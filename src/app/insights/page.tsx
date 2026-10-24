import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/insights/DashboardSkeleton";
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";
import { MOCK_CUSTOMER_ID } from "@/config/customer";

export const metadata: Metadata = {
  title: "Spending Insights",
  description:
    "Track your spending by category, follow monthly trends, monitor budgets and review recent transactions.",
};

export default function InsightsPage({ searchParams }: PageProps<"/insights">) {
  return (
    <div className="bg-surface">
      <div className="container-page py-8 md:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-heading sm:text-3xl">Spending Insights</h1>
          <p className="mt-1 text-sm text-body">
            Understand where your money goes and spot trends over time.
          </p>
        </header>

        {/* Search params are request-time data, so the dashboard streams in behind a skeleton. */}
        <Suspense fallback={<DashboardSkeleton />}>
          <InsightsDashboard customerId={MOCK_CUSTOMER_ID} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
