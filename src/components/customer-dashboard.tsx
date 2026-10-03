import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
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
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";

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

const STATUS_METADATA: Record<
  OrderRecord["status"],
  { label: string; color: string; icon: typeof Package; step: number }
> = {
  COLLECTION_SCHEDULED: {
    label: "Collection Scheduled",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    icon: Clock,
    step: 1,
  },
  ITEMS_RECEIVED: {
    label: "Items Received",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
    icon: Package,
    step: 2,
  },
  WASHING: {
    label: "Washing & Care",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
    icon: WashingMachine,
    step: 3,
  },
  READY_FOR_PICKUP: {
    label: "Ready for Pickup",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    icon: CheckCircle2,
    step: 4,
  },
  DELIVERY_ON_THE_WAY: {
    label: "Delivery on the Way",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    icon: Truck,
    step: 5,
  },
  COMPLETED: {
    label: "Completed & Delivered",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    icon: CheckCircle2,
    step: 6,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-destructive/10 text-destructive border-destructive/30",
    icon: AlertCircle,
    step: 0,
  },
};

interface CustomerDashboardProps {
  onOpenBooking: () => void;
  onTrackOrder: (orderId: string) => void;
  onOpenAdmin?: () => void;
}

export function CustomerDashboard({
  onOpenBooking,
  onTrackOrder,
  onOpenAdmin,
}: CustomerDashboardProps) {
  const { user, profile, isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Secure query: Only fetch orders belonging to this user
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: OrderRecord[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({
            ...(docSnap.data() as Omit<OrderRecord, "docId">),
            docId: docSnap.id,
          });
        });
        setOrders(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Dashboard onSnapshot error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.status !== "COMPLETED" && o.status !== "CANCELLED";
    if (filter === "completed") return o.status === "COMPLETED";
    return true;
  });

  const activeCount = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
  ).length;

  return (
    <section id="dashboard" className="section-pad bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-soft mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={brandIcon}
                alt="Affordable Laundry"
                className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-primary">
                    Customer Portal
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-foreground font-normal">
                  {profile?.displayName || user.displayName || "Valued Customer"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>{user.email}</span>
                  {profile?.phone && (
                    <>
                      <span>·</span>
                      <span>{profile.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && onOpenAdmin && (
                <Button
                  variant="outline"
                  onClick={onOpenAdmin}
                  className="rounded-full text-xs font-semibold border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Admin Dashboard
                </Button>
              )}
              <Button
                onClick={onOpenBooking}
                className="rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Book Collection
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Sign Out"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="p-3 bg-secondary rounded-2xl">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Active Orders
              </span>
              <p className="text-2xl font-serif text-foreground font-normal mt-0.5">
                {activeCount}
              </p>
            </div>
            <div className="p-3 bg-secondary rounded-2xl">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Total Bookings
              </span>
              <p className="text-2xl font-serif text-foreground font-normal mt-0.5">
                {orders.length}
              </p>
            </div>
            <div className="p-3 bg-secondary rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                KNUST Campus Delivery
              </span>
              <p className="text-sm font-semibold text-emerald-600 mt-1">✓ Free Doorstep Pickup</p>
            </div>
          </div>
        </div>

        {/* Orders Header and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-serif text-foreground">Your Laundry Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live updates as your clothes are collected, washed, and delivered.
            </p>
          </div>

          <div className="flex p-1 bg-muted rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === "active"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === "completed"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed ({orders.length - activeCount})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === "all"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({orders.length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-border">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-border">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <h4 className="text-lg font-serif text-foreground">No orders in this view</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
              {filter === "active"
                ? "You do not have any orders in transit right now. Book a collection today!"
                : "No past laundry orders found."}
            </p>
            <Button onClick={onOpenBooking} className="rounded-full text-xs font-semibold">
              Schedule a Collection
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const meta = STATUS_METADATA[order.status] || STATUS_METADATA.COLLECTION_SCHEDULED;
              const StatusIcon = meta.icon;

              const garments = Object.entries(order.items || {})
                .filter(([, c]) => c > 0)
                .map(([name, count]) => `${count}x ${name}`)
                .join(", ");

              return (
                <div
                  key={order.docId}
                  className="p-5 sm:p-6 bg-card rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-base text-foreground font-mono">
                            #{order.id}
                          </strong>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <small className="text-xs text-muted-foreground block mt-0.5">
                          Placed on{" "}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : order.pickupDate}
                        </small>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <small className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                          Total
                        </small>
                        <strong className="text-lg font-serif text-primary">
                          GHC {order.total}
                        </strong>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTrackOrder(order.id)}
                        className="rounded-full text-xs font-semibold flex items-center gap-1"
                      >
                        Live Stepper
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block uppercase text-[10px] font-bold">
                        Pickup Location
                      </span>
                      <p className="text-foreground font-medium flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {order.location}
                      </p>
                    </div>

                    <div>
                      <span className="text-muted-foreground block uppercase text-[10px] font-bold">
                        Garments Breakdown
                      </span>
                      <p className="text-foreground font-medium mt-0.5 line-clamp-1">
                        {garments || "Garments collection"}
                      </p>
                    </div>

                    <div>
                      <span className="text-muted-foreground block uppercase text-[10px] font-bold">
                        Dispatch Courier
                      </span>
                      <p className="text-foreground font-medium flex items-center gap-1.5 mt-0.5">
                        <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {order.riderName || "Affordable Laundry Dispatch"}
                      </p>
                    </div>
                  </div>

                  {order.stageNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-muted/60 text-xs text-muted-foreground border border-border/40">
                      <span className="font-semibold text-foreground mr-1.5">Note:</span>
                      {order.stageNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
