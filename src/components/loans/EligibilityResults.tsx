import type { Ref } from "react";
import { formatCurrency } from "@/lib/format";
import type { SimulatorState } from "@/lib/loans/form-state";
import { AFFORDABILITY_LABELS, RISK_CATEGORY_LABELS } from "@/lib/loans/labels";
import type { RiskCategory } from "@/lib/loans/types";
import { RepaymentSchedule } from "./RepaymentSchedule";

type EligibilityResultsProps = {
  state: SimulatorState;
  headingRef: Ref<HTMLHeadingElement>;
};

const card = "rounded-md bg-card p-5 shadow-card sm:p-6";

const RISK_STYLES: Record<RiskCategory, { text: string; bar: string }> = {
  low: { text: "text-brand-dark", bar: "bg-brand" },
  medium: { text: "text-warning", bar: "bg-amber-500" },
  high: { text: "text-danger", bar: "bg-danger" },
};

export function EligibilityResults({ state, headingRef }: EligibilityResultsProps) {
  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <h2
        id="results-heading"
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-6 text-lg font-semibold text-heading focus:outline-none"
      >
        Your estimate
      </h2>

      {state.status === "success" ? (
        <SuccessResults state={state} />
      ) : state.status === "error" ? (
        <p role="alert" className={`${card} text-sm text-danger`}>
          {state.message}
        </p>
      ) : (
        <div className={`${card} text-sm text-body`}>
          <p>
            Complete the form to see whether you&apos;re likely to qualify, what you could
            borrow and your estimated monthly repayment.
          </p>
          <p className="mt-3">Checking your eligibility won&apos;t affect your credit score.</p>
        </div>
      )}
    </section>
  );
}

function SuccessResults({ state }: { state: Extract<SimulatorState, { status: "success" }> }) {
  const { eligibilityResult, recommendedLoan, affordabilityAnalysis } = state.eligibility;
  const risk = RISK_STYLES[eligibilityResult.riskCategory];

  return (
    <>
      <div className={card}>
        <p
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
            eligibilityResult.isEligible ? "bg-brand/10 text-brand-dark" : "bg-danger/10 text-danger"
          }`}
        >
          <StatusIcon eligible={eligibilityResult.isEligible} />
          {eligibilityResult.isEligible ? "You're likely eligible" : "You're unlikely to qualify"}
        </p>
        <p className="mt-3 text-sm text-body">{eligibilityResult.decisionReason}</p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-2">
            <p id="likelihood-label" className="text-sm font-medium text-heading">
              Approval likelihood
            </p>
            <p className={`text-sm font-semibold ${risk.text}`}>
              {eligibilityResult.approvalLikelihood}%
              <span className="ml-1 font-normal text-body">
                · {RISK_CATEGORY_LABELS[eligibilityResult.riskCategory]}
              </span>
            </p>
          </div>
          <div
            role="progressbar"
            aria-labelledby="likelihood-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={eligibilityResult.approvalLikelihood}
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface"
          >
            <div
              className={`h-full rounded-full ${risk.bar}`}
              style={{ width: `${eligibilityResult.approvalLikelihood}%` }}
            />
          </div>
        </div>
      </div>

      {eligibilityResult.isEligible && (
        <div className={card}>
          <h3 className="text-base font-semibold text-heading">Recommended {state.productName.toLowerCase()}</h3>
          <dl className="mt-4">
            <dt className="text-sm text-body">Loan amount</dt>
            <dd className="text-3xl font-semibold text-heading">
              {formatCurrency(recommendedLoan.recommendedAmount)}
            </dd>
          </dl>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4">
            <Stat label="Monthly repayment" value={formatCurrency(recommendedLoan.monthlyPayment)} />
            <Stat label="Interest rate" value={`${recommendedLoan.interestRate.toFixed(1)}% p.a.`} />
            <Stat label="Total repayment" value={formatCurrency(recommendedLoan.totalRepayment)} />
            <Stat label="You may qualify for up to" value={formatCurrency(recommendedLoan.maxAmount)} />
          </dl>
        </div>
      )}

      <div className={card}>
        <h3 className="text-base font-semibold text-heading">Affordability</h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <Stat label="Disposable income" value={formatCurrency(affordabilityAnalysis.disposableIncome)} />
          <Stat label="Affordability" value={AFFORDABILITY_LABELS[affordabilityAnalysis.affordabilityScore]} />
          <Stat label="Debt-to-income" value={`${affordabilityAnalysis.debtToIncomeRatio.toFixed(1)}%`} />
          <Stat label="Loan-to-income" value={`${affordabilityAnalysis.loanToIncomeRatio.toFixed(1)}%`} />
        </dl>
      </div>

      {state.repayment && <RepaymentSchedule repayment={state.repayment} />}

      <p className="text-xs text-body">
        This is an estimate only and not a credit offer. Final approval, amount and interest rate
        depend on a full credit assessment.
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-body">{label}</dt>
      <dd className="break-words text-sm font-semibold text-heading sm:text-base">{value}</dd>
    </div>
  );
}

function StatusIcon({ eligible }: { eligible: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {eligible ? <path d="M4 10.5l4 4 8-9" /> : <path d="M5 5l10 10M15 5L5 15" />}
    </svg>
  );
}
