import { Panel } from "@/components/ui/Panel";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SpendingByCategory } from "@/lib/insights/types";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryDonutChart } from "./charts/CategoryDonutChart";

type CategoryBreakdownProps = {
  data: SpendingByCategory;
  currency: string;
};

export function CategoryBreakdown({ data, currency }: CategoryBreakdownProps) {
  const { startDate, endDate } = data.dateRange;

  return (
    <Panel
      id="categories"
      title="Spending by category"
      description={`${formatDate(startDate)} – ${formatDate(endDate)}`}
    >
      <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,220px)_1fr]">
        {/* The list below carries the same data as text, so the chart is decorative. */}
        <div aria-hidden="true">
          <CategoryDonutChart
            categories={data.categories}
            total={data.totalAmount}
            currency={currency}
          />
        </div>

        <ul className="divide-y divide-line">
          {data.categories.map((category) => (
            <li key={category.name} className="flex items-center gap-3 py-2.5">
              <CategoryIcon icon={category.icon} color={category.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">{category.name}</p>
                <p className="text-xs text-body">
                  {category.transactionCount} transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-heading">
                  {formatCurrency(category.amount, currency)}
                </p>
                <p className="text-xs text-body">{category.percentage.toFixed(1)}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
