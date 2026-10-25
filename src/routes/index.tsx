import { createFileRoute } from "@tanstack/react-router";
import { LaundryApp } from "@/components/laundry-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        name: "description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
      },
      { property: "og:site_name", content: "Affordable Laundry" },
      { property: "og:title", content: "Affordable Laundry KNUST & Kumasi | Pickup & Delivery" },
      {
        property: "og:description",
        content:
          "Affordable laundry pickup and delivery for KNUST students and Kumasi residents, simple per-item prices, fast return.",
      },
      { property: "og:type", content: "website" },
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
    ],
  }),
  component: Index,
});

function Index() {
  return <LaundryApp />;
}
