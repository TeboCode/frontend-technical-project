import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const { company, copyrightYear, trademarkNotice } = siteConfig.legal;

  return (
    <footer className="border-t border-line bg-card">
      <div className="container-page flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-xs text-body">
          &copy; {copyrightYear} {company}. All rights reserved. {trademarkNotice}
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-heading transition-colors hover:text-brand-dark hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
