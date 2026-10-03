import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Check,
  Plus,
  Trash2,
  Volume2,
  X,
  Package,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getStoredNotifications,
  getTrackedOrderIds,
  addTrackedOrderId,
  removeTrackedOrderId,
  markAllNotificationsRead,
  requestDeviceNotificationPermission,
  getDeviceNotificationPermission,
  triggerDeviceNotification,
  playNotificationChime,
  type StoredNotification,
} from "@/lib/order-notifications";
import { toast } from "sonner";

interface NotificationCenterProps {
  onOpenOrder?: (orderId: string) => void;
}

export function NotificationCenter({ onOpenOrder }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [newOrderIdInput, setNewOrderIdInput] = useState("");
  const [activeTab, setActiveTab] = useState<"notifications" | "devices">("notifications");

  const loadData = () => {
    setNotifications(getStoredNotifications());
    setTrackedIds(getTrackedOrderIds());
    setPermission(getDeviceNotificationPermission());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRequestPermission = async () => {
    const res = await requestDeviceNotificationPermission();
    setPermission(res);
    if (res === "granted") {
      playNotificationChime();
      toast.success("Device notifications enabled! You will receive live status updates.");
      triggerDeviceNotification(
        "Affordable Laundry Alerts Active 🔔",
        "Your device will receive live notifications when your garment care status changes, even when not logged in.",
        "SYSTEM",
        "READY",
      );
      loadData();
    } else if (res === "denied") {
      toast.error("Notification permission was denied in your browser settings.");
    }
  };

  const handleTestChime = () => {
    triggerDeviceNotification(
      "Test Laundry Alert 🔔",
      "Order #AL-84920: Clothes are now in Gentle Wash & Eco-Treatment at our Kumasi atelier!",
      "AL-84920",
      "WASHING",
    );
    toast.success("Test notification fired with sound chime!");
    loadData();
  };

  const handleAddTracked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderIdInput.trim()) return;
    const clean = newOrderIdInput.trim().toUpperCase().replace("#", "");
    addTrackedOrderId(clean);
    setNewOrderIdInput("");
    loadData();
    toast.success(`Order #${clean} added to this device's notification watcher!`);
  };

  const handleRemoveTracked = (id: string) => {
    removeTrackedOrderId(id);
    loadData();
    toast.info(`Removed order #${id} from watcher.`);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    loadData();
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) handleMarkAllRead();
        }}
        className="relative p-2 rounded-2xl text-foreground hover:bg-muted/80 backdrop-blur-md border border-border/40 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Order Status Notifications"
        title="Live Order Notifications on your device"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-4 h-4 text-primary animate-bounce" />
        ) : (
          <Bell className="w-4 h-4 text-muted-foreground" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Glassmorphism Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-card/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl z-50 p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Live Order Alerts</h4>
                  <p className="text-[10px] text-muted-foreground">Phone, Laptop & Desktop Sync</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Permission Banner */}
            {permission !== "granted" ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-indigo-500/10 border border-primary/25 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Receive Alerts on This Device</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Get real-time status updates even when you are not logged in or when the app is in
                  the background.
                </p>
                <Button
                  onClick={handleRequestPermission}
                  size="sm"
                  className="w-full rounded-xl text-xs font-bold h-9 shadow-xs"
                >
                  <BellRing className="w-3.5 h-3.5 mr-1.5" />
                  Enable Device Notifications
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Device Push Alerts Active</span>
                </div>
                <button
                  onClick={handleTestChime}
                  className="text-[10px] font-bold underline hover:opacity-80 flex items-center gap-1 text-emerald-700 dark:text-emerald-300"
                >
                  <Volume2 className="w-3 h-3" /> Test Chime
                </button>
              </div>
            )}

            {/* Tab switch */}
            <div className="flex p-1 bg-muted/60 rounded-xl">
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === "notifications"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Alerts ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab("devices")}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === "devices"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tracked Orders ({trackedIds.length})
              </button>
            </div>

            {/* Tab: Notifications List */}
            {activeTab === "notifications" && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground space-y-1">
                    <Package className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs">No notifications yet</p>
                    <p className="text-[10px]">
                      When your garments change stages, alerts will ring here.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenOrder?.(item.orderId)}
                      className="p-3 rounded-2xl bg-muted/40 hover:bg-muted/80 border border-border/40 transition-all cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-[11px]">{item.title}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-tight">{item.body}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Tracked Order IDs on this device */}
            {activeTab === "devices" && (
              <div className="space-y-3">
                <form onSubmit={handleAddTracked} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Order # (e.g. AL-84920)"
                    value={newOrderIdInput}
                    onChange={(e) => setNewOrderIdInput(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl border border-input bg-background text-xs focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                  />
                  <Button type="submit" size="sm" className="rounded-xl text-xs h-9 px-3">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Watch
                  </Button>
                </form>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {trackedIds.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground text-center py-3">
                      No orders registered on this device yet. When you book a collection, it
                      automatically watches it here.
                    </p>
                  ) : (
                    trackedIds.map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2 rounded-xl bg-muted/50 border border-border/30 text-xs"
                      >
                        <span className="font-mono font-bold text-foreground">#{id}</span>
                        <button
                          onClick={() => handleRemoveTracked(id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                          title="Stop watching this order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer note */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Laptop className="w-3 h-3 text-primary" /> Works while device is online
              </span>
              <button
                onClick={handleTestChime}
                className="hover:underline text-primary font-semibold"
              >
                Chime demo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
