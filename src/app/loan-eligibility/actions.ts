"use server";

import {
  calculateRate,
  checkEligibility,
  getLoanProducts,
  getValidationRules,
} from "@/lib/loans/api";
import type { SimulatorState } from "@/lib/loans/form-state";
import { parseEligibilityForm, readFormValues } from "@/lib/loans/validation";

export async function checkEligibilityAction(
  _previousState: SimulatorState,
  formData: FormData,
): Promise<SimulatorState> {
  const values = readFormValues(formData);

  try {
    const [rules, { products }] = await Promise.all([getValidationRules(), getLoanProducts()]);

    // Always validate on the server — client-side checks can be bypassed.
    const parsed = parseEligibilityForm(values, rules, products);
    if (!parsed.success) {
      return { status: "invalid", values, errors: parsed.errors };
    }

    const eligibility = await checkEligibility(parsed.request);
    const { isEligible } = eligibility.eligibilityResult;

    const repayment = isEligible
      ? await calculateRate({
          loanAmount: eligibility.recommendedLoan.recommendedAmount,
          loanTerm: parsed.request.loanDetails.loanTerm,
          creditScore: parsed.request.financialInfo.creditScore,
          loanType: parsed.product.id,
        })
      : undefined;

    return { status: "success", values, eligibility, repayment, productName: parsed.product.name };
  } catch (error) {
    console.error("Loan eligibility check failed", error);
    return {
      status: "error",
      values,
      message: "We couldn't check your eligibility right now. Please try again in a moment.",
    };
  }
}
