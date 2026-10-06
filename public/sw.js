// Service Worker for Affordable Laundry Kumasi
// Handles native device push and background notifications for order updates whether inside or outside the app

const CACHE_NAME = "affordable-laundry-v3";
const PROJECT_ID = "gen-lang-client-0010839257";
const DATABASE_ID = "ai-studio-appscreendesigne-8f99ab62-7d65-4c26-bd95-292417592eb7";
const API_KEY = "AIzaSyAo7hYvxKTUG51Fu7FMxtJz7eH1VTP0X4Q";

const STATUS_LABELS = {
  COLLECTION_SCHEDULED: "Collection Scheduled",
  ITEMS_RECEIVED: "Clothes Received",
  WASHING: "Washing Clothes",
  READY_FOR_PICKUP: "Ready for Delivery",
  DELIVERY_ON_THE_WAY: "Courier Out for Delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Order Cancelled",
};

// Map of orderId -> lastKnownStatus
const trackedOrdersMap = new Map();

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function checkOrderUpdates() {
  if (trackedOrdersMap.size === 0) return;

  for (const [orderId, lastStatus] of trackedOrdersMap.entries()) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/orders/${orderId}?key=${API_KEY}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const data = await res.json();
      const currentStatus = data.fields?.status?.stringValue;
      const stageNotes = data.fields?.stageNotes?.stringValue;

      if (currentStatus && lastStatus && currentStatus !== lastStatus) {
        trackedOrdersMap.set(orderId, currentStatus);
        const friendly = STATUS_LABELS[currentStatus] || currentStatus.replace(/_/g, " ");
        const title = `Order #${orderId}: ${friendly}`;
        const body =
          stageNotes || `Your garment care status is now: ${friendly}. Our team is on it!`;

        await self.registration.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [200, 100, 200],
          tag: `al-order-${orderId}`,
          data: { url: "/#dashboard", orderId },
        });
      } else if (currentStatus && !lastStatus) {
        trackedOrdersMap.set(orderId, currentStatus);
      }
    } catch (e) {
      // offline or network hiccup, skip silently
    }
  }
}

// Background polling loop while service worker is active
setInterval(() => {
  checkOrderUpdates().catch(() => {});
}, 25000);

// Listen for periodic background sync from Android Chrome / PWA
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-order-updates") {
    event.waitUntil(checkOrderUpdates());
  }
});

// Listen for one-off background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "check-orders") {
    event.waitUntil(checkOrderUpdates());
  }
});

// Listen for messages from client pages
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "TRACK_ORDERS") {
    const list = event.data.orders || [];
    for (const item of list) {
      if (item && item.id) {
        trackedOrdersMap.set(item.id, item.status || trackedOrdersMap.get(item.id) || "");
      }
    }
    event.waitUntil(checkOrderUpdates());
  } else if (event.data.type === "SHOW_NOTIFICATION") {
    // Only triggered if page requested explicit service worker notification
    const { title, options } = event.data;
    const tag = options?.tag || `al-order-${options?.data?.orderId || "alert"}`;
    event.waitUntil(
      self.registration.showNotification(title, {
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [200, 100, 200],
        tag,
        ...options,
      }),
    );
  }
});

// Handle user clicking on a system notification outside or inside the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/#dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});

// Support for native push events from Web Push
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "Order Update", body: event.data.text() };
    }
  }
  const title = data.title || "Affordable Laundry Update";
  const orderId = data.orderId || data.data?.orderId || "update";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "Your order status has been updated.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      tag: `al-order-${orderId}`,
      data: { url: "/#dashboard", ...data },
    }),
  );
});
