import { Panel } from "@/components/ui/Panel";
import {
  getCustomerProfile,
  getInsightFilters,
  getSpendingByCategory,
  getSpendingGoals,
  getSpendingSummary,
  getSpendingTrends,
  getTransactions,
} from "@/lib/insights/api";
import {
  parsePeriod,
  parseTransactionQuery,
  type RawSearchParams,
} from "@/lib/insights/search-params";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { PeriodFilter } from "./PeriodFilter";
import { ProfileOverview } from "./ProfileOverview";
import { SpendingGoals } from "./SpendingGoals";
import { SpendingTrends } from "./SpendingTrends";
import { SummaryCards } from "./SummaryCards";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionsPagination } from "./TransactionsPagination";
import { TransactionsTable } from "./TransactionsTable";

type InsightsDashboardProps = {
  customerId: string;
  searchParams: Promise<RawSearchParams>;
};

export async function InsightsDashboard({ customerId, searchParams }: InsightsDashboardProps) {
  const params = await searchParams;
  const period = parsePeriod(params);

  const [profile, filters] = await Promise.all([
    getCustomerProfile(customerId),
    getInsightFilters(customerId),
  ]);
  const transactionQuery = parseTransactionQuery(
    params,
    filters.categories.map((category) => category.name),
  );

  const [summary, categories, trends, transactionList, goals] = await Promise.all([
    getSpendingSummary(customerId, period),
    getSpendingByCategory(customerId, { period }),
    getSpendingTrends(customerId),
    getTransactions(customerId, transactionQuery),
    getSpendingGoals(customerId),
  ]);

  const { currency } = profile;
  const periodLabel =
    filters.dateRangePresets.find((preset) => preset.value === period)?.label ?? period;

  return (
    <div className="space-y-6">
      <ProfileOverview profile={profile} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-heading">
          Showing: <span className="text-body">{periodLabel}</span>
        </p>
        <PeriodFilter
          presets={filters.dateRangePresets}
          activePeriod={period}
          searchParams={params}
        />
      </div>

      <SummaryCards summary={summary} currency={currency} periodLabel={periodLabel} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBreakdown data={categories} currency={currency} />
        <SpendingTrends trends={trends.trends} currency={currency} />
      </div>

      <SpendingGoals goals={goals.goals} currency={currency} />

      <Panel id="transactions" title="Transactions" description="Filter, sort and browse your activity">
        <TransactionFilters
          categories={filters.categories}
          query={transactionQuery}
          period={period}
        />
        <div className="mt-5">
          <TransactionsTable transactions={transactionList.transactions} currency={currency} />
          <TransactionsPagination pagination={transactionList.pagination} searchParams={params} />
        </div>
      </Panel>
    </div>
  );
}
