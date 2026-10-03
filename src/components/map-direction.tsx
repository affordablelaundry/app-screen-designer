import { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  Compass,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ATELIER_LOCATION = {
  name: "Affordable Laundry Shop",
  address: "Ayeduase - KNUST Main Gate Road, Kumasi, Ghana",
  city: "Kumasi, Ashanti Region",
  plusCode: "M8GR+5V Kumasi",
  lat: 6.6745,
  lng: -1.567,
  phone: "053 233 1150",
  whatsapp: "233532331150",
  hours: "Mon – Sat: 7:00 AM – 8:00 PM · Sun: 10:00 AM – 6:00 PM",
};

const CAMPUS_ZONES = [
  {
    name: "Zone 1 · KNUST Main Campus & Halls",
    details: "Unity, University Hall (Katanga), Republic, Queen's, Independence, Africa Hall",
    eta: "10 – 15 mins",
    fee: "Free Pickup & Return",
    color: "emerald",
  },
  {
    name: "Zone 2 · Ayeduase & Kotei",
    details: "Ayeduase New Site, Kotei, Boadi Gate, Jubilee Mall perimeter",
    eta: "15 – 20 mins",
    fee: "Free Pickup & Return",
    color: "emerald",
  },
  {
    name: "Zone 3 · Gyinyase & Bomso",
    details: "Gyinyase, Bomso Clinic, Tech Junction, Kentinkrono",
    eta: "20 – 30 mins",
    fee: "GHC 10 Flat Rider Dispatch",
    color: "sky",
  },
  {
    name: "Zone 4 · Greater Kumasi",
    details: "Ahodwo, Asokwa, Ridge, Danyame, Kumasi City Mall",
    eta: "Scheduled Express",
    fee: "Calculated at booking",
    color: "blue",
  },
];

export function MapDirection() {
  const [activeZone, setActiveZone] = useState<number>(0);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=KNUST+Ayeduase+Kumasi+Ghana`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=KNUST+Ayeduase+Kumasi+Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="location"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      {/* Background ambient glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Our Shop & Free Pickup Areas</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Visit Us or <span className="text-primary italic font-serif">We Come to You</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Near the KNUST Ayeduase Gate. Our friendly riders come right to your hostel, hall, or
          house.
        </p>
      </div>

      {/* Main Grid: Interactive Map + Directions & Coverage Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Map Card */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-3 sm:p-5 shadow-xl overflow-hidden space-y-4">
          {/* Map Embed Container */}
          <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-border/60 shadow-inner bg-muted">
            <iframe
              title="Affordable Laundry KNUST Map Location"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0 filter contrast-[1.02]"
              loading="lazy"
              allowFullScreen
            />

            {/* Floating Quick Action Overlay on Map */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/30 shadow-lg text-xs space-y-2">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{ATELIER_LOCATION.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {ATELIER_LOCATION.address}
              </p>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Action Button Row under Map */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-98"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${ATELIER_LOCATION.phone}`}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/30 text-foreground text-xs font-semibold hover:bg-white/50 transition-all shadow-2xs"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>Call: {ATELIER_LOCATION.phone}</span>
            </a>

            <a
              href={`https://wa.me/${ATELIER_LOCATION.whatsapp}?text=Hello%20Affordable%20Laundry,%20I%20would%20like%20to%20request%20a%20garment%20pickup.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Right: Atelier Info & Campus Coverage Zones */}
        <div className="lg:col-span-5 space-y-6">
          {/* Atelier Details Card */}
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground tracking-tight">
                  Atelier & Dispatch Hub
                </h3>
                <p className="text-xs text-muted-foreground">{ATELIER_LOCATION.city}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Operating Hours</span>
                  <span className="text-muted-foreground text-[11px] leading-relaxed">
                    {ATELIER_LOCATION.hours}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                <Truck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Doorstep Rider Dispatch</span>
                  <span className="text-muted-foreground text-[11px] leading-relaxed">
                    Riders call 5–10 mins prior to arrival at your hostel or hall reception.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Radius & Zone Explorer */}
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground">Pickup Coverage Zones</h4>
              <span className="text-[11px] font-bold text-primary">KNUST & Kumasi</span>
            </div>

            <div className="space-y-2.5">
              {CAMPUS_ZONES.map((zone, idx) => (
                <div
                  key={zone.name}
                  onClick={() => setActiveZone(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeZone === idx
                      ? "bg-sky-500/15 border-sky-400/40 shadow-xs"
                      : "bg-white/30 dark:bg-white/5 border-white/25 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-foreground">{zone.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {zone.eta}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">{zone.details}</p>
                  <div className="mt-2 pt-1 border-t border-border/30 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground font-medium">{zone.fee}</span>
                    {activeZone === idx && (
                      <span className="text-primary font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active Coverage
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
