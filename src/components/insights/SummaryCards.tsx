import { Receipt, Tag, TrendingDown, TrendingUp, Wallet, Calculator, type LucideIcon } from "lucide-react";
import { formatChange, formatCurrency, formatNumber } from "@/lib/format";
import type { SpendingSummary } from "@/lib/insights/types";

type SummaryCardsProps = {
  summary: SpendingSummary;
  currency: string;
  periodLabel: string;
};

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: number;
  // For spending, an increase is unfavourable.
  increaseIsGood?: boolean;
};

export function SummaryCards({ summary, currency, periodLabel }: SummaryCardsProps) {
  const stats: Stat[] = [
    {
      label: "Total spent",
      value: formatCurrency(summary.totalSpent, currency),
      icon: Wallet,
      change: summary.comparedToPrevious.spentChange,
      increaseIsGood: false,
    },
    {
      label: "Transactions",
      value: formatNumber(summary.transactionCount),
      icon: Receipt,
      change: summary.comparedToPrevious.transactionChange,
      increaseIsGood: false,
    },
    {
      label: "Average transaction",
      value: formatCurrency(summary.averageTransaction, currency),
      icon: Calculator,
    },
    {
      label: "Top category",
      value: summary.topCategory,
      icon: Tag,
    },
  ];

  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">
        Spending summary for the {periodLabel.toLowerCase()}
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col rounded-md bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:p-5"
          >
            <dt className="flex items-center gap-2 text-xs text-body sm:text-sm">
              <stat.icon aria-hidden="true" className="size-4 shrink-0 text-brand" />
              {stat.label}
            </dt>
            <dd className="mt-2 break-words text-lg font-semibold text-heading sm:text-2xl">
              {stat.value}
            </dd>
            {stat.change !== undefined && (
              <dd className="mt-1">
                <ChangeIndicator value={stat.change} increaseIsGood={stat.increaseIsGood} />
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

function ChangeIndicator({ value, increaseIsGood = true }: { value: number; increaseIsGood?: boolean }) {
  const isIncrease = value >= 0;
  const isGood = isIncrease === increaseIsGood;
  const Icon = isIncrease ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex flex-wrap items-center gap-1 text-xs font-medium ${
        isGood ? "text-brand-dark" : "text-danger"
      }`}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {formatChange(value)}
      {/* Visible from `sm` up; always announced to screen readers. */}
      <span className="sr-only font-normal text-body sm:not-sr-only">vs previous period</span>
    </span>
  );
}
