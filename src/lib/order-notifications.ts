import { collection, doc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export interface StoredNotification {
  id: string;
  orderId: string;
  title: string;
  body: string;
  timestamp: string;
  status: string;
  read: boolean;
  type?: "customer_update" | "admin_new_order";
}

const STORAGE_KEY_ORDERS = "al_tracked_order_ids";
const STORAGE_KEY_NOTIFS = "al_device_notifications";
const STORAGE_KEY_PREF = "al_notification_permission_requested";
const DEDUPE_STORAGE_KEY = "al_dispatched_alerts_cache";

// Module-level deduplication singletons
const globalDispatchedNotifications = new Map<string, number>();
const globalAdminAlertTimestamps = new Map<string, number>();
const globalCustomerAlertTimestamps = new Map<string, number>();

// Persistent cross-tab and cross-window deduplication checker
// Guarantees zero double notifications even if multiple browser tabs are open
function isAlertDuplicate(dedupeKey: string, cooldownMs = 12000): boolean {
  const now = Date.now();
  // 1. In-memory check for current window
  const lastMemory = globalDispatchedNotifications.get(dedupeKey) || 0;
  if (now - lastMemory < cooldownMs) {
    return true;
  }
  globalDispatchedNotifications.set(dedupeKey, now);

  // 2. Cross-tab persistent check in localStorage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(DEDUPE_STORAGE_KEY);
      const cache: Record<string, number> = raw ? JSON.parse(raw) : {};
      const lastLocal = cache[dedupeKey] || 0;
      if (now - lastLocal < cooldownMs) {
        return true;
      }
      // Prune keys older than 60 seconds to keep storage clean
      const pruned: Record<string, number> = {};
      for (const [k, v] of Object.entries(cache)) {
        if (now - v < 60000) {
          pruned[k] = v;
        }
      }
      pruned[dedupeKey] = now;
      localStorage.setItem(DEDUPE_STORAGE_KEY, JSON.stringify(pruned));
    } catch {
      // ignore
    }
  }

  return false;
}

// Web Audio API notification chime (reliable, zero external network dependency)
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // High note 1 (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // High note 2 (A5 harmony)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.22, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.debug("Notification chime notice:", err);
  }
}

// Request browser notification permission
export async function requestDeviceNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(STORAGE_KEY_PREF, "true");
    return permission;
  } catch {
    return "denied";
  }
}

export function getDeviceNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

// Tracked Orders Local Storage Helpers
export function getTrackedOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTrackedOrderId(orderId: string): string[] {
  if (typeof window === "undefined" || !orderId) return [];
  try {
    const current = getTrackedOrderIds();
    const cleanId = orderId.trim();
    if (!current.includes(cleanId)) {
      const updated = [cleanId, ...current].slice(0, 30);
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch {
    return [];
  }
}

export function removeTrackedOrderId(orderId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getTrackedOrderIds();
    const updated = current.filter((id) => id !== orderId);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// Device Notification History Storage
export function getStoredNotifications(): StoredNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotificationRecord(
  notif: Omit<StoredNotification, "id" | "read">,
): StoredNotification {
  const current = getStoredNotifications();
  const newRecord: StoredNotification = {
    ...notif,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
  };
  const updated = [newRecord, ...current].slice(0, 40);
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("al_notifications_updated"));
    }
  } catch {
    // ignore
  }
  return newRecord;
}

export function markAllNotificationsRead() {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("al_notifications_updated"));
    }
  } catch {
    // ignore
  }
}

// Register Service Worker for true background native device notifications
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Trigger device notification with Service Worker background support and strict 12s deduplication
export async function triggerDeviceNotification(
  title: string,
  body: string,
  orderId: string,
  status: string,
  type: "customer_update" | "admin_new_order" = "customer_update",
) {
  const dedupeKey = `${type}:${orderId}:${status}`;

  // Strict global persistent deduplication across all tabs & windows on this device
  if (isAlertDuplicate(dedupeKey, 12000)) {
    return;
  }

  playNotificationChime();

  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      // ignore
    }
  }

  saveNotificationRecord({
    orderId,
    title,
    body,
    timestamp: new Date().toISOString(),
    status,
    type,
  });

  // Native system notification that pops up on lock screen/tray whether user is in the app or not
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    const notifOptions: NotificationOptions = {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      // Consistent order-level tag ensures Android OS replaces previous notification rather than doubling
      tag: `al-order-${orderId}`,
      data: {
        url: "/#dashboard",
        orderId,
      },
    };

    let notificationShown = false;

    // 1. Primary: Use Service Worker registration (Shows on lock screen & outside the app on Android/iOS/Desktop)
    if ("serviceWorker" in navigator) {
      try {
        const reg = await Promise.race([
          navigator.serviceWorker.getRegistration(),
          navigator.serviceWorker.ready,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000)),
        ]);
        if (reg && "showNotification" in reg) {
          await reg.showNotification(title, notifOptions);
          notificationShown = true;
        }
      } catch (err) {
        console.debug("ServiceWorker showNotification note:", err);
      }

      // Also message service worker active client for background processing
      try {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            title,
            options: notifOptions,
          });
        }
      } catch {
        // ignore
      }
    }

    // 2. Fallback ONLY if Service Worker did not display it
    if (!notificationShown) {
      try {
        const notif = new Notification(title, notifOptions);
        notif.onclick = () => {
          window.focus();
          window.location.hash = "#dashboard";
        };
      } catch (err) {
        console.debug("Native Notification fallback note:", err);
      }
    }
  }
}

// Human-friendly labels for statuses - Updated: Clothes Received instead of Clothes Picked Up
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

// Generates clear, informative customer notifications for each stage update
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

// Cross-tab and multi-window event broadcasting
export interface OrderBroadcastEvent {
  type: "NEW_ORDER" | "STATUS_UPDATE";
  orderId: string;
  status?: string;
  customerName?: string;
  customerEmail?: string;
  userId?: string;
  itemCount?: number;
  total?: number;
  location?: string;
  stageNotes?: string;
  timestamp: string;
}

let notifChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    notifChannel = new BroadcastChannel("al_order_notifications");
  }
} catch {
  // ignore
}

export function broadcastOrderEvent(event: Omit<OrderBroadcastEvent, "timestamp">) {
  const fullEvent: OrderBroadcastEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (notifChannel) {
    try {
      notifChannel.postMessage(fullEvent);
    } catch {
      // ignore
    }
  }

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("al_order_broadcast", { detail: fullEvent }));
      localStorage.setItem("al_last_order_broadcast", JSON.stringify(fullEvent));
    } catch {
      // ignore
    }
  }
}

// Real-time listener for Admin: Pop up notification every time a customer books
export function setupAdminOrderNotifications(
  onNewBooking: (order: {
    orderId: string;
    customerName: string;
    itemCount: number;
    location: string;
    total: number;
  }) => void,
) {
  if (typeof window === "undefined") return () => {};

  const knownOrderIds = new Set<string>();
  let isInitialLoad = true;

  const notifyAdmin = (booking: {
    orderId: string;
    customerName: string;
    itemCount: number;
    location: string;
    total: number;
  }) => {
    const dedupeKey = `admin_alert:${booking.orderId}`;
    if (isAlertDuplicate(dedupeKey, 12000)) {
      return; // Skip duplicate notification within 12s across all windows
    }

    triggerDeviceNotification(
      `🔔 New Customer Booking #${booking.orderId}`,
      `${booking.customerName} placed a booking for ${booking.itemCount} items at ${booking.location} (GHC ${booking.total}).`,
      booking.orderId,
      "COLLECTION_SCHEDULED",
      "admin_new_order",
    );

    onNewBooking(booking);
  };

  // 1. Listen to BroadcastChannel for instant local cross-tab booking triggers
  const handleBroadcast = (e: MessageEvent<OrderBroadcastEvent>) => {
    if (e.data?.type === "NEW_ORDER" && e.data.orderId) {
      knownOrderIds.add(e.data.orderId);
      notifyAdmin({
        orderId: e.data.orderId,
        customerName: e.data.customerName || "Customer",
        itemCount: Number(e.data.itemCount || 1),
        location: e.data.location || "KNUST Campus",
        total: Number(e.data.total || 0),
      });
    }
  };

  if (notifChannel) {
    notifChannel.addEventListener("message", handleBroadcast);
  }

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent<OrderBroadcastEvent>).detail;
    if (detail?.type === "NEW_ORDER" && detail.orderId) {
      knownOrderIds.add(detail.orderId);
      notifyAdmin({
        orderId: detail.orderId,
        customerName: detail.customerName || "Customer",
        itemCount: Number(detail.itemCount || 1),
        location: detail.location || "KNUST Campus",
        total: Number(detail.total || 0),
      });
    }
  };
  window.addEventListener("al_order_broadcast", handleCustomEvent);

  // Also listen to storage events across separate windows
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === "al_last_order_broadcast" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue) as OrderBroadcastEvent;
        if (parsed.type === "NEW_ORDER" && parsed.orderId) {
          knownOrderIds.add(parsed.orderId);
          notifyAdmin({
            orderId: parsed.orderId,
            customerName: parsed.customerName || "Customer",
            itemCount: Number(parsed.itemCount || 1),
            location: parsed.location || "KNUST Campus",
            total: Number(parsed.total || 0),
          });
        }
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener("storage", handleStorageEvent);

  // 2. Real-time Firestore snapshot listener: connects on mount or as soon as admin session is verified
  let unsubFirestore: (() => void) | null = null;

  const startFirestoreListener = () => {
    if (unsubFirestore) return;
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(30));
      unsubFirestore = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              const ordId = (data.id as string) || change.doc.id;

              if (!isInitialLoad && !knownOrderIds.has(ordId)) {
                knownOrderIds.add(ordId);
                notifyAdmin({
                  orderId: ordId,
                  customerName: (data.customerName as string) || "Customer",
                  itemCount: Number(data.itemCount || 1),
                  location: (data.location as string) || "KNUST Campus",
                  total: Number(data.total || 0),
                });
              } else {
                knownOrderIds.add(ordId);
              }
            }
          });
          isInitialLoad = false;
        },
        (err) => {
          console.debug("Admin notifications listener notice:", err);
        },
      );
    } catch (err) {
      console.debug("Admin notifications listener setup error:", err);
    }
  };

  if (auth.currentUser) {
    startFirestoreListener();
  }

  const unsubAuth = auth.onAuthStateChanged((user) => {
    if (user && !unsubFirestore) {
      startFirestoreListener();
    }
  });

  return () => {
    if (notifChannel) {
      notifChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("al_order_broadcast", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    unsubAuth();
    if (unsubFirestore) {
      unsubFirestore();
    }
  };
}

// Real-time listener for Customer: Pop up notification every time the admin updates their order process
export function setupCustomerOrderNotifications(
  userIdentifier: { userId?: string; email?: string },
  onStatusUpdate: (orderId: string, newStatus: string, title: string, body: string) => void,
) {
  if (typeof window === "undefined") return () => {};

  // Gather all known order IDs from tracking storage and cache
  const trackedIds = new Set<string>(getTrackedOrderIds());
  try {
    const rawCache = localStorage.getItem("al_orders_cache");
    if (rawCache) {
      const list = JSON.parse(rawCache) as {
        id: string;
        userId?: string;
        customerEmail?: string;
      }[];
      list.forEach((ord) => {
        if (ord.id) {
          const matchEmail =
            userIdentifier.email &&
            ord.customerEmail?.toLowerCase() === userIdentifier.email.toLowerCase();
          const matchUid = userIdentifier.userId && ord.userId === userIdentifier.userId;
          if (matchEmail || matchUid) {
            trackedIds.add(ord.id);
          }
        }
      });
    }
  } catch {
    // ignore
  }

  const cleanEmail = userIdentifier.email?.trim().toLowerCase();
  const cleanUid = userIdentifier.userId;
  const previousStatuses: Record<string, string> = {};

  const notifyCustomer = (orderId: string, newStatus: string, stageNotes?: string) => {
    const dedupeKey = `customer_update:${orderId}:${newStatus}`;
    if (isAlertDuplicate(dedupeKey, 12000)) {
      return; // Skip duplicate notification within 12s across all tabs & listeners
    }

    const { title, body } = getStatusCustomerMessage(newStatus, orderId, stageNotes);
    triggerDeviceNotification(title, body, orderId, newStatus);
    onStatusUpdate(orderId, newStatus, title, body);
  };

  // 1. Listen to BroadcastChannel / storage events for instant updates
  const handleBroadcast = (e: MessageEvent<OrderBroadcastEvent>) => {
    const data = e.data;
    if (data?.type === "STATUS_UPDATE" && data.status && data.orderId) {
      const isTargetOrder =
        trackedIds.has(data.orderId) ||
        (cleanEmail && data.customerEmail?.toLowerCase() === cleanEmail) ||
        (cleanUid && data.userId === cleanUid);

      if (isTargetOrder) {
        const lastKnown = previousStatuses[data.orderId];
        if (lastKnown !== data.status) {
          previousStatuses[data.orderId] = data.status;
          notifyCustomer(data.orderId, data.status, data.stageNotes);
        }
      }
    }
  };

  if (notifChannel) {
    notifChannel.addEventListener("message", handleBroadcast);
  }

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent<OrderBroadcastEvent>).detail;
    if (detail?.type === "STATUS_UPDATE" && detail.status && detail.orderId) {
      const isTargetOrder =
        trackedIds.has(detail.orderId) ||
        (cleanEmail && detail.customerEmail?.toLowerCase() === cleanEmail) ||
        (cleanUid && detail.userId === cleanUid);

      if (isTargetOrder) {
        const lastKnown = previousStatuses[detail.orderId];
        if (lastKnown !== detail.status) {
          previousStatuses[detail.orderId] = detail.status;
          notifyCustomer(detail.orderId, detail.status, detail.stageNotes);
        }
      }
    }
  };
  window.addEventListener("al_order_broadcast", handleCustomEvent);

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === "al_last_order_broadcast" && e.newValue) {
      try {
        const detail = JSON.parse(e.newValue) as OrderBroadcastEvent;
        if (detail?.type === "STATUS_UPDATE" && detail.status && detail.orderId) {
          const isTargetOrder =
            trackedIds.has(detail.orderId) ||
            (cleanEmail && detail.customerEmail?.toLowerCase() === cleanEmail) ||
            (cleanUid && detail.userId === cleanUid);

          if (isTargetOrder) {
            const lastKnown = previousStatuses[detail.orderId];
            if (lastKnown !== detail.status) {
              previousStatuses[detail.orderId] = detail.status;
              notifyCustomer(detail.orderId, detail.status, detail.stageNotes);
            }
          }
        }
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener("storage", handleStorageEvent);

  // 2. Real-time Firestore listener for all tracked orders
  const unsubs: (() => void)[] = [];

  trackedIds.forEach((orderId) => {
    try {
      const unsub = onSnapshot(
        doc(db, "orders", orderId),
        (snapshot) => {
          if (!snapshot.exists()) return;
          const data = snapshot.data();
          const currentStatus = data.status;
          const lastKnown = previousStatuses[orderId];

          // If status changed and we had an earlier status recorded
          if (lastKnown && lastKnown !== currentStatus) {
            notifyCustomer(orderId, currentStatus, data.stageNotes);
          }

          previousStatuses[orderId] = currentStatus;
        },
        () => {
          // Gracefully ignore offline notices
        },
      );
      unsubs.push(unsub);
    } catch {
      // ignore
    }
  });

  // 3. Real-time listener on customer's orders query if user is logged in
  let unsubCustomerQuery: (() => void) | null = null;
  const attachCustomerQueryListener = () => {
    if (unsubCustomerQuery) return;
    const uid = cleanUid || auth.currentUser?.uid;
    if (!uid) return;

    try {
      const q = query(collection(db, "orders"), where("userId", "==", uid));
      unsubCustomerQuery = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const ordId = (data.id as string) || change.doc.id;
            trackedIds.add(ordId);
            const currentStatus = data.status as string;
            const lastKnown = previousStatuses[ordId];

            if (change.type === "modified" || (lastKnown && lastKnown !== currentStatus)) {
              if (lastKnown && lastKnown !== currentStatus) {
                notifyCustomer(ordId, currentStatus, data.stageNotes as string);
              }
            }
            previousStatuses[ordId] = currentStatus;
          });
        },
        () => {
          // Gracefully ignore permission notice
        },
      );
    } catch {
      // ignore
    }
  };

  if (cleanUid || auth.currentUser) {
    attachCustomerQueryListener();
  }

  const unsubAuth = auth.onAuthStateChanged((user) => {
    if (user && !unsubCustomerQuery) {
      attachCustomerQueryListener();
    }
  });

  return () => {
    if (notifChannel) {
      notifChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("al_order_broadcast", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    unsubAuth();
    if (unsubCustomerQuery) unsubCustomerQuery();
    unsubs.forEach((u) => u());
  };
}
