import type {
  AffordabilityScore,
  EmploymentStatus,
  LoanPurpose,
  RiskCategory,
} from "./types";

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  employed: "Employed",
  self_employed: "Self-employed",
  unemployed: "Unemployed",
  retired: "Retired",
};

export const LOAN_PURPOSE_LABELS: Record<LoanPurpose, string> = {
  debt_consolidation: "Debt consolidation",
  home_improvement: "Home improvement",
  education: "Education",
  medical: "Medical",
  other: "Other",
  new_vehicle: "New vehicle",
  used_vehicle: "Used vehicle",
};

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export const AFFORDABILITY_LABELS: Record<AffordabilityScore, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};
