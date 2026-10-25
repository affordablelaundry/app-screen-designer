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
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      },
      { title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
      },
      { name: "author", content: "Affordable Laundry" },
      { name: "theme-color", content: "#0284c7" },
      { property: "og:site_name", content: "Affordable Laundry" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        property: "og:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:secure_url", content: "/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Clean folded laundry delivered to a KNUST hostel" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "twitter:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
      { name: "twitter:image:alt", content: "Clean folded laundry delivered to a KNUST hostel" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "DryCleaningOrLaundry",
          name: "Affordable Laundry KNUST & Kumasi",
          image: "/og-image.jpg",
          description:
            "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
          telephone: "+233532331150",
          priceRange: "GHC 4 - GHC 25",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ayeduase, near KNUST Ayeduase Gate",
            addressLocality: "Kumasi",
            addressRegion: "Ashanti Region",
            addressCountry: "GH",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "07:00",
              closes: "20:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Sunday",
              opens: "10:00",
              closes: "18:00",
            },
          ],
          areaServed: [
            "KNUST campus",
            "Ayeduase",
            "Kotei",
            "Bomso",
            "Boadi",
            "Oforikrom",
            "Kumasi",
          ],
        },
      },
    ],
    links: [
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

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
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
