// Service Worker for Affordable Laundry Kumasi
// Handles native device push and background notifications for order updates whether inside or outside the app

const CACHE_NAME = "affordable-laundry-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from client pages to trigger background native notifications
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
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
