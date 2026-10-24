// Response shapes for the Customer Spending Insights API.

export type Period = "7d" | "30d" | "90d" | "1y";

export type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export type CategoryIcon =
  | "shopping-cart"
  | "film"
  | "car"
  | "utensils"
  | "shopping-bag"
  | "zap";

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type CustomerProfile = {
  customerId: string;
  name: string;
  email: string;
  joinDate: string;
  accountType: string;
  totalSpent: number;
  currency: string;
};

export type SpendingSummary = {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: {
    spentChange: number;
    transactionChange: number;
  };
};

export type CategorySpending = {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: CategoryIcon;
};

export type SpendingByCategory = {
  dateRange: DateRange;
  totalAmount: number;
  categories: CategorySpending[];
};

export type MonthlyTrend = {
  month: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
};

export type SpendingTrends = {
  trends: MonthlyTrend[];
};

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: CategoryIcon;
  categoryColor: string;
};

export type Pagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type TransactionList = {
  transactions: Transaction[];
  pagination: Pagination;
};

export type GoalStatus = "on_track" | "warning" | "exceeded";

export type SpendingGoal = {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
};

export type SpendingGoals = {
  goals: SpendingGoal[];
};

export type FilterCategory = {
  name: string;
  color: string;
  icon: CategoryIcon;
};

export type DateRangePreset = {
  label: string;
  value: Period;
};

export type InsightFilters = {
  categories: FilterCategory[];
  dateRangePresets: DateRangePreset[];
};

export type TransactionQuery = {
  limit?: number;
  offset?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: SortBy;
};
