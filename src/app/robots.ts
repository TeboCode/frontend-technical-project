import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Served at /robots.txt. Private pages such as /insights are NOT disallowed
// here on purpose: they carry a `noindex` robots meta tag (see lib/seo), and
// crawlers can only see that tag if they're allowed to fetch the page. A
// robots.txt block would leave the bare URL indexable.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
