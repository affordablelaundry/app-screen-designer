import { auth } from "@/lib/firebase";

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

export interface EnableNotificationResult {
  success: boolean;
  status: "enabled" | "blocked" | "unsupported" | "not_installed_ios" | "saved";
  error?: string;
  subscription?: PushSubscription;
}

/**
 * Main function requested: enableNotifications()
 * 1. Registers /sw.js
 * 2. Requests user permission via Notification.requestPermission() (MUST be called from a user tap)
 * 3. Subscribes with pushManager.subscribe (userVisibleOnly: true, VAPID public key)
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

    // 3. Get VAPID public key from Vite frontend environment variable
    const vapidKey =
      import.meta.env.VITE_VAPID_PUBLIC_KEY ||
      // Fallback demo public key if environment variable is not yet populated
      "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIHBQFLXYp5Nksh8U";

    let subscription: PushSubscription | null = await reg.pushManager.getSubscription();

    if (!subscription) {
      try {
        const applicationServerKey = urlBase64ToUint8Array(vapidKey);
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
      } catch (subErr: unknown) {
        console.warn("PushManager subscription notice:", subErr);
        const errMessage =
          subErr instanceof Error ? subErr.message : "Failed to subscribe to push notifications.";
        // On iOS without standalone mode, PushManager throws an error
        return {
          success: false,
          status: "unsupported",
          error: errMessage,
        };
      }
    }

    // 4. Get signed-in user's Firebase ID token
    const user = auth.currentUser;
    if (user && subscription) {
      try {
        const idToken = await user.getIdToken(true);
        // 5. POST subscription to backend
        const response = await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ subscription }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn("Backend /api/save-subscription responded:", errText);
        }
      } catch (tokenErr) {
        console.warn("Could not retrieve Firebase ID token or post to API:", tokenErr);
      }
    }

    // Also persist permission timestamp locally
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
    console.error("enableNotifications encountered an error:", err);
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
