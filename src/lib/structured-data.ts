import type { Destination } from "@/lib/destinations";
import { siteConfig } from "@/lib/site";

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export function destinationSchema(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.summary,
    url: absolute(`/destinations/${destination.slug}`),
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.coordinates.lat,
      longitude: destination.coordinates.lng,
    },
    containedInPlace: { "@type": "Country", name: "Maldives" },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
