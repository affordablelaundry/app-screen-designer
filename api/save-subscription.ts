import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import admin, { adminAuth, adminDb } from "./_firebase-admin";

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

interface SubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Helper to ensure request body is parsed if raw stream
async function parseBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
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
    // 1. Verify Firebase Auth ID token from the Authorization header
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: Missing or invalid Authorization header. Expected 'Bearer <token>'.",
      });
    }

    const idToken = authHeader.split("Bearer ")[1]?.trim();
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized: Missing token string." });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown verification error";
      console.error("[save-subscription] Token verification failed:", msg);
      return res.status(401).json({
        error: "Unauthorized: Token verification failed.",
        details: msg,
      });
    }

    // UID comes strictly from the verified Firebase Auth token. Never trust the body.
    const uid = decodedToken.uid;

    // 2. Read and validate the Web Push subscription object from body
    const body = await parseBody(req);
    const subscription = (body.subscription || body) as SubscriptionPayload;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({
        error: "Bad Request: Subscription must include 'endpoint' and 'keys' (auth, p256dh).",
      });
    }

    const { endpoint, keys } = subscription;
    if (!keys.p256dh || !keys.auth) {
      return res.status(400).json({
        error: "Bad Request: Subscription keys must contain both 'p256dh' and 'auth'.",
      });
    }

    // 3. Hash endpoint using SHA-256 so the same device / browser never creates duplicates
    const subscriptionId = crypto.createHash("sha256").update(endpoint).digest("hex");

    const userAgent = (req.headers["user-agent"] as string) || "Unknown";

    const subscriptionData = {
      id: subscriptionId,
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      uid,
      userAgent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 4. Save to Firestore collection "pushSubscriptions" using the deterministic hash ID
    const docRef = adminDb.collection("pushSubscriptions").doc(subscriptionId);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      await docRef.set({
        ...subscriptionData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await docRef.update(subscriptionData);
    }

    return res.status(200).json({
      success: true,
      message: "Push subscription registered successfully.",
      subscriptionId,
    });
  } catch (error: unknown) {
    console.error("[save-subscription] Internal server error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Internal Server Error",
      details: msg,
    });
  }
}
