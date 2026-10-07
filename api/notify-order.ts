import type { IncomingMessage, ServerResponse } from "http";
import admin, { adminAuth, adminDb } from "./_firebase-admin";
import { sendPushToUsers, getStatusFriendlyText, getStatusCustomerMessage } from "./_push";

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

interface NotifyOrderRequestBody {
  event?: "STATUS_UPDATE" | "NEW_ORDER";
  orderIds?: string[];
}

// Request body parser supporting pre-parsed Vercel bodies and raw Node.js streams
async function parseBody(req: VercelRequest): Promise<NotifyOrderRequestBody> {
  if (req.body && typeof req.body === "object") {
    return req.body as NotifyOrderRequestBody;
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
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // 1. Verify Authorization header: "Bearer <Firebase ID token>"
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: Missing or invalid Authorization header. Expected 'Bearer <token>'.",
      });
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing token string." });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (authErr) {
      const msg = authErr instanceof Error ? authErr.message : "Token verification failed";
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid Firebase ID token.", details: msg });
    }

    const callerUid = decodedToken.uid;
    const callerEmail = decodedToken.email?.toLowerCase();

    // 2. Validate request payload
    const body = await parseBody(req);
    const { event, orderIds } = body;

    if (!event || (event !== "STATUS_UPDATE" && event !== "NEW_ORDER")) {
      return res.status(400).json({
        error: "Bad Request: 'event' must be either 'STATUS_UPDATE' or 'NEW_ORDER'.",
      });
    }

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        error: "Bad Request: 'orderIds' must be a non-empty array of order IDs (max 50).",
      });
    }

    // Cap to 50 order IDs max
    const targetOrderIds = orderIds
      .slice(0, 50)
      .filter((id): id is string => Boolean(id && typeof id === "string"));

    // 3. Determine if caller is an admin
    const isCallerEmailAdmin = callerEmail === "affordablelaundry424@gmail.com";
    let isCallerAdminDoc = false;
    try {
      const adminDoc = await adminDb.collection("admins").doc(callerUid).get();
      isCallerAdminDoc = adminDoc.exists;
    } catch {
      // ignore
    }

    const isCallerAdmin =
      isCallerEmailAdmin ||
      isCallerAdminDoc ||
      Boolean((decodedToken as Record<string, unknown>).admin) ||
      Boolean((decodedToken as Record<string, unknown>).role === "admin");

    // 4. Handle STATUS_UPDATE event
    if (event === "STATUS_UPDATE") {
      if (!isCallerAdmin) {
        return res.status(403).json({
          error: "Forbidden: Only administrators can push order status updates.",
        });
      }

      let processedCount = 0;
      let skippedCount = 0;

      for (const orderId of targetOrderIds) {
        const orderRef = adminDb.collection("orders").doc(orderId);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
          skippedCount++;
          continue;
        }

        const orderData = orderSnap.data() || {};
        const currentStatus = (orderData.status as string) || "ITEMS_RECEIVED";

        // Skip if order.lastPushedStatus already equals the current status
        if (orderData.lastPushedStatus === currentStatus) {
          skippedCount++;
          continue;
        }

        const displayId = (orderData.id as string) || (orderData.orderId as string) || orderSnap.id;
        const friendlyStatus = getStatusFriendlyText(currentStatus);
        const defaultMsg = getStatusCustomerMessage(
          currentStatus,
          displayId,
          orderData.stageNotes as string | undefined,
        );

        const pushTitle = `Order #${displayId}: ${friendlyStatus}`;
        const pushBody = ((orderData.stageNotes as string) || defaultMsg.body).trim();
        const pushTag = `al-order-${displayId}-${currentStatus}`;

        // Push to order's customer userId if available
        const customerUserId = orderData.userId as string | undefined;
        if (customerUserId) {
          await sendPushToUsers([customerUserId], {
            title: pushTitle,
            body: pushBody,
            url: "/#dashboard",
            tag: pushTag,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
          });
        }

        // Mark lastPushedStatus on the order document in Firestore
        await orderRef.update({
          lastPushedStatus: currentStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        processedCount++;
      }

      return res.status(200).json({
        success: true,
        event: "STATUS_UPDATE",
        processed: processedCount,
        skipped: skippedCount,
      });
    }

    // 5. Handle NEW_ORDER event
    if (event === "NEW_ORDER") {
      let processedCount = 0;
      let skippedCount = 0;

      // Gather all admin UIDs to receive the push alert
      const adminUids: string[] = [];
      try {
        const adminDocs = await adminDb.collection("admins").get();
        adminDocs.forEach((d) => adminUids.push(d.id));
      } catch (err) {
        console.warn("[notify-order] Error fetching admin docs:", err);
      }

      try {
        const primaryAdmin = await adminAuth.getUserByEmail("affordablelaundry424@gmail.com");
        if (primaryAdmin?.uid) {
          adminUids.push(primaryAdmin.uid);
        }
      } catch {
        // User may not be created yet in Auth
      }

      const uniqueAdminUids = Array.from(
        new Set(adminUids.filter((id): id is string => Boolean(id && typeof id === "string"))),
      );

      for (const orderId of targetOrderIds) {
        const orderRef = adminDb.collection("orders").doc(orderId);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
          skippedCount++;
          continue;
        }

        const orderData = orderSnap.data() || {};

        // Caller must own the order (userId matches, or customerEmail matches caller's verified email) or be admin
        const orderUserId = orderData.userId as string | undefined;
        const orderEmail = (orderData.customerEmail as string)?.toLowerCase();
        const isOwner =
          (orderUserId && orderUserId === callerUid) ||
          (orderEmail && callerEmail && orderEmail === callerEmail) ||
          isCallerAdmin;

        if (!isOwner) {
          // Reject caller attempting to broadcast for an order they don't own
          skippedCount++;
          continue;
        }

        // Skip if admin has already been notified
        if (orderData.adminNotified === true) {
          skippedCount++;
          continue;
        }

        const displayId = (orderData.id as string) || (orderData.orderId as string) || orderSnap.id;
        const customerName = (orderData.customerName as string) || "Customer";
        const itemCount =
          orderData.itemCount || (Array.isArray(orderData.items) ? orderData.items.length : 1);
        const location =
          (orderData.location as string) || (orderData.pickupAddress as string) || "Kumasi";
        const total =
          typeof orderData.total === "number"
            ? `GHS ${orderData.total.toFixed(2)}`
            : String(orderData.total || "GHS 0");

        const pushTitle = `🔔 New Customer Booking #${displayId}`;
        const pushBody = `${customerName} booked ${itemCount} items (${location}) • ${total}`;
        const pushTag = `al-new-order-${displayId}`;

        if (uniqueAdminUids.length > 0) {
          await sendPushToUsers(uniqueAdminUids, {
            title: pushTitle,
            body: pushBody,
            url: "/#dashboard",
            tag: pushTag,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
          });
        }

        // Mark adminNotified on the order doc
        await orderRef.update({
          adminNotified: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        processedCount++;
      }

      return res.status(200).json({
        success: true,
        event: "NEW_ORDER",
        processed: processedCount,
        skipped: skippedCount,
      });
    }

    return res.status(400).json({ error: "Unhandled event type." });
  } catch (error: unknown) {
    console.error("[notify-order] Internal error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Internal Server Error", details: msg });
  }
}
