import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Eye,
  EyeOff,
  FoldHorizontal,
  HelpCircle,
  Home,
  Iron,
  ListFilter,
  LocateFixed,
  LogOut,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  Settings,
  Shirt,
  Sparkles,
  Truck,
  UserRound,
  UsersRound,
  WashingMachine,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import logoAsset from "@/assets/affordable-laundry-logo.png.asset.json";
import { Button } from "@/components/ui/button";

type Screen =
  | "splash"
  | "onboarding-1"
  | "onboarding-2"
  | "auth"
  | "home"
  | "services"
  | "booking"
  | "tracking"
  | "payments"
  | "orders"
  | "notifications"
  | "profile"
  | "admin";

type Booking = {
  id: string;
  location: string;
  date: string;
  time: string;
  weight: number;
  notes: string;
  payment: string;
  status: string;
};

const PRICE_PER_KG = 13;

const baseOrder: Booking = {
  id: "AL0001",
  location: "KNUST, Republic Hall",
  date: "28 Sep 2026",
  time: "10:00 AM",
  weight: 3,
  notes: "Handle white shirts separately",
  payment: "Cash on Delivery",
  status: "Picked Up",
};

const screenTitles: Partial<Record<Screen, string>> = {
  services: "Services & pricing",
  booking: "Book laundry",
  tracking: "Track order",
  payments: "Payment method",
  orders: "My orders",
  notifications: "Notifications",
  profile: "Profile",
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img className={compact ? "size-9 rounded-full" : "size-16 rounded-2xl"} src={logoAsset.url} alt="Affordable Laundry Service" />
      <div>
        <p className="font-display text-sm font-bold text-foreground">Affordable Laundry</p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Clean Clothes • Fresh Start</p>
      </div>
    </div>
  );
}

function AppHeader({ title, onBack, action }: { title: string; onBack?: () => void; action?: ReactNode }) {
  return (
    <header className="flex min-h-16 items-center gap-3 border-b border-border bg-card px-5">
      {onBack ? (
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
          <ArrowLeft />
        </Button>
      ) : null}
      <h1 className="flex-1 font-display text-lg font-bold text-foreground">{title}</h1>
      {action}
    </header>
  );
}

function BottomNav({ active, go }: { active: Screen; go: (screen: Screen) => void }) {
  const items = [
    { screen: "home" as Screen, label: "Home", icon: Home },
    { screen: "orders" as Screen, label: "Orders", icon: PackageCheck },
    { screen: "notifications" as Screen, label: "Notifications", icon: Bell },
    { screen: "profile" as Screen, label: "Profile", icon: UserRound },
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.screen || (active === "tracking" && item.screen === "orders");
        return (
          <Button
            key={item.screen}
            variant="ghost"
            className={selected ? "bottom-nav-item bottom-nav-item-active" : "bottom-nav-item"}
            onClick={() => go(item.screen)}
            aria-label={item.label}
          >
            <Icon />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return <span className="icon-tile">{children}</span>;
}

export function LaundryApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [history, setHistory] = useState<Screen[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [weight, setWeight] = useState(3);
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [orders, setOrders] = useState<Booking[]>([baseOrder]);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [adminFilter, setAdminFilter] = useState("All");
  const [adminQuery, setAdminQuery] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("affordable-laundry-orders");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Booking[];
      if (Array.isArray(parsed) && parsed.length) setOrders(parsed);
    } catch {
      window.localStorage.removeItem("affordable-laundry-orders");
    }
  }, []);

  const total = weight * PRICE_PER_KG;
  const latestOrder = orders.at(-1) ?? baseOrder;

  const go = (next: Screen) => {
    setHistory((current) => [...current, screen]);
    setScreen(next);
  };

  const back = () => {
    const previous = history.at(-1) ?? "home";
    setHistory((current) => current.slice(0, -1));
    setScreen(previous);
  };

  const finishAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("identity") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (identity.length < 5 || password.length < 6) {
      toast.error("Enter a valid phone or email and at least 6 password characters.");
      return;
    }
    toast.success(authMode === "login" ? "Welcome back!" : "Demo account created.");
    setHistory([]);
    setScreen("home");
  };

  const continueBooking = () => {
    if (bookingStep === 1 && (!location || !pickupDate || !pickupTime)) {
      toast.error("Choose your pickup location, date and time.");
      return;
    }
    setBookingStep((current) => Math.min(4, current + 1));
  };

  const confirmBooking = () => {
    const order: Booking = {
      id: `AL${String(orders.length + 2).padStart(4, "0")}`,
      location,
      date: pickupDate,
      time: pickupTime,
      weight,
      notes,
      payment,
      status: "Booking Confirmed",
    };
    const nextOrders = [...orders, order];
    setOrders(nextOrders);
    window.localStorage.setItem("affordable-laundry-orders", JSON.stringify(nextOrders));
    setBookingStep(4);
    toast.success("Laundry booking confirmed.");
  };

  if (screen === "splash") {
    return (
      <AppFrame immersive>
        <div className="splash-screen">
          <div className="bubble bubble-one" />
          <div className="bubble bubble-two" />
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
            <img className="splash-logo" src={logoAsset.url} alt="Affordable Laundry Service" />
            <h1 className="mt-6 font-display text-3xl font-extrabold text-primary-foreground">Affordable Laundry</h1>
            <p className="mt-2 text-sm font-medium text-primary-foreground/80">Clean Clothes • Fresh Start</p>
          </div>
          <div className="relative z-10 space-y-3 px-6 pb-8">
            <Button className="h-13 w-full bg-card text-primary hover:bg-card/90" onClick={() => go("onboarding-1")}>Get Started</Button>
            <Button variant="ghost" className="w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => go("auth")}>Already have an account? Log in</Button>
          </div>
        </div>
      </AppFrame>
    );
  }

  if (screen === "onboarding-1" || screen === "onboarding-2") {
    const second = screen === "onboarding-2";
    return (
      <AppFrame>
        <div className="flex h-full flex-col bg-card">
          <div className="flex justify-end p-5">
            <Button variant="ghost" onClick={() => go("auth")}>Skip</Button>
          </div>
          <div className="onboarding-art">
            {second ? <Truck className="size-24 text-primary" strokeWidth={1.4} /> : <img className="size-40 rounded-full object-cover" src={logoAsset.url} alt="Laundry pickup service" />}
          </div>
          <div className="flex flex-1 flex-col px-7 pb-8">
            <p className="eyebrow">{second ? "Pickup & delivery" : "Easy laundry care"}</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-foreground">
              {second ? "We collect. We clean. We deliver." : "Fresh clothes without the hassle."}
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {second ? "Free pickup and delivery within KNUST, with a fast 24-hour turnaround." : "Professional washing, drying, ironing and folding at an affordable GH₵13 per kilogram."}
            </p>
            <div className="mt-auto flex items-center gap-2 py-6">
              <span className={second ? "onboarding-dot" : "onboarding-dot onboarding-dot-active"} />
              <span className={second ? "onboarding-dot onboarding-dot-active" : "onboarding-dot"} />
            </div>
            <Button className="h-13 w-full" onClick={() => (second ? go("auth") : go("onboarding-2"))}>{second ? "Get Started" : "Next"}<ChevronRight /></Button>
          </div>
        </div>
      </AppFrame>
    );
  }

  if (screen === "auth") {
    return (
      <AppFrame>
        <main className="app-scroll bg-card px-6 pb-8 pt-8">
          <Brand />
          <div className="mt-10">
            <h1 className="font-display text-3xl font-extrabold text-foreground">{authMode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{authMode === "login" ? "Sign in to manage your laundry." : "Start your first laundry booking today."}</p>
          </div>
          <div className="segmented-control mt-7">
            <Button variant="ghost" className={authMode === "login" ? "segment-active" : "segment"} onClick={() => setAuthMode("login")}>Login</Button>
            <Button variant="ghost" className={authMode === "signup" ? "segment-active" : "segment"} onClick={() => setAuthMode("signup")}>Sign Up</Button>
          </div>
          <form className="mt-6 space-y-4" onSubmit={finishAuth}>
            {authMode === "signup" ? (
              <label className="field-label">Full name<input name="name" className="app-input" required maxLength={80} placeholder="Your full name" /></label>
            ) : null}
            <label className="field-label">Phone number or email<input name="identity" className="app-input" required maxLength={120} placeholder="053 233 1150" /></label>
            {authMode === "signup" ? (
              <label className="field-label">Email address<input name="email" type="email" className="app-input" required maxLength={120} placeholder="you@example.com" /></label>
            ) : null}
            <label className="field-label relative">Password
              <input name="password" type={showPassword ? "text" : "password"} className="app-input pr-12" required minLength={6} maxLength={72} placeholder="At least 6 characters" />
              <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button>
            </label>
            {authMode === "login" ? <Button type="button" variant="link" className="ml-auto flex px-0" onClick={() => toast("Demo reset link sent.")}>Forgot password?</Button> : null}
            <Button type="submit" className="h-13 w-full">{authMode === "login" ? "Login" : "Create Account"}</Button>
          </form>
          <Button variant="ghost" className="mt-8 w-full text-xs text-muted-foreground" onClick={() => go("admin")}>Open staff demo</Button>
        </main>
      </AppFrame>
    );
  }

  const content = (() => {
    if (screen === "home") return <HomeScreen go={go} latestOrder={latestOrder} />;
    if (screen === "services") return <ServicesScreen go={go} weight={weight} setWeight={setWeight} />;
    if (screen === "booking") return <BookingScreen step={bookingStep} setStep={setBookingStep} back={back} weight={weight} setWeight={setWeight} location={location} setLocation={setLocation} pickupDate={pickupDate} setPickupDate={setPickupDate} pickupTime={pickupTime} setPickupTime={setPickupTime} notes={notes} setNotes={setNotes} payment={payment} setPayment={setPayment} total={total} continueBooking={continueBooking} confirmBooking={confirmBooking} go={go} latestOrder={orders.at(-1) ?? baseOrder} />;
    if (screen === "tracking") return <TrackingScreen order={latestOrder} back={back} />;
    if (screen === "payments") return <PaymentsScreen payment={payment} setPayment={setPayment} back={back} />;
    if (screen === "orders") return <OrdersScreen orders={orders} go={go} />;
    if (screen === "notifications") return <NotificationsScreen read={notificationsRead} setRead={setNotificationsRead} />;
    if (screen === "profile") return <ProfileScreen go={go} />;
    return <AdminScreen go={go} orders={orders} setOrders={setOrders} filter={adminFilter} setFilter={setAdminFilter} query={adminQuery} setQuery={setAdminQuery} />;
  })();

  return (
    <AppFrame>
      <div className="flex h-full flex-col bg-background">
        {content}
        {screen !== "admin" && !["services", "booking", "payments"].includes(screen) ? <BottomNav active={screen} go={go} /> : null}
      </div>
    </AppFrame>
  );
}

function AppFrame({ children, immersive = false }: { children: ReactNode; immersive?: boolean }) {
  return (
    <div className="app-stage">
      <div className={immersive ? "phone-shell phone-shell-immersive" : "phone-shell"}>
        <div className="desktop-brand"><Brand compact /><p>Mobile frontend demo</p></div>
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}

function HomeScreen({ go, latestOrder }: { go: (screen: Screen) => void; latestOrder: Booking }) {
  const actions = [
    { label: "Book Laundry", sub: "Quick & easy", icon: WashingMachine, screen: "booking" as Screen },
    { label: "Track Order", sub: "Live progress", icon: Truck, screen: "tracking" as Screen },
    { label: "Our Services", sub: "See pricing", icon: Shirt, screen: "services" as Screen },
    { label: "Contact Us", sub: "Call support", icon: Phone, screen: "profile" as Screen },
  ];
  return (
    <>
      <div className="app-scroll px-5 pb-6 pt-6">
        <header className="flex items-center justify-between">
          <div><p className="text-xs font-medium text-muted-foreground">Good evening,</p><h1 className="font-display text-xl font-extrabold text-foreground">Bernard</h1></div>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => go("notifications")} aria-label="Notifications"><Bell /></Button>
        </header>
        <section className="promo-banner mt-5">
          <div className="relative z-10 max-w-[62%]">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">24-hour care</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-primary-foreground">Laundry from GH₵13/kg</h2>
            <Button className="mt-5 bg-card text-primary hover:bg-card/90" onClick={() => go("booking")}>Book Laundry</Button>
          </div>
          <WashingMachine className="absolute -bottom-3 -right-2 size-32 text-primary-foreground/20" strokeWidth={1.2} />
        </section>
        <div className="mt-6 flex items-center justify-between"><h2 className="section-title">Quick actions</h2><span className="text-xs text-muted-foreground">Everything in one place</span></div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return <Button key={action.label} variant="outline" className="quick-action" onClick={() => go(action.screen)}><IconTile><Icon /></IconTile><span><strong>{action.label}</strong><small>{action.sub}</small></span></Button>;
          })}
        </div>
        <div className="mt-6 flex items-center justify-between"><h2 className="section-title">Active order</h2><Button variant="link" className="px-0" onClick={() => go("orders")}>View all</Button></div>
        <Button variant="outline" className="order-card mt-2" onClick={() => go("tracking")}>
          <div className="flex w-full items-start justify-between"><div className="text-left"><span className="status-badge">{latestOrder.status}</span><h3 className="mt-3 font-display font-bold text-foreground">Order #{latestOrder.id}</h3><p className="mt-1 text-xs text-muted-foreground">{latestOrder.weight} kg · GH₵{latestOrder.weight * PRICE_PER_KG}.00</p></div><ChevronRight className="text-muted-foreground" /></div>
          <div className="progress-track"><span /></div>
          <div className="flex w-full justify-between text-[10px] font-medium text-muted-foreground"><span>Picked up</span><span>Ready in 24 hours</span></div>
        </Button>
      </div>
    </>
  );
}

function ServicesScreen({ go, weight, setWeight }: { go: (screen: Screen) => void; weight: number; setWeight: (value: number) => void }) {
  const services = [
    ["Washing", "Fresh, hygienic garment care", WashingMachine],
    ["Drying", "Quick and fabric-safe", Wind],
    ["Ironing", "Crisp and wrinkle-free", Iron],
    ["Folding", "Neatly packed for you", FoldHorizontal],
  ] as const;
  return (
    <><AppHeader title={screenTitles.services ?? "Services"} onBack={() => go("home")} />
      <main className="app-scroll p-5">
        <div className="price-strip"><div><p className="text-xs text-primary-foreground/70">Simple pricing</p><strong>GH₵13 <small>/ kilogram</small></strong></div><Clock3 /><span>24hr</span></div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Free pickup and delivery within KNUST. Delivery outside KNUST is confirmed based on location.</p>
        <h2 className="section-title mt-6">What we do</h2>
        <div className="mt-3 space-y-3">{services.map(([name, copy, Icon]) => <div className="service-row" key={name}><IconTile><Icon /></IconTile><div><h3>{name}</h3><p>{copy}</p></div><Check className="ml-auto size-4 text-success" /></div>)}</div>
        <div className="calculator mt-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Price calculator</p><h2 className="section-title mt-1">Estimated weight</h2></div><CircleDollarSign className="size-8 text-primary" /></div><div className="mt-5 flex items-center justify-between"><WeightStepper value={weight} setValue={setWeight} /><div className="text-right"><p className="text-xs text-muted-foreground">Estimated cost</p><strong className="font-display text-2xl text-success">GH₵{weight * PRICE_PER_KG}.00</strong></div></div></div>
        <Button className="mt-6 h-13 w-full" onClick={() => go("booking")}>Book Laundry</Button>
      </main>
    </>
  );
}

function WeightStepper({ value, setValue }: { value: number; setValue: (value: number) => void }) {
  return <div className="weight-stepper"><Button variant="ghost" size="icon" onClick={() => setValue(Math.max(1, value - 1))} aria-label="Decrease weight"><Minus /></Button><span>{value} <small>kg</small></span><Button variant="ghost" size="icon" onClick={() => setValue(Math.min(30, value + 1))} aria-label="Increase weight"><Plus /></Button></div>;
}

type BookingProps = {
  step: number; setStep: (value: number) => void; back: () => void; weight: number; setWeight: (value: number) => void;
  location: string; setLocation: (value: string) => void; pickupDate: string; setPickupDate: (value: string) => void;
  pickupTime: string; setPickupTime: (value: string) => void; notes: string; setNotes: (value: string) => void;
  payment: string; setPayment: (value: string) => void; total: number; continueBooking: () => void; confirmBooking: () => void;
  go: (screen: Screen) => void; latestOrder: Booking;
};

function BookingScreen(props: BookingProps) {
  const { step, setStep, back, weight, setWeight, location, setLocation, pickupDate, setPickupDate, pickupTime, setPickupTime, notes, setNotes, payment, setPayment, total, continueBooking, confirmBooking, go, latestOrder } = props;
  return (
    <><AppHeader title={step === 4 ? "Booking confirmed" : `Book laundry · ${step} of 3`} onBack={step > 1 && step < 4 ? () => setStep(step - 1) : back} />
      <main className="app-scroll p-5">
        {step < 4 ? <div className="booking-progress"><span style={{ width: `${step * 33.333}%` }} /></div> : null}
        {step === 1 ? <div className="booking-panel"><p className="eyebrow">Pickup details</p><h2>When should we collect?</h2><label className="field-label mt-6">Pickup location<select className="app-input" value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Select your area or hostel</option><option>KNUST, Republic Hall</option><option>KNUST, Unity Hall</option><option>Gyinyase</option><option>Outside KNUST</option></select></label>{location === "Outside KNUST" ? <p className="info-note">Delivery fee to be confirmed based on your location.</p> : null}<label className="field-label">Preferred date<input className="app-input" type="date" value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} /></label><label className="field-label">Preferred time<select className="app-input" value={pickupTime} onChange={(event) => setPickupTime(event.target.value)}><option value="">Select a time</option><option>8:00 AM – 10:00 AM</option><option>10:00 AM – 12:00 PM</option><option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option></select></label><Button className="mt-6 h-13 w-full" onClick={continueBooking}>Continue</Button></div> : null}
        {step === 2 ? <div className="booking-panel"><p className="eyebrow">Laundry details</p><h2>Tell us about your load</h2><div className="calculator mt-6"><p className="field-label">Estimated weight</p><div className="mt-2 flex items-center justify-between"><WeightStepper value={weight} setValue={setWeight} /><strong className="font-display text-2xl text-success">GH₵{total}.00</strong></div></div><label className="field-label mt-5">Special instructions<textarea className="app-input min-h-24 resize-none" maxLength={300} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Delicate items, stains, fabric notes…" /></label><p className="info-note">Final weight and price will be confirmed at pickup.</p><Button className="mt-6 h-13 w-full" onClick={continueBooking}>Review booking</Button></div> : null}
        {step === 3 ? <div className="booking-panel"><p className="eyebrow">Review & payment</p><h2>Confirm your booking</h2><Summary order={{ ...baseOrder, location, date: pickupDate, time: pickupTime, weight, notes, payment }} /><p className="field-label mt-5">Payment method</p><PaymentChoices value={payment} setValue={setPayment} /><div className="mt-5 flex gap-3"><Button variant="outline" className="h-12 flex-1" onClick={() => setStep(1)}>Edit details</Button><Button className="h-12 flex-[1.4]" onClick={confirmBooking}>Confirm booking</Button></div></div> : null}
        {step === 4 ? <div className="confirmation"><div className="confirmation-icon"><Check /></div><p className="eyebrow mt-5">You’re all set</p><h2>Laundry booked!</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">We’ll collect your laundry at the selected time and confirm the final weight.</p><div className="mt-6 w-full"><Summary order={latestOrder} /></div><Button className="mt-6 h-13 w-full" onClick={() => go("tracking")}>Track Order</Button><Button variant="ghost" className="mt-2 w-full" onClick={() => { setStep(1); go("home"); }}>Back to Home</Button></div> : null}
      </main>
    </>
  );
}

function Summary({ order }: { order: Booking }) {
  return <div className="summary-box mt-5"><div><span>Pickup</span><strong>{order.location || "Not selected"}</strong></div><div><span>Date & time</span><strong>{order.date || "—"} · {order.time || "—"}</strong></div><div><span>Estimated weight</span><strong>{order.weight} kg</strong></div><div><span>Estimated laundry cost</span><strong>GH₵{order.weight * PRICE_PER_KG}.00</strong></div></div>;
}

function PaymentChoices({ value, setValue }: { value: string; setValue: (value: string) => void }) {
  return <div className="space-y-2">{["Cash on Delivery", "MTN MoMo", "Telecel Cash"].map((method) => <Button key={method} variant="outline" className={value === method ? "payment-choice payment-choice-active" : "payment-choice"} onClick={() => setValue(method)}><CircleDollarSign /><span>{method}</span>{value === method ? <Check className="ml-auto" /> : null}</Button>)}</div>;
}

function TrackingScreen({ order, back }: { order: Booking; back: () => void }) {
  const statuses = ["Booking Confirmed", "Picked Up", "Processing", "Ready for Delivery", "Delivered"];
  return <><AppHeader title="Track order" onBack={back} /><main className="app-scroll p-5"><div className="flex items-start justify-between"><div><p className="eyebrow">Order #{order.id}</p><h2 className="mt-1 font-display text-xl font-extrabold text-foreground">On the way to fresh</h2></div><span className="status-badge">{order.status}</span></div><div className="eta-card mt-5"><Clock3 /><div><strong>Estimated completion</strong><p>Within 24 hours of pickup</p></div></div><div className="timeline mt-7">{statuses.map((status, index) => <div className={index < 2 ? "timeline-item timeline-done" : index === 2 ? "timeline-item timeline-current" : "timeline-item"} key={status}><span className="timeline-dot">{index < 2 ? <Check /> : null}</span><div><strong>{status}</strong><p>{index === 0 ? "27 Sep · 6:42 PM" : index === 1 ? "28 Sep · 10:14 AM" : index === 2 ? "In progress" : "Pending"}</p></div></div>)}</div><Summary order={order} /><div className="mt-5 grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => toast("Order details are up to date.")}>Order details</Button><Button onClick={() => window.location.assign("tel:0532331150")}><Phone />Support</Button></div></main></>;
}

function PaymentsScreen({ payment, setPayment, back }: { payment: string; setPayment: (value: string) => void; back: () => void }) {
  return <><AppHeader title="Payment method" onBack={back} /><main className="app-scroll p-5"><div className="demo-notice"><Sparkles /><p><strong>Frontend demonstration</strong><br />No real payment details are collected or processed.</p></div><h2 className="section-title mt-6">Choose how to pay</h2><div className="mt-3"><PaymentChoices value={payment} setValue={setPayment} /></div><div className="summary-box mt-6"><div><span>Selected method</span><strong>{payment}</strong></div><div><span>When you pay</span><strong>{payment === "Cash on Delivery" ? "When your laundry arrives" : "After final weight confirmation"}</strong></div></div><Button className="mt-6 h-13 w-full" onClick={() => toast.success(`${payment} selected for this demo.`)}>Confirm Demo Method</Button></main></>;
}

function OrdersScreen({ orders, go }: { orders: Booking[]; go: (screen: Screen) => void }) {
  return <><AppHeader title="My orders" action={<Button variant="ghost" size="icon" onClick={() => go("booking")} aria-label="New booking"><Plus /></Button>} /><main className="app-scroll p-5">{orders.length ? <div className="space-y-3">{[...orders].reverse().map((order) => <Button variant="outline" className="order-list-row" key={order.id} onClick={() => go("tracking")}><IconTile><Shirt /></IconTile><div className="min-w-0 flex-1 text-left"><div className="flex items-center justify-between"><strong>#{order.id}</strong><span className="status-badge">{order.status}</span></div><p>{order.date} · {order.weight} kg · GH₵{order.weight * PRICE_PER_KG}.00</p></div><ChevronRight /></Button>)}</div> : <div className="empty-state"><Shirt /><h2>No orders yet</h2><p>Your first fresh load is only a few taps away.</p><Button onClick={() => go("booking")}>Book Laundry</Button></div>}</main></>;
}

function NotificationsScreen({ read, setRead }: { read: boolean; setRead: (value: boolean) => void }) {
  const notices = [
    ["Order confirmed", "Your order #AL0001 has been confirmed.", "Just now", PackageCheck],
    ["Pickup complete", "Your laundry is heading to our care team.", "2h ago", Truck],
    ["Payment update", "Cash on Delivery is selected for your order.", "Yesterday", CircleDollarSign],
    ["Welcome!", "Thanks for choosing Affordable Laundry Service.", "2d ago", Sparkles],
  ] as const;
  return <><AppHeader title="Notifications" action={<Button variant="link" className="px-0 text-xs" onClick={() => setRead(true)}>Mark all read</Button>} /><main className="app-scroll p-5"><div className="space-y-3">{notices.map(([title, copy, time, Icon], index) => <div className="notification-row" key={title}><IconTile><Icon /></IconTile><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><strong>{title}</strong><span>{time}</span></div><p>{copy}</p></div>{!read && index < 2 ? <i /> : null}</div>)}</div></main></>;
}

function ProfileScreen({ go }: { go: (screen: Screen) => void }) {
  const rows = [
    ["My Orders", PackageCheck, () => go("orders")],
    ["Saved Addresses", MapPin, () => toast("Republic Hall is your saved address.")],
    ["Payment Preferences", CircleDollarSign, () => go("payments")],
    ["Notifications", Bell, () => go("notifications")],
    ["Help & Support", HelpCircle, () => window.location.assign("tel:0532331150")],
    ["Settings", Settings, () => toast("Demo preferences saved on this device.")],
  ] as const;
  return <><AppHeader title="Profile" /><main className="app-scroll p-5"><div className="profile-card"><div className="avatar-lg">BA</div><div><h2>Bernard Atsu</h2><p>+233 53 233 1150</p><Button variant="link" className="h-auto px-0 py-1" onClick={() => toast.success("Profile details saved.")}>Edit profile</Button></div></div><div className="mt-6 space-y-1">{rows.map(([label, Icon, action]) => <Button variant="ghost" className="profile-row" key={label} onClick={action}><IconTile><Icon /></IconTile><span>{label}</span><ChevronRight className="ml-auto text-muted-foreground" /></Button>)}</div><div className="contact-panel mt-6"><MapPin /><p>Gyinyase, opposite KNUST Business School, Kumasi</p><Phone /><p>0532331150 / 0243140855</p></div><Button variant="outline" className="mt-5 w-full text-destructive" onClick={() => go("auth")}><LogOut />Log out of demo</Button><Button variant="ghost" className="mt-2 w-full text-xs text-muted-foreground" onClick={() => go("admin")}>Switch to staff demo</Button></main></>;
}

function AdminScreen({ go, orders, setOrders, filter, setFilter, query, setQuery }: { go: (screen: Screen) => void; orders: Booking[]; setOrders: (orders: Booking[]) => void; filter: string; setFilter: (value: string) => void; query: string; setQuery: (value: string) => void }) {
  const allOrders = useMemo(() => orders.length > 1 ? orders : [baseOrder, { ...baseOrder, id: "AL0002", status: "Processing", location: "KNUST, Unity Hall", weight: 5 }, { ...baseOrder, id: "AL0003", status: "Delivered", location: "Gyinyase", weight: 2 }], [orders]);
  const visible = allOrders.filter((order) => (filter === "All" || order.status === filter) && (order.id.toLowerCase().includes(query.toLowerCase()) || order.location.toLowerCase().includes(query.toLowerCase())));
  const updateStatus = (id: string) => {
    const next = allOrders.map((order) => order.id === id ? { ...order, status: order.status === "Delivered" ? "Delivered" : "Processing" } : order);
    setOrders(next);
    window.localStorage.setItem("affordable-laundry-orders", JSON.stringify(next));
    toast.success(`Order #${id} updated.`);
  };
  return <div className="flex h-full flex-col bg-background"><header className="admin-header"><div className="flex items-center justify-between"><div><p className="text-xs text-primary-foreground/70">Staff workspace</p><h1 className="font-display text-xl font-extrabold text-primary-foreground">Operations overview</h1></div><div className="avatar-sm">AB</div></div><div className="admin-stats"><div><strong>{allOrders.length}</strong><span>Total orders</span></div><div><strong>{allOrders.filter((order) => order.status !== "Delivered").length}</strong><span>In progress</span></div><div><strong>{allOrders.filter((order) => order.status === "Delivered").length}</strong><span>Completed</span></div></div></header><main className="app-scroll p-5"><div className="flex items-center justify-between"><h2 className="section-title">Manage orders</h2><Button variant="ghost" size="icon" onClick={() => toast("Services: GH₵13/kg · 24-hour turnaround") } aria-label="Service settings"><Settings /></Button></div><label className="search-field mt-3"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order or location" /></label><div className="filter-tabs mt-3">{["All", "Processing", "Delivered"].map((item) => <Button variant="ghost" className={filter === item ? "filter-active" : ""} key={item} onClick={() => setFilter(item)}>{item}</Button>)}</div><div className="mt-4 space-y-3">{visible.map((order) => <div className="admin-order" key={order.id}><div className="flex items-start justify-between"><div><strong>#{order.id}</strong><p>{order.location}</p></div><span className="status-badge">{order.status}</span></div><div className="mt-3 flex items-center justify-between text-xs"><span>{order.weight} kg · GH₵{order.weight * PRICE_PER_KG}.00</span><Button variant="outline" size="sm" onClick={() => updateStatus(order.id)}>{order.status === "Delivered" ? "Completed" : "Update status"}</Button></div></div>)}</div><div className="admin-tools mt-6"><Button variant="outline" onClick={() => toast("Customer list: 18 demo customers.")}><UsersRound />Customers</Button><Button variant="outline" onClick={() => toast("Services & pricing demo opened.")}><ListFilter />Services</Button><Button variant="outline" onClick={() => toast("Delivery area settings opened.")}><LocateFixed />Delivery</Button><Button variant="outline" onClick={() => toast("Business hours: 7 AM – 7 PM.")}><Clock3 />Settings</Button></div></main><div className="border-t border-border bg-card p-3"><Button variant="ghost" className="w-full" onClick={() => go("home")}><ArrowLeft />Return to customer app</Button></div></div>;
}