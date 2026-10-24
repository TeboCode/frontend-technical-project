// Parses and validates the dashboard's URL search params so that only known
// values ever reach the data layer.

import type { Period, SortBy, TransactionQuery } from "./types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const PERIODS: readonly Period[] = ["7d", "30d", "90d", "1y"];

export const SORT_OPTIONS: readonly { value: SortBy; label: string }[] = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Highest amount" },
  { value: "amount_asc", label: "Lowest amount" },
];

export const TRANSACTIONS_PAGE_SIZE = 10;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]) {
  return allowed.find((option) => option === value);
}

function parseDate(value: string | undefined) {
  return value && DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
    ? value
    : undefined;
}

export function parsePeriod(params: RawSearchParams): Period {
  return oneOf(first(params.period), PERIODS) ?? "30d";
}

export function parseTransactionQuery(
  params: RawSearchParams,
  allowedCategories: readonly string[],
): Required<Pick<TransactionQuery, "limit" | "offset" | "sortBy">> & TransactionQuery {
  const offset = Number.parseInt(first(params.offset) ?? "", 10);

  return {
    category: oneOf(first(params.category), allowedCategories),
    startDate: parseDate(first(params.startDate)),
    endDate: parseDate(first(params.endDate)),
    sortBy:
      oneOf(first(params.sortBy), SORT_OPTIONS.map((option) => option.value)) ??
      "date_desc",
    limit: TRANSACTIONS_PAGE_SIZE,
    offset: Number.isFinite(offset) && offset > 0 ? offset : 0,
  };
}

/** Builds `pathname` + the current params with `updates` applied; `undefined` removes a key. */
export function buildHref(
  pathname: string,
  params: RawSearchParams,
  updates: Record<string, string | number | undefined>,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const single = first(value);
    if (single) query.set(key, single);
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") query.delete(key);
    else query.set(key, String(value));
  }
  const search = query.toString();
  return search ? `${pathname}?${search}` : pathname;
}
