import type { MetadataRoute } from "next";

import { destinations } from "@/lib/destinations";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  return [
    { url: url("/"), priority: 1 },
    { url: url("/destinations"), priority: 0.9 },
    { url: url("/plan"), priority: 0.6 },
    ...destinations.map((destination) => ({
      url: url(`/destinations/${destination.slug}`),
      priority: 0.8,
    })),
  ];
}
