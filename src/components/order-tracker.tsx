import { useState, useMemo, useEffect, type FormEvent } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Package,
  WashingMachine,
  MapPin,
  Phone,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";
import { Button } from "@/components/ui/button";

export type OrderStatusStage =
  "confirmed" | "picked_up" | "washing" | "pressing" | "out_for_delivery" | "delivered";

export type TrackedOrder = {
  id: string;
  customer: string;
  phone: string;
  location: string;
  date: string;
  items: Record<string, number>;
  total: number;
  stage: OrderStatusStage;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
};

const STAGES: {
  key: OrderStatusStage;
  label: string;
  sublabel: string;
  icon: typeof Package;
}[] = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    sublabel: "Collection scheduled with dispatch",
    icon: CheckCircle2,
  },
  {
    key: "picked_up",
    label: "Picked Up",
    sublabel: "Collected from your doorstep",
    icon: Package,
  },
  {
    key: "washing",
    label: "Washing & Care",
    sublabel: "Eco-detergent wash & gentle stain care",
    icon: WashingMachine,
  },
  {
    key: "pressing",
    label: "Steam Press & Fold",
    sublabel: "Quality inspection and neat packaging",
    icon: Sparkles,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "Rider is heading to your address",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered Fresh",
    sublabel: "Completed & handed over to customer",
    icon: ShieldCheck,
  },
];

const DEFAULT_ORDERS: TrackedOrder[] = [
  {
    id: "AL-84920",
    customer: "Kwame Boateng",
    phone: "053 233 1150",
    location: "Unity Hall (Conti), Room 114, KNUST",
    date: "Today, 10:00 AM",
    items: { tshirt: 4, trousers: 2, shirt: 2 },
    total: 38,
    stage: "washing",
    riderName: "Kofi Mensah",
    riderPhone: "024 314 0855",
    createdAt: "Today at 08:30 AM",
    estimatedDelivery: "Today, 5:30 PM",
    notes: "Deep wash for dress shirts with crisp collar steam press.",
  },
  {
    id: "AL-72314",
    customer: "Akua Mansa",
    phone: "024 498 1234",
    location: "Ayeduase Gate, Near Silicon Hostel",
    date: "Today, 11:30 AM",
    items: { dress: 2, jacket: 1, hoodie: 1 },
    total: 45,
    stage: "out_for_delivery",
    riderName: "Yaw Owusu",
    riderPhone: "053 233 1150",
    createdAt: "Yesterday at 04:00 PM",
    estimatedDelivery: "Within 45 mins",
    notes: "Outerwear protection pack. Hand over at gate reception.",
  },
  {
    id: "AL-93102",
    customer: "Emmanuel Addo",
    phone: "020 876 5432",
    location: "Queens Hall, Block C, KNUST",
    date: "Yesterday",
    items: { suit: 1, shirt: 3, bedsheet: 1 },
    total: 52,
    stage: "delivered",
    riderName: "Kofi Mensah",
    riderPhone: "024 314 0855",
    createdAt: "Oct 1 at 09:00 AM",
    estimatedDelivery: "Delivered yesterday at 04:15 PM",
    notes: "Suits placed on custom wooden hanger with garment bag.",
  },
];

const STORAGE_ORDERS_KEY = "affordable-laundry-tracked-orders";

interface OrderTrackerProps {
  onOpenBooking: () => void;
  selectedOrderId?: string;
}

export function OrderTracker({ onOpenBooking, selectedOrderId }: OrderTrackerProps) {
  const [orders, setOrders] = useState<TrackedOrder[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ORDERS;
    try {
      const stored = window.localStorage.getItem(STORAGE_ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TrackedOrder[];
        return parsed.length > 0 ? parsed : DEFAULT_ORDERS;
      }
    } catch {
      // fallback
    }
    return DEFAULT_ORDERS;
  });

  const [searchQuery, setSearchQuery] = useState(selectedOrderId || "AL-84920");
  const [activeOrderId, setActiveOrderId] = useState<string>(selectedOrderId || "AL-84920");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if selectedOrderId prop changes from booking flow or hero click
  useEffect(() => {
    if (selectedOrderId) {
      setSearchQuery(selectedOrderId);
      setActiveOrderId(selectedOrderId);
      setErrorMessage(null);
    }
  }, [selectedOrderId]);

  // Persist orders on state change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  const activeOrder = useMemo(() => {
    if (!activeOrderId) return null;
    const cleanId = activeOrderId.trim().toUpperCase().replace(/\s+/g, "");
    return (
      orders.find((o) => {
        const oClean = o.id.toUpperCase().replace(/\s+/g, "");
        return (
          oClean === cleanId ||
          oClean.replace(/[^A-Z0-9]/g, "") === cleanId.replace(/[^A-Z0-9]/g, "")
        );
      }) || null
    );
  }, [orders, activeOrderId]);

  const currentStageIndex = useMemo(() => {
    if (!activeOrder) return 0;
    return STAGES.findIndex((s) => s.key === activeOrder.stage);
  }, [activeOrder]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setErrorMessage("Please enter an Order ID.");
      return;
    }

    const cleanQuery = query.toUpperCase().replace(/\s+/g, "");
    const found = orders.find((o) => {
      const oClean = o.id.toUpperCase().replace(/\s+/g, "");
      return (
        oClean === cleanQuery ||
        oClean.replace(/[^A-Z0-9]/g, "") === cleanQuery.replace(/[^A-Z0-9]/g, "")
      );
    });

    if (found) {
      setActiveOrderId(found.id);
      setErrorMessage(null);
    } else {
      setErrorMessage(
        `Order "${query}" was not found. Please verify the ID or choose one of the sample orders below.`,
      );
    }
  };

  const advanceStage = () => {
    if (!activeOrder) return;
    const stageKeys: OrderStatusStage[] = [
      "confirmed",
      "picked_up",
      "washing",
      "pressing",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = stageKeys.indexOf(activeOrder.stage);
    const nextIndex = (currentIndex + 1) % stageKeys.length;
    const nextStage = stageKeys[nextIndex]!;

    setOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, stage: nextStage } : o)),
    );
  };

  const formatItemCount = (items?: Record<string, number>) => {
    if (!items) return "No items listed";
    return Object.entries(items)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => `${count}x ${name}`)
      .join(", ");
  };

  return (
    <section id="tracker" className="section-pad tracker-section">
      <div className="section-heading mb-10">
        <div>
          <p className="section-kicker">Real-time status</p>
          <h2>
            Track your <em>laundry</em> in real-time.
          </h2>
        </div>
        <p>
          Check the exact treatment stage of your garments from door pickup to steam press and
          scheduled return.
        </p>
      </div>

      <div className="tracker-card">
        {/* Search header */}
        <div className="tracker-search-bar">
          <form onSubmit={handleSearch} className="tracker-form">
            <div className="tracker-input-wrap">
              <Search className="tracker-search-icon" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. AL-84920)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="tracker-input"
              />
            </div>
            <Button type="submit" className="tracker-submit-btn">
              Track Order
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick select pills */}
          <div className="quick-orders-row">
            <span className="quick-label">Try sample order:</span>
            <div className="quick-chips">
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(o.id);
                    setActiveOrderId(o.id);
                    setErrorMessage(null);
                  }}
                  className={`quick-chip ${activeOrder?.id === o.id ? "quick-chip-active" : ""}`}
                >
                  <span className="font-semibold">{o.id}</span>
                  <span className="opacity-75 capitalize text-xs">
                    ({o.stage.replace(/_/g, " ")})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="tracker-error-alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Order not found</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {activeOrder && (
          <div className="tracker-content">
            {/* Order Summary Strip */}
            <div className="order-summary-box">
              <div className="summary-left">
                <div className="flex items-center gap-3">
                  <img
                    src={brandIcon}
                    alt="Affordable Laundry"
                    className="w-12 h-12 rounded-full border border-primary/20 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-primary">
                        Order #{activeOrder.id}
                      </span>
                      <span className="stage-pill capitalize">
                        {activeOrder.stage.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="text-xl font-normal text-foreground font-display mt-0.5">
                      {activeOrder.customer}
                    </h3>
                  </div>
                </div>

                <div className="summary-meta-grid">
                  <div className="meta-item">
                    <MapPin className="meta-icon" />
                    <div>
                      <small>Pickup & Return Location</small>
                      <strong>{activeOrder.location}</strong>
                    </div>
                  </div>
                  <div className="meta-item">
                    <Clock className="meta-icon" />
                    <div>
                      <small>Estimated Handover</small>
                      <strong>{activeOrder.estimatedDelivery}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-right">
                <div className="price-tag">
                  <small>Collection Total</small>
                  <strong>GHC {activeOrder.total}</strong>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Items:{" "}
                  <span className="text-foreground font-medium">
                    {formatItemCount(activeOrder.items)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={advanceStage}
                  className="mt-3 text-xs flex items-center gap-1.5"
                  title="Cycle to next stage for demonstration"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Simulate Next Stage
                </Button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="tracker-timeline-wrap">
              <div className="timeline-progress-track">
                <div
                  className="timeline-progress-fill"
                  style={{
                    width: `${Math.max(8, (currentStageIndex / (STAGES.length - 1)) * 100)}%`,
                  }}
                />
              </div>

              <div className="timeline-stages">
                {STAGES.map((stage, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const Icon = stage.icon;

                  let stepClass = "timeline-stage-pending";
                  if (isDone) stepClass = "timeline-stage-done";
                  if (isCurrent) stepClass = "timeline-stage-active";

                  return (
                    <div key={stage.key} className={`timeline-stage-node ${stepClass}`}>
                      <div className="stage-icon-circle">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="stage-node-content">
                        <strong>{stage.label}</strong>
                        <p>{stage.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rider & Support Action Cards */}
            <div className="tracker-footer-grid">
              <div className="rider-card">
                <div className="flex items-center gap-3">
                  <div className="rider-avatar">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <small className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                      KNUST Campus Dispatch Rider
                    </small>
                    <h4 className="font-semibold text-foreground text-sm">
                      {activeOrder.riderName || "Affordable Laundry Express Courier"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Contact: {activeOrder.riderPhone || "053 233 1150"}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${(activeOrder.riderPhone || "0532331150").replace(/\s+/g, "")}`}
                  className="contact-pill-btn"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Rider
                </a>
              </div>

              <div className="dispatch-help-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      Need quick alterations or urgent return?
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Our customer desk at Gyinyase opposite KNUST Business School is online.
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onOpenBooking}
                    className="rounded-full text-xs"
                  >
                    New Booking
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
