import { auth } from "@/lib/firebase";

export const DEMO_VAPID_PUBLIC_KEY =
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIHBQFLXYp5Nksh8U";

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
 * Validates and retrieves the production VAPID public key.
 * Strictly disallows the demo fallback key so phones never get locked
 * to a key that cannot be verified by the real backend.
 */
export function getVapidPublicKey(): string | null {
  const rawKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!rawKey || typeof rawKey !== "string" || !rawKey.trim()) {
    console.error(
      "[web-push] Error: VITE_VAPID_PUBLIC_KEY environment variable is not defined. Cannot subscribe to push notifications.",
    );
    return null;
  }

  const cleanKey = rawKey.trim();
  if (cleanKey === DEMO_VAPID_PUBLIC_KEY) {
    console.error(
      "[web-push] Error: Demo VAPID public key detected. Please configure your real VAPID keys in Vercel / .env. Push subscription aborted.",
    );
    return null;
  }

  return cleanKey;
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
 * User-initiated push enablement (strictly called from a tap):
 * 1. Registers /sw.js
 * 2. Requests user permission via Notification.requestPermission()
 * 3. Subscribes with pushManager.subscribe (userVisibleOnly: true, VAPID public key)
 *    If an existing subscription has a different applicationServerKey, unsubscribes and creates a new one.
 * 4. Gets the signed-in user's Firebase ID token via getIdToken()
 * 5. POSTs subscription to /api/save-subscription with "Authorization: Bearer <token>"
 */
export async function enableNotifications(): Promise<EnableNotificationResult> {
  if (typeof window === "undefined") {
    return { success: false, status: "unsupported", error: "Window is not available" };
  }

  // Check Web Push and Service Worker support
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return {
      success: false,
      status: "unsupported",
      error: "Web Push notifications are not supported on this browser or platform.",
    };
  }

  const vapidKey = getVapidPublicKey();
  if (!vapidKey) {
    return {
      success: false,
      status: "unsupported",
      error:
        "Push notifications are currently not configured. Set VITE_VAPID_PUBLIC_KEY to enable.",
    };
  }

  try {
    // 1. Register service worker
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    // 2. Request permission (strictly user-gesture activated on iOS and Chrome)
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return {
        success: false,
        status: "blocked",
        error: "Notification permission was denied or dismissed.",
      };
    }

    const expectedKeyBytes = urlBase64ToUint8Array(vapidKey);
    let subscription: PushSubscription | null = await reg.pushManager.getSubscription();

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
        console.warn("[web-push] pushManager.subscribe failed:", subErr);
        const errMessage =
          subErr instanceof Error ? subErr.message : "Failed to subscribe to push notifications.";
        return {
          success: false,
          status: "unsupported",
          error: errMessage,
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
  if (!vapidKey) {
    return null;
  }

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
