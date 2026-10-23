import { createFileRoute } from "@tanstack/react-router";
import { LaundryApp } from "@/components/laundry-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Affordable Laundry" },
      { property: "og:locale", content: "en_GH" },
      { property: "og:url", content: "https://affordable-laundry.vercel.app/" },
      { property: "og:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        property: "og:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://affordable-laundry.vercel.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "twitter:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents. Simple per-item prices, free campus pickup, fresh clothes returned fast.",
      },
      { name: "twitter:image", content: "https://affordable-laundry.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://affordable-laundry.vercel.app/" }],
  }),
  component: Index,
});

function Index() {
  return <LaundryApp />;
}
