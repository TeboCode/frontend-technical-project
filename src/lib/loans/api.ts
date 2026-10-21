// Data access for the Loan Eligibility Simulator.
//
// Each function mirrors one endpoint in LoanEligibilitySimulatorEndpoints.md.
// Until the real API is available, eligibility and rates are estimated by the
// mock engine below so the simulator reacts to what the customer enters.
// To connect the API, replace each function body with a fetch to the matching
// endpoint — callers and types stay the same.

import { cacheLife } from "next/cache";
import { formatRand } from "./format";
import { mockProducts, mockValidationRules } from "./mock-data";
import { productById, productForPurpose } from "./products";
import type {
  AffordabilityScore,
  EligibilityRequest,
  EligibilityResponse,
  LoanProduct,
  LoanProducts,
  PaymentScheduleEntry,
  RateRequest,
  RateResponse,
  RiskCategory,
  ValidationRules,
} from "./types";

/** GET /api/loans/products */
export async function getLoanProducts(): Promise<LoanProducts> {
  "use cache";
  cacheLife("days");
  return mockProducts;
}

/** GET /api/loans/validation-rules */
export async function getValidationRules(): Promise<ValidationRules> {
  "use cache";
  cacheLife("days");
  return mockValidationRules;
}

/** POST /api/loans/eligibility */
export async function checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
  const { products } = await getLoanProducts();
  return estimateEligibility(request, productForPurpose(products, request.loanDetails.loanPurpose));
}

/** POST /api/loans/calculate-rate */
export async function calculateRate(request: RateRequest): Promise<RateResponse> {
  const { products } = await getLoanProducts();
  const product = productById(products, request.loanType);
  const interestRate = rateFor(product, request.creditScore);
  const paymentSchedule = buildSchedule(request.loanAmount, interestRate, request.loanTerm);
  const totalRepayment = round(paymentSchedule.reduce((sum, entry) => sum + entry.payment, 0));

  return {
    interestRate,
    monthlyPayment: paymentSchedule[0]?.payment ?? 0,
    totalInterest: round(totalRepayment - request.loanAmount),
    totalRepayment,
    paymentSchedule,
  };
}

// ---------------------------------------------------------------------------
// Mock estimation engine — remove once the real API is connected.
// ---------------------------------------------------------------------------

/** Credit score assumed when the customer doesn't provide one. */
const DEFAULT_CREDIT_SCORE = 600;
const MIN_CREDIT_SCORE = 500;
/** Share of disposable income that may go towards the new repayment. */
const AFFORDABILITY_BUFFER = 0.8;
/** Assumed monthly repayment on existing debt, as a share of the outstanding balance. */
const EXISTING_DEBT_REPAYMENT_RATE = 0.05;

const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Better credit scores move the rate towards the bottom of the product's range. */
function rateFor(product: LoanProduct, creditScore = DEFAULT_CREDIT_SCORE) {
  const { min, max } = product.interestRateRange;
  const strength = clamp((creditScore - 300) / 550, 0, 1);
  return Math.round((max - strength * (max - min)) * 10) / 10;
}

function monthlyPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 1200;
  return r === 0 ? principal / months : (principal * r) / (1 - (1 + r) ** -months);
}

/** The largest principal that a given monthly payment can repay. */
function affordablePrincipal(payment: number, annualRate: number, months: number) {
  const r = annualRate / 1200;
  return r === 0 ? payment * months : (payment * (1 - (1 + r) ** -months)) / r;
}

function buildSchedule(principal: number, annualRate: number, months: number): PaymentScheduleEntry[] {
  const r = annualRate / 1200;
  const payment = round(monthlyPayment(principal, annualRate, months));
  const schedule: PaymentScheduleEntry[] = [];
  let balance = principal;

  for (let month = 1; month <= months; month++) {
    const interest = round(balance * r);
    // The final payment absorbs any rounding difference.
    const principalPaid = month === months ? balance : round(payment - interest);
    balance = round(balance - principalPaid);
    schedule.push({
      month,
      payment: round(principalPaid + interest),
      principal: round(principalPaid),
      interest,
      balance: Math.max(balance, 0),
    });
  }
  return schedule;
}

/** Repayment as a share of disposable income; calibrated so the spec's example (~0.7) rates "good". */
function affordabilityFor(paymentShare: number): AffordabilityScore {
  if (paymentShare <= 0.5) return "excellent";
  if (paymentShare <= 0.75) return "good";
  if (paymentShare <= 0.9) return "fair";
  return "poor";
}

function riskFor(likelihood: number): RiskCategory {
  if (likelihood >= 75) return "low";
  if (likelihood >= 50) return "medium";
  return "high";
}

function estimateEligibility(request: EligibilityRequest, product: LoanProduct): EligibilityResponse {
  const { employmentStatus, employmentDuration } = request.personalInfo;
  const { monthlyIncome, monthlyExpenses, existingDebt, creditScore } = request.financialInfo;
  const { requestedAmount, loanTerm } = request.loanDetails;

  const interestRate = rateFor(product, creditScore);
  // As in the API spec: disposable income is income less expenses, and
  // `existingDebt` is the total outstanding balance on other credit.
  const disposableIncome = round(monthlyIncome - monthlyExpenses);
  const existingRepayments = existingDebt * EXISTING_DEBT_REPAYMENT_RATE;
  const capacity = Math.max((disposableIncome - existingRepayments) * AFFORDABILITY_BUFFER, 0);
  const maxAmount = Math.min(
    product.maxAmount,
    Math.floor(affordablePrincipal(capacity, interestRate, loanTerm) / 1000) * 1000,
  );
  const recommendedAmount = Math.min(requestedAmount, maxAmount);
  const isReduced = requestedAmount > maxAmount;

  const debtToIncomeRatio = round((existingDebt / monthlyIncome) * 100);
  const loanToIncomeRatio = round((requestedAmount / (monthlyIncome * 12)) * 100);

  let declineReason: string | undefined;
  if (employmentStatus === "unemployed") {
    declineReason = "A regular source of income is required to qualify for a loan.";
  } else if (disposableIncome <= 0) {
    declineReason = "Your monthly expenses are higher than your income.";
  } else if (creditScore !== undefined && creditScore < MIN_CREDIT_SCORE) {
    declineReason = `A credit score of at least ${MIN_CREDIT_SCORE} is required.`;
  } else if (maxAmount < product.minAmount) {
    declineReason = `Your disposable income doesn't currently support the minimum ${product.name.toLowerCase()} amount of ${formatRand(product.minAmount)}.`;
  }
  const isEligible = declineReason === undefined;

  // Score the loan we'd actually offer: the recommended amount when eligible.
  const assessedAmount = isEligible ? recommendedAmount : requestedAmount;
  const assessedPayment = monthlyPayment(assessedAmount, interestRate, loanTerm);
  const paymentShare = disposableIncome > 0 ? assessedPayment / disposableIncome : Infinity;

  let likelihood = 92;
  likelihood -= Math.max(paymentShare - 0.75, 0) * 60;
  likelihood -= Math.max(debtToIncomeRatio - 30, 0);
  likelihood -= Math.max(700 - (creditScore ?? DEFAULT_CREDIT_SCORE), 0) / 10;
  if (employmentStatus !== "employed") likelihood -= 5;
  if (employmentDuration < 12 && employmentStatus !== "retired") likelihood -= 10;
  if (isReduced) likelihood -= 10;
  const approvalLikelihood = Math.round(clamp(likelihood, 5, isEligible ? 95 : 20));

  let decisionReason = declineReason ?? "";
  if (isEligible) {
    if (isReduced) {
      decisionReason = `The requested amount is more than your disposable income comfortably supports. You may qualify for up to ${formatRand(maxAmount)}.`;
    } else if (paymentShare <= 0.75 && debtToIncomeRatio <= 30) {
      decisionReason = "Strong income-to-expense ratio and manageable existing debt.";
    } else {
      decisionReason = "You qualify, but repayments would use a large share of your disposable income.";
    }
  }

  const paymentOnRecommended = isEligible ? assessedPayment : 0;

  return {
    eligibilityResult: {
      isEligible,
      approvalLikelihood,
      riskCategory: riskFor(approvalLikelihood),
      decisionReason,
    },
    recommendedLoan: {
      maxAmount: Math.max(maxAmount, 0),
      recommendedAmount: isEligible ? recommendedAmount : 0,
      interestRate,
      monthlyPayment: round(paymentOnRecommended),
      totalRepayment: round(paymentOnRecommended * loanTerm),
    },
    affordabilityAnalysis: {
      disposableIncome,
      debtToIncomeRatio,
      loanToIncomeRatio,
      affordabilityScore: affordabilityFor(paymentShare),
    },
  };
}
