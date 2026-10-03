import { useState } from "react";
import { BellRing, Check, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  requestDeviceNotificationPermission,
  triggerDeviceNotification,
  playNotificationChime,
} from "@/lib/order-notifications";
import { toast } from "sonner";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";

interface NotificationOnboardingModalProps {
  userId: string;
  isOpen: boolean;
  onComplete: () => void;
}

export function NotificationOnboardingModal({
  userId,
  isOpen,
  onComplete,
}: NotificationOnboardingModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const markOnboarded = () => {
    try {
      localStorage.setItem(`al_notif_onboarded_${userId}`, "true");
      localStorage.setItem("al_device_notif_prompted", "true");
    } catch {
      // ignore
    }
    onComplete();
  };

  const handleTurnOn = async () => {
    setSubmitting(true);
    try {
      const res = await requestDeviceNotificationPermission();
      if (res === "granted") {
        playNotificationChime();
        triggerDeviceNotification(
          "Alerts Turned On 🔔",
          "You will receive live updates on this phone or laptop as your clothes are washed and delivered.",
          "WELCOME",
          "READY",
        );
        toast.success("Phone updates turned on!");
      } else {
        toast.info("Settings saved.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      markOnboarded();
    }
  };

  const handleSkip = () => {
    markOnboarded();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Floating Brand & Bell Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <BellRing className="w-10 h-10 animate-pulse text-primary" />
          </div>
          <img
            src={brandIcon}
            alt="Affordable Laundry"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl object-cover border-2 border-background shadow-xs"
          />
        </div>

        {/* Simple title and message */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Quick Setup
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Get Updates on This Phone
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Turn on notifications so you know the exact moment your clothes are picked up, washed,
            and on the way back.
          </p>
        </div>

        {/* Value Points in Simple English */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-left space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Rider on the Way</span>
              <span className="text-[11px] text-muted-foreground">
                We alert you when our rider is coming to your hall or hostel gate.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Washed & Ready</span>
              <span className="text-[11px] text-muted-foreground">
                Know when your clothes are washed, ironed, and neatly packed.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Works on Any Device</span>
              <span className="text-[11px] text-muted-foreground">
                Plays a pleasant sound alert on your phone or laptop.
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-1">
          <Button
            onClick={handleTurnOn}
            disabled={submitting}
            className="w-full h-12 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-98 gap-2"
          >
            <BellRing className="w-4 h-4" />
            <span>{submitting ? "Turning On..." : "Turn On Updates"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="w-full h-10 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}
