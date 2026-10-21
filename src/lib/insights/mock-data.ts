// Mock responses taken from CustomerSpendingInsightsEndpoints.md.
// Only used by ./api.ts — delete this file once the real API is connected.

import type {
  CustomerProfile,
  InsightFilters,
  SpendingByCategory,
  SpendingGoals,
  SpendingSummary,
  SpendingTrends,
  Transaction,
} from "./types";

export const mockProfile: CustomerProfile = {
  customerId: "12345",
  name: "John Doe",
  email: "john.doe@email.com",
  joinDate: "2023-01-15",
  accountType: "premium",
  totalSpent: 15420.5,
  currency: "ZAR",
};

export const mockSummary: SpendingSummary = {
  period: "30d",
  totalSpent: 4250.75,
  transactionCount: 47,
  averageTransaction: 90.44,
  topCategory: "Groceries",
  comparedToPrevious: {
    spentChange: 12.5,
    transactionChange: -3.2,
  },
};

export const mockCategories: SpendingByCategory = {
  dateRange: {
    startDate: "2024-08-16",
    endDate: "2024-09-16",
  },
  totalAmount: 4250.75,
  categories: [
    { name: "Groceries", amount: 1250.3, percentage: 29.4, transactionCount: 15, color: "#FF6B6B", icon: "shopping-cart" },
    { name: "Entertainment", amount: 890.2, percentage: 20.9, transactionCount: 8, color: "#4ECDC4", icon: "film" },
    { name: "Transportation", amount: 680.45, percentage: 16.0, transactionCount: 12, color: "#45B7D1", icon: "car" },
    { name: "Dining", amount: 520.3, percentage: 12.2, transactionCount: 9, color: "#F7DC6F", icon: "utensils" },
    { name: "Shopping", amount: 450.8, percentage: 10.6, transactionCount: 6, color: "#BB8FCE", icon: "shopping-bag" },
    { name: "Utilities", amount: 458.7, percentage: 10.8, transactionCount: 3, color: "#85C1E9", icon: "zap" },
  ],
};

export const mockTrends: SpendingTrends = {
  trends: [
    { month: "2024-01", totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
    { month: "2024-02", totalSpent: 4150.8, transactionCount: 38, averageTransaction: 109.23 },
    { month: "2024-03", totalSpent: 3750.6, transactionCount: 45, averageTransaction: 83.35 },
    { month: "2024-04", totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.7 },
    { month: "2024-05", totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
    { month: "2024-06", totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  ],
};

// The spec only provides two transactions; the rest are added so that
// filtering, sorting and pagination can be exercised.
export const mockTransactions: Transaction[] = [
  { id: "txn_123456", date: "2024-09-16T14:30:00Z", merchant: "Pick n Pay", category: "Groceries", amount: 245.8, description: "Weekly groceries", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123457", date: "2024-09-15T10:15:00Z", merchant: "Netflix", category: "Entertainment", amount: 199.0, description: "Monthly subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_123458", date: "2024-09-14T08:05:00Z", merchant: "Uber", category: "Transportation", amount: 87.5, description: "Ride to office", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_123459", date: "2024-09-13T19:40:00Z", merchant: "Ocean Basket", category: "Dining", amount: 312.6, description: "Dinner with friends", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_123460", date: "2024-09-12T12:20:00Z", merchant: "Woolworths", category: "Groceries", amount: 189.95, description: "Lunch and snacks", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123461", date: "2024-09-11T16:10:00Z", merchant: "Takealot", category: "Shopping", amount: 450.8, description: "Headphones", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_123462", date: "2024-09-10T07:00:00Z", merchant: "City Power", category: "Utilities", amount: 458.7, description: "Prepaid electricity", paymentMethod: "EFT", icon: "zap", categoryColor: "#85C1E9" },
  { id: "txn_123463", date: "2024-09-09T18:25:00Z", merchant: "Ster-Kinekor", category: "Entertainment", amount: 220.0, description: "Movie tickets", paymentMethod: "Debit Card", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_123464", date: "2024-09-08T09:45:00Z", merchant: "Shell", category: "Transportation", amount: 650.0, description: "Fuel", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_123465", date: "2024-09-07T13:15:00Z", merchant: "Checkers", category: "Groceries", amount: 532.4, description: "Monthly stock-up", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123466", date: "2024-09-06T20:00:00Z", merchant: "Mr D Food", category: "Dining", amount: 164.9, description: "Takeaway dinner", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_123467", date: "2024-09-05T11:30:00Z", merchant: "Spotify", category: "Entertainment", amount: 59.99, description: "Monthly subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_123468", date: "2024-09-04T08:20:00Z", merchant: "Gautrain", category: "Transportation", amount: 120.0, description: "Card top-up", paymentMethod: "Debit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_123469", date: "2024-09-03T15:50:00Z", merchant: "Mr Price", category: "Shopping", amount: 299.99, description: "Clothing", paymentMethod: "Debit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_123470", date: "2024-09-02T12:05:00Z", merchant: "Nando's", category: "Dining", amount: 145.5, description: "Lunch", paymentMethod: "Debit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_123471", date: "2024-09-01T09:00:00Z", merchant: "Vodacom", category: "Utilities", amount: 399.0, description: "Mobile contract", paymentMethod: "Debit Order", icon: "zap", categoryColor: "#85C1E9" },
  { id: "txn_123472", date: "2024-08-30T17:35:00Z", merchant: "Spar", category: "Groceries", amount: 98.6, description: "Top-up shopping", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_123473", date: "2024-08-28T21:10:00Z", merchant: "Showmax", category: "Entertainment", amount: 99.0, description: "Monthly subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_123474", date: "2024-08-25T10:40:00Z", merchant: "Bolt", category: "Transportation", amount: 64.3, description: "Ride to airport", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_123475", date: "2024-08-22T19:15:00Z", merchant: "Spur", category: "Dining", amount: 287.4, description: "Family dinner", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_123476", date: "2024-08-19T14:00:00Z", merchant: "Clicks", category: "Shopping", amount: 176.45, description: "Toiletries", paymentMethod: "Debit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_123477", date: "2024-08-17T11:25:00Z", merchant: "Pick n Pay", category: "Groceries", amount: 410.2, description: "Weekly groceries", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
];

export const mockGoals: SpendingGoals = {
  goals: [
    { id: "goal_001", category: "Entertainment", monthlyBudget: 1000.0, currentSpent: 650.3, percentageUsed: 65.03, daysRemaining: 12, status: "on_track" },
    { id: "goal_002", category: "Groceries", monthlyBudget: 1500.0, currentSpent: 1450.8, percentageUsed: 96.72, daysRemaining: 12, status: "warning" },
  ],
};

export const mockFilters: InsightFilters = {
  categories: [
    { name: "Groceries", color: "#FF6B6B", icon: "shopping-cart" },
    { name: "Entertainment", color: "#4ECDC4", icon: "film" },
    { name: "Transportation", color: "#45B7D1", icon: "car" },
    { name: "Dining", color: "#F7DC6F", icon: "utensils" },
    { name: "Shopping", color: "#BB8FCE", icon: "shopping-bag" },
    { name: "Utilities", color: "#85C1E9", icon: "zap" },
  ],
  dateRangePresets: [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year", value: "1y" },
  ],
};
