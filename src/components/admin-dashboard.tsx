import { useState, useEffect, type FormEvent } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import {
  Shield,
  Search,
  CheckCircle2,
  Package,
  WashingMachine,
  Truck,
  Clock,
  Phone,
  User as UserIcon,
  MapPin,
  RefreshCw,
  X,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowRight,
  Filter,
  Plus,
  ArrowLeft,
  LogOut,
  Navigation,
  Calendar,
  DollarSign,
  Send,
  Check,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";
import { toast } from "sonner";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import { NotificationCenter } from "@/components/notification-center";
import {
  broadcastOrderEvent,
  getStatusFriendlyText,
  getStatusCustomerMessage,
  playNotificationChime,
  triggerDeviceNotification,
  setupAdminOrderNotifications,
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

const STATUS_OPTIONS: {
  value: OrderRecord["status"];
  label: string;
  badge: string;
}[] = [
  {
    value: "COLLECTION_SCHEDULED",
    label: "Pickup Booked",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  {
    value: "ITEMS_RECEIVED",
    label: "Clothes Received",
    badge: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  },
  {
    value: "WASHING",
    label: "Washing Clothes",
    badge: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  },
  {
    value: "READY_FOR_PICKUP",
    label: "Ironed & Packed",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
  {
    value: "DELIVERY_ON_THE_WAY",
    label: "Rider on the Way",
    badge: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  },
  {
    value: "COMPLETED",
    label: "Delivered to Customer",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
  },
];

const NEXT_STAGE_MAP: Record<
  OrderRecord["status"],
  { next: OrderRecord["status"]; label: string; btnClass: string } | null
> = {
  COLLECTION_SCHEDULED: {
    next: "ITEMS_RECEIVED",
    label: "Clothes Received",
    btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
  ITEMS_RECEIVED: {
    next: "WASHING",
    label: "Washing Clothes",
    btnClass: "bg-cyan-600 hover:bg-cyan-700 text-white",
  },
  WASHING: {
    next: "READY_FOR_PICKUP",
    label: "Ready for Delivery",
    btnClass: "bg-sky-600 hover:bg-sky-700 text-white",
  },
  READY_FOR_PICKUP: {
    next: "DELIVERY_ON_THE_WAY",
    label: "Courier Out for Delivery",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  DELIVERY_ON_THE_WAY: {
    next: "COMPLETED",
    label: "Mark Delivered",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  COMPLETED: null,
  CANCELLED: null,
};

interface AdminDashboardProps {
  onBackToLanding: () => void;
}

export function AdminDashboard({ onBackToLanding }: AdminDashboardProps) {
  const { user, isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderRecord["status"]>("WASHING");
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [stageNotes, setStageNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // New Walk-in / Phone Order Modal state
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newLocation, setNewLocation] = useState("KNUST campus");
  const [newItems, setNewItems] = useState<Record<string, number>>({ tshirt: 2, shirt: 1 });
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);

    // Initial load from unified local cache
    try {
      const cachedRaw = localStorage.getItem("al_orders_cache");
      if (cachedRaw) {
        const list = JSON.parse(cachedRaw) as OrderRecord[];
        if (list.length > 0) {
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
          setLoading(false);
        }
      }
    } catch {
      // ignore
    }

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMap = new Map<string, OrderRecord>();
        snapshot.forEach((d) => {
          fetchedMap.set(d.id, {
            ...(d.data() as Omit<OrderRecord, "docId">),
            docId: d.id,
          });
        });

        // Also merge any local cache orders that aren't synced yet
        try {
          const cachedRaw = localStorage.getItem("al_orders_cache");
          if (cachedRaw) {
            const list = JSON.parse(cachedRaw) as OrderRecord[];
            list.forEach((ord) => {
              if (!fetchedMap.has(ord.id)) {
                fetchedMap.set(ord.id, ord);
              }
            });
          }
        } catch {
          // ignore
        }

        const mergedList = Array.from(fetchedMap.values());
        mergedList.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(mergedList);
        setLoading(false);

        // Keep local cache synced
        try {
          localStorage.setItem("al_orders_cache", JSON.stringify(mergedList));
        } catch {
          // ignore
        }
      },
      (err) => {
        console.error("Admin order stream error:", err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Real-time listener: Pop up notification every time a customer books
  useEffect(() => {
    if (!isAdmin) return;

    const unsubAdminNotif = setupAdminOrderNotifications((booking) => {
      toast.info(
        `🔔 New Customer Booking! Order #${booking.orderId} - ${booking.customerName} booked ${booking.itemCount} item(s) at ${booking.location}.`,
        {
          duration: 10000,
          action: {
            label: "Filter Order",
            onClick: () => setSearch(booking.orderId),
          },
        },
      );
    });

    return () => unsubAdminNotif();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 bg-card border border-border rounded-3xl shadow-xl space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Restricted Executive Area</h2>
          <p className="text-xs text-muted-foreground">
            This command dashboard requires authorized admin credentials
            (affordablelaundry424@gmail.com).
          </p>
          <Button onClick={onBackToLanding} className="rounded-xl w-full">
            Return to Website
          </Button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (docId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.docId)));
    }
  };

  const handleSingleStatusChange = async (docId: string, newStatus: OrderRecord["status"]) => {
    try {
      const orderRef = doc(db, "orders", docId);
      const targetOrder = orders.find((o) => o.docId === docId || o.id === docId);
      const orderDisplayId = targetOrder?.id || docId;
      const stageMsg = getStatusCustomerMessage(newStatus, orderDisplayId);

      await updateDoc(orderRef, {
        status: newStatus,
        stageNotes: stageMsg.body,
        updatedAt: new Date().toISOString(),
      });

      // Broadcast immediately so customer device / browser gets pop-up notification
      broadcastOrderEvent({
        type: "STATUS_UPDATE",
        orderId: orderDisplayId,
        status: newStatus,
        userId: targetOrder?.userId,
        customerEmail: targetOrder?.customerEmail,
        customerName: targetOrder?.customerName,
        stageNotes: stageMsg.body,
      });

      // Update local cache
      try {
        const raw = localStorage.getItem("al_orders_cache");
        if (raw) {
          const list = JSON.parse(raw) as OrderRecord[];
          const updated = list.map((item) =>
            item.id === orderDisplayId
              ? {
                  ...item,
                  status: newStatus,
                  stageNotes: stageMsg.body,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          );
          localStorage.setItem("al_orders_cache", JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      toast.success(
        `Order #${orderDisplayId} updated: ${getStatusFriendlyText(newStatus)}! Customer notified.`,
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${docId}`, user);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one order to update.");
      return;
    }

    setUpdating(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((docId) => {
        const orderRef = doc(db, "orders", docId);
        const targetOrder = orders.find((o) => o.docId === docId || o.id === docId);
        const orderDisplayId = targetOrder?.id || docId;
        const stageMsg = getStatusCustomerMessage(bulkStatus, orderDisplayId);

        batch.update(orderRef, {
          status: bulkStatus,
          stageNotes: stageMsg.body,
          updatedAt: new Date().toISOString(),
        });

        broadcastOrderEvent({
          type: "STATUS_UPDATE",
          orderId: orderDisplayId,
          status: bulkStatus,
          userId: targetOrder?.userId,
          customerEmail: targetOrder?.customerEmail,
          customerName: targetOrder?.customerName,
          stageNotes: stageMsg.body,
        });
      });

      await batch.commit();
      toast.success(
        `Updated ${selectedIds.size} orders to ${getStatusFriendlyText(bulkStatus)}! Customers notified.`,
      );
      setSelectedIds(new Set());
    } catch (err) {
      toast.error("Failed to update bulk orders.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenEdit = (order: OrderRecord) => {
    setEditingOrder(order);
    setRiderName(order.riderName || "Affordable Laundry Dispatch");
    setRiderPhone(order.riderPhone || "053 233 1150");
    setStageNotes(order.stageNotes || "");
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const orderRef = doc(db, "orders", editingOrder.docId);
      await updateDoc(orderRef, {
        riderName,
        riderPhone,
        stageNotes,
        updatedAt: new Date().toISOString(),
      });

      // Update local cache
      try {
        const raw = localStorage.getItem("al_orders_cache");
        if (raw) {
          const list = JSON.parse(raw) as OrderRecord[];
          const updated = list.map((item) =>
            item.id === editingOrder.id ? { ...item, riderName, riderPhone, stageNotes } : item,
          );
          localStorage.setItem("al_orders_cache", JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      toast.success("Order dispatch details saved successfully.");
      setEditingOrder(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${editingOrder.docId}`, user);
    }
  };

  const handleCreateWalkinOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      toast.error("Please provide customer name and phone.");
      return;
    }

    setCreatingOrder(true);
    const newId = `AL${Date.now().toString().slice(-5)}`;
    const totalCount = Object.values(newItems).reduce((sum, c) => sum + c, 0);
    const PRICING: Record<string, number> = {
      tshirt: 4,
      shirt: 6,
      trousers: 8,
      suit: 25,
      dress: 15,
      traditional: 20,
      bedding: 18,
    };
    const calcTotal = Object.entries(newItems).reduce(
      (sum, [key, count]) => sum + (PRICING[key] || 5) * count,
      0,
    );

    const cleanCustEmail = (
      newCustomerEmail.trim() || "walkin@affordablelaundry.com"
    ).toLowerCase();
    const walkinOrder: OrderRecord = {
      id: newId,
      docId: newId,
      userId: user?.uid || "admin-walkin",
      customerName: newCustomerName.trim(),
      customerEmail: cleanCustEmail,
      customerPhone: newCustomerPhone.trim(),
      location: newLocation,
      pickupDate: new Date().toISOString().split("T")[0],
      items: newItems,
      itemCount: totalCount,
      total: calcTotal,
      status: "ITEMS_RECEIVED",
      stageNotes: "Received at Kumasi Atelier intake desk.",
      riderName: "Affordable Laundry Dispatch Rider",
      riderPhone: "053 233 1150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const orderRef = doc(db, "orders", newId);
      await setDoc(orderRef, walkinOrder);

      // Save to local cache
      try {
        const raw = localStorage.getItem("al_orders_cache");
        const list: OrderRecord[] = raw ? JSON.parse(raw) : [];
        list.unshift(walkinOrder);
        localStorage.setItem("al_orders_cache", JSON.stringify(list));
      } catch {
        // ignore
      }

      toast.success(`New order #${newId} created directly!`);
      setCreateOrderModalOpen(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerEmail("");
    } catch (err) {
      toast.error("Failed to create order.");
      console.error(err);
    } finally {
      setCreatingOrder(false);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "COLLECTION_SCHEDULED").length;
  const washingCount = orders.filter(
    (o) => o.status === "WASHING" || o.status === "ITEMS_RECEIVED",
  ).length;
  const readyOrTransitCount = orders.filter(
    (o) => o.status === "READY_FOR_PICKUP" || o.status === "DELIVERY_ON_THE_WAY",
  ).length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Executive Command Header - Ultra-Transparent Glass */}
      <header className="sticky top-0 z-40 bg-white/60 dark:bg-black/60 backdrop-blur-3xl border-b border-white/30 dark:border-white/10 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={brandIcon}
                alt="Affordable Laundry"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover border border-sky-400/40 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-500 border-2 border-background" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base tracking-tight text-foreground truncate max-w-[120px] xs:max-w-none">
                  Admin HQ
                </span>
                <span className="px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 shrink-0">
                  Command
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
                Master dispatch, live Firestore orders & operations
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              onClick={() => setCreateOrderModalOpen(true)}
              size="sm"
              className="rounded-xl sm:rounded-2xl text-xs font-bold shadow-md bg-sky-500 hover:bg-sky-400 text-white gap-1 h-8 sm:h-10 px-2 sm:px-4 shadow-sky-500/25 transition-transform hover:scale-105 active:scale-95"
              title="New intake order"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Intake Order</span>
              <span className="sm:hidden text-[10px] xs:text-[11px]">Intake</span>
            </Button>

            <NotificationCenter />

            <Button
              variant="outline"
              size="sm"
              onClick={onBackToLanding}
              className="rounded-xl sm:rounded-2xl text-xs font-semibold h-8 sm:h-10 px-2 sm:px-3 bg-white/20 hover:bg-white/35 backdrop-blur-xl border border-white/25 text-foreground"
              title="Return to website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline ml-1">Website</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="rounded-xl sm:rounded-2xl text-xs font-medium text-destructive hover:bg-destructive/10 h-8 sm:h-10 px-2 sm:px-3"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Executive Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-8 space-y-3.5 sm:space-y-8">
        {/* Executive Stats Bar - Ultra-Transparent Floating Glass Cards */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
          <div className="p-2.5 sm:p-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
              Total Bookings
            </span>
            <p className="text-lg sm:text-3xl font-black text-foreground mt-0.5 sm:mt-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {orders.length}
            </p>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground block truncate">
              All Kumasi orders
            </span>
          </div>

          <div className="p-2.5 sm:p-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[9px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block truncate">
              Pending Pickup
            </span>
            <p className="text-lg sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1">
              {pendingCount}
            </p>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground block truncate">
              Awaiting courier
            </span>
          </div>

          <div className="p-2.5 sm:p-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[9px] sm:text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block truncate">
              In Wash & Care
            </span>
            <p className="text-lg sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5 sm:mt-1">
              {washingCount}
            </p>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground block truncate">
              Treatment stations
            </span>
          </div>

          <div className="p-2.5 sm:p-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[9px] sm:text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block truncate">
              Ready / Out
            </span>
            <p className="text-lg sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
              {readyOrTransitCount}
            </p>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground block truncate">
              On courier route
            </span>
          </div>

          <div className="p-2.5 sm:p-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden col-span-2 md:col-span-1">
            <span className="text-[9px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block truncate">
              Total Revenue
            </span>
            <p className="text-lg sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1">
              GHC {totalRevenue}
            </p>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground block truncate">
              {completedCount} delivered
            </span>
          </div>
        </section>

        {/* Search, Filter & Bulk Dispatch Controls - Translucent Glass Box */}
        <section className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl space-y-2.5 sm:space-y-4">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground absolute left-3 top-3 sm:top-3.5" />
              <input
                type="text"
                placeholder="Search orders by customer, phone, #, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9.5 sm:h-11 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl sm:rounded-2xl border border-white/30 bg-white/35 dark:bg-white/5 backdrop-blur-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
              />
            </div>

            {/* Filter by Status Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto h-9.5 sm:h-11 px-3 rounded-xl sm:rounded-2xl border border-white/30 bg-white/35 dark:bg-white/10 backdrop-blur-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden truncate"
              >
                <option value="ALL">All Statuses ({orders.length})</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({orders.filter((o) => o.status === opt.value).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Update Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
              >
                {selectedIds.size === filteredOrders.length && filteredOrders.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-sky-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Select All ({selectedIds.size} selected)</span>
              </button>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Bulk set stage:</span>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as OrderRecord["status"])}
                  className="h-9 px-3 rounded-xl border border-white/30 bg-white/30 dark:bg-white/10 backdrop-blur-xl text-xs font-bold"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleBulkStatusUpdate}
                  disabled={updating}
                  size="sm"
                  className="rounded-xl text-xs font-bold h-9 shadow-xs bg-sky-500 hover:bg-sky-400 text-white"
                >
                  {updating ? "Updating..." : `Apply to ${selectedIds.size} Orders`}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Orders Table & Cards */}
        {loading ? (
          <div className="p-16 text-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 rounded-3xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-500" />
            <p className="text-sm font-semibold text-foreground">Loading master orders feed...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-dashed border-white/40 rounded-3xl space-y-3">
            <Package className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-foreground">No orders match your filter</h3>
            <p className="text-xs text-muted-foreground">
              Try clearing your search query or filter
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusCfg =
                STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];

              return (
                <div
                  key={order.docId}
                  className={`p-3.5 sm:p-6 bg-white/45 dark:bg-white/5 backdrop-blur-3xl border rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    selectedIds.has(order.docId)
                      ? "border-sky-500/70 bg-sky-500/10"
                      : "border-white/40 dark:border-white/10 hover:border-sky-400/50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                    {/* Checkbox & Order Info */}
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleSelect(order.docId)}
                        className="mt-1 text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {selectedIds.has(order.docId) ? (
                          <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                        ) : (
                          <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                            #{order.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${statusCfg.badge}`}
                          >
                            {statusCfg.label}
                          </span>
                          <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                            GHC {order.total} ({order.itemCount} items)
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-bold text-foreground">{order.customerName}</span>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {order.customerPhone}
                          </a>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {order.location}
                          </span>
                          <span>Pickup: {order.pickupDate}</span>
                        </div>

                        {order.stageNotes && (
                          <p className="text-[11px] text-muted-foreground bg-white/30 dark:bg-white/5 backdrop-blur-md px-2.5 py-1 rounded-lg w-fit mt-1 border border-white/20">
                            Notes: {order.stageNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stage Switcher Dropdown, One-Click Advance Button & Notes */}
                    <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 lg:flex items-stretch sm:items-center gap-2 pt-2.5 border-t border-white/15 lg:border-0 lg:pt-0">
                      {NEXT_STAGE_MAP[order.status] && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSingleStatusChange(
                              order.docId,
                              NEXT_STAGE_MAP[order.status]!.next,
                            )
                          }
                          className={`w-full rounded-xl sm:rounded-2xl text-xs font-black h-10 px-3.5 shadow-xs gap-1.5 justify-center transition-transform hover:scale-105 active:scale-95 ${NEXT_STAGE_MAP[order.status]!.btnClass}`}
                          title={`Advance to ${NEXT_STAGE_MAP[order.status]!.label} and notify customer`}
                        >
                          <span className="truncate">{NEXT_STAGE_MAP[order.status]!.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Button>
                      )}

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleSingleStatusChange(
                            order.docId,
                            e.target.value as OrderRecord["status"],
                          )
                        }
                        className="w-full lg:w-auto h-10 px-3 rounded-xl sm:rounded-2xl border border-white/30 bg-white/40 dark:bg-white/10 backdrop-blur-xl text-xs font-bold text-foreground focus:ring-2 focus:ring-sky-500/20 truncate"
                        title="Set exact order stage"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(order)}
                        className="w-full lg:w-auto rounded-xl sm:rounded-2xl text-xs font-bold h-10 px-3.5 bg-white/20 hover:bg-white/35 backdrop-blur-xl border border-white/30 justify-center"
                      >
                        Dispatch / Notes
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Dispatch / Courier Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditingOrder(null);
          }}
        >
          <div className="relative w-full max-w-md bg-white/95 dark:bg-black/90 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-4.5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Dispatch Order #{editingOrder.id}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Assigned Rider Name
                </label>
                <input
                  type="text"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Rider Contact Phone
                </label>
                <input
                  type="text"
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Stage Notes / Garment Inspection Details
                </label>
                <textarea
                  rows={3}
                  value={stageNotes}
                  onChange={(e) => setStageNotes(e.target.value)}
                  placeholder="e.g. 2 shirts steam-pressed, delicate stain treated, dispatched on courier motorbike..."
                  className="w-full p-3 rounded-xl border border-input bg-background text-foreground"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" className="w-full rounded-xl text-xs font-bold h-11">
                  Save Dispatch Notes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingOrder(null)}
                  className="rounded-xl text-xs h-11"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Walk-in / Phone Order Intake Modal */}
      {createOrderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateOrderModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-black/90 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-4.5 sm:p-8 max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Atelier Intake
                </span>
                <h3 className="text-xl font-bold text-foreground">New Direct Customer Order</h3>
              </div>
              <button
                onClick={() => setCreateOrderModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkinOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prince K."
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="053 233 1150"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Customer Email (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="customer@knust.edu.gh"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Location / Hall
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unity Hall, KNUST"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                  />
                </div>
              </div>

              {/* Garment Quick Counter */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-foreground block">Garment Count</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: "tshirt", label: "T-Shirt (GHC 4)" },
                    { key: "shirt", label: "Formal Shirt (GHC 6)" },
                    { key: "trousers", label: "Trousers (GHC 8)" },
                    { key: "suit", label: "Suit (GHC 25)" },
                    { key: "dress", label: "Dress (GHC 15)" },
                    { key: "traditional", label: "Native (GHC 20)" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between"
                    >
                      <span className="text-[11px] font-medium text-foreground">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setNewItems((prev) => ({
                              ...prev,
                              [item.key]: Math.max(0, (prev[item.key] || 0) - 1),
                            }))
                          }
                          className="w-6 h-6 rounded-md bg-card border border-border text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold">{newItems[item.key] || 0}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewItems((prev) => ({
                              ...prev,
                              [item.key]: (prev[item.key] || 0) + 1,
                            }))
                          }
                          className="w-6 h-6 rounded-md bg-card border border-border text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={creatingOrder}
                className="w-full h-11 rounded-xl text-xs font-bold mt-2"
              >
                {creatingOrder ? "Registering Order..." : "Create Direct Intake Order"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
