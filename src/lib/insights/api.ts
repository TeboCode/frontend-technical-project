// Data access for the Customer Spending Insights dashboard.
//
// Each function mirrors one endpoint in CustomerSpendingInsightsEndpoints.md
// and currently resolves mock data. To connect the real API, replace the body
// of each function with a fetch to the matching endpoint — callers and types
// stay the same.

import {
  mockCategories,
  mockFilters,
  mockGoals,
  mockProfile,
  mockSummary,
  mockTransactions,
  mockTrends,
} from "./mock-data";
import type {
  CustomerProfile,
  InsightFilters,
  Period,
  SpendingByCategory,
  SpendingGoals,
  SpendingSummary,
  SpendingTrends,
  TransactionList,
  TransactionQuery,
} from "./types";

const DEFAULT_PERIOD: Period = "30d";
const PERIOD_DAYS: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

// The mock data describes 30 days ending on this date.
const MOCK_TODAY = "2024-09-16";
const MOCK_BASE_DAYS = 30;

const MAX_TRANSACTION_LIMIT = 100;
const DEFAULT_TRANSACTION_LIMIT = 20;

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

function shiftDate(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(startDate: string, endDate: string) {
  const ms = Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`);
  return Math.max(1, Math.round(ms / 86_400_000));
}

/** GET /api/customers/{customerId}/profile */
export async function getCustomerProfile(customerId: string): Promise<CustomerProfile> {
  return { ...mockProfile, customerId };
}

/** GET /api/customers/{customerId}/spending/summary?period={period} */
export async function getSpendingSummary(
  _customerId: string,
  period: Period = DEFAULT_PERIOD,
): Promise<SpendingSummary> {
  // Mock only: scale the 30-day sample so each period shows different figures.
  const scale = PERIOD_DAYS[period] / MOCK_BASE_DAYS;
  const transactionCount = Math.round(mockSummary.transactionCount * scale);
  const totalSpent = roundCurrency(mockSummary.totalSpent * scale);

  return {
    ...mockSummary,
    period,
    totalSpent,
    transactionCount,
    averageTransaction: roundCurrency(totalSpent / transactionCount),
  };
}

/** GET /api/customers/{customerId}/spending/categories?period=&startDate=&endDate= */
export async function getSpendingByCategory(
  _customerId: string,
  options: { period?: Period; startDate?: string; endDate?: string } = {},
): Promise<SpendingByCategory> {
  const period = options.period ?? DEFAULT_PERIOD;
  const endDate = options.endDate ?? MOCK_TODAY;
  const startDate = options.startDate ?? shiftDate(endDate, -PERIOD_DAYS[period]);

  // Mock only: scale the 30-day sample to the requested range.
  const scale = daysBetween(startDate, endDate) / MOCK_BASE_DAYS;

  return {
    dateRange: { startDate, endDate },
    totalAmount: roundCurrency(mockCategories.totalAmount * scale),
    categories: mockCategories.categories.map((category) => ({
      ...category,
      amount: roundCurrency(category.amount * scale),
      transactionCount: Math.max(1, Math.round(category.transactionCount * scale)),
    })),
  };
}

/** GET /api/customers/{customerId}/spending/trends?months={months} */
export async function getSpendingTrends(
  _customerId: string,
  months = 12,
): Promise<SpendingTrends> {
  const count = Math.min(Math.max(months, 1), 24);
  return { trends: mockTrends.trends.slice(-count) };
}

/** GET /api/customers/{customerId}/transactions?limit=&offset=&category=&startDate=&endDate=&sortBy= */
export async function getTransactions(
  _customerId: string,
  query: TransactionQuery = {},
): Promise<TransactionList> {
  const {
    category,
    startDate,
    endDate,
    sortBy = "date_desc",
    offset = 0,
  } = query;
  const limit = Math.min(Math.max(query.limit ?? DEFAULT_TRANSACTION_LIMIT, 1), MAX_TRANSACTION_LIMIT);

  const filtered = mockTransactions.filter((transaction) => {
    const day = transaction.date.slice(0, 10);
    if (category && transaction.category !== category) return false;
    if (startDate && day < startDate) return false;
    if (endDate && day > endDate) return false;
    return true;
  });

  const sorted = filtered.toSorted((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return a.date.localeCompare(b.date);
      case "amount_desc":
        return b.amount - a.amount;
      case "amount_asc":
        return a.amount - b.amount;
      default:
        return b.date.localeCompare(a.date);
    }
  });

  return {
    transactions: sorted.slice(offset, offset + limit),
    pagination: {
      total: sorted.length,
      limit,
      offset,
      hasMore: offset + limit < sorted.length,
    },
  };
}

/** GET /api/customers/{customerId}/goals */
export async function getSpendingGoals(_customerId: string): Promise<SpendingGoals> {
  return mockGoals;
}

/** GET /api/customers/{customerId}/filters */
export async function getInsightFilters(_customerId: string): Promise<InsightFilters> {
  return mockFilters;
}
