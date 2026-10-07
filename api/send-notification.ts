import type { IncomingMessage, ServerResponse } from "http";
import webpush from "web-push";
import { adminDb } from "./_firebase-admin";

interface VercelRequest extends IncomingMessage {
  body: unknown;
  query: Record<string, string | string[]>;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
}

interface NotificationRequestBody {
  uid?: string;
  title?: string;
  body?: string;
  url?: string;
  icon?: string;
}

async function parseBody(req: VercelRequest): Promise<NotificationRequestBody> {
  if (req.body && typeof req.body === "object") return req.body as NotificationRequestBody;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // 1. Authenticate using API_SECRET header
    const expectedSecret = process.env.API_SECRET;
    const providedSecret =
      (req.headers["x-api-secret"] as string) ||
      (req.headers["authorization"] as string)?.replace("Bearer ", "")?.trim();

    if (!expectedSecret || providedSecret !== expectedSecret) {
      return res.status(403).json({
        error: "Forbidden: Missing or invalid x-api-secret header.",
      });
    }

    // 2. Validate VAPID configuration
    const vapidSubject = process.env.VAPID_SUBJECT || "mailto:affordablelaundry424@gmail.com";
    const vapidPublicKey =
      process.env.VAPID_PUBLIC_KEY ||
      "BCxZgwdc3RdO9K_zQbbBExOGhEd1eBSyrTWGYIFVxxkJM_395HBEaN6AiAoV-eeIOWN9QRpnk8RvSg2KBqAMCr4";
    const vapidPrivateKey =
      process.env.VAPID_PRIVATE_KEY || "pMlpFwNwISNwjsoEoI9F6-g6imTRDxHcnSR6jIZKVgo";

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // 3. Parse and validate notification payload
    const body = await parseBody(req);
    const { uid, title, body: messageBody, url, icon } = body;

    if (!title || !messageBody) {
      return res.status(400).json({
        error: "Bad Request: 'title' and 'body' are required fields.",
      });
    }

    const payloadString = JSON.stringify({
      title,
      body: messageBody,
      url: url || "/#dashboard",
      icon: icon || "/icon-192.png",
      badge: "/icon-192.png",
      tag: `al-push-${Date.now()}`,
    });

    // 4. Fetch target subscriptions from Firestore collection "pushSubscriptions"
    const subscriptionsRef = adminDb.collection("pushSubscriptions");
    let querySnapshot;

    if (!uid || uid === "all") {
      // Send to all registered devices
      querySnapshot = await subscriptionsRef.get();
    } else {
      // Send only to the specific user's registered devices
      querySnapshot = await subscriptionsRef.where("uid", "==", uid).get();
    }

    if (querySnapshot.empty) {
      return res.status(200).json({
        success: true,
        sent: 0,
        failed: 0,
        cleaned: 0,
        message:
          uid === "all"
            ? "No push subscriptions found in database."
            : `No subscriptions for user ${uid}.`,
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    let cleanedCount = 0;

    // 5. Send Web Push to all matched subscriptions in parallel
    const sendPromises = querySnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      const pushSubscription = {
        endpoint: data.endpoint,
        keys: data.keys,
      };

      try {
        await webpush.sendNotification(pushSubscription, payloadString);
        sentCount++;
      } catch (err: unknown) {
        failedCount++;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // Status 404 (Not Found) or 410 (Gone) indicates the subscription expired or user uninstalled/revoked
        if (statusCode === 404 || statusCode === 410) {
          try {
            await docSnapshot.ref.delete();
            cleanedCount++;
            console.log(
              `[send-notification] Cleaned inactive subscription document: ${docSnapshot.id}`,
            );
          } catch (deleteErr) {
            console.error(`[send-notification] Error deleting stale subscription:`, deleteErr);
          }
        } else {
          const errMessage = err instanceof Error ? err.message : String(err);
          console.warn(
            `[send-notification] Push dispatch warning for doc ${docSnapshot.id}:`,
            errMessage,
          );
        }
      }
    });

    await Promise.all(sendPromises);

    return res.status(200).json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      cleaned: cleanedCount,
      totalMatched: querySnapshot.size,
    });
  } catch (error: unknown) {
    console.error("[send-notification] Internal server error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Internal Server Error",
      details: msg,
    });
  }
}
