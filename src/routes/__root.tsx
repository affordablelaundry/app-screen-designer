import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  console.error(normalizedError);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(normalizedError, { boundary: "tanstack_root_error_component" });
  }, [normalizedError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
      },
      { title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "googlef7d1d9fcdf676f52" },
      { name: "author", content: "Affordable Laundry Service" },
      { name: "theme-color", content: "#0284c7" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Affordable Laundry" },
      { property: "og:locale", content: "en_GH" },
      { property: "og:url", content: "https://affordable-laundry.vercel.app/" },
      { property: "og:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        property: "og:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { property: "og:image", content: "https://affordable-laundry.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Affordable Laundry Service KNUST Kumasi" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "twitter:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { name: "twitter:image", content: "https://affordable-laundry.vercel.app/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://affordable-laundry.vercel.app/" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/favicon.jpg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LaundryService",
      "@id": "https://affordable-laundry.vercel.app/#service",
      name: "Affordable Laundry",
      alternateName: "Affordable Laundry KNUST",
      url: "https://affordable-laundry.vercel.app/",
      logo: "https://affordable-laundry.vercel.app/favicon.jpg",
      image: "https://affordable-laundry.vercel.app/og-image.jpg",
      description:
        "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      telephone: "+233532331150",
      priceRange: "GH₵4 - GH₵50",
      paymentAccepted: "Cash, Mobile Money (MTN MoMo, Telecel Cash)",
      currenciesAccepted: "GHS",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ayeduase Road near KNUST Campus",
        addressLocality: "Kumasi",
        addressRegion: "Ashanti Region",
        addressCountry: "GH",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.6752325,
        longitude: -1.5620578,
      },
      hasMap: "https://maps.app.goo.gl/V6eX9v3zBjmZy7EV7",
      areaServed: [
        { "@type": "AdministrativeArea", name: "KNUST Campus" },
        { "@type": "AdministrativeArea", name: "Ayeduase" },
        { "@type": "AdministrativeArea", name: "Kotei" },
        { "@type": "AdministrativeArea", name: "Bomso" },
        { "@type": "AdministrativeArea", name: "Boadi" },
        { "@type": "AdministrativeArea", name: "Oforikrom" },
        { "@type": "City", name: "Kumasi" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "07:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://affordable-laundry.vercel.app/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does laundry cost at KNUST?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We charge simple, transparent per-item prices starting from only GH₵4 per cloth (GH₵4 for T-shirts, GH₵5 for dress shirts, GH₵6 for trousers/jeans). There are no heavy weighing scales or surprise fees.",
          },
        },
        {
          "@type": "Question",
          name: "How long does laundry pickup and delivery take in Kumasi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Garments are washed clean, dried, steam ironed smooth, and returned in protective packaging within 24 to 48 hours (1 to 2 days) to your doorstep.",
          },
        },
        {
          "@type": "Question",
          name: "Do you pick up from student hostels and halls around KNUST?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Our dispatch riders offer free doorstep collection and return at all traditional KNUST halls (Unity/Conti, University/Katanga, Republic, Queen Elizabeth II, Independence, Africa) and student hostels across Ayeduase, Kotei, Bomso, Boadi, and Gaza.",
          },
        },
        {
          "@type": "Question",
          name: "Which areas in Kumasi do you cover for laundry pickup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We cover KNUST campus, Ayeduase, Kotei, Bomso, Boadi, Oforikrom, Gyinyase, Kentinkrono, and surrounding Kumasi neighborhoods.",
          },
        },
        {
          "@type": "Question",
          name: "How do I pay for my laundry service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You only pay after your clothes are cleaned, ironed, and returned to your hands. We accept Mobile Money (MTN MoMo, Telecel Cash) and cash directly on delivery.",
          },
        },
        {
          "@type": "Question",
          name: "What items and garments do you wash and fold?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We wash all everyday student and household clothing including shirts, trousers, jeans, dresses, hoodies, bedsheets, duvet covers, lab coats, and native wear with gentle fabric care.",
          },
        },
      ],
    },
  ],
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GH">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Service Worker registration
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.debug(
              "Service Worker registered for Web Push background notifications:",
              reg.scope,
            );
          })
          .catch((err) => {
            console.debug("Service Worker registration notice:", err);
          });
      }

      // 2. Prevent mobile browser sticky zoom after typing in inputs
      const handleInputBlur = (e: FocusEvent) => {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          // Force layout reset
          window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" });
        }
      };

      document.addEventListener("blur", handleInputBlur, true);
      return () => {
        document.removeEventListener("blur", handleInputBlur, true);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
