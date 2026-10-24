"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";
import type { CategorySpending } from "@/lib/insights/types";
import { tooltipTheme } from "./chartTheme";

type CategoryDonutChartProps = {
  categories: CategorySpending[];
  total: number;
  currency: string;
};

export function CategoryDonutChart({ categories, total, currency }: CategoryDonutChartProps) {
  const data = categories.map((category) => ({
    name: category.name,
    value: category.amount,
    fill: category.color,
  }));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[200px] sm:max-w-[240px]">
      {/* The parent renders the same figures as a list, so keep the chart out of the tab order. */}
      <PieChart responsive accessibilityLayer={false} style={{ width: "100%", height: "100%" }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="100%"
          paddingAngle={2}
          stroke="none"
          isAnimationActive={false}
        />
        <Tooltip {...tooltipTheme} formatter={(value) => formatCurrency(Number(value), currency)} />
      </PieChart>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-body">Total</span>
        <span className="text-lg font-semibold text-heading">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  );
}
