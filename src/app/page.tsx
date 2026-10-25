import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata(routes.home, {
  title: siteConfig.title,
  description: siteConfig.description,
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
