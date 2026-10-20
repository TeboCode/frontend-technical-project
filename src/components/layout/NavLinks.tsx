import Link from "next/link";
import { mainNav } from "@/config/navigation";

type NavLinksProps = {
  className?: string;
  linkClassName?: string;
};

export function NavLinks({ className = "", linkClassName = "" }: NavLinksProps) {
  return (
    <ul className={className}>
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`text-sm text-heading transition-colors hover:text-brand ${linkClassName}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
