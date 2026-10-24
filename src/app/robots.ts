import type { MetadataRoute } from "next";
import { privateRoutes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Served at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privateRoutes,
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
