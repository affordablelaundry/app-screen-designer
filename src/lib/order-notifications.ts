import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface StoredNotification {
  id: string;
  orderId: string;
  title: string;
  body: string;
  timestamp: string;
  status: string;
  read: boolean;
}

const STORAGE_KEY_ORDERS = "al_tracked_order_ids";
const STORAGE_KEY_NOTIFS = "al_device_notifications";
const STORAGE_KEY_PREF = "al_notification_permission_requested";

// Synthesize pleasant sound chime using Web Audio API (no external file dependencies)
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2 (higher harmony)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (err) {
    console.debug("Web Audio chime error:", err);
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
      const updated = [cleanId, ...current].slice(0, 20); // Keep max 20
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
  const updated = [newRecord, ...current].slice(0, 30);
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }
  return newRecord;
}

export function markAllNotificationsRead() {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

// Trigger device notification with fallback
export function triggerDeviceNotification(
  title: string,
  body: string,
  orderId: string,
  status: string,
) {
  playNotificationChime();

  // Try device vibration if supported on mobile
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      navigator.vibrate([150, 75, 150]);
    } catch {
      // Ignore vibration error
    }
  }

  // Save in local notifications store
  saveNotificationRecord({
    orderId,
    title,
    body,
    timestamp: new Date().toISOString(),
    status,
  });

  // Browser desktop/mobile notification
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    try {
      const notif = new Notification(title, {
        body,
        icon: "/src/assets/affordable-laundry-icon.jpg",
        badge: "/src/assets/affordable-laundry-icon.jpg",
        tag: `order-${orderId}`,
      });

      notif.onclick = () => {
        window.focus();
        window.location.hash = "#dashboard";
      };
    } catch (err) {
      console.debug("Native Notification constructor error:", err);
    }
  }
}

// Format friendly label for statuses
export function getStatusFriendlyText(status: string): string {
  const MAP: Record<string, string> = {
    COLLECTION_SCHEDULED: "Collection Scheduled (Rider assigned)",
    ITEMS_RECEIVED: "Items Received & Inspected at Atelier",
    WASHING: "In Gentle Wash & Eco-Treatment",
    READY_FOR_PICKUP: "Steam Pressed & Neatly Packaged",
    DELIVERY_ON_THE_WAY: "Courier Out for Delivery to Your Door",
    COMPLETED: "Delivered & Fresh in Your Wardrobe",
    CANCELLED: "Order Cancelled",
  };
  return MAP[status] || status;
}

// Real-time Firestore listener for all tracked orders on this device
export function setupDeviceOrderNotifications(
  onUpdate?: (orderId: string, newStatus: string, title: string, body: string) => void,
) {
  const trackedIds = getTrackedOrderIds();
  if (trackedIds.length === 0) return () => {};

  const previousStatuses: Record<string, string> = {};
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

          // If status changed and this isn't the initial read
          if (lastKnown && lastKnown !== currentStatus) {
            const friendly = getStatusFriendlyText(currentStatus);
            const title = `Affordable Laundry: Order #${orderId}`;
            const body = `Status updated: ${friendly}. ${data.stageNotes || "Our team is taking care of your garments."}`;

            triggerDeviceNotification(title, body, orderId, currentStatus);
            onUpdate?.(orderId, currentStatus, title, body);
          }

          previousStatuses[orderId] = currentStatus;
        },
        () => {
          // Gracefully ignore offline or permission errors for background notification poller
        },
      );

      unsubs.push(unsub);
    } catch (err) {
      console.debug(`Error watching order ${orderId}:`, err);
    }
  });

  return () => {
    unsubs.forEach((u) => u());
  };
}
