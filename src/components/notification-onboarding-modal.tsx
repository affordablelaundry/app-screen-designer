import { useState } from "react";
import { Clock, BellRing, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enableNotifications } from "@/lib/web-push";
import {
  playNotificationChime,
  recordNotificationPromptDismissed,
} from "@/lib/order-notifications";
import { toast } from "sonner";

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

  const handleTurnOn = async () => {
    setSubmitting(true);
    try {
      // Must be called directly within user gesture so iOS Safari displays the prompt
      const res = await enableNotifications();
      recordNotificationPromptDismissed(userId);

      if (res.success) {
        playNotificationChime();
        toast.success("Notifications enabled! You'll receive live order updates.");
      } else if (res.status === "blocked") {
        toast.info("Notifications were denied. You can enable them anytime in phone settings.");
      }
    } catch (err) {
      console.error("[onboarding] Enable notifications error:", err);
    } finally {
      setSubmitting(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    recordNotificationPromptDismissed(userId);
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-onboarding-title"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl p-6 sm:p-8 flex flex-col items-center border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-300">
        {/* Top Graphic: Centered Circular Illustration with Smartphone & Floating Notification Card */}
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-primary/10 via-sky-100/70 to-indigo-100/50 dark:from-primary/20 dark:via-sky-950/40 dark:to-indigo-950/30 flex items-center justify-center relative my-2 overflow-visible select-none">
          {/* Stylized Smartphone Frame */}
          <div className="w-32 sm:w-36 h-48 sm:h-52 bg-slate-900 dark:bg-slate-950 rounded-[30px] border-4 border-slate-800 dark:border-slate-700 shadow-xl relative overflow-hidden flex flex-col items-center pt-2 shrink-0">
            {/* Dynamic Island Notch */}
            <div className="w-8 h-2.5 bg-black rounded-full mb-2 shrink-0 z-10" />

            {/* Screen Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-sky-200/90 via-indigo-100/80 to-purple-100/70 dark:from-slate-800 dark:to-slate-900 relative flex flex-col items-center justify-between p-2">
              {/* Subtle top indicator */}
              <div className="w-12 h-1 bg-white/40 dark:bg-white/20 rounded-full" />
              {/* Screen subtle icon */}
              <div className="opacity-25 my-auto">
                <Shirt className="w-8 h-8 text-primary" />
              </div>
              {/* Home indicator bar */}
              <div className="w-10 h-1 bg-black/30 dark:bg-white/30 rounded-full mb-1" />
            </div>
          </div>

          {/* Floating Horizontal Notification Banner Card (Overlapping the Smartphone) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 z-20">
            {/* Circular Icon Badge */}
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <Clock className="w-5 h-5 text-primary" />
            </div>

            {/* Preview Content: Clean Horizontal Pill Bars with Subtle Friendly Text */}
            <div className="flex-1 min-w-0 space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground tracking-tight">
                  Clothes Received
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Now</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-36 bg-primary/20 dark:bg-primary/30 rounded-full" />
                <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Big Bold Headline */}
        <h2
          id="notif-onboarding-title"
          className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-6 mb-2 leading-tight"
        >
          Get laundry reminders
        </h2>

        {/* Friendly Explanatory Subtitle */}
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs mx-auto mb-8">
          Get reminders when your pickup is scheduled and stay informed about every stage of your
          wash and delivery.
        </p>

        {/* Primary CTA: Full-Width Rounded Pill Button */}
        <Button
          onClick={handleTurnOn}
          disabled={submitting}
          className="w-full h-13 sm:h-14 rounded-full text-base sm:text-lg font-bold bg-[#261d56] hover:bg-[#1e1644] dark:bg-primary dark:hover:bg-primary/90 text-white shadow-lg transition-transform active:scale-[0.98] gap-2"
        >
          <BellRing className="w-4 h-4 shrink-0" />
          <span>{submitting ? "Turning on..." : "Turn on notifications"}</span>
        </Button>

        {/* Secondary CTA: Clean Skip Text Link */}
        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 text-muted-foreground hover:text-foreground font-semibold text-sm sm:text-base transition-colors py-2 focus:outline-none"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
