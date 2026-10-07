import type { IncomingMessage, ServerResponse } from "http";
import webpush from "web-push";
import { adminDb } from "./_firebase-admin";

interface VercelRequest extends IncomingMessage {
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Verify Vercel Cron authorization
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    if (cronSecret) {
      const expectedBearer = `Bearer ${cronSecret}`;
      if (authHeader !== expectedBearer) {
        return res.status(401).json({ error: "Unauthorized: Invalid CRON_SECRET." });
      }
    }

    // 2. Setup VAPID
    const vapidSubject = process.env.VAPID_SUBJECT || "mailto:affordablelaundry424@gmail.com";
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return res.status(200).json({
        success: true,
        message: "Cron ran successfully. (VAPID keys not configured for push dispatch)",
      });
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // 3. Example task: Check for active orders and send morning reminder/status
    const payload = JSON.stringify({
      title: "Affordable Laundry Service",
      body: "Morning pickup routes are open today across KNUST and Kumasi! Book your laundry collection.",
      url: "/#pricing",
      icon: "/icon-192.png",
      tag: "al-morning-cron",
    });

    const snapshot = await adminDb.collection("pushSubscriptions").limit(20).get();
    let sent = 0;

    const sends = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      try {
        await webpush.sendNotification(
          {
            endpoint: data.endpoint,
            keys: data.keys,
          },
          payload,
        );
        sent++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          await doc.ref.delete();
        }
      }
    });

    await Promise.all(sends);

    return res.status(200).json({
      success: true,
      message: `Cron job executed successfully. Dispatched ${sent} notifications.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("[cron-example] Error executing cron job:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Internal Server Error",
      details: msg,
    });
  }
}
