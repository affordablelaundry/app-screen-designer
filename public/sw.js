// Service Worker for Affordable Laundry Kumasi
// Implements W3C Web Push Notification standards with VAPID
// Supports background push notifications on iOS (Home Screen PWA) and Android Chrome

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// CRITICAL FOR IOS: Every "push" event MUST call self.registration.showNotification()
// If a push event completes without calling showNotification, iOS WebKit immediately revokes the push subscription.
self.addEventListener("push", (event) => {
  let payload = {
    title: "Affordable Laundry Kumasi",
    body: "Your laundry status has been updated.",
    url: "/#dashboard",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: `al-push-${Date.now()}`,
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = {
        title: data.title || payload.title,
        body: data.body || payload.body,
        url: data.url || data.data?.url || payload.url,
        icon: data.icon || payload.icon,
        badge: data.badge || payload.badge,
        tag: data.tag || payload.tag,
      };
    } catch (err) {
      try {
        const text = event.data.text();
        if (text) {
          payload.body = text;
        }
      } catch (e) {
        // use default fallback payload
      }
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || "/icon-192.png",
    badge: payload.badge || "/icon-192.png",
    vibrate: [250, 150, 250],
    tag: payload.tag,
    renotify: true,
    requireInteraction: true,
    data: {
      url: payload.url,
    },
  };

  event.waitUntil(self.registration.showNotification(payload.title, notificationOptions));
});

// Handle clicking on a notification
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

// Support direct messages from the active app window (e.g. testing or local events)
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SHOW_NOTIFICATION") {
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
