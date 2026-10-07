import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { enableNotifications, getPwaState } from "@/lib/web-push";
import { toast } from "sonner";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaPushBanner() {
  const [mounted, setMounted] = useState(false);
  const [pwaState, setPwaState] = useState<{
    isIOS: boolean;
    isStandalone: boolean;
    permission: NotificationPermission;
    canEnablePush: boolean;
  }>({
    isIOS: false,
    isStandalone: false,
    permission: "default",
    canEnablePush: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [enabling, setEnabling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Sync PWA state and listen for beforeinstallprompt after mount
  useEffect(() => {
    setMounted(true);
    setPwaState(getPwaState());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPwaState(getPwaState());
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Update on visibility or media query change
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = () => setPwaState(getPwaState());
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Determine current lifecycle state
  // 1. "not_installed" (iOS not standalone OR Android with deferredPrompt)
  // 2. "blocked" (permission === "denied")
  // 3. "enabled" (permission === "granted")
  // 4. "permission_not_asked" (permission === "default")
  const { isIOS, isStandalone, permission } = pwaState;

  const isNotInstalled = (isIOS && !isStandalone) || (!isStandalone && !!deferredPrompt);

  let statusKey: "not_installed" | "blocked" | "enabled" | "permission_not_asked" =
    "permission_not_asked";

  if (permission === "granted") {
    statusKey = "enabled";
  } else if (permission === "denied") {
    statusKey = "blocked";
  } else if (isNotInstalled && isIOS) {
    statusKey = "not_installed";
  } else {
    statusKey = "permission_not_asked";
  }

  // Handle Android PWA Install button
  const handleAndroidInstall = async () => {
    if (!deferredPrompt) {
      toast.info(
        "To install, tap your browser's menu (⋮) and select 'Install App' or 'Add to Home screen'.",
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      toast.success("Affordable Laundry added to your Home Screen!");
      setDeferredPrompt(null);
    }
  };

  // Direct user tap for enabling Web Push notifications
  const handleEnablePush = async () => {
    setEnabling(true);
    try {
      const res = await enableNotifications();
      setPwaState(getPwaState());

      if (res.success) {
        toast.success("Push notifications enabled! You'll receive updates even when closed.");
      } else if (res.status === "blocked") {
        toast.error(
          "Notification permission was denied. Please allow notifications in site settings.",
        );
      } else if (res.status === "unsupported") {
        toast.info(res.error || "Web push is not supported in this browser mode.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      toast.error("Failed to turn on notifications: " + msg);
    } finally {
      setEnabling(false);
    }
  };

  // Prevent hydration mismatch: render nothing during SSR and initial hydration pass
  if (!mounted || dismissed) return null;

  // Don't show if already enabled and installed
  if (statusKey === "enabled" && isStandalone) return null;

  return (
    <aside
      aria-label="App installation and notifications prompt"
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 max-w-sm z-40 bg-slate-950/95 dark:bg-black/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-3 sm:p-4 space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/10"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            {statusKey === "enabled" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : statusKey === "blocked" ? (
              <AlertCircle className="w-4 h-4 text-amber-300" />
            ) : statusKey === "not_installed" ? (
              <Smartphone className="w-4 h-4 text-sky-300" />
            ) : (
              <BellRing className="w-4 h-4 text-sky-300 animate-pulse" />
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white tracking-tight">
              {statusKey === "enabled" && "Push Alerts Active"}
              {statusKey === "blocked" && "Notifications Blocked"}
              {statusKey === "not_installed" && "Install App for Offline & Push"}
              {statusKey === "permission_not_asked" && "Enable Background Alerts"}
            </h4>
            <span className="text-[9px] uppercase font-bold tracking-wider text-sky-400">
              {statusKey === "enabled" && "State: Enabled"}
              {statusKey === "blocked" && "State: Blocked in Settings"}
              {statusKey === "not_installed" && "State: Not Installed"}
              {statusKey === "permission_not_asked" && "State: Ready to Enable"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-white/80 leading-relaxed">
        {statusKey === "enabled" &&
          "You will receive live laundry alerts even when this web app is completely closed."}
        {statusKey === "blocked" &&
          "To receive alerts when the app is closed, tap the lock/settings icon in your address bar and reset Notifications."}
        {statusKey === "not_installed" &&
          isIOS &&
          "iPhone Web Push requires adding to Home Screen first. Tap Share, then 'Add to Home Screen'."}
        {statusKey === "not_installed" &&
          !isIOS &&
          "Install the app for instant access and instant push notifications when closed."}
        {statusKey === "permission_not_asked" &&
          "Receive alerts when clothes are picked up, washed, and out for delivery."}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-0.5">
        {/* iPhone Install Guide */}
        {isIOS && !isStandalone && (
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 text-[10px] font-semibold text-white">
            <span>Tap</span>
            <Share className="w-3 h-3 text-sky-300" />
            <span>&rarr; Add to Home Screen</span>
            <PlusSquare className="w-3 h-3 text-sky-300" />
          </div>
        )}

        {/* Android Install Button */}
        {!isIOS && !isStandalone && deferredPrompt && (
          <Button
            size="sm"
            onClick={handleAndroidInstall}
            className="h-8 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-xs shadow-sm gap-1.5 flex-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </Button>
        )}

        {/* Turn On Notifications Button */}
        {(!isIOS || isStandalone) && statusKey === "permission_not_asked" && (
          <Button
            size="sm"
            onClick={handleEnablePush}
            disabled={enabling}
            className="h-8 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-sm gap-1.5 flex-1 transition-transform active:scale-95"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{enabling ? "Connecting..." : "Turn On Notifications"}</span>
          </Button>
        )}

        {statusKey === "blocked" && (
          <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
            Check Browser Settings
          </span>
        )}
      </div>
    </aside>
  );
}
