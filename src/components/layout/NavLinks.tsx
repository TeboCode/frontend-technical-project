"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";

type NavLinksProps = {
  className?: string;
  linkClassName?: string;
};

export function NavLinks({ className = "", linkClassName = "" }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {mainNav.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`text-sm transition-colors hover:text-brand ${
                isActive ? "font-medium text-brand-dark" : "text-heading"
              } ${linkClassName}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
