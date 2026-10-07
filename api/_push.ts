import webpush from "web-push";
import admin, { adminDb } from "./_firebase-admin";

export interface PushMessagePayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

export interface SendPushResult {
  totalSubscriptions: number;
  sent: number;
  failed: number;
  pruned: number;
}

// Friendly human labels for laundry order statuses
export function getStatusFriendlyText(status: string): string {
  const MAP: Record<string, string> = {
    COLLECTION_SCHEDULED: "Collection Scheduled",
    ITEMS_RECEIVED: "Clothes Received",
    WASHING: "Washing Clothes",
    READY_FOR_PICKUP: "Ready for Delivery",
    DELIVERY_ON_THE_WAY: "Courier Out for Delivery",
    COMPLETED: "Delivered",
    CANCELLED: "Order Cancelled",
  };
  return MAP[status] || status.replace(/_/g, " ");
}

// Generates clear stage updates for customers
export function getStatusCustomerMessage(
  status: string,
  orderId: string,
  customNotes?: string,
): { title: string; body: string } {
  const friendly = getStatusFriendlyText(status);
  const title = `Order #${orderId}: ${friendly}`;
  let body = customNotes?.trim();

  if (!body) {
    switch (status) {
      case "COLLECTION_SCHEDULED":
        body =
          "Your pickup has been scheduled! Our courier is assigned and will collect your clothes.";
        break;
      case "ITEMS_RECEIVED":
        body = "Clothes Received! Our atelier has safely received and inspected your garments.";
        break;
      case "WASHING":
        body =
          "Washing Clothes! Your items are now being carefully washed and treated with premium detergents.";
        break;
      case "READY_FOR_PICKUP":
        body =
          "Ready for Delivery! Your clothes are freshly dried, steam-pressed, and neatly packaged.";
        break;
      case "DELIVERY_ON_THE_WAY":
        body = "Courier Out for Delivery! Our rider is on the way to your door in KNUST / Kumasi.";
        break;
      case "COMPLETED":
        body =
          "Delivered! Your fresh clothes have arrived. Thank you for choosing Affordable Laundry!";
        break;
      case "CANCELLED":
        body = "Your order has been cancelled. Please contact our support hotline if needed.";
        break;
      default:
        body = `Your order status has been updated to ${friendly}.`;
    }
  }

  return { title, body };
}

// Initialize web-push VAPID details once
function ensureVapidConfigured(): boolean {
  const vapidSubject = process.env.VAPID_SUBJECT || "mailto:affordablelaundry424@gmail.com";
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn(
      "[web-push] Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY in environment variables.",
    );
    return false;
  }

  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    return true;
  } catch (err) {
    console.error("[web-push] Failed to configure VAPID details:", err);
    return false;
  }
}

/**
 * Shared server push helper:
 * - Reads push subscriptions for the given uids from Firestore collection "pushSubscriptions"
 * - Uses chunked "in" queries of up to 30 uids (Firestore limitation)
 * - Sends push to every registered device with TTL 24h and high urgency
 * - Automatically prunes (deletes) subscriptions that return 404 or 410
 */
export async function sendPushToUsers(
  uids: string[],
  payload: PushMessagePayload,
): Promise<SendPushResult> {
  const result: SendPushResult = {
    totalSubscriptions: 0,
    sent: 0,
    failed: 0,
    pruned: 0,
  };

  const cleanUids = Array.from(
    new Set(uids.filter((id): id is string => Boolean(id && typeof id === "string" && id.trim()))),
  );

  if (cleanUids.length === 0) {
    return result;
  }

  if (!ensureVapidConfigured()) {
    console.warn("[web-push] Aborting sendPushToUsers: VAPID keys not configured.");
    return result;
  }

  // Chunk uids into batches of up to 30 for Firestore "in" queries
  const chunkSize = 30;
  const uidChunks: string[][] = [];
  for (let i = 0; i < cleanUids.length; i += chunkSize) {
    uidChunks.push(cleanUids.slice(i, i + chunkSize));
  }

  // Load subscriptions across all chunks
  const subscriptionDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  for (const chunk of uidChunks) {
    try {
      const snap = await adminDb.collection("pushSubscriptions").where("uid", "in", chunk).get();
      snap.forEach((doc) => subscriptionDocs.push(doc));
    } catch (err) {
      console.error("[web-push] Failed to query pushSubscriptions for chunk:", chunk, err);
    }
  }

  result.totalSubscriptions = subscriptionDocs.length;
  if (subscriptionDocs.length === 0) {
    return result;
  }

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "/#dashboard",
    tag: payload.tag || `al-push-${Date.now()}`,
    icon: payload.icon || "/icon-192.png",
    badge: payload.badge || "/icon-192.png",
    timestamp: Date.now(),
  });

  const sendOptions: webpush.RequestOptions = {
    TTL: 86400, // 24 hours
    urgency: "high",
  };

  const tasks = subscriptionDocs.map(async (docSnap) => {
    const data = docSnap.data();
    const endpoint = data.endpoint as string | undefined;
    const keys = data.keys as { p256dh?: string; auth?: string } | undefined;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return;
    }

    const pushSub: webpush.PushSubscription = {
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSub, notificationPayload, sendOptions);
      result.sent++;
    } catch (err: unknown) {
      result.failed++;
      const statusCode = (err as { statusCode?: number })?.statusCode;
      // HTTP 404 (Not Found) or 410 (Gone): device unsubscribed or subscription expired
      if (statusCode === 404 || statusCode === 410) {
        try {
          await docSnap.ref.delete();
          result.pruned++;
          console.log(`[web-push] Deleted dead subscription ${docSnap.id} (HTTP ${statusCode})`);
        } catch (delErr) {
          console.error(`[web-push] Failed to delete subscription ${docSnap.id}:`, delErr);
        }
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[web-push] Failed to send push to ${docSnap.id}:`, msg);
      }
    }
  });

  await Promise.all(tasks);
  return result;
}
