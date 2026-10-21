"use client";

import { useActionState, useEffect, useRef } from "react";
import { checkEligibilityAction } from "@/app/loan-eligibility/actions";
import type { FieldErrors, SimulatorState } from "@/lib/loans/form-state";
import type { LoanProduct, ValidationRules } from "@/lib/loans/types";
import { EligibilityResults } from "./EligibilityResults";
import { LoanSimulatorForm } from "./LoanSimulatorForm";

type LoanSimulatorProps = {
  products: LoanProduct[];
  rules: ValidationRules;
};

const initialState: SimulatorState = { status: "idle", values: {} };
const NO_ERRORS: FieldErrors = {};

export function LoanSimulator({ products, rules }: LoanSimulatorProps) {
  const [state, formAction, pending] = useActionState(checkEligibilityAction, initialState);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to whatever the customer needs next after each submission:
  // the error summary, or the results (which sit below the form on phones).
  useEffect(() => {
    if (state.status === "idle") return;
    const target =
      state.status === "invalid"
        ? document.getElementById("form-errors")
        : resultsHeadingRef.current;
    if (!target) return;

    target.focus({ preventScroll: true });
    const { top } = target.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.75) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, [state]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
      <LoanSimulatorForm
        action={formAction}
        pending={pending}
        products={products}
        rules={rules}
        values={state.values}
        serverErrors={state.status === "invalid" ? state.errors : NO_ERRORS}
      />
      <div className="lg:sticky lg:top-6">
        <EligibilityResults state={state} headingRef={resultsHeadingRef} />
      </div>
    </div>
  );
}
