import { useState, useEffect, useMemo, useRef, type FormEvent } from "react";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import {
  Package,
  Clock,
  MapPin,
  Phone,
  WashingMachine,
  Truck,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Shield,
  ArrowLeft,
  Calendar,
  DollarSign,
  Receipt,
  Check,
  X,
  ExternalLink,
  Shirt,
  Info,
  Search,
  Edit2,
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";
import { toast } from "sonner";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import { NotificationCenter } from "@/components/notification-center";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import {
  broadcastOrderEvent,
  getStatusCustomerMessage,
  getStatusFriendlyText,
  playNotificationChime,
  triggerDeviceNotification,
  setupCustomerOrderNotifications,
  addTrackedOrderId,
} from "@/lib/order-notifications";

export type OrderRecord = {
  id: string;
  docId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  location: string;
  pickupDate: string;
  items: Record<string, number>;
  itemCount: number;
  total: number;
  status:
    | "COLLECTION_SCHEDULED"
    | "ITEMS_RECEIVED"
    | "WASHING"
    | "READY_FOR_PICKUP"
    | "DELIVERY_ON_THE_WAY"
    | "COMPLETED"
    | "CANCELLED";
  stageNotes?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt?: string;
};

const STATUS_STEPS = [
  { key: "COLLECTION_SCHEDULED", label: "Booked", desc: "Pickup booked" },
  { key: "ITEMS_RECEIVED", label: "Clothes Received", desc: "Clothes received & inspected" },
  { key: "WASHING", label: "Washing Clothes", desc: "Washing & stain care" },
  { key: "READY_FOR_PICKUP", label: "Ready for Delivery", desc: "Ironed & packaged" },
  { key: "DELIVERY_ON_THE_WAY", label: "Out for Delivery", desc: "Courier on the way" },
  { key: "COMPLETED", label: "Delivered", desc: "Delivered fresh" },
];

const STATUS_CONFIG: Record<
  OrderRecord["status"],
  { label: string; badge: string; icon: typeof Package; step: number }
> = {
  COLLECTION_SCHEDULED: {
    label: "Pickup Booked",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    icon: Clock,
    step: 1,
  },
  ITEMS_RECEIVED: {
    label: "Clothes Received",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    icon: Package,
    step: 2,
  },
  WASHING: {
    label: "Washing Clothes",
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    icon: WashingMachine,
    step: 3,
  },
  READY_FOR_PICKUP: {
    label: "Ironed & Packed Clean",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    icon: CheckCircle2,
    step: 4,
  },
  DELIVERY_ON_THE_WAY: {
    label: "Rider Coming to You",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    icon: Truck,
    step: 5,
  },
  COMPLETED: {
    label: "Delivered to You",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
    step: 6,
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    icon: AlertCircle,
    step: 0,
  },
};

const GARMENT_PRICING = [
  { id: "tshirt", name: "T-Shirt / Polo", price: 4 },
  { id: "shirt", name: "Formal Shirt", price: 6 },
  { id: "trousers", name: "Trousers / Jeans", price: 8 },
  { id: "suit", name: "Suit (2-Piece)", price: 25 },
  { id: "dress", name: "Dress / Gown", price: 15 },
  { id: "traditional", name: "Kente / Native Wear", price: 20 },
  { id: "bedding", name: "Bedsheet & Duvet", price: 18 },
];

interface CustomerPortalProps {
  onBackToLanding: () => void;
}

export function CustomerPortal({ onBackToLanding }: CustomerPortalProps) {
  const { user, profile, logout, updateDisplayName } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderRecord | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const knownCustomerStatusesRef = useRef<Record<string, string>>({});
  const isInitialCustomerSyncRef = useRef<boolean>(true);

  // New booking form quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({
    tshirt: 2,
    shirt: 1,
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Cross-tab and live order process notifications for customer
  useEffect(() => {
    if (!user) return;
    const unsub = setupCustomerOrderNotifications(
      { userId: user.uid, email: user.email || profile?.email || "" },
      (orderId, newStatus, title, body) => {
        toast.info(`👕 ${title}`, {
          description: body,
          duration: 9000,
        });
      },
    );
    return () => unsub();
  }, [user, profile?.email]);

  // Real-time listener for current user's orders (Links manual and Google accounts via email & UID)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const ordersRef = collection(db, "orders");
      const cleanEmail = (user.email || profile?.email || "").trim().toLowerCase();
      const ordersMap = new Map<string, OrderRecord>();

      // Pre-fill orders from unified local cache immediately for instant display & offline resiliency
      try {
        const cachedRaw = localStorage.getItem("al_orders_cache");
        if (cachedRaw) {
          const list = JSON.parse(cachedRaw) as OrderRecord[];
          list.forEach((ord) => {
            const matchEmail = cleanEmail && ord.customerEmail?.toLowerCase() === cleanEmail;
            const matchUid = ord.userId === user.uid;
            if (matchEmail || matchUid) {
              ordersMap.set(ord.id, ord);
            }
          });
          if (ordersMap.size > 0) {
            const initialList = Array.from(ordersMap.values());
            initialList.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
            setOrders(initialList);
            initialList.forEach((ord) => {
              knownCustomerStatusesRef.current[ord.id] = ord.status;
            });
            setLoading(false);
          }
        }
      } catch {
        // ignore
      }

      const syncMergedOrders = () => {
        const list = Array.from(ordersMap.values());
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        list.forEach((ord) => {
          knownCustomerStatusesRef.current[ord.id] = ord.status;
        });
        isInitialCustomerSyncRef.current = false;

        setOrders(list);
        setLoading(false);

        // Keep local persistent cache unified and up to date
        try {
          const cachedRaw = localStorage.getItem("al_orders_cache");
          const masterMap = new Map<string, OrderRecord>();
          if (cachedRaw) {
            const existing = JSON.parse(cachedRaw) as OrderRecord[];
            existing.forEach((o) => masterMap.set(o.id, o));
          }
          list.forEach((o) => masterMap.set(o.id, o));
          localStorage.setItem("al_orders_cache", JSON.stringify(Array.from(masterMap.values())));
        } catch {
          // ignore
        }
      };

      const parseDoc = (docSnap: {
        id: string;
        data: () => Record<string, unknown>;
      }): OrderRecord => {
        const data = docSnap.data();
        return {
          id: (data.id as string) || docSnap.id,
          docId: docSnap.id,
          userId: (data.userId as string) || "",
          customerName: (data.customerName as string) || "Customer",
          customerEmail: (data.customerEmail as string) || "",
          customerPhone: (data.customerPhone as string) || "",
          location: (data.location as string) || "KNUST campus",
          pickupDate: (data.pickupDate as string) || "As soon as possible",
          items: (data.items as Record<string, number>) || {},
          itemCount: (data.itemCount as number) || 0,
          total: Number(data.total || 0),
          status: (data.status as OrderRecord["status"]) || "COLLECTION_SCHEDULED",
          stageNotes: data.stageNotes as string | undefined,
          riderName: data.riderName as string | undefined,
          riderPhone: data.riderPhone as string | undefined,
          createdAt: (data.createdAt as string) || new Date().toISOString(),
          updatedAt: data.updatedAt as string | undefined,
        };
      };

      // Immediately show cached orders for 0ms latency
      syncMergedOrders();

      let unsubUid: (() => void) | null = null;
      let unsubEmail: (() => void) | null = null;

      const attachFirestoreListeners = () => {
        if (!auth.currentUser || unsubUid) return;
        const currentUid = auth.currentUser.uid;
        const qUid = query(ordersRef, where("userId", "==", currentUid));
        unsubUid = onSnapshot(
          qUid,
          (snapshot) => {
            snapshot.forEach((docSnap) => {
              ordersMap.set(docSnap.id, parseDoc(docSnap));
            });
            syncMergedOrders();
          },
          (error) => {
            console.debug("Firestore customer orders sync note:", error);
            syncMergedOrders();
            setLoading(false);
          },
        );

        if (cleanEmail && auth.currentUser.email) {
          const qEmail = query(ordersRef, where("customerEmail", "==", cleanEmail));
          unsubEmail = onSnapshot(
            qEmail,
            (snapshot) => {
              snapshot.forEach((docSnap) => {
                ordersMap.set(docSnap.id, parseDoc(docSnap));
              });
              syncMergedOrders();
            },
            (error) => {
              console.debug("Firestore email query notice:", error);
              syncMergedOrders();
            },
          );
        }
      };

      if (auth.currentUser) {
        attachFirestoreListeners();
      }

      const unsubAuth = auth.onAuthStateChanged((fbUser) => {
        if (fbUser && !unsubUid) {
          attachFirestoreListeners();
        }
      });

      return () => {
        unsubAuth();
        if (unsubUid) unsubUid();
        if (unsubEmail) unsubEmail();
      };
    } catch (err) {
      console.error("Firestore listener setup error:", err);
      setLoading(false);
    }
  }, [user, profile?.email]);

  // Split active vs completed
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"),
    [orders],
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "COMPLETED" || o.status === "CANCELLED"),
    [orders],
  );

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status !== "CANCELLED" ? o.total : 0), 0),
    [orders],
  );

  const bookingTotal = useMemo(
    () => GARMENT_PRICING.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0),
    [quantities],
  );

  const bookingItemCount = useMemo(
    () => Object.values(quantities).reduce((sum, count) => sum + count, 0),
    [quantities],
  );

  const baseOrders = activeTab === "active" ? activeOrders : completedOrders;
  const displayedOrders = useMemo(() => {
    if (!searchQuery.trim()) return baseOrders;
    const q = searchQuery.toLowerCase().trim();
    return baseOrders.filter((order) => {
      const matchId = order.id.toLowerCase().includes(q);
      const matchLocation = order.location.toLowerCase().includes(q);
      const matchItems = Object.keys(order.items || {}).some((k) => k.toLowerCase().includes(q));
      const matchRider = (order.riderName || "").toLowerCase().includes(q);
      return matchId || matchLocation || matchItems || matchRider;
    });
  }, [baseOrders, searchQuery]);

  const changeBookingQuantity = (id: string, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + amount),
    }));
  };

  const handleCreateBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (bookingItemCount === 0) {
      toast.error("Please add at least one garment for collection.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const newOrderId = `AL${Date.now().toString().slice(-5)}`;
    const customerName = String(form.get("name") || profile?.displayName || "Customer");
    const customerPhone = String(form.get("phone") || profile?.phone || "");
    const location = String(form.get("location") || "").trim() || "KNUST Campus";
    const pickupDate = String(form.get("date") || "Tomorrow");

    const cleanEmail = (user.email || profile?.email || "").trim().toLowerCase();
    const newOrderRecord: OrderRecord = {
      id: newOrderId,
      docId: newOrderId,
      userId: user.uid,
      customerName,
      customerEmail: cleanEmail,
      customerPhone,
      location,
      pickupDate,
      items: quantities,
      itemCount: bookingItemCount,
      total: bookingTotal,
      status: "COLLECTION_SCHEDULED",
      stageNotes: "Collection requested via Customer Portal.",
      riderName: "Affordable Laundry Dispatch Rider",
      riderPhone: "053 233 1150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubmittingBooking(true);

    try {
      const orderRef = doc(db, "orders", newOrderId);
      await setDoc(orderRef, newOrderRecord);

      // Broadcast new booking immediately so admin dashboard gets instant pop-up notification
      broadcastOrderEvent({
        type: "NEW_ORDER",
        orderId: newOrderId,
        customerName: newOrderRecord.customerName,
        customerEmail: newOrderRecord.customerEmail,
        userId: user.uid,
        itemCount: newOrderRecord.itemCount,
        total: newOrderRecord.total,
        location: newOrderRecord.location,
        status: "COLLECTION_SCHEDULED",
      });

      // Persist in local cache for immediate availability
      try {
        const rawCache = localStorage.getItem("al_orders_cache");
        const cacheList: OrderRecord[] = rawCache ? JSON.parse(rawCache) : [];
        cacheList.unshift(newOrderRecord);
        localStorage.setItem("al_orders_cache", JSON.stringify(cacheList));
      } catch {
        // ignore
      }

      // Track order on this device for background push notifications
      addTrackedOrderId(newOrderId);
      triggerDeviceNotification(
        `Affordable Laundry: Collection Scheduled!`,
        `Order #${newOrderId} is booked. We will notify you at every step: clothes received, washing, and delivery!`,
        newOrderId,
        "COLLECTION_SCHEDULED",
      );

      toast.success(`Collection #${newOrderId} scheduled successfully!`);
      setBookingModalOpen(false);
      setQuantities({ tshirt: 2, shirt: 1 });
      setActiveTab("active");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${newOrderId}`, user);
      toast.error("Failed to book collection. Please try again.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // If user is not authenticated, render the secure authentication gate
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 bg-card border border-border rounded-3xl shadow-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Secure Customer Portal</h2>
            <p className="text-xs text-muted-foreground mt-2">
              Authentication required. Only logged-in customers can view their active garment care
              orders and private dispatch statuses.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={onBackToLanding} variant="default" className="rounded-xl w-full">
              Sign In to Access Portal
            </Button>
            <Button onClick={onBackToLanding} variant="outline" className="rounded-xl w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col font-sans">
      {/* Portal Header - Translucent Glass */}
      <header className="sticky top-0 z-40 bg-white/40 dark:bg-black/50 backdrop-blur-2xl border-b border-white/30 dark:border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Brand & Portal Label */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={brandIcon}
                alt="Affordable Laundry"
                className="w-10 h-10 rounded-2xl object-cover border border-sky-400/40 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-background" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  Affordable Laundry
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Garment care status, collection booking & unified order history
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setBookingModalOpen(true)}
              size="sm"
              className="rounded-2xl text-xs font-bold shadow-md gap-1.5 h-9 sm:h-10 px-4 bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Book Collection</span>
              <span className="sm:hidden">Book</span>
            </Button>

            <NotificationCenter />

            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLanding}
              className="rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground h-9 sm:h-10 px-3 bg-white/20 hover:bg-white/35 backdrop-blur-xl border border-white/20"
              title="Return to the main marketing website"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span className="hidden md:inline">Website</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="rounded-2xl text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/20 h-9 sm:h-10 px-3"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner & Summary Stats */}
        <section className="bg-white/35 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-300">
                  Customer Dashboard · Order History & Dispatch Updates
                </span>
              </div>

              {!isEditingName ? (
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Welcome, {profile?.displayName || user.displayName || "Customer"}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(profile?.displayName || user.displayName || "");
                      setIsEditingName(true);
                    }}
                    className="p-1.5 px-2.5 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5 transition-all border border-white/30 backdrop-blur-md shadow-xs"
                    title="Change unified user name across Google and password logins"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-[11px] font-bold">Edit Name</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!tempName.trim()) return;
                    setSavingName(true);
                    try {
                      await updateDisplayName(tempName.trim());
                      setIsEditingName(false);
                    } finally {
                      setSavingName(false);
                    }
                  }}
                  className="flex items-center gap-2 flex-wrap pt-1"
                >
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 px-3.5 rounded-xl border border-sky-400/60 bg-white/80 dark:bg-black/70 backdrop-blur-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    type="submit"
                    disabled={savingName}
                    className="h-10 rounded-xl text-xs font-bold px-3.5 bg-sky-500 hover:bg-sky-400 text-white"
                  >
                    {savingName ? "Saving..." : "Save Unified Name"}
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditingName(false)}
                    className="h-10 rounded-xl text-xs px-2.5"
                  >
                    Cancel
                  </Button>
                </form>
              )}

              <p className="text-xs sm:text-sm text-muted-foreground">
                Email: <strong className="text-foreground">{user.email}</strong> · Name and orders
                are automatically synchronized across Google & password login.
              </p>
            </div>

            {/* Quick Metrics - Translucent Glass Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center min-w-[110px] shadow-sm hover:scale-105 transition-transform">
                <span className="text-[11px] font-bold text-muted-foreground block uppercase tracking-wider">
                  In Progress
                </span>
                <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
                  {activeOrders.length}
                </span>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center min-w-[110px] shadow-sm hover:scale-105 transition-transform">
                <span className="text-[11px] font-bold text-muted-foreground block uppercase tracking-wider">
                  Delivered
                </span>
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  {completedOrders.length}
                </span>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center min-w-[110px] col-span-2 sm:col-span-1 shadow-sm hover:scale-105 transition-transform">
                <span className="text-[11px] font-bold text-muted-foreground block uppercase tracking-wider">
                  Total Spent
                </span>
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  GHC {totalSpent}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Selection & Search Row - Translucent Glass */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center p-1.5 bg-white/35 dark:bg-white/5 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-sm w-fit">
            <button
              onClick={() => {
                setActiveTab("active");
                setSearchQuery("");
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "active"
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Active Orders Tracker
              {activeOrders.length > 0 && (
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeTab === "active" ? "bg-white text-sky-600" : "bg-sky-500/10 text-sky-600"
                  }`}
                >
                  {activeOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                setSearchQuery("");
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Order History
              {completedOrders.length > 0 && (
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeTab === "history" ? "bg-white text-sky-600" : "bg-muted text-foreground"
                  }`}
                >
                  {completedOrders.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search order #, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-2xl border border-white/30 bg-white/30 dark:bg-white/5 backdrop-blur-xl text-xs text-foreground focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-sky-500" />
              <span className="hidden sm:inline">Live Updates</span>
            </div>
          </div>
        </section>

        {/* Orders List */}
        {loading ? (
          <div className="p-16 text-center bg-card border border-border rounded-3xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm font-semibold text-foreground">
              Loading your clothes and orders...
            </p>
            <p className="text-xs text-muted-foreground">Checking live status</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-card border border-dashed border-border rounded-3xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {activeTab === "active" ? "No active laundry collections" : "No order history yet"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                {activeTab === "active"
                  ? "You don't have any garments currently being processed. Schedule a pickup now and our courier will collect your laundry at your door."
                  : "Completed orders and historical receipts will appear here once delivered."}
              </p>
            </div>
            {activeTab === "active" && (
              <Button
                onClick={() => setBookingModalOpen(true)}
                className="rounded-xl text-xs font-semibold px-6 h-11"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Schedule First Collection
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.COLLECTION_SCHEDULED;
              const StatusIcon = statusCfg.icon;
              const currentStepNumber = statusCfg.step;

              return (
                <article
                  key={order.id}
                  className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-sky-400/50 transition-all duration-300 space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-foreground tracking-tight">
                          Order #{order.id}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1.5 ${statusCfg.badge}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>
                          Booked:{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-500" />
                          {order.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-500" />
                          Pickup: {order.pickupDate}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="rounded-2xl text-xs font-semibold h-9 bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 hover:bg-white/40"
                      >
                        <Receipt className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
                        View Receipt
                      </Button>
                    </div>
                  </div>

                  {/* 6-Stage Progress Stepper */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>Care Journey</span>
                      <span className="text-sky-600 dark:text-sky-400 font-bold">
                        Stage {currentStepNumber} of 6
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2.5 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-700 ease-out shadow-xs"
                        style={{
                          width: `${Math.min(100, Math.max(12, (currentStepNumber / 6) * 100))}%`,
                        }}
                      />
                    </div>

                    {/* Steps Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                      {STATUS_STEPS.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isDone = currentStepNumber > stepNum;
                        const isCurrent = currentStepNumber === stepNum;

                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-2xl border text-center transition-all ${
                              isCurrent
                                ? "bg-sky-500/15 border-sky-400/50 text-sky-600 dark:text-sky-300 font-bold shadow-xs"
                                : isDone
                                  ? "bg-white/30 dark:bg-white/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium"
                                  : "bg-white/10 dark:bg-white/5 border-transparent text-muted-foreground opacity-60"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 text-[11px] mb-0.5">
                              {isDone ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <span>{stepNum}.</span>
                              )}
                              <span>{step.label}</span>
                            </div>
                            <span className="text-[10px] block opacity-80 leading-tight">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Grid: Garments, Notes & Assigned Rider */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Garments breakdown */}
                    <div className="p-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/25 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Garments Handled ({order.itemCount} items)
                      </span>
                      <div className="space-y-1 text-xs">
                        {order.items &&
                        Object.entries(order.items).filter(([, count]) => count > 0).length > 0 ? (
                          Object.entries(order.items)
                            .filter(([, count]) => count > 0)
                            .map(([name, count]) => (
                              <div key={name} className="flex justify-between text-foreground">
                                <span className="capitalize">{name}</span>
                                <span className="font-bold">x{count}</span>
                              </div>
                            ))
                        ) : (
                          <p className="text-muted-foreground italic">
                            Standard wash & fold assortment
                          </p>
                        )}
                        <div className="border-t border-white/20 pt-1.5 mt-2 flex justify-between font-bold text-foreground">
                          <span>Total Amount</span>
                          <span className="text-sky-600 dark:text-sky-400">GHC {order.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inspection & Care Notes */}
                    <div className="p-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/25 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Specialist Inspection Notes
                      </span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {order.stageNotes ||
                          "Garments undergo gentle fabric inspection, premium detergent wash, and steam finishing."}
                      </p>
                    </div>

                    {/* Dispatch Rider Card */}
                    <div className="p-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/25 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Assigned Courier / Dispatch
                      </span>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-foreground">
                          {order.riderName || "Affordable Laundry Dispatch Courier"}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-500" />
                          {order.riderPhone || "053 233 1150"}
                        </p>
                        {order.riderPhone && (
                          <a
                            href={`tel:${order.riderPhone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline mt-1 pt-1 block"
                          >
                            Call Courier Direct ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Book Collection Modal */}
      {bookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setBookingModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-black/90 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Doorstep Pickup
                </span>
                <h3 className="text-xl font-black text-foreground">Book Garment Collection</h3>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-5">
              {/* Garment Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Select Items ({bookingItemCount} items selected)
                  </label>
                  <span className="text-xs font-bold text-primary">Total: GHC {bookingTotal}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {GARMENT_PRICING.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border"
                    >
                      <div>
                        <span className="text-xs font-bold text-foreground block">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          GHC {item.price} each
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeBookingQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-sm font-bold hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-6 text-center">
                          {quantities[item.id] ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeBookingQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-sm font-bold hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Location Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Contact Name
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={profile?.displayName || user.displayName || ""}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    required
                    inputMode="tel"
                    defaultValue={profile?.phone || ""}
                    placeholder="053 233 1150"
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Pickup Location (Hall, Hostel, or Room)
                  </label>
                  <PlacesAutocomplete
                    name="location"
                    required
                    placeholder="Type your hall, hostel, or room (e.g. Queen's Hall Rm 12)"
                    id="portal-location-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Pickup Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Free pickup and delivery within KNUST. We call before arrival.</span>
              </div>

              <Button
                type="submit"
                disabled={submittingBooking}
                className="w-full h-12 rounded-xl text-xs font-bold"
              >
                {submittingBooking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Scheduling Collection...
                  </>
                ) : (
                  <>Confirm Collection · GHC {bookingTotal}</>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedReceiptOrder(null);
          }}
        >
          <div className="relative w-full max-w-md bg-white/95 dark:bg-black/90 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={brandIcon} alt="Logo" className="w-7 h-7 rounded-lg" />
                <h3 className="font-bold text-foreground">Digital Service Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-bold text-foreground">#{selectedReceiptOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-primary">
                  {STATUS_CONFIG[selectedReceiptOrder.status]?.label || selectedReceiptOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-semibold text-foreground">
                  {selectedReceiptOrder.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Location</span>
                <span className="font-semibold text-foreground">
                  {selectedReceiptOrder.location}
                </span>
              </div>

              <div className="border-t border-b border-border py-3 space-y-2">
                <span className="font-bold text-foreground block">Garment Breakdown:</span>
                {Object.entries(selectedReceiptOrder.items || {}).map(([name, count]) => (
                  <div key={name} className="flex justify-between text-muted-foreground">
                    <span className="capitalize">{name}</span>
                    <span>x{count}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-black text-foreground pt-1">
                <span>Total Charge</span>
                <span className="text-primary">GHC {selectedReceiptOrder.total}</span>
              </div>
            </div>

            <Button
              onClick={() => setSelectedReceiptOrder(null)}
              className="w-full rounded-xl text-xs font-semibold"
            >
              Close Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
