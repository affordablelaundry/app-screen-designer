import { o as __toESM } from "../_runtime.mjs";
import "../_libs/firebase.mjs";
import { n as setDoc, r as doc } from "../_libs/@firebase/firestore+[...].mjs";
import { r as db } from "./firebase-CwFdwGnP.mjs";
import { a as Trigger2, i as Root2, l as require_react, n as Header, o as Slot, r as Item, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { _ as Check, a as Plus, c as Minus, d as MapPin, f as ExternalLink, g as ChevronDown, h as CircleQuestionMark, i as Shirt, l as MessageCircle, m as Clock, n as WashingMachine, o as Phone, p as Compass, r as Truck, s as Navigation, t as X, u as Menu, v as Building, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BwhC8Pzr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$5 = "/app/applet/src/components/map-direction.tsx";
var ATELIER_LOCATION = {
	name: "Affordable Laundry (Main Branch)",
	address: "Ayeduase - KNUST, Kumasi, Ghana",
	city: "Kumasi, Ashanti Region",
	mapsUrl: "https://maps.app.goo.gl/V6eX9v3zBjmZy7EV7",
	lat: 6.6752325,
	lng: -1.5620578,
	phone: "053 233 1150",
	whatsapp: "233532331150",
	hours: "Mon – Sat: 7:00 AM – 8:00 PM · Sun: 10:00 AM – 6:00 PM"
};
var CAMPUS_ZONES = [
	{
		name: "Zone 1 · KNUST Main Campus & Halls",
		details: "Unity, University Hall (Katanga), Republic, Queen's, Independence, Africa Hall",
		eta: "10 – 15 mins",
		fee: "Free Pickup & Return",
		color: "emerald"
	},
	{
		name: "Zone 2 · Ayeduase & Kotei",
		details: "Ayeduase New Site, Kotei, Boadi Gate, Jubilee Mall perimeter",
		eta: "15 – 20 mins",
		fee: "Free Pickup & Return",
		color: "emerald"
	},
	{
		name: "Zone 3 · Gyinyase & Bomso",
		details: "Gyinyase, Bomso Clinic, Tech Junction, Kentinkrono",
		eta: "20 – 30 mins",
		fee: "GHC 10 Flat Rider Dispatch",
		color: "sky"
	},
	{
		name: "Zone 4 · Greater Kumasi",
		details: "Ahodwo, Asokwa, Ridge, Danyame, Kumasi City Mall",
		eta: "Scheduled Express",
		fee: "Calculated at booking",
		color: "blue"
	}
];
function MapDirection() {
	const [activeZone, setActiveZone] = (0, import_react.useState)(0);
	const googleMapsDirectionsUrl = "https://maps.app.goo.gl/V6eX9v3zBjmZy7EV7";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		id: "location",
		className: "relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 72,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-10" }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 73,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-center max-w-2xl mx-auto space-y-2.5 mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Compass, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 78,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Our Shop & Free Pickup Areas" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 79,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 77,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
						children: ["Visit Us or ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-primary italic font-serif",
							children: "We Come to You"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 82,
							columnNumber: 23
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 81,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
						children: "Near the KNUST Ayeduase Gate. Our friendly riders come right to your hostel, hall, or house."
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 84,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 76,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-3 sm:p-5 shadow-xl overflow-hidden space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-border/60 shadow-inner bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
							title: "Affordable Laundry KNUST Map Location",
							src: "https://maps.google.com/maps?q=6.6752325,-1.5620578+(AFFORDABLE+LAUNDRY)&t=&z=16&ie=UTF8&iwloc=B&output=embed",
							className: "w-full h-full border-0 filter contrast-[1.02]",
							loading: "lazy",
							allowFullScreen: true
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 96,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/30 shadow-lg text-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 text-foreground font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "w-4 h-4 text-primary shrink-0" }, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 107,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ATELIER_LOCATION.name }, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 108,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 106,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-muted-foreground leading-tight",
									children: ATELIER_LOCATION.address
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 110,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: googleMapsDirectionsUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Navigate on Google Maps" }, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 119,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-3 h-3" }, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 120,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 113,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 105,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 95,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: googleMapsDirectionsUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-98",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 133,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Get Directions" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 134,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 127,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: `tel:${ATELIER_LOCATION.phone}`,
								className: "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/30 text-foreground text-xs font-semibold hover:bg-white/50 transition-all shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "w-4 h-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 141,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Call: ", ATELIER_LOCATION.phone] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 142,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 137,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
								href: `https://wa.me/${ATELIER_LOCATION.whatsapp}?text=Hello%20Affordable%20Laundry,%20I%20would%20like%20to%20request%20a%20garment%20pickup.`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 151,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "WhatsApp Us" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 152,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 145,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 126,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 93,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "w-6 h-6" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 163,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 162,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-bold text-lg text-foreground tracking-tight",
								children: "Atelier & Dispatch Hub"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 166,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: ATELIER_LOCATION.city
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 169,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 165,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 161,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start gap-3 p-3 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 175,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-bold text-foreground block",
									children: "Operating Hours"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 177,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground text-[11px] leading-relaxed",
									children: ATELIER_LOCATION.hours
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 178,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 176,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 174,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start gap-3 p-3 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Truck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 185,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-bold text-foreground block",
									children: "Doorstep Rider Dispatch"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 187,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground text-[11px] leading-relaxed",
									children: "Riders call 5–10 mins prior to arrival at your hostel or hall reception."
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 188,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 186,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 184,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 173,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 160,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-bold text-sm text-foreground",
								children: "Pickup Coverage Zones"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 199,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[11px] font-bold text-primary",
								children: "KNUST & Kumasi"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 200,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 198,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2.5",
							children: CAMPUS_ZONES.map((zone, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								onClick: () => setActiveZone(idx),
								className: `p-3.5 rounded-2xl border transition-all cursor-pointer ${activeZone === idx ? "bg-sky-500/15 border-sky-400/40 shadow-xs" : "bg-white/30 dark:bg-white/5 border-white/25 hover:bg-white/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-bold text-xs text-foreground",
											children: zone.name
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 215,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
											children: zone.eta
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 216,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 214,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-[11px] text-muted-foreground leading-tight",
										children: zone.details
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 220,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-2 pt-1 border-t border-border/30 flex items-center justify-between text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground font-medium",
											children: zone.fee
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 222,
											columnNumber: 21
										}, this), activeZone === idx && /* @__PURE__ */ (void 0)("span", {
											className: "text-primary font-bold flex items-center gap-1",
											children: [/* @__PURE__ */ (void 0)(Check, { className: "w-3 h-3" }, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 225,
												columnNumber: 25
											}, this), " Active Coverage"]
										}, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 224,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 221,
										columnNumber: 19
									}, this)
								]
							}, zone.name, true, {
								fileName: _jsxFileName$5,
								lineNumber: 205,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 203,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 197,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 158,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 91,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 67,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/app/applet/src/components/places-autocomplete.tsx";
var POPULAR_KNUST_LOCATIONS = [
	{
		name: "Unity Hall (Conti)",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "University Hall (Katanga)",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "Queen Elizabeth II Hall",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "Independence Hall",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "Republic Hall",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "Africa Hall",
		area: "KNUST Campus",
		type: "hall"
	},
	{
		name: "Brunei Complex / Hall 7",
		area: "KNUST Campus",
		type: "hostel"
	},
	{
		name: "SRC Hostel",
		area: "KNUST Campus",
		type: "hostel"
	},
	{
		name: "Evandy Hostel",
		area: "Ayeduase, Kumasi",
		type: "hostel"
	},
	{
		name: "Frontline Hostel",
		area: "Ayeduase, Kumasi",
		type: "hostel"
	},
	{
		name: "Standard Hostel",
		area: "Ayeduase, Kumasi",
		type: "hostel"
	},
	{
		name: "Crystal Rose Hostel",
		area: "Ayeduase, Kumasi",
		type: "hostel"
	},
	{
		name: "Shalom Hostel",
		area: "Ayeduase, Kumasi",
		type: "hostel"
	},
	{
		name: "Gaza Hostel",
		area: "Kotei, Kumasi",
		type: "hostel"
	},
	{
		name: "White House Hostel",
		area: "Kotei, Kumasi",
		type: "hostel"
	},
	{
		name: "Chancellor Hall Hostel",
		area: "Kotei, Kumasi",
		type: "hostel"
	},
	{
		name: "Splendor Hostel",
		area: "Kotei, Kumasi",
		type: "hostel"
	},
	{
		name: "Amamoma Hostel",
		area: "Kotei, Kumasi",
		type: "hostel"
	},
	{
		name: "Ayeduase New Site",
		area: "Ayeduase, Kumasi",
		type: "area"
	},
	{
		name: "Kotei Town",
		area: "Kotei, Kumasi",
		type: "area"
	},
	{
		name: "Gyinyase",
		area: "Kumasi",
		type: "area"
	},
	{
		name: "Bomso",
		area: "Kumasi",
		type: "area"
	},
	{
		name: "Kentinkrono",
		area: "Kumasi",
		type: "area"
	},
	{
		name: "Boadi",
		area: "Kumasi",
		type: "area"
	},
	{
		name: "Deduako",
		area: "Kumasi",
		type: "area"
	},
	{
		name: "Tech Junction",
		area: "KNUST, Kumasi",
		type: "area"
	},
	{
		name: "KNUST Main Gate",
		area: "KNUST Campus",
		type: "area"
	},
	{
		name: "KNUST Commercial Area",
		area: "KNUST Campus",
		type: "area"
	},
	{
		name: "KNUST Botanical Garden",
		area: "KNUST Campus",
		type: "area"
	}
];
function PlacesAutocomplete({ value: initialValue = "", onChange, name = "location", required = false, placeholder = "Type your hall, hostel, or house address...", className = "", id = "pickup-location-input" }) {
	const [inputValue, setInputValue] = (0, import_react.useState)(initialValue);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [googlePredictions, setGooglePredictions] = (0, import_react.useState)([]);
	const autocompleteServiceRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setInputValue(initialValue);
	}, [initialValue]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const gMaps = window.google?.maps?.places;
			if (gMaps?.AutocompleteService) try {
				autocompleteServiceRef.current = new gMaps.AutocompleteService();
			} catch (err) {
				console.warn("Google AutocompleteService init:", err);
			}
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!inputValue || inputValue.length < 2) {
			setGooglePredictions([]);
			return;
		}
		if (autocompleteServiceRef.current) try {
			autocompleteServiceRef.current.getPlacePredictions({
				input: inputValue,
				componentRestrictions: { country: "gh" },
				locationBias: {
					center: {
						lat: 6.6745,
						lng: -1.567
					},
					radius: 2e4
				}
			}, (predictions, status) => {
				if (status === "OK" && predictions) setGooglePredictions(predictions.map((p) => p.description));
				else setGooglePredictions([]);
			});
		} catch {
			setGooglePredictions([]);
		}
	}, [inputValue]);
	(0, import_react.useEffect)(() => {
		const handleOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
		};
		document.addEventListener("mousedown", handleOutside);
		return () => document.removeEventListener("mousedown", handleOutside);
	}, []);
	const filteredLocal = POPULAR_KNUST_LOCATIONS.filter((item) => {
		if (!inputValue.trim()) return true;
		const q = inputValue.toLowerCase();
		return item.name.toLowerCase().includes(q) || item.area.toLowerCase().includes(q);
	}).slice(0, 6);
	const handleSelect = (placeName) => {
		setInputValue(placeName);
		onChange?.(placeName);
		setIsOpen(false);
	};
	const handleInputChange = (e) => {
		const nextVal = e.target.value;
		setInputValue(nextVal);
		onChange?.(nextVal);
		setIsOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref: containerRef,
		className: "relative w-full",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative flex items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "absolute left-3 w-4 h-4 text-primary pointer-events-none shrink-0" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 168,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					id,
					type: "text",
					name,
					required,
					value: inputValue,
					onChange: handleInputChange,
					onFocus: () => setIsOpen(true),
					placeholder,
					autoComplete: "off",
					className: `w-full h-11 pl-9 pr-9 rounded-2xl border border-input bg-background text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all shadow-xs ${className}`
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 169,
					columnNumber: 9
				}, this),
				inputValue && /* @__PURE__ */ (void 0)("button", {
					type: "button",
					onClick: () => {
						setInputValue("");
						onChange?.("");
					},
					className: "absolute right-3 p-1 text-muted-foreground hover:text-foreground rounded-full",
					"aria-label": "Clear location input",
					children: /* @__PURE__ */ (void 0)(X, { className: "w-3.5 h-3.5" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 191,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 182,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 167,
			columnNumber: 7
		}, this), isOpen && /* @__PURE__ */ (void 0)("div", {
			className: "absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ (void 0)("div", {
					className: "px-2 py-1 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-1.5 mb-1",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (void 0)(Navigation, { className: "w-3 h-3 text-primary" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 201,
							columnNumber: 15
						}, this), "Suggested KNUST & Kumasi Locations"]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 200,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", { children: "Tap to fill" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 204,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 199,
					columnNumber: 11
				}, this),
				googlePredictions.length > 0 && /* @__PURE__ */ (void 0)("div", {
					className: "space-y-1 mb-2",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-[10px] font-bold text-primary px-2 block",
						children: "Google Places:"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 210,
						columnNumber: 15
					}, this), googlePredictions.map((pred) => /* @__PURE__ */ (void 0)("button", {
						type: "button",
						onClick: () => handleSelect(pred),
						className: "w-full text-left px-3 py-2 rounded-xl text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 group",
						children: [/* @__PURE__ */ (void 0)(MapPin, { className: "w-3.5 h-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 218,
							columnNumber: 19
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "truncate",
							children: pred
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 219,
							columnNumber: 19
						}, this)]
					}, pred, true, {
						fileName: _jsxFileName$4,
						lineNumber: 212,
						columnNumber: 17
					}, this))]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 209,
					columnNumber: 13
				}, this),
				filteredLocal.map((loc) => /* @__PURE__ */ (void 0)("button", {
					type: "button",
					onClick: () => handleSelect(`${loc.name}, ${loc.area}`),
					className: "w-full text-left px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors flex items-center justify-between group",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
							children: /* @__PURE__ */ (void 0)(Building, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 235,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 234,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (void 0)("span", {
								className: "font-semibold text-foreground block truncate",
								children: loc.name
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 238,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] text-muted-foreground truncate block",
								children: loc.area
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 239,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 237,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 233,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("span", {
						className: "text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2",
						children: "Select"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 244,
						columnNumber: 15
					}, this)]
				}, `${loc.name}-${loc.area}`, true, {
					fileName: _jsxFileName$4,
					lineNumber: 227,
					columnNumber: 13
				}, this)),
				filteredLocal.length === 0 && googlePredictions.length === 0 && /* @__PURE__ */ (void 0)("div", {
					className: "px-3 py-3 text-center text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (void 0)("p", { children: "Type your exact address, hall, or room number above." }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 252,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("p", {
						className: "text-[11px] text-primary font-medium mt-1",
						children: "Our rider will call your phone when arriving."
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 253,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 251,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 198,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 166,
		columnNumber: 5
	}, this);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$3 = "/app/applet/src/components/ui/accordion.tsx";
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 13,
	columnNumber: 3
}, void 0));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 31,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 22,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("pb-4 pt-0", className),
		children
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 46,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 41,
	columnNumber: 3
}, void 0));
AccordionContent.displayName = Content2.displayName;
var ghanaian_hero_1790975886532_default = "/assets/ghanaian_hero_1790975886532-9nrCvP7f.jpg";
var courier_dispatch_1790871292507_default = "/assets/courier_dispatch_1790871292507-BQCxXT5y.jpg";
var affordable_laundry_icon_default = "/assets/affordable-laundry-icon-Um_gUXQQ.jpg";
var _jsxFileName$2 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 43,
		columnNumber: 7
	}, void 0);
});
Button.displayName = "Button";
var _jsxFileName$1 = "/app/applet/src/components/laundry-app.tsx";
var WHATSAPP_PHONE = "233532331150";
var WHATSAPP_DISPLAY = "053 233 1150";
var DEFAULT_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Affordable Laundry, I would like to request a garment pickup.")}`;
var laundryItems = [
	{
		id: "tshirt",
		name: "T-shirt",
		note: "Washed, ironed & folded",
		price: 4
	},
	{
		id: "shirt",
		name: "Dress shirt",
		note: "Ironed smooth on a hanger",
		price: 5
	},
	{
		id: "trousers",
		name: "Trousers & Jeans",
		note: "Cleaned and neatly ironed",
		price: 6
	},
	{
		id: "dress",
		name: "Dress",
		note: "Gentle fabric care",
		price: 10
	},
	{
		id: "hoodie",
		name: "Hoodie & Sweater",
		note: "Deep washed and fresh",
		price: 10
	},
	{
		id: "bedsheet",
		name: "Bedsheet & Cover",
		note: "Freshly washed and folded",
		price: 12
	},
	{
		id: "jacket",
		name: "Jacket & Coat",
		note: "Careful outer wear cleaning",
		price: 15
	},
	{
		id: "suit",
		name: "Two-piece Suit",
		note: "Special gentle pressing",
		price: 25
	}
];
var services = [
	{
		number: "01",
		title: "Wash & Fold",
		copy: "Your everyday clothes returned clean, soft, fresh, and neatly folded.",
		icon: WashingMachine
	},
	{
		number: "02",
		title: "Iron & Pack",
		copy: "Clean steam ironing so your shirts, trousers, and dresses look sharp.",
		icon: Shirt
	},
	{
		number: "03",
		title: "Free Doorstep Pickup",
		copy: "We pick up and bring back to your hostel, hall, or room for free.",
		icon: Truck
	}
];
var faqs = [
	{
		q: "How much does laundry cost at KNUST?",
		a: "We charge simple, transparent per-item prices starting from only GHC 4 per cloth (GHC 4 for T-shirts, GHC 5 for dress shirts, GHC 6 for trousers and jeans). There are no heavy weighing scales or unexpected fees, making it the most affordable laundry service for KNUST students."
	},
	{
		q: "How long does laundry pickup and delivery take in Kumasi?",
		a: "Normally 24 to 48 hours (1 to 2 days). Your clothes are washed clean, dried thoroughly with backup solar power, steam ironed smooth, and returned in protective packaging right to your doorstep."
	},
	{
		q: "Do you pick up from student hostels and halls around KNUST?",
		a: "Yes! Our dispatch riders provide free doorstep pickup and delivery to all traditional KNUST campus halls (Unity/Conti, University/Katanga, Republic, Queen Elizabeth II, Independence, Africa Hall) and student hostels across Ayeduase, Kotei, Bomso, Boadi, and Gaza."
	},
	{
		q: "Which areas in Kumasi do you cover for laundry pickup?",
		a: "We cover the entire KNUST campus, Ayeduase, Kotei, Bomso, Boadi, Oforikrom, Gyinyase, Kentinkrono, and surrounding Kumasi neighborhoods. Just book a pickup and our rider will come to your gate."
	},
	{
		q: "How do I pay for my laundry service?",
		a: "You only pay AFTER your clothes are washed, dried, ironed, and delivered safely to you. You can pay conveniently using Mobile Money (MTN MoMo, Telecel Cash) or cash on delivery."
	},
	{
		q: "What items and clothes do you wash and fold?",
		a: "We wash, fold, and steam iron all everyday clothing: T-shirts, shirts, trousers, jeans, dresses, hoodies, shorts, lab coats, and bedsheets. Delicate native wear and formal suits receive gentle specialized care."
	}
];
var savedBookingKey = "affordable-laundry-latest-booking";
function scrollToSection(id) {
	document.getElementById(id)?.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
}
function LaundryApp() {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [bookingOpen, setBookingOpen] = (0, import_react.useState)(false);
	const [bookingComplete, setBookingComplete] = (0, import_react.useState)(false);
	const [quantities, setQuantities] = (0, import_react.useState)({
		tshirt: 2,
		shirt: 1
	});
	const [latestBooking, setLatestBooking] = (0, import_react.useState)(null);
	const [typedLocation, setTypedLocation] = (0, import_react.useState)("");
	const [isScrolled, setIsScrolled] = (0, import_react.useState)(false);
	const [activeSection, setActiveSection] = (0, import_react.useState)("top");
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 40);
			const sections = [
				"services",
				"pricing",
				"process",
				"areas",
				"location",
				"faq",
				"contact"
			];
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
			if (window.scrollY < 200) setActiveSection("top");
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const navItems = (0, import_react.useMemo)(() => {
		return [
			{
				label: "Services",
				id: "services"
			},
			{
				label: "Pricing",
				id: "pricing"
			},
			{
				label: "How It Works",
				id: "process"
			},
			{
				label: "Areas We Serve",
				id: "areas"
			},
			{
				label: "Map & Shop",
				id: "location"
			},
			{
				label: "FAQ",
				id: "faq"
			},
			{
				label: "Call Us",
				id: "contact"
			}
		];
	}, []);
	(0, import_react.useEffect)(() => {
		const raw = window.localStorage.getItem(savedBookingKey);
		if (!raw) return;
		try {
			const booking = JSON.parse(raw);
			if (booking.id && booking.items) setLatestBooking(booking);
		} catch {
			window.localStorage.removeItem(savedBookingKey);
		}
	}, []);
	const total = (0, import_react.useMemo)(() => laundryItems.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0), [quantities]);
	const itemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
	const changeQuantity = (id, delta) => {
		setQuantities((current) => {
			const next = Math.max(0, (current[id] ?? 0) + delta);
			return {
				...current,
				[id]: next
			};
		});
	};
	const openBooking = () => {
		setBookingComplete(false);
		setBookingOpen(true);
	};
	const handleBookingTrigger = () => {
		openBooking();
	};
	const submitBooking = async (event) => {
		event.preventDefault();
		if (itemCount === 0) {
			toast.error("Please pick at least one cloth before booking.");
			return;
		}
		const form = new FormData(event.currentTarget);
		const newBookingId = `AL${Date.now().toString().slice(-5)}`;
		const customer = String(form.get("name") || "").trim() || "Valued Customer";
		const phone = String(form.get("phone") || "").trim();
		const location = (typedLocation || String(form.get("location") || "")).trim() || "KNUST Campus";
		const date = String(form.get("date") || "Tomorrow");
		if (!customer) {
			toast.error("Please enter your name.");
			return;
		}
		if (!phone) {
			toast.error("Please enter your phone number.");
			return;
		}
		const whatsappMessage = `🧺 *New Laundry Pickup Request - Affordable Laundry*\n\n*Order ID:* #${newBookingId}\n*Customer:* ${customer}\n*Phone:* ${phone}\n*Pickup Location:* ${location}\n*Pickup Date:* ${date}\n\n*Garments Selected:*\n${laundryItems.filter((item) => (quantities[item.id] ?? 0) > 0).map((item) => `• ${quantities[item.id]}x ${item.name} (GHC ${item.price * (quantities[item.id] ?? 0)})`).join("\n")}\n\n*Total Pieces:* ${itemCount} ${itemCount === 1 ? "piece" : "pieces"}\n*Estimated Total:* GHC ${total}\n\nHello Affordable Laundry, please confirm my pickup schedule. Thank you!`;
		const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;
		const booking = {
			id: newBookingId,
			customer,
			phone,
			location,
			date,
			items: quantities,
			total,
			status: "COLLECTION_SCHEDULED"
		};
		try {
			window.localStorage.setItem(savedBookingKey, JSON.stringify(booking));
		} catch {}
		setLatestBooking(booking);
		setBookingComplete(true);
		try {
			const orderRef = doc(db, "orders", newBookingId);
			await setDoc(orderRef, {
				id: newBookingId,
				docId: newBookingId,
				customerName: customer,
				customerPhone: phone,
				location,
				pickupDate: date,
				items: quantities,
				itemCount,
				total,
				channel: "WHATSAPP",
				status: "COLLECTION_SCHEDULED",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch {}
		toast.success("Opening WhatsApp chat directly for 053 233 1150...");
		try {
			window.location.assign(whatsappUrl);
		} catch {
			window.open(whatsappUrl, "_blank");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "site-shell min-h-screen bg-background text-foreground antialiased font-sans overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: `fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 shadow-sm py-2.5" : "bg-black/15 backdrop-blur-xs border-b border-white/15 py-3.5"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							className: "flex items-center gap-3 no-underline group",
							href: "#top",
							"aria-label": "Affordable Laundry home",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: affordable_laundry_icon_default,
									alt: "Affordable Laundry KNUST Kumasi Logo",
									className: "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-sky-400/40 shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-all duration-300"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 326,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-background" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 331,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 325,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `font-black text-base sm:text-lg tracking-tight leading-none transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white drop-shadow-sm"}`,
									children: "Affordable Laundry"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 334,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `text-[10px] uppercase font-bold tracking-widest mt-1 transition-colors duration-300 ${isScrolled ? "text-sky-600 dark:text-sky-400" : "text-sky-300"}`,
									children: "KNUST · Kumasi"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 341,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 333,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 320,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
							className: `hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 shadow-md ${isScrolled ? "bg-muted/70 backdrop-blur-xl border-border/70" : "bg-white/10 backdrop-blur-2xl border-white/20 shadow-black/20"}`,
							children: navItems.map(({ label, id }) => {
								const isActive = activeSection === id;
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: `#${id}`,
									onClick: (e) => {
										e.preventDefault();
										scrollToSection(id);
									},
									className: `relative rounded-full text-xs font-bold px-3.5 h-8 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 no-underline ${isActive ? isScrolled ? "bg-primary text-primary-foreground shadow-sm" : "bg-white text-black shadow-md shadow-white/20" : isScrolled ? "text-foreground/80 hover:text-foreground hover:bg-card/70" : "text-white/85 hover:text-white hover:bg-white/15"}`,
									children: [label, isActive && /* @__PURE__ */ (void 0)("span", { className: `absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isScrolled ? "bg-sky-500" : "bg-sky-400"}` }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 381,
										columnNumber: 21
									}, this)]
								}, id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 362,
									columnNumber: 17
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 352,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								onClick: openBooking,
								className: `rounded-2xl text-xs font-extrabold shadow-md h-9 sm:h-10 px-3.5 sm:px-4 gap-1.5 inline-flex transition-all duration-300 hover:scale-105 active:scale-95 ${!isScrolled ? "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30 shadow-lg" : "bg-foreground text-background hover:bg-foreground/90"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Book Collection" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 402,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-3.5 h-3.5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 403,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 394,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								size: "icon",
								className: `lg:hidden rounded-2xl w-9 h-9 transition-colors duration-300 ${!isScrolled ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"}`,
								onClick: () => setMenuOpen(!menuOpen),
								"aria-label": "Toggle Navigation Menu",
								children: menuOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-5 h-5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 416,
									columnNumber: 27
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "w-5 h-5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 416,
									columnNumber: 55
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 407,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 393,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 319,
					columnNumber: 9
				}, this), menuOpen && /* @__PURE__ */ (void 0)("div", {
					className: "lg:hidden mx-3 sm:mx-4 mt-2 p-4 sm:p-5 rounded-3xl bg-slate-950/96 dark:bg-zinc-950/96 text-white backdrop-blur-3xl border border-white/25 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-300 ring-1 ring-white/15",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/15 px-1",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 427,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-black uppercase tracking-wider text-emerald-400",
									children: "Fast KNUST Campus Pickup"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 428,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 426,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("span", {
								className: "text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white tracking-wide",
								children: "Kumasi HQ"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 432,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 425,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 gap-2 pt-1",
							children: navItems.map(({ label, id }) => {
								const isActive = activeSection === id;
								const ItemIcon = {
									services: WashingMachine,
									pricing: Shirt,
									process: Compass,
									areas: MapPin,
									location: Navigation,
									faq: CircleQuestionMark,
									contact: Phone
								}[id] || Compass;
								return /* @__PURE__ */ (void 0)("a", {
									href: `#${id}`,
									onClick: (e) => {
										e.preventDefault();
										scrollToSection(id);
										setMenuOpen(false);
									},
									className: `flex items-center gap-2.5 py-3 px-3.5 rounded-2xl text-xs font-extrabold transition-all duration-300 text-left border no-underline ${isActive ? "bg-sky-500/30 text-white border-sky-400 shadow-md shadow-sky-500/25 scale-[1.02]" : "bg-white/10 border-white/15 text-white/90 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] active:scale-95"}`,
									children: [/* @__PURE__ */ (void 0)("div", {
										className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${isActive ? "bg-sky-500 text-white shadow-xs" : "bg-white/15 text-sky-400 border border-white/10"}`,
										children: /* @__PURE__ */ (void 0)(ItemIcon, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 474,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 467,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "truncate text-white font-extrabold",
										children: label
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 476,
										columnNumber: 21
									}, this)]
								}, id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 453,
									columnNumber: 19
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 438,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "pt-3 border-t border-white/15 flex flex-col gap-2.5",
							children: [
								/* @__PURE__ */ (void 0)(Button, {
									onClick: () => {
										setMenuOpen(false);
										openBooking();
									},
									className: "w-full rounded-2xl text-xs font-black h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 gap-2 transition-all hover:scale-[1.02] active:scale-98 border border-white/20",
									children: [
										/* @__PURE__ */ (void 0)(Plus, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 491,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("span", { children: "Book Doorstep Pickup (GHC 4/piece)" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 492,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)(ArrowRight, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 493,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 484,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("a", {
									href: DEFAULT_WHATSAPP_LINK,
									target: "_blank",
									rel: "noopener noreferrer",
									onClick: () => setMenuOpen(false),
									className: "w-full rounded-2xl text-xs font-black h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-2 transition-all",
									children: [/* @__PURE__ */ (void 0)(MessageCircle, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 503,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("span", { children: [
										"WhatsApp Direct (",
										WHATSAPP_DISPLAY,
										")"
									] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 504,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 496,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("a", {
									href: "tel:0532331150",
									className: "text-center text-xs font-extrabold text-sky-300 hover:text-white transition-colors py-1.5 flex items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/10",
									children: [/* @__PURE__ */ (void 0)(Phone, { className: "w-3.5 h-3.5 text-sky-400" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 512,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("span", { children: "Call Hotline Rider: 053 233 1150" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 513,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 508,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 483,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 423,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 312,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "w-full overflow-x-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "relative w-full overflow-hidden min-h-[480px] sm:min-h-[580px] pt-18 sm:pt-28 pb-12 sm:pb-24 flex items-center group",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
								src: ghanaian_hero_1790975886532_default,
								alt: "Affordable Laundry Friendly Ghanaian Team in Kumasi Atelier",
								className: "absolute inset-0 w-full h-full object-cover object-[center_18%] sm:object-center transition-transform duration-1000 group-hover:scale-105",
								loading: "eager",
								decoding: "async"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 525,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/40 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/70 sm:to-black/35" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 534,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-radial from-transparent via-transparent to-black/40" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 535,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 lg:py-20 space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
										className: "text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-md max-w-4xl",
										children: [
											"Laundry Pickup & Delivery at",
											" ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-sky-300 italic font-serif",
												children: "KNUST and Kumasi"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 542,
												columnNumber: 15
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 540,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-xs",
										children: "Simple prices for each cloth — no weighing scales, no guessing. Free pickup and doorstep delivery to all KNUST halls, hostels, and Kumasi homes with live phone updates."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 546,
										columnNumber: 13
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											onClick: handleBookingTrigger,
											className: "h-12 sm:h-14 px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-sky-500/30 transition-all hover:scale-[1.03] active:scale-97 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Book a Pickup" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 558,
												columnNumber: 17
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 559,
												columnNumber: 17
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 554,
											columnNumber: 15
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "outline",
											onClick: () => scrollToSection("pricing"),
											className: "h-12 sm:h-14 px-7 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl text-white font-bold text-xs sm:text-sm hover:bg-white/20 hover:text-white transition-all shadow-xl",
											children: "See Simple Prices"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 562,
											columnNumber: 15
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 553,
										columnNumber: 13
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 538,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none z-20 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
									viewBox: "0 0 1200 120",
									preserveAspectRatio: "none",
									className: "relative block w-full h-10 sm:h-16 lg:h-20 text-background fill-current transition-all animate-wave",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										d: "M0,0 C150,90 350,-40 500,60 C650,140 900,-30 1200,40 L1200,120 Z",
										className: "opacity-40"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 579,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M0,25 C200,110 420,10 600,70 C800,130 1000,20 1200,65 L1200,120 L0,120 Z" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 583,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 574,
									columnNumber: 13
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 573,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 523,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "py-3.5 bg-muted/60 border-y border-border overflow-hidden whitespace-nowrap text-xs font-extrabold tracking-widest text-muted-foreground uppercase flex select-none",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "animate-marquee-infinite flex items-center gap-8 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ WASHED CLEAN" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 591,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ STEAM IRONED" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 592,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ PACKED NEATLY" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 593,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ FREE DOORSTEP PICKUP IN KNUST" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 594,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ GHC 4 PER T-SHIRT" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 595,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ PAY WITH MOMO" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 596,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ 1 TO 2 DAYS READY" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 597,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ WASHED CLEAN" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 598,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ STEAM IRONED" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 599,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ PACKED NEATLY" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 600,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ FREE DOORSTEP PICKUP IN KNUST" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 601,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ GHC 4 PER T-SHIRT" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 602,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ PAY WITH MOMO" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 603,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✦ 1 TO 2 DAYS READY" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 604,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 590,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 589,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "services",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-center max-w-2xl mx-auto space-y-2.5 mb-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-bold text-primary uppercase tracking-wider",
									children: "Care From Door to Wardrobe"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 611,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
									children: [
										"We Take Good Care of",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-primary italic font-serif",
											children: "Every Single Cloth"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 616,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 614,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs sm:text-sm text-muted-foreground",
									children: "Gentle washing, clean soap, smooth steam ironing, and fast delivery to your door."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 618,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 610,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6",
							children: services.map(({ number, title, copy, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:border-sky-400/50 transition-all duration-300 space-y-4 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs font-black text-muted-foreground font-mono",
											children: number
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 630,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "w-6 h-6" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 634,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 633,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 629,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-lg sm:text-xl font-bold text-foreground",
										children: title
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 637,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
										children: copy
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 638,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										onClick: handleBookingTrigger,
										className: "text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 pt-2 group-hover:translate-x-1 transition-transform",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Pick my clothes" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 643,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-3.5 h-3.5" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 644,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 639,
										columnNumber: 17
									}, this)
								]
							}, title, true, {
								fileName: _jsxFileName$1,
								lineNumber: 625,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 623,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 609,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "pricing",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "lg:col-span-5 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-bold text-primary uppercase tracking-wider",
										children: "Clear Prices for Every Cloth"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 656,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
										children: [
											"Know the price ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-primary italic font-serif",
												children: "before"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 660,
												columnNumber: 32
											}, this),
											" we come to pick up."
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 659,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
										children: "No weighing scales. No guessing. Pick your items below and watch your total show right away."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 663,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-3xl overflow-hidden border border-border shadow-lg relative group",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
											src: courier_dispatch_1790871292507_default,
											alt: "Affordable Laundry Friendly Delivery Courier in Kumasi",
											className: "w-full h-52 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105",
											loading: "lazy",
											decoding: "async"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 670,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 flex flex-col justify-end text-white",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs font-bold",
												children: "Doorstep Courier Pickup"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 678,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-white/80",
												children: "Friendly riders coming to your hall or hostel gate"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 679,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 677,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 669,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 655,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "lg:col-span-7 bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2.5",
									children: laundryItems.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "p-3 sm:p-3.5 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:border-sky-400/40 hover:bg-white/50 transition-all duration-200 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-bold text-xs sm:text-sm text-foreground block",
											children: item.name
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 695,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[11px] text-muted-foreground",
											children: item.note
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 698,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 694,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 min-w-[50px] text-right",
												children: ["GHC ", item.price]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 702,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border rounded-xl p-1 shadow-2xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
														onClick: () => changeQuantity(item.id, -1),
														className: "w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-xs font-bold",
														"aria-label": `Remove one ${item.name}`,
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Minus, { className: "w-3.5 h-3.5" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 711,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 706,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "w-6 text-center text-xs font-bold text-foreground",
														children: quantities[item.id] ?? 0
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 713,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
														onClick: () => changeQuantity(item.id, 1),
														className: "w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-xs font-bold",
														"aria-label": `Add one ${item.name}`,
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 721,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 716,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 705,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 701,
											columnNumber: 21
										}, this)]
									}, item.id, true, {
										fileName: _jsxFileName$1,
										lineNumber: 690,
										columnNumber: 19
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 688,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-4 sm:p-5 rounded-2xl bg-sky-500/15 backdrop-blur-xl border border-sky-400/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs text-muted-foreground block font-medium",
										children: [
											"Total for ",
											itemCount,
											" ",
											itemCount === 1 ? "cloth" : "clothes",
											":"
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 732,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-2xl sm:text-3xl font-black text-foreground",
										children: ["GHC ", total]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 735,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 731,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										onClick: handleBookingTrigger,
										className: "rounded-2xl text-xs font-extrabold h-11 sm:h-12 px-6 shadow-md gap-2 bg-sky-600 hover:bg-sky-500 text-white transition-all hover:scale-105 active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Book This Pickup" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 743,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 744,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 739,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 730,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 687,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 653,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 652,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapDirection, {}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 752,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "process",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-center max-w-2xl mx-auto space-y-2.5 mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-bold text-primary uppercase tracking-wider",
								children: "Super Simple Steps"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 757,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
								children: ["From Your Door, ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-primary italic font-serif",
									children: "Back to You"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 761,
									columnNumber: 31
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 760,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 756,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6",
							children: [
								{
									step: "01",
									title: "Pick Your Clothes",
									desc: "Choose the items you have with our clear per-cloth prices."
								},
								{
									step: "02",
									title: "We Pick Up at Your Door",
									desc: "Our rider comes to your hostel, hall, or house at your chosen time."
								},
								{
									step: "03",
									title: "Returned Clean & Fresh",
									desc: "Your clothes arrive back clean, ironed, and ready to wear."
								}
							].map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-sky-400/40 transition-all duration-300 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-2xl font-black text-sky-600 dark:text-sky-400 font-mono",
										children: p.step
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 787,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base sm:text-lg font-bold text-foreground",
										children: p.title
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 790,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
										children: p.desc
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 791,
										columnNumber: 17
									}, this)
								]
							}, p.step, true, {
								fileName: _jsxFileName$1,
								lineNumber: 783,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 765,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 755,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "areas",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-center max-w-2xl mx-auto space-y-2.5 mb-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-bold text-primary uppercase tracking-wider",
									children: "Campus & Neighborhood Coverage"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 800,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
									children: [
										"Areas We Serve Around",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-primary italic font-serif",
											children: "KNUST & Kumasi"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 805,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 803,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: "Fast, friendly laundry pickup and delivery across KNUST campus, student hostels, and Kumasi residential neighborhoods."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 807,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 799,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
							children: [
								{
									name: "KNUST Campus Halls",
									desc: "Unity Hall (Conti), University Hall (Katanga), Republic, Queen Elizabeth II, Independence, and Africa Hall.",
									badge: "Free Hall Gate Pickup"
								},
								{
									name: "Ayeduase & New Site",
									desc: "All student hostels, apartments, and private residences around Ayeduase gate and Ayeduase New Site.",
									badge: "Hostel Pickup"
								},
								{
									name: "Kotei & Gaza",
									desc: "Doorstep collection along Gaza street, Kotei township, and surrounding student hostels.",
									badge: "Daily Coverage"
								},
								{
									name: "Bomso & Tech Junction",
									desc: "Quick collection for students, lecturers, and residents near Bomso and Kumasi Tech Junction.",
									badge: "Fast Dispatch"
								},
								{
									name: "Boadi",
									desc: "Doorstep laundry collection for residential homes, hostels, and student apartments in Boadi.",
									badge: "Doorstep Service"
								},
								{
									name: "Oforikrom & Kumasi",
									desc: "Serving Oforikrom, Gyinyase, Anwomaso, and greater Kumasi with reliable wash, fold, and steam ironing.",
									badge: "Greater Kumasi"
								}
							].map((area) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-6 bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl hover:-translate-y-1 hover:border-sky-400/40 transition-all duration-300 space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-base sm:text-lg font-bold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 852,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: area.name }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 853,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 851,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
										children: area.badge
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 855,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 850,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: area.desc
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 859,
									columnNumber: 17
								}, this)]
							}, area.name, true, {
								fileName: _jsxFileName$1,
								lineNumber: 846,
								columnNumber: 15
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 813,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 798,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-7 sm:p-10 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("blockquote", {
								className: "text-lg sm:text-2xl font-serif italic text-foreground leading-snug",
								children: "“No need to waste hours washing clothes by hand in the hostel. They come to pick up right from my hall gate and bring them back clean and ironed!”"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 870,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs font-bold text-foreground",
								children: "Bernard A. · Unity Hall, KNUST"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 874,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 869,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 868,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "faq",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-center max-w-2xl mx-auto space-y-2.5 mb-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 882,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Questions & Answers" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 883,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 881,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight",
									children: "Frequently Asked Questions (FAQ)"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 885,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: "Simple answers to everything you need to know before handing your clothes to our rider."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 888,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 880,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Accordion, {
								type: "single",
								collapsible: true,
								defaultValue: "item-0",
								className: "w-full space-y-2.5",
								children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AccordionItem, {
									value: `item-${index}`,
									className: "border border-white/30 dark:border-white/10 rounded-2xl px-4 py-1 bg-white/20 dark:bg-white/5 backdrop-blur-xl hover:bg-white/35 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AccordionTrigger, {
										className: "text-xs sm:text-sm font-bold text-foreground hover:no-underline py-3 text-left",
										children: faq.q
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 907,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AccordionContent, {
										className: "text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3",
										children: faq.a
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 910,
										columnNumber: 19
									}, this)]
								}, index, true, {
									fileName: _jsxFileName$1,
									lineNumber: 902,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 895,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 894,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 879,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						id: "contact",
						className: "py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-7 sm:p-12 rounded-3xl bg-white/45 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl text-center space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 max-w-xl mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider",
										children: "Doorstep Laundry in Kumasi"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 923,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "text-2xl sm:text-4xl font-extrabold text-foreground",
										children: [
											"Let Us Wash Your Clothes",
											" ",
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-primary italic font-serif",
												children: "For You"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 928,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 926,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs sm:text-sm text-muted-foreground",
										children: "Book a pickup in 30 seconds. Pay only when your clothes are clean."
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 930,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 922,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col sm:flex-row items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									onClick: handleBookingTrigger,
									className: "h-12 sm:h-13 px-8 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg gap-2 w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Book a Doorstep Pickup" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 940,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 941,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 936,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "tel:0532331150",
									className: "h-12 sm:h-13 px-6 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/30 text-foreground text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-all shadow-xs w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "w-4 h-4 text-sky-600 dark:text-sky-400" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 948,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Call Rider: 053 233 1150" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 949,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 944,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 935,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 921,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 920,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 521,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "border-t border-border bg-card/60 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-center gap-2 font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
						src: affordable_laundry_icon_default,
						alt: "Affordable Laundry KNUST Kumasi Brand Icon",
						loading: "lazy",
						className: "w-6 h-6 rounded-lg"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 959,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Affordable Laundry Kumasi" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 965,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 958,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "© 2026 Affordable Laundry Service. Clean Clothes & Fast Pickup in KNUST, Kumasi." }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 967,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 957,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				"aria-label": "Mobile Bottom Navigation Dock",
				className: "md:hidden fixed bottom-4 inset-x-3 max-w-sm mx-auto z-40",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative bg-slate-950/95 dark:bg-black/95 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/60 rounded-full p-1.5 px-2.5 flex items-center justify-between ring-1 ring-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "#services",
							onClick: (e) => {
								e.preventDefault();
								scrollToSection("services");
							},
							className: `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 no-underline ${activeSection === "services" ? "bg-white/15 text-sky-400 font-bold" : "text-white/80 hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(WashingMachine, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 989,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] font-bold tracking-tight mt-0.5",
									children: "Services"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 990,
									columnNumber: 13
								}, this),
								activeSection === "services" && /* @__PURE__ */ (void 0)("span", { className: "absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 992,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 977,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "#pricing",
							onClick: (e) => {
								e.preventDefault();
								scrollToSection("pricing");
							},
							className: `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 no-underline ${activeSection === "pricing" ? "bg-white/15 text-sky-400 font-bold" : "text-white/80 hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shirt, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1009,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] font-bold tracking-tight mt-0.5",
									children: "Pricing"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1010,
									columnNumber: 13
								}, this),
								activeSection === "pricing" && /* @__PURE__ */ (void 0)("span", { className: "absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1012,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 997,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: handleBookingTrigger,
							className: "group relative -my-1.5 px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-md shadow-sky-500/30 flex items-center gap-1.5 active:scale-95 transition-all duration-200 border border-white/30",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "w-5 h-5 rounded-full bg-white/20 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-3.5 h-3.5 text-white" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1023,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1022,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "tracking-wide",
								children: "Book"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1025,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1017,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "#location",
							onClick: (e) => {
								e.preventDefault();
								scrollToSection("location");
							},
							className: `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 active:scale-95 no-underline ${activeSection === "location" ? "bg-white/15 text-sky-400 font-bold" : "text-white/80 hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1041,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] font-bold tracking-tight mt-0.5",
									children: "Map"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1042,
									columnNumber: 13
								}, this),
								activeSection === "location" && /* @__PURE__ */ (void 0)("span", { className: "absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sky-400" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1044,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1029,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: DEFAULT_WHATSAPP_LINK,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "Chat on WhatsApp",
							className: "relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-emerald-400 hover:text-emerald-300 transition-all duration-200 active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1056,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] font-bold tracking-tight mt-0.5",
								children: "WhatsApp"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1057,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1049,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 975,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 971,
				columnNumber: 7
			}, this),
			bookingOpen && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in",
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) setBookingOpen(false);
				},
				children: /* @__PURE__ */ (void 0)("div", {
					className: "relative w-full max-w-lg bg-card/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto space-y-5",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between pb-3 border-b border-border",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (void 0)("img", {
								src: "/assets/affordable-laundry-icon-Um_gUXQQ.jpg",
								alt: "Affordable Laundry",
								className: "w-10 h-10 rounded-2xl object-cover border border-primary/20"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1073,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-primary",
								children: "Easy Booking"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1079,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("h3", {
								className: "text-lg sm:text-xl font-black text-foreground",
								children: bookingComplete ? "Pickup Booked!" : "Book Clothes Pickup"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1082,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1078,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 1072,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							onClick: () => setBookingOpen(false),
							className: "p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted",
							"aria-label": "Close booking popup",
							children: /* @__PURE__ */ (void 0)(X, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1092,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 1087,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1071,
						columnNumber: 13
					}, this), bookingComplete && latestBooking ? /* @__PURE__ */ (void 0)("div", {
						className: "text-center py-4 space-y-4",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner",
								children: /* @__PURE__ */ (void 0)(MessageCircle, { className: "w-8 h-8" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1099,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1098,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h4", {
								className: "text-xl font-black text-foreground tracking-tight",
								children: "Booking Sent to WhatsApp!"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1102,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
								children: [
									"Pickup ",
									/* @__PURE__ */ (void 0)("strong", { children: ["#", latestBooking.id] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1106,
										columnNumber: 28
									}, this),
									" has been prepared for",
									" ",
									/* @__PURE__ */ (void 0)("strong", { children: latestBooking.customer }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1107,
										columnNumber: 21
									}, this),
									" on",
									" ",
									/* @__PURE__ */ (void 0)("strong", { children: latestBooking.date }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1108,
										columnNumber: 21
									}, this),
									" at",
									" ",
									/* @__PURE__ */ (void 0)("strong", { children: latestBooking.location }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1109,
										columnNumber: 21
									}, this),
									"."
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1105,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1101,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "p-4 rounded-2xl bg-muted/40 border border-border text-xs flex justify-between font-bold",
								children: [/* @__PURE__ */ (void 0)("span", { children: "Estimated Total:" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1114,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "text-emerald-600 dark:text-emerald-400 text-base",
									children: ["GHC ", latestBooking.total]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1115,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1113,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex flex-col gap-2.5 pt-2",
								children: [/* @__PURE__ */ (void 0)("a", {
									href: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`🧺 *New Laundry Pickup Request - Affordable Laundry*\n\n*Order ID:* #${latestBooking.id}\n*Customer:* ${latestBooking.customer}\n*Phone:* ${latestBooking.phone}\n*Pickup Location:* ${latestBooking.location}\n*Pickup Date:* ${latestBooking.date}\n\n*Estimated Total:* GHC ${latestBooking.total}\n\nHello Affordable Laundry, please confirm my pickup schedule. Thank you!`)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "w-full h-12 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98",
									children: [/* @__PURE__ */ (void 0)(MessageCircle, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 1136,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", { children: [
										"Open WhatsApp Chat (",
										WHATSAPP_DISPLAY,
										")"
									] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1137,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1121,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									onClick: () => {
										setBookingOpen(false);
										setBookingComplete(false);
									},
									className: "w-full rounded-2xl text-xs font-bold h-11",
									children: "Done"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1139,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1120,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1097,
						columnNumber: 15
					}, this) : /* @__PURE__ */ (void 0)("form", {
						onSubmit: submitBooking,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex justify-between font-bold text-foreground",
									children: [/* @__PURE__ */ (void 0)("span", { children: [
										"Selected Clothes (",
										itemCount,
										" ",
										itemCount === 1 ? "piece" : "pieces",
										")"
									] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1156,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-primary text-sm",
										children: ["Total: GHC ", total]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1159,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1155,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "space-y-2 max-h-40 overflow-y-auto pr-1",
									children: laundryItems.map((item) => /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border",
										children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-bold text-foreground block",
											children: item.name
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 1168,
											columnNumber: 27
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"GHC ",
												item.price,
												" each"
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 1169,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 1167,
											columnNumber: 25
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => changeQuantity(item.id, -1),
													className: "w-6 h-6 rounded-md bg-card border border-border font-bold text-xs",
													children: "-"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 1174,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("span", {
													className: "w-5 text-center font-bold",
													children: quantities[item.id] ?? 0
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 1181,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: () => changeQuantity(item.id, 1),
													className: "w-6 h-6 rounded-md bg-card border border-border font-bold text-xs",
													children: "+"
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 1184,
													columnNumber: 27
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 1173,
											columnNumber: 25
										}, this)]
									}, item.id, true, {
										fileName: _jsxFileName$1,
										lineNumber: 1163,
										columnNumber: 23
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1161,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1154,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block font-bold text-foreground mb-1",
									children: "Your Name"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1200,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("input", {
									name: "name",
									required: true,
									defaultValue: latestBooking?.customer || "",
									placeholder: "e.g. Kwame Mensah",
									className: "w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1201,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1199,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "block font-bold text-foreground mb-1",
									children: "Phone Number"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1210,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("input", {
									name: "phone",
									required: true,
									type: "tel",
									defaultValue: latestBooking?.phone || "",
									placeholder: "053 233 1150",
									className: "w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1211,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1209,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1198,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold text-foreground mb-1",
								children: "Pickup Location (Hall, Hostel, or Address)"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1224,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)(PlacesAutocomplete, {
								name: "location",
								required: true,
								value: typedLocation,
								onChange: (val) => setTypedLocation(val),
								placeholder: "Type hall, hostel, or room (e.g. Unity Hall Rm 24)"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1227,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1223,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "block font-bold text-foreground mb-1",
								children: "Pickup Date"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1237,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("input", {
								name: "date",
								type: "date",
								required: true,
								defaultValue: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
								className: "w-full h-11 px-3 rounded-2xl border border-input bg-background text-foreground text-base sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 1238,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1236,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2",
								children: [/* @__PURE__ */ (void 0)(Check, { className: "w-4 h-4 shrink-0 text-emerald-500" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1248,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Free pickup and delivery in KNUST. Our rider will call your phone when coming." }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1249,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1247,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								type: "submit",
								className: "w-full h-12 rounded-2xl text-xs font-black shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (void 0)(MessageCircle, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 1258,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", { children: ["Send Pickup Request via WhatsApp · GHC ", total] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 1259,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 1254,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 1152,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 1070,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 1064,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 310,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function Index() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LaundryApp, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 3,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
