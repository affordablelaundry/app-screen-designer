import { createFileRoute } from "@tanstack/react-router";
import { LaundryApp } from "@/components/laundry-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affordable Laundry — Premium Garment Care in Kumasi" },
      {
        name: "description",
        content:
          "Book premium laundry pickup and delivery around KNUST, Kumasi, with simple per-item garment pricing.",
      },
      { property: "og:title", content: "Affordable Laundry — Premium Garment Care in Kumasi" },
      {
        property: "og:description",
        content:
          "Expert garment care, transparent item pricing and convenient collection around KNUST.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LaundryApp />;
}
