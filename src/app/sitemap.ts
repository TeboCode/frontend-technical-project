import type { MetadataRoute } from "next";
import { publicPages } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Served at /sitemap.xml. No lastModified/changeFrequency/priority: search
// engines ignore guessed values, and accurate dates aren't tracked yet.
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: new URL(page.href, siteConfig.url).toString(),
  }));
}
