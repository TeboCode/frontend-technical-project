import Form from "next/form";
import Link from "next/link";
import { routes } from "@/config/navigation";
import { SORT_OPTIONS } from "@/lib/insights/search-params";
import type { FilterCategory, Period, TransactionQuery } from "@/lib/insights/types";

type TransactionFiltersProps = {
  categories: FilterCategory[];
  query: TransactionQuery;
  period: Period;
};

const fieldClass =
  "mt-1 block w-full rounded-sm border border-black/15 bg-white px-3 py-2 text-sm text-heading focus:border-brand focus:outline-2 focus:outline-brand/30";

/**
 * A GET form: filters live in the URL, so results are shareable and the form
 * works without JavaScript. `next/form` adds client-side navigation on top.
 */
export function TransactionFilters({ categories, query, period }: TransactionFiltersProps) {
  return (
    <Form
      action={routes.insights}
      scroll={false}
      className="grid grid-cols-2 gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
    >
      {/* Keep the dashboard period when filtering transactions. */}
      <input type="hidden" name="period" value={period} />

      <label className="col-span-2 text-xs font-medium text-body sm:col-span-1">
        Category
        <select name="category" defaultValue={query.category ?? ""} className={fieldClass}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs font-medium text-body">
        From
        <input type="date" name="startDate" defaultValue={query.startDate} className={fieldClass} />
      </label>

      <label className="text-xs font-medium text-body">
        To
        <input type="date" name="endDate" defaultValue={query.endDate} className={fieldClass} />
      </label>

      <label className="col-span-2 text-xs font-medium text-body sm:col-span-1">
        Sort by
        <select name="sortBy" defaultValue={query.sortBy} className={fieldClass}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="col-span-2 flex items-end gap-2 lg:col-span-1">
        <button
          type="submit"
          className="flex-1 rounded-sm bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark lg:flex-none"
        >
          Apply
        </button>
        <Link
          href={`${routes.insights}?period=${period}`}
          scroll={false}
          className="rounded-sm px-3 py-2 text-sm text-heading hover:bg-surface"
        >
          Reset
        </Link>
      </div>
    </Form>
  );
}
