import { BranchLocator } from "@/components/branches/BranchLocator";
import { JsonLd } from "@/components/seo/JsonLd";
import { routes } from "@/config/navigation";
import { getBranches } from "@/lib/branches/api";
import { branchesJsonLd } from "@/lib/branches/structured-data";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata(routes.branchLocator);

export default async function BranchLocatorPage() {
  const branches = await getBranches();

  return (
    <div className="bg-surface">
      {/* Structured data so search engines can show branch locations and hours. */}
      <JsonLd data={branchesJsonLd(branches)} />
      <div className="container-page py-8 md:py-10">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Branch Locator</h1>
          <p className="mt-1 text-sm text-body">
            Find a branch near you for in-person banking services and assistance.
          </p>
        </header>

        <BranchLocator branches={branches} />
      </div>
    </div>
  );
}
