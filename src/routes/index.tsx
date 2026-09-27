import { createFileRoute } from "@tanstack/react-router";
import { LaundryApp } from "@/components/laundry-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affordable Laundry Service — Mobile App" },
      { name: "description", content: "Book, price and track affordable laundry pickup and delivery around KNUST, Kumasi." },
      { property: "og:title", content: "Affordable Laundry Service — Mobile App" },
      { property: "og:description", content: "A mobile laundry booking experience with GH₵13/kg pricing and pickup around KNUST." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LaundryApp />;
}
