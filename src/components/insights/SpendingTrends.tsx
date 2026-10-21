import { Panel } from "@/components/ui/Panel";
import { formatCurrency, formatMonth, formatNumber } from "@/lib/format";
import type { MonthlyTrend } from "@/lib/insights/types";
import { SpendingTrendChart } from "./charts/SpendingTrendChart";

type SpendingTrendsProps = {
  trends: MonthlyTrend[];
  currency: string;
};

export function SpendingTrends({ trends, currency }: SpendingTrendsProps) {
  return (
    <Panel id="trends" title="Monthly spending trends" description="Total spent per month">
      <div aria-hidden="true">
        <SpendingTrendChart trends={trends} currency={currency} />
      </div>

      {/* Text alternative to the chart for screen readers and crawlers.
          `sr-only` sits on a wrapper because tables ignore its 1px width and
          would otherwise stretch the page sideways. */}
      <div className="sr-only">
        <table>
          <caption>Monthly spending trends</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Total spent</th>
              <th scope="col">Transactions</th>
              <th scope="col">Average transaction</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend) => (
              <tr key={trend.month}>
                <th scope="row">{formatMonth(trend.month, "long")}</th>
                <td>{formatCurrency(trend.totalSpent, currency)}</td>
                <td>{formatNumber(trend.transactionCount)}</td>
                <td>{formatCurrency(trend.averageTransaction, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
