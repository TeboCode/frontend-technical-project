import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link href={routes.home}className="inline-flex shrink-0 items-center">
      <Image
        src={logo}
        alt={`${siteConfig.name} home`}
        className="h-6 w-auto"
        loading="eager"
      />
    </Link>
  );
}
