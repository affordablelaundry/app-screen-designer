// Service Worker for Affordable Laundry Kumasi
// Handles native device push and background notifications for order updates whether inside or outside the app

const CACHE_NAME = "affordable-laundry-v4";
const DATA_CACHE_NAME = "al-tracked-orders-v2";
const DATA_CACHE_URL = "/al-orders-tracking.json";

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

// In-memory cache synced with persistent CacheStorage
const trackedOrdersMap = new Map();

// Read persistent tracked orders from CacheStorage
async function getStoredTrackedOrders() {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    const resp = await cache.match(DATA_CACHE_URL);
    if (resp) {
      const data = await resp.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (e) {
    // ignore
  }
  return [];
}

// Write persistent tracked orders to CacheStorage
async function setStoredTrackedOrders(orders) {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    await cache.put(
      DATA_CACHE_URL,
      new Response(JSON.stringify(orders), {
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch (e) {
    // ignore
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Check Firestore REST API for updates to all tracked orders
async function checkOrderUpdates() {
  // 1. Load persistent tracked orders from disk
  const storedList = await getStoredTrackedOrders();
  for (const item of storedList) {
    if (item && item.id && !trackedOrdersMap.has(item.id)) {
      trackedOrdersMap.set(item.id, item.lastNotifiedStatus || item.status || "");
    }
  }

  if (trackedOrdersMap.size === 0) return;

  let hasUpdates = false;

  for (const [orderId, lastStatus] of trackedOrdersMap.entries()) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/orders/${orderId}?key=${API_KEY}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const data = await res.json();
      const currentStatus = data.fields?.status?.stringValue;
      const stageNotes = data.fields?.stageNotes?.stringValue;

      // Status has progressed and differs from last recorded notification
      if (currentStatus && lastStatus && currentStatus !== lastStatus) {
        trackedOrdersMap.set(orderId, currentStatus);
        hasUpdates = true;

        const friendly = STATUS_LABELS[currentStatus] || currentStatus.replace(/_/g, " ");
        const title = `Order #${orderId}: ${friendly}`;
        const body =
          stageNotes || `Your garment care status is now: ${friendly}. Our team is on it!`;

        await self.registration.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [250, 150, 250],
          tag: `al-order-${orderId}`,
          renotify: true,
          requireInteraction: true,
          data: { url: "/#dashboard", orderId },
        });
      } else if (currentStatus && !lastStatus) {
        // Record current status as baseline
        trackedOrdersMap.set(orderId, currentStatus);
        hasUpdates = true;
      }
    } catch (e) {
      // Offline or network hiccup, skip silently
    }
  }

  // Persist updated status map back to disk
  if (hasUpdates) {
    const updatedToStore = [];
    for (const [id, st] of trackedOrdersMap.entries()) {
      updatedToStore.push({ id, status: st, lastNotifiedStatus: st });
    }
    await setStoredTrackedOrders(updatedToStore);
  }
}

// Rescheduling timer for background loop while worker process is alive
let backgroundTimer = null;
function scheduleBackgroundCheck(delayMs = 25000) {
  if (backgroundTimer) clearTimeout(backgroundTimer);
  backgroundTimer = setTimeout(async () => {
    await checkOrderUpdates();
    scheduleBackgroundCheck(25000);
  }, delayMs);
}
scheduleBackgroundCheck(10000);

// Listen for periodic background sync from Android Chrome / PWA when app is closed
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-order-updates") {
    event.waitUntil(checkOrderUpdates());
  }
});

// Listen for one-off background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "check-orders" || event.tag === "check-order-updates") {
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
        trackedOrdersMap.set(
          item.id,
          item.lastNotifiedStatus || item.status || trackedOrdersMap.get(item.id) || "",
        );
      }
    }
    // Save to persistent storage immediately
    event.waitUntil(
      (async () => {
        const toSave = [];
        for (const [id, st] of trackedOrdersMap.entries()) {
          toSave.push({ id, status: st, lastNotifiedStatus: st });
        }
        await setStoredTrackedOrders(toSave);
        await checkOrderUpdates();
      })(),
    );
  } else if (event.data.type === "SHOW_NOTIFICATION") {
    const { title, options } = event.data;
    const tag = options?.tag || `al-order-${options?.data?.orderId || "alert"}`;
    event.waitUntil(
      self.registration.showNotification(title, {
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [250, 150, 250],
        tag,
        renotify: true,
        requireInteraction: true,
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
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});

// Support for native push events from Web Push
self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      await checkOrderUpdates();
      if (event.data) {
        try {
          const data = event.data.json();
          const orderId = data.orderId || data.data?.orderId || "update";
          await self.registration.showNotification(data.title || "Affordable Laundry Update", {
            body: data.body || "Your order status has been updated.",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            vibrate: [250, 150, 250],
            tag: `al-order-${orderId}`,
            renotify: true,
            data: { url: "/#dashboard", orderId },
          });
        } catch (e) {
          // ignore
        }
      }
    })(),
  );
});
