import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Shirt,
  Truck,
  WashingMachine,
  X,
  LogIn,
  Shield,
  User as UserIcon,
  LayoutDashboard,
  Navigation,
  Compass,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { CustomerPortal } from "@/components/customer-portal";
import { AdminDashboard } from "@/components/admin-dashboard";
import { MapDirection } from "@/components/map-direction";
import { NotificationOnboardingModal } from "@/components/notification-onboarding-modal";
import { PlacesAutocomplete } from "@/components/places-autocomplete";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  setupDeviceOrderNotifications,
  setupAdminOrderNotifications,
  setupCustomerOrderNotifications,
  addTrackedOrderId,
  triggerDeviceNotification,
  broadcastOrderEvent,
  playNotificationChime,
  getStatusFriendlyText,
  requestDeviceNotificationPermission,
  getDeviceNotificationPermission,
  notifyOrderApi,
  shouldShowNotificationPrompt,
} from "@/lib/order-notifications";

import heroAtelierImage from "@/assets/images/ghanaian_hero_1790975886532.jpg";
import courierImage from "@/assets/images/courier_dispatch_1790871292507.jpg";
import brandLogo from "@/assets/affordable-laundry-logo.jpg";
import brandIcon from "@/assets/affordable-laundry-icon.jpg";
import { Button } from "@/components/ui/button";

type LaundryItem = {
  id: string;
  name: string;
  note: string;
  price: number;
};

type Booking = {
  id: string;
  customer: string;
  phone: string;
  location: string;
  date: string;
  items: Record<string, number>;
  total: number;
  status: string;
};

// Easy, straightforward item pricing without technical jargon
const laundryItems: LaundryItem[] = [
  { id: "tshirt", name: "T-shirt", note: "Washed, ironed & folded", price: 4 },
  { id: "shirt", name: "Dress shirt", note: "Ironed smooth on a hanger", price: 5 },
  { id: "trousers", name: "Trousers & Jeans", note: "Cleaned and neatly ironed", price: 6 },
  { id: "dress", name: "Dress", note: "Gentle fabric care", price: 10 },
  { id: "hoodie", name: "Hoodie & Sweater", note: "Deep washed and fresh", price: 10 },
  { id: "bedsheet", name: "Bedsheet & Cover", note: "Freshly washed and folded", price: 12 },
  { id: "jacket", name: "Jacket & Coat", note: "Careful outer wear cleaning", price: 15 },
  { id: "suit", name: "Two-piece Suit", note: "Special gentle pressing", price: 25 },
];

const services = [
  {
    number: "01",
    title: "Wash & Fold",
    copy: "Your everyday clothes returned clean, soft, fresh, and neatly folded.",
    icon: WashingMachine,
  },
  {
    number: "02",
    title: "Iron & Pack",
    copy: "Clean steam ironing so your shirts, trousers, and dresses look sharp.",
    icon: Shirt,
  },
  {
    number: "03",
    title: "Free Doorstep Pickup",
    copy: "We pick up and bring back to your hostel, hall, or room for free.",
    icon: Truck,
  },
];

// Straightforward answers to everyday laundry questions around KNUST & Kumasi
const faqs = [
  {
    q: "How do I prepare my clothes before the rider arrives?",
    a: "Just put your dirty clothes in any bag or rubber bag (poly bag). You don’t need to count them first; our rider will count them together with you at your door, or we count them at our shop and text you a confirmation right away.",
  },
  {
    q: "What items and clothes do you wash?",
    a: "We wash all everyday clothes: T-shirts, shirts, trousers, jeans, dresses, hoodies, shorts, boxers, and school uniforms or lab coats. We also wash bedsheets, duvet covers, pillowcases, and towels. If you have delicate native wear or funeral fabrics, tell the rider and we take special gentle care.",
  },
  {
    q: "How and when do I pay for my laundry?",
    a: "You only pay AFTER your clothes are washed, dried, ironed, and delivered back to you. You can pay via Mobile Money (MTN MoMo, Telecel Cash) or give cash directly to the rider.",
  },
  {
    q: "Do you charge by weight (kilo) or per cloth?",
    a: "We charge simple prices for each single cloth (from GHC 4 per piece). There are no heavy weighing scales, wet weight tricks, or guessing. You know exactly what you are paying before we start.",
  },
  {
    q: "Will the rider come directly to my hostel or hall gate?",
    a: "Yes! Whether you are staying in Unity Hall (Conti), Katanga, Republic, Queen's, Independence, Africa Hall, or in hostels around Ayeduase, Kotei, Bomso, or Gyinyase, our dispatch rider calls your phone directly when outside your gate.",
  },
  {
    q: "How fast will my clothes be ready?",
    a: "Normally within 1 to 2 days! We wash them clean with sweet-smelling soap, dry them, steam iron them smooth, and pack them neatly in protective bags so you can put them straight into your wardrobe.",
  },
  {
    q: "What happens if it rains or there is lights out (dumsor)?",
    a: "We have backup solar power, plant generators, and industrial dryers. Rain or dumsor will never delay your clean clothes!",
  },
];

const savedBookingKey = "affordable-laundry-latest-booking";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LaundryApp() {
  const { user, profile, isAdmin, logout } = useAuth();
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showNotificationOnboarding, setShowNotificationOnboarding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({ tshirt: 2, shirt: 1 });
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [typedLocation, setTypedLocation] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("top");
  const [pendingOpenBookingAfterAuth, setPendingOpenBookingAfterAuth] = useState(false);

  // Check whether to show the notification onboarding prompt on new device sign-in / sign-up
  useEffect(() => {
    if (user?.uid) {
      if (shouldShowNotificationPrompt(user.uid)) {
        setShowNotificationOnboarding(true);
      } else {
        setShowNotificationOnboarding(false);
      }
    } else {
      setShowNotificationOnboarding(false);
    }
  }, [user]);

  // Track window scroll for transparent title bar on hero section & active nav item
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["services", "pricing", "location", "process", "faq", "contact"];
      const scrollPos = window.scrollY + 220;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time live notification watchers:
  // 1. Admin gets pop up notification whenever any customer books an order
  // 2. Customer gets pop up notification whenever admin updates their order process
  useEffect(() => {
    // When inside the dashboard, AdminDashboard or CustomerPortal handles view-specific toast actions
    if (currentView === "dashboard") return;

    if (isAdmin) {
      const unsubAdmin = setupAdminOrderNotifications((booking) => {
        toast.info(
          `🔔 New Customer Booking! Order #${booking.orderId} from ${booking.customerName} - ${booking.itemCount} items at ${booking.location}.`,
          {
            duration: 10000,
            action: {
              label: "Open Dashboard",
              onClick: () => handleNavigateToDashboard(),
            },
          },
        );
      });
      return () => unsubAdmin();
    } else {
      const unsubCustomer = setupCustomerOrderNotifications(
        { userId: user?.uid, email: user?.email || profile?.email || "" },
        (orderId, newStatus, title, body) => {
          toast.info(`👕 ${title}`, {
            description: body,
            duration: 9000,
            action: {
              label: "View Status",
              onClick: () => handleNavigateToDashboard(),
            },
          });
        },
      );
      return () => unsubCustomer();
    }
  }, [isAdmin, user?.uid, user?.email, profile?.email, currentView]);

  // Check if notification permission prompt is needed on new device
  const handleNavigateToDashboard = () => {
    if (user) {
      const alreadyOnboarded = localStorage.getItem(`al_notif_onboarded_${user.uid}`);
      if (!alreadyOnboarded) {
        setShowNotificationOnboarding(true);
      }
    }
    setCurrentView("dashboard");
  };

  // Sync hash #dashboard on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleHash = () => {
        if (window.location.hash === "#dashboard") {
          if (user) {
            handleNavigateToDashboard();
          } else {
            setAuthModalOpen(true);
          }
        }
      };

      handleHash();
      window.addEventListener("hashchange", handleHash);
      return () => window.removeEventListener("hashchange", handleHash);
    }
  }, [user]);

  const navItems = useMemo(() => {
    return [
      { label: "Services", id: "services" },
      { label: "Prices", id: "pricing" },
      { label: "Map & Shop", id: "location" },
      { label: "How It Works", id: "process" },
      { label: "FAQ", id: "faq" },
      { label: "Call Us", id: "contact" },
    ];
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(savedBookingKey);
    if (!raw) return;
    try {
      const booking = JSON.parse(raw) as Booking;
      if (booking.id && booking.items) {
        setLatestBooking(booking);
      }
    } catch {
      window.localStorage.removeItem(savedBookingKey);
    }
  }, []);

  const total = useMemo(
    () => laundryItems.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0),
    [quantities],
  );
  const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  const changeQuantity = (id: string, delta: number) => {
    setQuantities((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      return { ...current, [id]: next };
    });
  };

  const openBooking = () => {
    setBookingComplete(false);
    setBookingOpen(true);
  };

  const handleBookingTrigger = () => {
    if (!user) {
      toast.info("Please sign up or sign in to confirm your pickup and track your clothes!", {
        duration: 4500,
      });
      setPendingOpenBookingAfterAuth(true);
      setAuthModalOpen(true);
      return;
    }
    openBooking();
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (itemCount === 0) {
      toast.error("Please pick at least one cloth before booking.");
      return;
    }

    if (!user) {
      toast.info("Please create an account or sign in to complete your pickup!", {
        duration: 4500,
      });
      setPendingOpenBookingAfterAuth(true);
      setAuthModalOpen(true);
      return;
    }

    const form = new FormData(event.currentTarget);
    const newBookingId = `AL${Date.now().toString().slice(-5)}`;
    const customer = String(form.get("name") || profile?.displayName || "Valued Customer");
    const phone = String(form.get("phone") || profile?.phone || "");
    const location = (typedLocation || String(form.get("location") || "")).trim() || "KNUST Campus";
    const date = String(form.get("date") || "Tomorrow");

    const booking: Booking = {
      id: newBookingId,
      customer,
      phone,
      location,
      date,
      items: quantities,
      total,
      status: "COLLECTION_SCHEDULED",
    };

    const cleanEmail = (user?.email || profile?.email || "").trim().toLowerCase();
    const orderRecord = {
      id: newBookingId,
      docId: newBookingId,
      userId: user?.uid || "guest",
      customerName: customer,
      customerEmail: cleanEmail,
      customerPhone: phone,
      location,
      pickupDate: date,
      items: quantities,
      itemCount,
      total,
      status: "COLLECTION_SCHEDULED" as const,
      stageNotes: "Pickup request confirmed. Rider assigned.",
      riderName: "Affordable Laundry Dispatch Rider",
      riderPhone: "053 233 1150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    try {
      const orderRef = doc(db, "orders", newBookingId);
      await setDoc(orderRef, orderRecord);
    } catch (e) {
      console.error("Error saving booking to Firestore:", e);
    }

    // Broadcast new booking immediately so admin dashboard gets instant pop-up notification
    broadcastOrderEvent({
      type: "NEW_ORDER",
      orderId: newBookingId,
      customerName: customer,
      customerEmail: cleanEmail,
      userId: user?.uid || "",
      itemCount,
      total,
      location,
      status: "COLLECTION_SCHEDULED",
    });

    // Send push notification to admins so they receive background alert even when phone is closed
    notifyOrderApi("NEW_ORDER", [newBookingId]).catch((err) => {
      console.debug("notifyOrderApi error:", err);
    });

    // Persist into unified order cache (ensures manual & Google accounts share exact same data)
    try {
      const rawCache = window.localStorage.getItem("al_orders_cache");
      const cacheList = rawCache ? JSON.parse(rawCache) : [];
      // Remove any duplicate id if it existed
      const filtered = cacheList.filter((item: { id: string }) => item.id !== newBookingId);
      filtered.unshift(orderRecord);
      window.localStorage.setItem("al_orders_cache", JSON.stringify(filtered));
    } catch {
      // ignore
    }

    // Register this order on this device for live background push notifications
    addTrackedOrderId(newBookingId);

    // Prompt native notification permission so alerts pop up whether inside or outside the app
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        await requestDeviceNotificationPermission();
      } catch {
        // ignore
      }
    }

    triggerDeviceNotification(
      `Affordable Laundry: Pickup Booked!`,
      `Order #${newBookingId} is set for ${date}. We'll notify your phone when the rider is coming.`,
      newBookingId,
      "COLLECTION_SCHEDULED",
    );

    window.localStorage.setItem(savedBookingKey, JSON.stringify(booking));
    setLatestBooking(booking);
    setBookingComplete(true);
    toast.success("Your pickup has been booked!");
  };

  // The admin gmail MUST have only ONE dashboard as admin, not 2 separate dashboards
  if (currentView === "dashboard") {
    if (isAdmin) {
      return (
        <>
          <AdminDashboard
            onBackToLanding={() => {
              setCurrentView("landing");
              if (typeof window !== "undefined" && window.location.hash === "#dashboard") {
                window.history.pushState(null, "", window.location.pathname);
              }
            }}
          />
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
          {showNotificationOnboarding && user && (
            <NotificationOnboardingModal
              userId={user.uid}
              isOpen={true}
              onComplete={() => setShowNotificationOnboarding(false)}
            />
          )}
        </>
      );
    }

    return (
      <>
        <CustomerPortal
          onBackToLanding={() => {
            setCurrentView("landing");
            if (typeof window !== "undefined" && window.location.hash === "#dashboard") {
              window.history.pushState(null, "", window.location.pathname);
            }
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => handleNavigateToDashboard()}
        />
        {showNotificationOnboarding && user && (
          <NotificationOnboardingModal
            userId={user.uid}
            isOpen={true}
            onComplete={() => setShowNotificationOnboarding(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="site-shell min-h-screen bg-background text-foreground antialiased font-sans overflow-x-hidden">
      {/* Floating Glassmorphic Top Navbar - Very transparent on hero section */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 shadow-sm py-2.5"
            : "bg-black/15 backdrop-blur-xs border-b border-white/15 py-3.5"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a
            className="flex items-center gap-3 no-underline group"
            href="#top"
            aria-label="Affordable Laundry home"
          >
            <div className="relative">
              <img
                src={brandIcon}
                alt="Affordable Laundry"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-sky-400/40 shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-all duration-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black text-base sm:text-lg tracking-tight leading-none transition-colors duration-300 ${
                  isScrolled ? "text-foreground" : "text-white drop-shadow-sm"
                }`}
              >
                Affordable Laundry
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest mt-1 transition-colors duration-300 ${
                  isScrolled ? "text-sky-600 dark:text-sky-400" : "text-sky-300"
                }`}
              >
                KNUST · Kumasi
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links - Dynamic Animated Middle Bar */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 shadow-md ${
              isScrolled
                ? "bg-muted/70 backdrop-blur-xl border-border/70"
                : "bg-white/10 backdrop-blur-2xl border-white/20 shadow-black/20"
            }`}
          >
            {navItems.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={`relative rounded-full text-xs font-bold px-4 h-8 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 ${
                    isActive
                      ? isScrolled
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white text-black shadow-md shadow-white/20"
                      : isScrolled
                        ? "text-foreground/80 hover:text-foreground hover:bg-card/70"
                        : "text-white/85 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        isScrolled ? "bg-sky-500" : "bg-sky-400"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster - Clean order: [My Dashboard] -> [Book Collection] -> [Sign Out LAST] */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* 1. Dashboard Button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNavigateToDashboard}
                  className={`rounded-2xl text-xs font-extrabold shadow-sm gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 ${
                    isAdmin
                      ? "bg-sky-600 hover:bg-sky-700 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isAdmin ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <LayoutDashboard className="w-3.5 h-3.5" />
                  )}
                  <span>{isAdmin ? "Admin Command" : "My Dashboard"}</span>
                </Button>

                {/* 2. Book Collection Button */}
                <Button
                  onClick={handleBookingTrigger}
                  className={`rounded-2xl text-xs font-extrabold shadow-md h-9 sm:h-10 px-3.5 sm:px-4 gap-1.5 hidden md:inline-flex transition-all duration-300 hover:scale-105 active:scale-95 ${
                    !isScrolled
                      ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30 shadow-lg"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <span>Book Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                {/* 3. Sign Out Button - Placed LAST as requested */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className={`rounded-2xl text-xs font-semibold h-9 px-2.5 hidden sm:inline-flex transition-colors duration-300 ${
                    !isScrolled
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Sign Out"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className={`rounded-2xl text-xs font-semibold h-9 px-3 transition-all duration-300 ${
                    !isScrolled
                      ? "text-white border border-white/25 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  Sign In
                </Button>

                <Button
                  onClick={handleBookingTrigger}
                  className={`rounded-2xl text-xs font-extrabold shadow-md h-9 sm:h-10 px-4 gap-1.5 hidden md:inline-flex transition-all duration-300 hover:scale-105 active:scale-95 ${
                    !isScrolled
                      ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30 shadow-lg"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <span>Book Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden rounded-2xl w-9 h-9 transition-colors duration-300 ${
                !isScrolled ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu - High-Contrast Solid Frosted Glass, 100% Visible & Legible */}
        {menuOpen && (
          <div className="lg:hidden mx-3 sm:mx-4 mt-2 p-4 sm:p-5 rounded-3xl bg-slate-950/96 dark:bg-zinc-950/96 text-white backdrop-blur-3xl border border-white/25 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-300 ring-1 ring-white/15">
            {/* Quick status bar inside mobile menu */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  {user
                    ? `Active · ${profile?.displayName || user.displayName || "Valued Customer"}`
                    : "Fast KNUST Campus Pickup"}
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white tracking-wide">
                Kumasi HQ
              </span>
            </div>

            {/* Nav item links with rich high-contrast cards, vivid icons, and active state */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navItems.map(({ label, id }) => {
                const isActive = activeSection === id;
                const iconMap: Record<string, typeof WashingMachine> = {
                  services: WashingMachine,
                  pricing: Shirt,
                  location: MapPin,
                  process: Compass,
                  faq: HelpCircle,
                  contact: Phone,
                };
                const ItemIcon = iconMap[id] || Compass;

                return (
                  <button
                    key={id}
                    onClick={() => {
                      scrollToSection(id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 py-3 px-3.5 rounded-2xl text-xs font-extrabold transition-all duration-300 text-left border ${
                      isActive
                        ? "bg-sky-500/30 text-white border-sky-400 shadow-md shadow-sky-500/25 scale-[1.02]"
                        : "bg-white/10 border-white/15 text-white/90 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        isActive
                          ? "bg-sky-500 text-white shadow-xs"
                          : "bg-white/15 text-sky-400 border border-white/10"
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <span className="truncate text-white font-extrabold">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Action Buttons */}
            <div className="pt-3 border-t border-white/15 flex flex-col gap-2.5">
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  handleBookingTrigger();
                }}
                className="w-full rounded-2xl text-xs font-black h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 gap-2 transition-all hover:scale-[1.02] active:scale-98 border border-white/20"
              >
                <Plus className="w-4 h-4" />
                <span>Book Doorstep Pickup (GHC 4/piece)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMenuOpen(false);
                      handleNavigateToDashboard();
                    }}
                    className="w-full rounded-2xl text-xs font-extrabold h-11 border-white/25 bg-white/15 hover:bg-white/25 text-white gap-2 shadow-xs"
                  >
                    {isAdmin ? (
                      <Shield className="w-4 h-4 text-sky-400" />
                    ) : (
                      <LayoutDashboard className="w-4 h-4 text-sky-400" />
                    )}
                    <span>{isAdmin ? "Admin HQ" : "My Dashboard"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full rounded-2xl text-xs font-bold h-11 text-red-300 hover:text-red-200 hover:bg-red-500/20 border border-red-500/20"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full rounded-2xl text-xs font-extrabold h-11 border-white/25 bg-white/15 hover:bg-white/25 text-white gap-2 shadow-xs"
                >
                  <LogIn className="w-4 h-4 text-sky-400" />
                  <span>Sign In / Create Account</span>
                </Button>
              )}

              {/* Direct Call Rider Hotlink */}
              <a
                href="tel:0532331150"
                className="text-center text-xs font-extrabold text-sky-300 hover:text-white transition-colors py-1.5 flex items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/10"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Call Hotline Rider: 053 233 1150</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Landing Sections */}
      <main className="w-full overflow-x-hidden">
        {/* Full Screen Width Hero Canvas with Curled, Animated Bottom Edge */}
        <section className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[580px] pt-18 sm:pt-28 pb-12 sm:pb-24 flex items-center group">
          {/* High-Resolution Ghanaian Laundry Specialists Atelier Photo - Optimized for portrait mobile screens */}
          <img
            src={heroAtelierImage}
            alt="Affordable Laundry Friendly Ghanaian Team in Kumasi Atelier"
            className="absolute inset-0 w-full h-full object-cover object-[center_18%] sm:object-center transition-transform duration-1000 group-hover:scale-105"
            loading="eager"
            decoding="async"
          />

          {/* Cinematic Gradient Overlays: Clear and warm on mobile so team is visible, with high text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/40 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/70 sm:to-black/35" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />

          {/* Hero Content Container Positioned on Top - Balanced for slim portrait phone screens */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 lg:py-20 space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-md max-w-4xl">
              Clean clothes, <br />
              <span className="text-sky-300 italic font-serif">delivered fresh</span> to your door.
            </h1>

            {/* Easy Simple Explanation */}
            <p className="text-xs sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
              Simple prices for each cloth — no weighing scales, no guessing. Free pickup and
              doorstep delivery to all KNUST halls, hostels, and Kumasi homes with live phone
              updates.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                onClick={handleBookingTrigger}
                className="h-12 sm:h-14 px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-sky-500/30 transition-all hover:scale-[1.03] active:scale-97 gap-2"
              >
                <span>Book a Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollToSection("pricing")}
                className="h-12 sm:h-14 px-7 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl text-white font-bold text-xs sm:text-sm hover:bg-white/20 hover:text-white transition-all shadow-xl"
              >
                See Simple Prices
              </Button>
            </div>
          </div>

          {/* Curled, Dynamic and Animated Wave Lower Edge */}
          <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-10 sm:h-16 lg:h-20 text-background fill-current transition-all animate-wave"
            >
              <path
                d="M0,0 C150,90 350,-40 500,60 C650,140 900,-30 1200,40 L1200,120 Z"
                className="opacity-40"
              />
              <path d="M0,25 C200,110 420,10 600,70 C800,130 1000,20 1200,65 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* Marquee Banner - Automatically Moving Horizontally */}
        <div className="py-3.5 bg-muted/60 border-y border-border overflow-hidden whitespace-nowrap text-xs font-extrabold tracking-widest text-muted-foreground uppercase flex select-none">
          <div className="animate-marquee-infinite flex items-center gap-8 shrink-0">
            <span>✦ WASHED CLEAN</span>
            <span>✦ STEAM IRONED</span>
            <span>✦ PACKED NEATLY</span>
            <span>✦ FREE DOORSTEP PICKUP IN KNUST</span>
            <span>✦ GHC 4 PER T-SHIRT</span>
            <span>✦ PAY WITH MOMO</span>
            <span>✦ 1 TO 2 DAYS READY</span>
            <span>✦ WASHED CLEAN</span>
            <span>✦ STEAM IRONED</span>
            <span>✦ PACKED NEATLY</span>
            <span>✦ FREE DOORSTEP PICKUP IN KNUST</span>
            <span>✦ GHC 4 PER T-SHIRT</span>
            <span>✦ PAY WITH MOMO</span>
            <span>✦ 1 TO 2 DAYS READY</span>
          </div>
        </div>

        {/* Services Section - Transparent Glass Cards */}
        <section id="services" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Care From Door to Wardrobe
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              We Take Good Care of{" "}
              <span className="text-primary italic font-serif">Every Single Cloth</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gentle washing, clean soap, smooth steam ironing, and fast delivery to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {services.map(({ number, title, copy, icon: Icon }) => (
              <div
                key={title}
                className="p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:border-sky-400/50 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-muted-foreground font-mono">
                    {number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{copy}</p>
                <button
                  onClick={handleBookingTrigger}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 pt-2 group-hover:translate-x-1 transition-transform"
                >
                  <span>Pick my clothes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Calculator Section - Transparent Glass Containers */}
        <section id="pricing" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Pricing Intro Glass Container */}
            <div className="lg:col-span-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Clear Prices for Every Cloth
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Know the price <span className="text-primary italic font-serif">before</span> we
                come to pick up.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No weighing scales. No guessing. Pick your items below and watch your total show
                right away.
              </p>

              {/* Courier Showcase Photo */}
              <div className="rounded-3xl overflow-hidden border border-border shadow-lg relative group">
                <img
                  src={courierImage}
                  alt="Affordable Laundry Friendly Delivery Courier"
                  className="w-full h-52 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-xs font-bold">Doorstep Courier Pickup</span>
                  <p className="text-[11px] text-white/80">
                    Friendly riders coming to your hall or hostel gate
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Garment List & Total Card - Translucent Glass */}
            <div className="lg:col-span-7 bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
              <div className="space-y-2.5">
                {laundryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-sky-400/40 hover:bg-white/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-foreground block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{item.note}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 min-w-[50px] text-right">
                        GHC {item.price}
                      </span>
                      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border rounded-xl p-1 shadow-2xs">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-xs font-bold"
                          aria-label={`Remove one ${item.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-foreground">
                          {quantities[item.id] ?? 0}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-xs font-bold"
                          aria-label={`Add one ${item.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary Footer - Translucent Glass */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/15 backdrop-blur-xl border border-sky-400/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">
                    Total for {itemCount} {itemCount === 1 ? "cloth" : "clothes"}:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-foreground">
                    GHC {total}
                  </span>
                </div>
                <Button
                  onClick={handleBookingTrigger}
                  className="rounded-2xl text-xs font-extrabold h-11 sm:h-12 px-6 shadow-md gap-2 bg-sky-600 hover:bg-sky-500 text-white transition-all hover:scale-105 active:scale-95"
                >
                  <span>Book This Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & TURN-BY-TURN DIRECTION SECTION */}
        <MapDirection />

        {/* Routine Process Section */}
        <section id="process" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Super Simple Steps
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              From Your Door, <span className="text-primary italic font-serif">Back to You</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                step: "01",
                title: "Pick Your Clothes",
                desc: "Choose the items you have with our clear per-cloth prices.",
              },
              {
                step: "02",
                title: "We Pick Up at Your Door",
                desc: "Our rider comes to your hostel, hall, or house at your chosen time.",
              },
              {
                step: "03",
                title: "Returned Clean & Fresh",
                desc: "Your clothes arrive back clean, ironed, and ready to wear.",
              },
            ].map((p) => (
              <div
                key={p.step}
                className="p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-sky-400/40 transition-all duration-300 space-y-3"
              >
                <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
                  {p.step}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-foreground">{p.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Review - Translucent Glass Card */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-7 sm:p-10 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl space-y-3">
            <blockquote className="text-lg sm:text-2xl font-serif italic text-foreground leading-snug">
              “No need to waste hours washing clothes by hand in the hostel. They come to pick up
              right from my hall gate and bring them back clean and ironed!”
            </blockquote>
            <p className="text-xs font-bold text-foreground">Bernard A. · Unity Hall, KNUST</p>
          </div>
        </section>

        {/* Frequently Asked Questions Section - Glass Container */}
        <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Frequently Asked <span className="text-primary italic font-serif">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Simple answers to everything you need to know before handing your clothes to our
              rider.
            </p>
          </div>

          <div className="bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="w-full space-y-2.5"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/30 dark:border-white/10 rounded-2xl px-4 py-1 bg-white/20 dark:bg-white/5 backdrop-blur-xl hover:bg-white/35 transition-colors"
                >
                  <AccordionTrigger className="text-xs sm:text-sm font-bold text-foreground hover:no-underline py-3 text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Ready to Book / Contact Footer Section - Glass Box */}
        <section id="contact" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-7 sm:p-12 rounded-3xl bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl text-center space-y-6">
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Doorstep Laundry in Kumasi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                Let Us Wash Your Clothes{" "}
                <span className="text-primary italic font-serif">For You</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Book a pickup in 30 seconds. Pay only when your clothes are clean.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleBookingTrigger}
                className="h-12 sm:h-13 px-8 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg gap-2 w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30"
              >
                <span>Book a Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <a
                href="tel:0532331150"
                className="h-12 sm:h-13 px-6 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/30 text-foreground text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-all shadow-xs w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Call Rider: 053 233 1150</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground space-y-3">
        <div className="flex items-center justify-center gap-2 font-bold text-foreground">
          <img src={brandIcon} alt="Icon" className="w-6 h-6 rounded-lg" />
          <span>Affordable Laundry Kumasi</span>
        </div>
        <p>© 2026 Affordable Laundry Service. Clean Clothes & Fast Pickup in KNUST, Kumasi.</p>
      </footer>

      {/* Floating Mobile Bottom Navigation Dock - Clean, High-Contrast & Legible */}
      <nav
        aria-label="Mobile Bottom Navigation Dock"
        className="md:hidden fixed bottom-4 inset-x-3 max-w-sm mx-auto z-40"
      >
        <div className="relative bg-slate-950/95 dark:bg-black/95 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/60 rounded-full p-1.5 px-2.5 flex items-center justify-between ring-1 ring-white/10">
          {/* 1. Services Tab */}
          <button
            type="button"
            onClick={() => scrollToSection("services")}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 ${
              activeSection === "services"
                ? "bg-white/15 text-sky-400 font-bold"
                : "text-white/80 hover:text-white"
            }`}
          >
            <WashingMachine className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Services</span>
            {activeSection === "services" && (
              <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
            )}
          </button>

          {/* 2. Prices Tab */}
          <button
            type="button"
            onClick={() => scrollToSection("pricing")}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 ${
              activeSection === "pricing"
                ? "bg-white/15 text-sky-400 font-bold"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Prices</span>
            {activeSection === "pricing" && (
              <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
            )}
          </button>

          {/* 3. CENTER HERO: Clean "Book" Button */}
          <button
            type="button"
            onClick={handleBookingTrigger}
            className="group relative -my-1.5 px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-md shadow-sky-500/30 flex items-center gap-1.5 active:scale-95 transition-all duration-200 border border-white/30"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="tracking-wide">Book</span>
          </button>

          {/* 4. Map Tab */}
          <button
            type="button"
            onClick={() => scrollToSection("location")}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 ${
              activeSection === "location"
                ? "bg-white/15 text-sky-400 font-bold"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Map</span>
            {activeSection === "location" && (
              <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
            )}
          </button>

          {/* 5. Portal / Admin / Sign In Tab */}
          <button
            type="button"
            onClick={() => {
              if (user) {
                handleNavigateToDashboard();
              } else {
                setAuthModalOpen(true);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all duration-200 active:scale-95 ${
              user ? "text-sky-400 hover:text-sky-300 font-bold" : "text-white/80 hover:text-white"
            }`}
          >
            {isAdmin ? (
              <Shield className="w-4 h-4 text-sky-400" />
            ) : user ? (
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              {user ? (isAdmin ? "Admin" : "Portal") : "Sign In"}
            </span>
          </button>
        </div>
      </nav>

      {/* Booking Drawer with Places Autocomplete & Glassmorphism */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setBookingOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <img
                  src={brandIcon}
                  alt="Affordable Laundry"
                  className="w-10 h-10 rounded-2xl object-cover border border-primary/20"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Easy Booking
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-foreground">
                    {bookingComplete ? "Pickup Booked!" : "Book Clothes Pickup"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setBookingOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                aria-label="Close booking popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingComplete && latestBooking ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">You’re All Set!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pickup <strong>#{latestBooking.id}</strong> has been booked for{" "}
                    <strong>{latestBooking.date}</strong> at{" "}
                    <strong>{latestBooking.location}</strong>. Our rider will call your phone before
                    arriving.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs flex justify-between font-bold">
                  <span>Total to Pay:</span>
                  <span className="text-primary text-base">GHC {latestBooking.total}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={() => setBookingOpen(false)}
                    className="w-full rounded-2xl text-xs font-bold h-11"
                  >
                    Done
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBookingOpen(false);
                      if (user) {
                        handleNavigateToDashboard();
                      } else {
                        setAuthModalOpen(true);
                      }
                    }}
                    className="w-full rounded-2xl text-xs font-bold h-11"
                  >
                    See Order in Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-4 text-xs">
                {/* Garments Quick Counter */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>
                      Selected Clothes ({itemCount} {itemCount === 1 ? "piece" : "pieces"})
                    </span>
                    <span className="text-primary text-sm">Total: GHC {total}</span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {laundryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border"
                      >
                        <div>
                          <span className="font-bold text-foreground block">{item.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            GHC {item.price} each
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-card border border-border font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold">
                            {quantities[item.id] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-card border border-border font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-foreground mb-1">Your Name</label>
                    <input
                      name="name"
                      required
                      defaultValue={profile?.displayName || user?.displayName || ""}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-foreground mb-1">Phone Number</label>
                    <input
                      name="phone"
                      required
                      type="tel"
                      defaultValue={profile?.phone || ""}
                      placeholder="053 233 1150"
                      className="w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Google Places Autocomplete Pickup Location Input */}
                <div>
                  <label className="block font-bold text-foreground mb-1">
                    Pickup Location (Hall, Hostel, or Address)
                  </label>
                  <PlacesAutocomplete
                    name="location"
                    required
                    value={typedLocation}
                    onChange={(val) => setTypedLocation(val)}
                    placeholder="Type hall, hostel, or room (e.g. Unity Hall Rm 24)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Pickup Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>
                    Free pickup and delivery in KNUST. Our rider will call your phone when coming.
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl text-xs font-extrabold shadow-lg bg-sky-500 hover:bg-sky-400 text-white transition-all hover:scale-[1.02] active:scale-98"
                >
                  {!user ? "Sign In & Confirm Pickup" : `Confirm Pickup · GHC ${total}`}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingOpenBookingAfterAuth(false);
        }}
        onSuccess={() => {
          if (pendingOpenBookingAfterAuth) {
            setPendingOpenBookingAfterAuth(false);
            openBooking();
          } else {
            handleNavigateToDashboard();
          }
        }}
      />

      {/* One-time notification onboarding modal on new device sign-in / sign-up */}
      {showNotificationOnboarding && user && (
        <NotificationOnboardingModal
          userId={user.uid}
          isOpen={true}
          onComplete={() => setShowNotificationOnboarding(false)}
        />
      )}
    </div>
  );
}
