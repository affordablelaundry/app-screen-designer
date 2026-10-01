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
  Sparkles,
  Truck,
  WashingMachine,
  X,
} from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/laundry-atelier-hero.jpg";
import logoAsset from "@/assets/affordable-laundry-logo.png.asset.json";
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

const laundryItems: LaundryItem[] = [
  { id: "tshirt", name: "T-shirt", note: "Washed, pressed & folded", price: 4 },
  { id: "shirt", name: "Dress shirt", note: "Carefully pressed on a hanger", price: 5 },
  { id: "trousers", name: "Trousers", note: "Cleaned with a crisp finish", price: 6 },
  { id: "dress", name: "Dress", note: "Gentle fabric-conscious care", price: 10 },
  { id: "hoodie", name: "Hoodie", note: "Deep clean and fresh finish", price: 10 },
  { id: "bedsheet", name: "Bedsheet", note: "Freshly washed and folded", price: 12 },
  { id: "jacket", name: "Jacket", note: "Detailed outerwear care", price: 15 },
  { id: "suit", name: "Two-piece suit", note: "Premium specialist cleaning", price: 25 },
];

const services = [
  { number: "01", title: "Wash & fold", copy: "Everyday clothes returned fresh, soft and neatly folded.", icon: WashingMachine },
  { number: "02", title: "Press & finish", copy: "Careful ironing for a clean, confident, ready-to-wear finish.", icon: Sparkles },
  { number: "03", title: "Pickup & delivery", copy: "Free collection and return within KNUST, right on schedule.", icon: Truck },
];

const savedBookingKey = "affordable-laundry-website-booking";
const navigationItems = [
  { label: "Services", id: "services" },
  { label: "Pricing", id: "pricing" },
  { label: "How it works", id: "process" },
  { label: "Contact", id: "contact" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LaundryApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({ tshirt: 2, shirt: 1 });
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(savedBookingKey);
    if (!raw) return;
    try {
      const booking = JSON.parse(raw) as Booking;
      if (booking.id && booking.items) setLatestBooking(booking);
    } catch {
      window.localStorage.removeItem(savedBookingKey);
    }
  }, []);

  const total = useMemo(
    () => laundryItems.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0),
    [quantities],
  );
  const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  const changeQuantity = (id: string, amount: number) => {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, Math.min(20, (current[id] ?? 0) + amount)) }));
  };

  const openBooking = () => {
    setBookingComplete(false);
    setBookingOpen(true);
    setMenuOpen(false);
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (itemCount === 0) {
      toast.error("Add at least one item to your collection.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const booking: Booking = {
      id: `AL${Date.now().toString().slice(-5)}`,
      customer: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      location: String(data.get("location") ?? ""),
      date: String(data.get("date") ?? ""),
      items: quantities,
      total,
      status: "Collection scheduled",
    };
    window.localStorage.setItem(savedBookingKey, JSON.stringify(booking));
    setLatestBooking(booking);
    setBookingComplete(true);
    toast.success("Your collection has been scheduled.");
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-brand" href="#top" aria-label="Affordable Laundry home">
          <img src={logoAsset.url} alt="" />
          <span><strong>Affordable Laundry</strong><small>Garment care · Kumasi</small></span>
        </a>
        <nav className={menuOpen ? "site-nav site-nav-open" : "site-nav"} aria-label="Main navigation">
          {navigationItems.map(({ label, id }) => (
            <Button key={id} variant="ghost" onClick={() => { scrollToSection(id); setMenuOpen(false); }}>{label}</Button>
          ))}
          <Button className="nav-book" onClick={openBooking}>Book a collection<ArrowRight /></Button>
        </nav>
        <Button variant="ghost" size="icon" className="menu-trigger" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      <main>
        <section id="top" className="atelier-hero">
          <div className="hero-copy reveal-up">
            <div className="hero-kicker"><span />Artisan laundry & garment care</div>
            <h1>Redefining <em>wardrobe</em> care.</h1>
            <div className="hero-intro">
              <p>Your clothes, collected, expertly cleaned and returned beautifully finished—without disrupting your day.</p>
              <div>
                <Button className="hero-cta" onClick={openBooking}>Book a collection<ArrowRight /></Button>
                <small>24-hour turnaround available</small>
              </div>
            </div>
            <div className="hero-proof">
              <span><strong>24hr</strong> turnaround</span>
              <span><strong>Free</strong> KNUST pickup</span>
              <span><strong>GHC 4</strong> T-shirts</span>
            </div>
          </div>

          <div className="hero-visual reveal-late">
            <div className="hero-image-wrap">
              <img src={heroImage} width={1536} height={1024} alt="Garment-care specialist inspecting freshly cleaned shirts" />
            </div>
            <div className="floating-status">
              <div className="status-heading"><span><i />Live status</span><PackageCheck /></div>
              <strong>{latestBooking ? `Order #${latestBooking.id}` : "Next collection"}</strong>
              <p>{latestBooking ? latestBooking.status : "Slots available today"}</p>
              <div className="status-line"><span /></div>
              <small><Check /> Item-based pricing. No weight estimates.</small>
            </div>
          </div>
          <div className="scroll-note"><span />Scroll to discover</div>
        </section>

        <div className="service-marquee" aria-hidden="true">
          <div>WASHED WITH CARE <span>✦</span> PRESSED WITH PRECISION <span>✦</span> DELIVERED ON TIME <span>✦</span> WASHED WITH CARE <span>✦</span> PRESSED WITH PRECISION <span>✦</span> DELIVERED ON TIME</div>
        </div>

        <section id="services" className="services-section section-pad">
          <div className="section-heading">
            <p className="section-kicker">Care, from door to wardrobe</p>
            <h2>Every piece receives the <em>right</em> attention.</h2>
            <p>Simple service, thoughtful handling and a polished finish for the clothes you live in.</p>
          </div>
          <div className="service-grid">
            {services.map(({ number, title, copy, icon: Icon }) => (
              <article className="service-feature" key={title}>
                <div className="feature-top"><span>{number}</span><Icon /></div>
                <h3>{title}</h3><p>{copy}</p>
                <Button variant="ghost" onClick={openBooking} aria-label={`Book ${title}`}>Explore service<ArrowRight /></Button>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="pricing-section section-pad">
          <div className="pricing-intro">
            <p className="section-kicker">Transparent item pricing</p>
            <h2>Know the price <em>before</em> we arrive.</h2>
            <p>No weighing. No confusing estimates. Select each garment and see your collection total instantly.</p>
            <div className="pricing-callout"><Shirt /><span>Everyday essential</span><strong>T-shirt · GHC 4</strong></div>
          </div>
          <div className="price-list">
            {laundryItems.map((item) => (
              <div className="price-row" key={item.id}>
                <div><strong>{item.name}</strong><small>{item.note}</small></div>
                <span>GHC {item.price}</span>
                <div className="quantity-control" aria-label={`${item.name} quantity`}>
                  <Button variant="ghost" size="icon" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus /></Button>
                  <output>{quantities[item.id] ?? 0}</output>
                  <Button variant="ghost" size="icon" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus /></Button>
                </div>
              </div>
            ))}
            <div className="price-total">
              <div><span>Your collection</span><small>{itemCount} {itemCount === 1 ? "item" : "items"} selected</small></div>
              <strong>GHC {total}</strong>
              <Button onClick={openBooking}>Continue to book<ArrowRight /></Button>
            </div>
          </div>
        </section>

        <section id="process" className="process-section section-pad">
          <div className="process-heading"><p className="section-kicker">A refreshingly simple routine</p><h2>From your door, <em>back to you.</em></h2></div>
          <div className="process-steps">
            {[
              ["01", "Choose your items", "Build your collection with clear prices for every garment."],
              ["02", "We collect", "Pick a convenient time and we come to you within KNUST."],
              ["03", "We return it fresh", "Your clothes come back clean, pressed and neatly packed."],
            ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="testimonial-section section-pad">
          <blockquote>“They make laundry feel less like a chore and more like a wardrobe reset.”</blockquote>
          <div><span>BA</span><p><strong>Bernard A.</strong><small>KNUST, Kumasi</small></p></div>
        </section>

        <section id="contact" className="contact-section section-pad">
          <div><p className="section-kicker">Ready when you are</p><h2>Let’s make laundry your <em>easiest</em> task.</h2></div>
          <Button className="contact-cta" onClick={openBooking}>Schedule your collection<ArrowRight /></Button>
          <div className="contact-details">
            <p><MapPin />Gyinyase, opposite KNUST Business School, Kumasi</p>
            <p><Phone />0532331150 · 0243140855</p>
            <p><Clock3 />24-hour turnaround available</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="site-brand footer-brand" href="#top"><img src={logoAsset.url} alt="" /><span><strong>Affordable Laundry</strong><small>Clean clothes · Fresh start</small></span></a>
        <p>Premium garment care and pickup around KNUST, Kumasi.</p>
        <Button variant="ghost" size="icon" onClick={() => toast("Instagram page demo opened.")} aria-label="Instagram"><Instagram /></Button>
        <small>© 2026 Affordable Laundry Service</small>
      </footer>

      {bookingOpen ? (
        <div className="booking-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <aside className="booking-drawer" role="dialog" aria-modal="true" aria-label="Book a laundry collection">
            <div className="drawer-header">
              <div><p className="section-kicker">Your collection</p><h2>{bookingComplete ? "Booking confirmed" : "Book garment care"}</h2></div>
              <Button variant="ghost" size="icon" onClick={() => setBookingOpen(false)} aria-label="Close booking"><X /></Button>
            </div>
            {bookingComplete && latestBooking ? (
              <div className="booking-success">
                <span><Check /></span><h3>You’re all set.</h3>
                <p>Collection <strong>#{latestBooking.id}</strong> is scheduled for {latestBooking.date}. We’ll call before pickup.</p>
                <div><small>Collection total</small><strong>GHC {latestBooking.total}</strong></div>
                <Button onClick={() => setBookingOpen(false)}>Done</Button>
              </div>
            ) : (
              <form className="booking-form" onSubmit={submitBooking}>
                <div className="booking-summary">
                  <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span><strong>GHC {total}</strong>
                  <Button type="button" variant="ghost" onClick={() => { setBookingOpen(false); scrollToSection("pricing"); }}>Edit items<ChevronDown /></Button>
                </div>
                <label>Full name<input name="name" required maxLength={80} placeholder="Your name" /></label>
                <label>Phone number<input name="phone" required inputMode="tel" minLength={9} maxLength={18} placeholder="053 233 1150" /></label>
                <label>Pickup location<select name="location" required defaultValue=""><option value="" disabled>Select your area</option><option>KNUST campus</option><option>Gyinyase</option><option>Ayeduase</option><option>Outside KNUST</option></select></label>
                <label>Pickup date<input name="date" type="date" required /></label>
                <p className="booking-note"><Check />Free pickup and delivery within KNUST. We confirm fees for other locations before collection.</p>
                <Button type="submit" className="drawer-submit">Confirm collection · GHC {total}<ArrowRight /></Button>
                <small className="demo-copy">Frontend demonstration only. No payment is collected.</small>
              </form>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}