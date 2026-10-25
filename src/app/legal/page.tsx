import { LegalSection } from "@/components/legal/LegalSection";
import { routes } from "@/config/navigation";
import { legalLastUpdated, legalSections } from "@/lib/legal/content";
import { publicPageMetadata } from "@/lib/seo";

// Title and description come from publicPages, shared with sitemap and llms.txt.
export const metadata = publicPageMetadata(routes.legal);

// UTC so the date can't shift a day depending on the server's time zone.
const lastUpdatedLabel = new Intl.DateTimeFormat("en-ZA", { dateStyle: "long", timeZone: "UTC" }).format(
  new Date(`${legalLastUpdated}T00:00:00Z`),
);

export default function LegalPage() {
  return (
    <div className="bg-surface">
      <div className="container-page py-8 md:py-10">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Legal</h1>
          <p className="mt-1 text-sm text-body">
            Our terms of use, how we handle your information and what our tools can and can&apos;t
            tell you.
          </p>
          <p className="mt-2 text-xs text-body">
            Last updated: <time dateTime={legalLastUpdated}>{lastUpdatedLabel}</time>
          </p>
        </header>

        {/* minmax(0, 1fr) on mobile too, so the cookie table scrolls inside its
            card instead of stretching the column past the screen. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start">
          <nav
            aria-labelledby="legal-contents-heading"
            className="rounded-md bg-card p-5 shadow-card lg:sticky lg:top-6"
          >
            <h2 id="legal-contents-heading" className="text-sm font-semibold text-heading">
              On this page
            </h2>
            <ol className="mt-3 space-y-2 text-sm">
              {legalSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-body transition-colors hover:text-brand-dark hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-4">
            {legalSections.map((section) => (
              <LegalSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
