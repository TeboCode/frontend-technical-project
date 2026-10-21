// Request and response shapes for the Loan Eligibility Simulator API.

export type EmploymentStatus = "employed" | "self_employed" | "unemployed" | "retired";

export type LoanPurpose =
  | "debt_consolidation"
  | "home_improvement"
  | "education"
  | "medical"
  | "other"
  | "new_vehicle"
  | "used_vehicle";

export type LoanProductId = "personal_loan" | "vehicle_loan";

export type RiskCategory = "low" | "medium" | "high";

export type AffordabilityScore = "excellent" | "good" | "fair" | "poor";

export type EligibilityRequest = {
  personalInfo: {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebt: number;
    creditScore?: number;
  };
  loanDetails: {
    requestedAmount: number;
    loanTerm: number;
    loanPurpose: LoanPurpose;
  };
};

export type EligibilityResponse = {
  eligibilityResult: {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: RiskCategory;
    decisionReason: string;
  };
  recommendedLoan: {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
  };
  affordabilityAnalysis: {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: AffordabilityScore;
  };
};

export type LoanProduct = {
  id: LoanProductId;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  purposes: LoanPurpose[];
};

export type LoanProducts = {
  products: LoanProduct[];
};

export type RateRequest = {
  loanAmount: number;
  loanTerm: number;
  creditScore?: number;
  loanType: LoanProductId;
};

export type PaymentScheduleEntry = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export type RateResponse = {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleEntry[];
};

export type RangeRule = {
  min?: number;
  max?: number;
  required: boolean;
  errorMessage: string;
};

export type OptionsRule = {
  required: boolean;
  options: EmploymentStatus[];
  errorMessage: string;
};

export type ValidationRules = {
  personalInfo: {
    age: RangeRule;
    employmentStatus: OptionsRule;
    employmentDuration: RangeRule;
  };
  financialInfo: {
    monthlyIncome: RangeRule;
    monthlyExpenses: RangeRule;
    creditScore: RangeRule;
  };
  loanDetails: {
    requestedAmount: RangeRule;
    loanTerm: RangeRule;
  };
};
