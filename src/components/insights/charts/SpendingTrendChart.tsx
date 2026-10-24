"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatMonth } from "@/lib/format";
import type { MonthlyTrend } from "@/lib/insights/types";

type SpendingTrendChartProps = {
  trends: MonthlyTrend[];
  currency: string;
};

const compactCurrency = (value: number) =>
  `R${new Intl.NumberFormat("en-ZA", { notation: "compact" }).format(value)}`;

export function SpendingTrendChart({ trends, currency }: SpendingTrendChartProps) {
  return (
    <div className="h-64 w-full sm:h-72">
      <BarChart
        responsive
        // The parent renders an equivalent data table, so keep the chart out of the tab order.
        accessibilityLayer={false}
        data={trends}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        style={{ width: "100%", height: "100%" }}
      >
        <CartesianGrid vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tickFormatter={(month: string) => formatMonth(month)}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#5f6368", fontSize: 12 }}
        />
        <YAxis
          tickFormatter={compactCurrency}
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fill: "#5f6368", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(67, 160, 71, 0.08)" }}
          labelFormatter={(month) => formatMonth(String(month), "long")}
          formatter={(value) => [formatCurrency(Number(value), currency), "Total spent"]}
        />
        <Bar
          dataKey="totalSpent"
          fill="var(--color-brand)"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
          isAnimationActive={false}
        />
      </BarChart>
    </div>
  );
}
