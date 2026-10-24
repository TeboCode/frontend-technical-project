// Validation for the simulator form, shared by the browser (on-blur checks)
// and the Server Action (the final say). Rules come from
// GET /api/loans/validation-rules; amount and term limits come from the loan
// product that matches the chosen purpose. Keep this module free of
// server-only imports so it can run in both places.

import { formatRand } from "./format";
import type { FieldErrors, FieldName, FormValues } from "./form-state";
import { LOAN_PURPOSE_LABELS } from "./labels";
import { findProductForPurpose } from "./products";
import type {
  EligibilityRequest,
  EmploymentStatus,
  LoanProduct,
  LoanPurpose,
  RangeRule,
  ValidationRules,
} from "./types";

export const FIELD_NAMES: readonly FieldName[] = [
  "age",
  "employmentStatus",
  "employmentDuration",
  "monthlyIncome",
  "monthlyExpenses",
  "existingDebt",
  "creditScore",
  "loanPurpose",
  "requestedAmount",
  "loanTerm",
];

/** Fields whose validity depends on another field's value. */
export const DEPENDENT_FIELDS: Partial<Record<FieldName, readonly FieldName[]>> = {
  employmentStatus: ["employmentDuration"],
  loanPurpose: ["requestedAmount", "loanTerm"],
};

/** Employment statuses for which an employment duration is meaningful. */
const WORKING_STATUSES: readonly EmploymentStatus[] = ["employed", "self_employed"];

const EXISTING_DEBT_RULE: RangeRule = {
  min: 0,
  required: false,
  errorMessage: "Existing debt can't be negative",
};

type ValidationContext = {
  rules: ValidationRules;
  products: LoanProduct[];
};

export function readFormValues(formData: FormData): FormValues {
  const values: FormValues = {};
  for (const name of FIELD_NAMES) {
    const value = formData.get(name);
    if (typeof value === "string" && value.trim() !== "") values[name] = value.trim();
  }
  return values;
}

function parseNumber(value: string | undefined) {
  if (value === undefined) return undefined;
  const number = Number(value.replace(/\s/g, ""));
  return Number.isFinite(number) ? number : NaN;
}

function checkRange(value: number | undefined, rule: RangeRule) {
  if (value === undefined) return rule.required ? rule.errorMessage : undefined;
  if (Number.isNaN(value)) return rule.errorMessage;
  if (rule.min !== undefined && value < rule.min) return rule.errorMessage;
  if (rule.max !== undefined && value > rule.max) return rule.errorMessage;
  return undefined;
}

/** Applies a product's own limits, keeping the API's wording when they match the default rule. */
function productRule(
  rule: RangeRule,
  min: number,
  max: number,
  describe: (min: number, max: number) => string,
): RangeRule {
  if (rule.min === min && rule.max === max) return rule;
  return { ...rule, min, max, errorMessage: describe(min, max) };
}

function parseEmploymentStatus(values: FormValues, rules: ValidationRules) {
  return rules.personalInfo.employmentStatus.options.find(
    (option) => option === values.employmentStatus,
  );
}

function parseLoanPurpose(values: FormValues) {
  return (Object.keys(LOAN_PURPOSE_LABELS) as LoanPurpose[]).find(
    (purpose) => purpose === values.loanPurpose,
  );
}

/** The product for the chosen purpose, if one is chosen. */
function selectedProduct(values: FormValues, products: LoanProduct[]) {
  const purpose = parseLoanPurpose(values);
  return purpose ? findProductForPurpose(products, purpose) : undefined;
}

/** Amount limits for the chosen product, or the API's default rule before a purpose is picked. */
function amountRule({ rules, products }: ValidationContext, values: FormValues) {
  const rule = rules.loanDetails.requestedAmount;
  const product = selectedProduct(values, products);
  return product
    ? productRule(rule, product.minAmount, product.maxAmount, (min, max) =>
        `Loan amount must be between ${formatRand(min)} and ${formatRand(max)}`,
      )
    : rule;
}

function termRule({ rules, products }: ValidationContext, values: FormValues) {
  const rule = rules.loanDetails.loanTerm;
  const product = selectedProduct(values, products);
  return product
    ? productRule(rule, product.minTerm, product.maxTerm, (min, max) =>
        `Loan term must be between ${min} and ${max} months`,
      )
    : rule;
}

/** Validates one field in the context of the whole form; returns an error message or undefined. */
export function validateField(
  name: FieldName,
  values: FormValues,
  context: ValidationContext,
): string | undefined {
  const { personalInfo, financialInfo } = context.rules;

  switch (name) {
    case "age":
      return checkRange(parseNumber(values.age), personalInfo.age);
    case "employmentStatus":
      return parseEmploymentStatus(values, context.rules)
        ? undefined
        : personalInfo.employmentStatus.errorMessage;
    case "employmentDuration": {
      const status = parseEmploymentStatus(values, context.rules);
      return status && WORKING_STATUSES.includes(status)
        ? checkRange(parseNumber(values.employmentDuration), personalInfo.employmentDuration)
        : undefined;
    }
    case "monthlyIncome":
      return checkRange(parseNumber(values.monthlyIncome), financialInfo.monthlyIncome);
    case "monthlyExpenses":
      return checkRange(parseNumber(values.monthlyExpenses), financialInfo.monthlyExpenses);
    case "existingDebt":
      return checkRange(parseNumber(values.existingDebt), EXISTING_DEBT_RULE);
    case "creditScore":
      return checkRange(parseNumber(values.creditScore), financialInfo.creditScore);
    case "loanPurpose":
      return selectedProduct(values, context.products)
        ? undefined
        : "Please select what the loan is for";
    case "requestedAmount":
      return checkRange(parseNumber(values.requestedAmount), amountRule(context, values));
    case "loanTerm": {
      const term = parseNumber(values.loanTerm);
      const error = checkRange(term, termRule(context, values));
      if (error) return error;
      return term !== undefined && !Number.isInteger(term)
        ? "Loan term must be a whole number of months"
        : undefined;
    }
  }
}

export function validateForm(values: FormValues, context: ValidationContext): FieldErrors {
  const errors: FieldErrors = {};
  for (const name of FIELD_NAMES) {
    const error = validateField(name, values, context);
    if (error) errors[name] = error;
  }
  return errors;
}

type ParseResult =
  | { success: true; request: EligibilityRequest; product: LoanProduct }
  | { success: false; errors: FieldErrors };

export function parseEligibilityForm(
  values: FormValues,
  rules: ValidationRules,
  products: LoanProduct[],
): ParseResult {
  const errors = validateForm(values, { rules, products });
  const employmentStatus = parseEmploymentStatus(values, rules);
  const loanPurpose = parseLoanPurpose(values);
  const product = selectedProduct(values, products);

  if (Object.keys(errors).length > 0 || !employmentStatus || !loanPurpose || !product) {
    return { success: false, errors };
  }

  // Every required number was checked by validateForm above.
  const number = (value: string | undefined) => parseNumber(value) as number;

  return {
    success: true,
    product,
    request: {
      personalInfo: {
        age: number(values.age),
        employmentStatus,
        employmentDuration: parseNumber(values.employmentDuration) ?? 0,
      },
      financialInfo: {
        monthlyIncome: number(values.monthlyIncome),
        monthlyExpenses: number(values.monthlyExpenses),
        existingDebt: parseNumber(values.existingDebt) ?? 0,
        creditScore: parseNumber(values.creditScore),
      },
      loanDetails: {
        requestedAmount: number(values.requestedAmount),
        loanTerm: number(values.loanTerm),
        loanPurpose,
      },
    },
  };
}
