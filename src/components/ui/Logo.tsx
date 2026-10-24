import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link href={routes.home} className="inline-flex shrink-0 items-center">
      {/* Dark mode: invert + hue-rotate lightens the dark wordmark while
          keeping the icon's blue/green hues. Swap for a dedicated dark logo
          asset when one exists. */}
      <Image
        src={logo}
        alt={`${siteConfig.name} home`}
        className="h-6 w-auto dark:hue-rotate-180 dark:invert"
        loading="eager"
      />
    </Link>
  );
}
