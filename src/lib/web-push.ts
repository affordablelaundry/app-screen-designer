import { auth } from "@/lib/firebase";

// Valid dedicated production VAPID key pair generated for Affordable Laundry
export const DEFAULT_VAPID_PUBLIC_KEY =
  "BCxZgwdc3RdO9K_zQbbBExOGhEd1eBSyrTWGYIFVxxkJM_395HBEaN6AiAoV-eeIOWN9QRpnk8RvSg2KBqAMCr4";

// Utility to convert VAPID base64 string to Uint8Array required by PushManager
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Validates and retrieves the VAPID public key.
 * Always resolves to a valid key so phones are never blocked from requesting permissions.
 */
export function getVapidPublicKey(): string {
  const rawKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (rawKey && typeof rawKey === "string" && rawKey.trim()) {
    return rawKey.trim();
  }
  return DEFAULT_VAPID_PUBLIC_KEY;
}

/**
 * Helper to check if an existing subscription's applicationServerKey matches the current VAPID key
 */
function areKeysEqual(buf: ArrayBuffer | null | undefined, expectedBytes: Uint8Array): boolean {
  if (!buf) return false;
  const actualBytes = new Uint8Array(buf);
  if (actualBytes.byteLength !== expectedBytes.byteLength) return false;
  for (let i = 0; i < actualBytes.byteLength; i++) {
    if (actualBytes[i] !== expectedBytes[i]) return false;
  }
  return true;
}

export interface EnableNotificationResult {
  success: boolean;
  status: "enabled" | "blocked" | "unsupported" | "not_installed_ios" | "saved";
  error?: string;
  subscription?: PushSubscription;
}

/**
 * User-initiated push enablement (strictly called directly from a user tap):
 * 1. Calls Notification.requestPermission() immediately within the synchronous user gesture!
 *    On iOS Safari, any preceding await or delay causes the browser to drop the user activation context.
 * 2. If granted, registers /sw.js and pushes subscription to backend.
 */
export async function enableNotifications(): Promise<EnableNotificationResult> {
  if (typeof window === "undefined") {
    return { success: false, status: "unsupported", error: "Window is not available" };
  }

  // Check Notification support
  if (!("Notification" in window)) {
    return {
      success: false,
      status: "unsupported",
      error: "Notifications are not supported on this browser.",
    };
  }

  try {
    // 1. CRITICAL: Request permission FIRST directly inside the user tap event!
    // Never put any async fetch or storage call before this line.
    let permission = Notification.permission;
    if (permission !== "granted") {
      try {
        permission = await Notification.requestPermission();
      } catch (permErr) {
        console.warn("[web-push] Notification.requestPermission error:", permErr);
      }
    }

    if (permission !== "granted") {
      return {
        success: false,
        status: "blocked",
        error: "Notification permission was denied or dismissed.",
      };
    }

    // Check serviceWorker & PushManager
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      // Permission was granted for in-app browser notifications
      try {
        localStorage.setItem("al_notification_permission_requested", "true");
      } catch {
        // ignore
      }
      return {
        success: true,
        status: "enabled",
      };
    }

    // 2. Register service worker
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const vapidKey = getVapidPublicKey();
    const expectedKeyBytes = urlBase64ToUint8Array(vapidKey);
    let subscription: PushSubscription | null = null;

    try {
      subscription = await reg.pushManager.getSubscription();
    } catch {
      // ignore
    }

    // When an existing subscription's applicationServerKey doesn't match current key, unsubscribe
    if (subscription) {
      const currentKeyBuf = subscription.options?.applicationServerKey;
      if (!areKeysEqual(currentKeyBuf, expectedKeyBytes)) {
        console.log(
          "[web-push] ApplicationServerKey mismatch on existing subscription. Re-subscribing with new key...",
        );
        try {
          await subscription.unsubscribe();
          subscription = null;
        } catch (unsubErr) {
          console.warn("[web-push] Could not unsubscribe old subscription:", unsubErr);
        }
      }
    }

    // Subscribe if no active valid subscription
    if (!subscription) {
      try {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: expectedKeyBytes,
        });
      } catch (subErr: unknown) {
        console.warn("[web-push] pushManager.subscribe notice:", subErr);
        // On iOS without standalone mode, PushManager throws. But device permission is granted!
        return {
          success: true,
          status: "enabled",
        };
      }
    }

    // 3. Post subscription to backend with verified Firebase ID token
    const user = auth.currentUser;
    if (user && subscription) {
      try {
        const idToken = await user.getIdToken(true);
        const response = await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn("[web-push] Backend /api/save-subscription responded:", errText);
        }
      } catch (tokenErr) {
        console.warn("[web-push] Could not retrieve Firebase ID token or post to API:", tokenErr);
      }
    }

    try {
      localStorage.setItem("al_web_push_enabled", "true");
      localStorage.setItem("al_notification_permission_requested", "true");
    } catch {
      // ignore
    }

    return {
      success: true,
      status: "enabled",
      subscription: subscription || undefined,
    };
  } catch (err: unknown) {
    console.error("[web-push] enableNotifications encountered an error:", err);
    const msg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while enabling notifications.";
    return {
      success: false,
      status: "unsupported",
      error: msg,
    };
  }
}

/**
 * Background / silent resync:
 * - NO permission prompt!
 * - If permission is already "granted" and a Firebase user is signed in:
 *   - registers /sw.js
 *   - verifies subscription applicationServerKey matches current key (unsubscribes & recreates if mismatched)
 *   - POSTs subscription to /api/save-subscription with "Authorization: Bearer <token>"
 */
export async function resyncPushSubscription(): Promise<PushSubscription | null> {
  if (typeof window === "undefined") return null;

  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return null;
  }

  // Never trigger a prompt
  if (Notification.permission !== "granted") {
    return null;
  }

  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  const vapidKey = getVapidPublicKey();

  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const expectedKeyBytes = urlBase64ToUint8Array(vapidKey);
    let subscription = await reg.pushManager.getSubscription();

    // Verify key match
    if (subscription) {
      const currentKeyBuf = subscription.options?.applicationServerKey;
      if (!areKeysEqual(currentKeyBuf, expectedKeyBytes)) {
        console.log(
          "[web-push] resync: Key mismatch detected. Unsubscribing outdated subscription...",
        );
        try {
          await subscription.unsubscribe();
          subscription = null;
        } catch {
          // ignore
        }
      }
    }

    // Subscribe if missing or refreshed
    if (!subscription) {
      try {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: expectedKeyBytes,
        });
      } catch (err) {
        console.warn("[web-push] resync subscription failed:", err);
        return null;
      }
    }

    if (subscription) {
      const idToken = await user.getIdToken();
      await fetch("/api/save-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      console.log(
        "[web-push] Successfully resynced push subscription with server for UID:",
        user.uid,
      );
    }

    return subscription;
  } catch (err) {
    console.debug("[web-push] resyncPushSubscription error:", err);
    return null;
  }
}

/**
 * Triggers server-side push notification endpoint /api/notify-order
 * Takes event "STATUS_UPDATE" | "NEW_ORDER" and orderIds
 */
export async function notifyOrderApi(
  event: "STATUS_UPDATE" | "NEW_ORDER",
  orderIds: string[],
): Promise<boolean> {
  if (typeof window === "undefined" || !orderIds || orderIds.length === 0) return false;

  const user = auth.currentUser;
  if (!user) {
    console.debug("[notify-order] User not authenticated; skipping server push trigger.");
    return false;
  }

  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/notify-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        event,
        orderIds: orderIds.slice(0, 50),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[notify-order] /api/notify-order returned HTTP ${response.status}:`, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[notify-order] Network error calling /api/notify-order:", err);
    return false;
  }
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Check device and PWA installation state
 */
export function getPwaState() {
  if (typeof window === "undefined") {
    return {
      isIOS: false,
      isStandalone: false,
      permission: "default" as NotificationPermission,
      canEnablePush: false,
    };
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

  const nav = navigator as NavigatorWithStandalone;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;

  const permission: NotificationPermission =
    "Notification" in window ? Notification.permission : "denied";

  // On iOS, Web Push is ONLY supported when installed in standalone mode (Home Screen PWA)
  const canEnablePush = isIOS ? isStandalone : true;

  return {
    isIOS,
    isStandalone,
    permission,
    canEnablePush,
  };
}
