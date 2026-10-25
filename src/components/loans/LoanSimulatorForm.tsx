"use client";

import {
  startTransition,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type SubmitEvent,
} from "react";
import { NumberField, SelectField } from "@/components/ui/FormField";
import { formatRand } from "@/lib/loans/format";
import type { FieldErrors, FieldName, FormValues } from "@/lib/loans/form-state";
import { EMPLOYMENT_STATUS_LABELS, LOAN_PURPOSE_LABELS } from "@/lib/loans/labels";
import { findProductForPurpose } from "@/lib/loans/products";
import type { LoanProduct, LoanPurpose, ValidationRules } from "@/lib/loans/types";
import {
  DEPENDENT_FIELDS,
  FIELD_NAMES,
  readFormValues,
  validateField,
} from "@/lib/loans/validation";

type LoanSimulatorFormProps = {
  action: (formData: FormData) => void;
  pending: boolean;
  products: LoanProduct[];
  rules: ValidationRules;
  values: FormValues;
  /** Errors from the last server validation; must keep a stable identity between renders. */
  serverErrors: FieldErrors;
};

type FieldElement = HTMLInputElement | HTMLSelectElement;

const isFieldName = (name: string): name is FieldName =>
  (FIELD_NAMES as readonly string[]).includes(name);

/** The simulator field an event delegated to the form came from, if any. */
function fieldFrom(target: EventTarget): (FieldElement & { name: FieldName }) | null {
  const isField = target instanceof HTMLInputElement || target instanceof HTMLSelectElement;
  return isField && isFieldName(target.name) ? (target as FieldElement & { name: FieldName }) : null;
}

const FIELD_LABELS: Record<FieldName, string> = {
  age: "Age",
  employmentStatus: "Employment status",
  employmentDuration: "Time in current employment",
  monthlyIncome: "Monthly income",
  monthlyExpenses: "Monthly expenses",
  existingDebt: "Existing debt",
  creditScore: "Credit score",
  loanPurpose: "What is the loan for?",
  requestedAmount: "Loan amount",
  loanTerm: "Repayment term",
};

export function LoanSimulatorForm({ action, pending, products, rules, values, serverErrors }: LoanSimulatorFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  // Tracks the purpose so the amount and term hints follow the selected product.
  const [purpose, setPurpose] = useState(values.loanPurpose ?? "");
  const product = purpose ? findProductForPurpose(products, purpose as LoanPurpose) : undefined;
  const { personalInfo, financialInfo, loanDetails } = rules;

  // Inline errors start from the server's verdict and are then kept up to date
  // in the browser as the customer edits fields.
  const [errors, setErrors] = useState<FieldErrors>(serverErrors);
  const [showSummary, setShowSummary] = useState(Object.keys(serverErrors).length > 0);
  const [syncedServerErrors, setSyncedServerErrors] = useState(serverErrors);
  if (serverErrors !== syncedServerErrors) {
    setSyncedServerErrors(serverErrors);
    setErrors(serverErrors);
    setShowSummary(Object.keys(serverErrors).length > 0);
  }

  // The summary only appears after a submit attempt, in form order, and
  // shrinks as fields are fixed.
  const summaryFields = showSummary ? FIELD_NAMES.filter((name) => errors[name]) : [];

  const revalidate = (names: FieldName[]) => {
    if (!formRef.current || names.length === 0) return;
    const current = readFormValues(new FormData(formRef.current));
    setErrors((previous) => {
      const next = { ...previous };
      for (const name of names) {
        const error = validateField(name, current, { rules, products });
        if (error) next[name] = error;
        else delete next[name];
      }
      return next;
    });
  };

  // Validation timing ("reward early, punish late"):
  // - leaving a field checks it, unless it was left empty (they may come back);
  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    const field = fieldFrom(event.target);
    if (!field) return;
    if (field.value.trim() === "" && !errors[field.name]) return;
    revalidate([field.name]);
  };

  // - a field already showing an error is re-checked as it changes, so the
  //   error clears the moment it's fixed;
  // - changing a field others depend on re-checks those that have a value or
  //   an error (e.g. a new purpose changes the allowed loan amount).
  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    const field = fieldFrom(event.target);
    if (!field) return;
    if (field.name === "loanPurpose") setPurpose(field.value);

    const dependents = (DEPENDENT_FIELDS[field.name] ?? []).filter((name) => {
      const input = formRef.current?.elements.namedItem(name) as FieldElement | null;
      return errors[name] || (input?.value.trim() ?? "") !== "";
    });
    revalidate([...(errors[field.name] ? [field.name] : []), ...dependents]);
  };

  // With JavaScript, submit manually so React doesn't reset the form after the
  // action — customers keep their answers while they tweak the numbers.
  // Without JavaScript, the `action` prop still posts the form natively.
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    // noValidate: the server validates against the API's rules and returns
    // consistent messages, rather than the browser's built-in bubbles.
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onChange={handleChange}
      noValidate
      className="space-y-5"
    >
      {summaryFields.length > 0 && (
        <div
          role="alert"
          tabIndex={-1}
          id="form-errors"
          className="rounded-md border border-danger/30 bg-danger/5 p-4"
        >
          <h2 className="text-sm font-semibold text-danger">
            Please fix {summaryFields.length === 1 ? "1 field" : `${summaryFields.length} fields`} to see your estimate
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {summaryFields.map((field) => (
              <li key={field}>
                <a href={`#${field}`} className="text-danger underline">
                  {FIELD_LABELS[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormSection title="About you">
        <NumberField
          name="age"
          label={FIELD_LABELS.age}
          suffix="years"
          inputMode="numeric"
          min={personalInfo.age.min}
          max={personalInfo.age.max}
          defaultValue={values.age}
          error={errors.age}
        />
        <SelectField
          name="employmentStatus"
          label={FIELD_LABELS.employmentStatus}
          defaultValue={values.employmentStatus ?? ""}
          error={errors.employmentStatus}
        >
          <option value="" disabled>
            Select status
          </option>
          {personalInfo.employmentStatus.options.map((option) => (
            <option key={option} value={option}>
              {EMPLOYMENT_STATUS_LABELS[option]}
            </option>
          ))}
        </SelectField>
        <NumberField
          name="employmentDuration"
          label={FIELD_LABELS.employmentDuration}
          hint="Only needed if you're employed or self-employed"
          suffix="months"
          inputMode="numeric"
          min={personalInfo.employmentDuration.min}
          defaultValue={values.employmentDuration}
          error={errors.employmentDuration}
          className="sm:col-span-2"
        />
      </FormSection>

      <FormSection title="Your finances">
        <NumberField
          name="monthlyIncome"
          label={FIELD_LABELS.monthlyIncome}
          hint="After tax"
          prefix="R"
          inputMode="decimal"
          step="0.01"
          min={financialInfo.monthlyIncome.min}
          defaultValue={values.monthlyIncome}
          error={errors.monthlyIncome}
        />
        <NumberField
          name="monthlyExpenses"
          label={FIELD_LABELS.monthlyExpenses}
          hint="Rent, food, transport, utilities, etc."
          prefix="R"
          inputMode="decimal"
          step="0.01"
          min={financialInfo.monthlyExpenses.min}
          defaultValue={values.monthlyExpenses}
          error={errors.monthlyExpenses}
        />
        <NumberField
          name="existingDebt"
          label={FIELD_LABELS.existingDebt}
          hint="Total you still owe on credit cards, store cards and other loans"
          optional
          prefix="R"
          inputMode="decimal"
          step="0.01"
          min={0}
          defaultValue={values.existingDebt}
          error={errors.existingDebt}
        />
        <NumberField
          name="creditScore"
          label={FIELD_LABELS.creditScore}
          hint={`Between ${financialInfo.creditScore.min} and ${financialInfo.creditScore.max}`}
          optional={!financialInfo.creditScore.required}
          inputMode="numeric"
          min={financialInfo.creditScore.min}
          max={financialInfo.creditScore.max}
          defaultValue={values.creditScore}
          error={errors.creditScore}
        />
      </FormSection>

      <FormSection title="Your loan">
        <SelectField
          name="loanPurpose"
          label={FIELD_LABELS.loanPurpose}
          defaultValue={values.loanPurpose ?? ""}
          error={errors.loanPurpose}
          hint={product?.description}
          className="sm:col-span-2"
        >
          <option value="" disabled>
            Select a purpose
          </option>
          {products.map((item) => (
            <optgroup key={item.id} label={item.name}>
              {item.purposes.map((option) => (
                <option key={option} value={option}>
                  {LOAN_PURPOSE_LABELS[option]}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectField>
        <NumberField
          name="requestedAmount"
          label={FIELD_LABELS.requestedAmount}
          hint={
            product
              ? `${formatRand(product.minAmount)} – ${formatRand(product.maxAmount)}`
              : `${formatRand(loanDetails.requestedAmount.min ?? 0)} – ${formatRand(loanDetails.requestedAmount.max ?? 0)}`
          }
          prefix="R"
          inputMode="decimal"
          step="100"
          min={product?.minAmount ?? loanDetails.requestedAmount.min}
          max={product?.maxAmount ?? loanDetails.requestedAmount.max}
          defaultValue={values.requestedAmount}
          error={errors.requestedAmount}
        />
        <NumberField
          name="loanTerm"
          label={FIELD_LABELS.loanTerm}
          hint={`${product?.minTerm ?? loanDetails.loanTerm.min} – ${product?.maxTerm ?? loanDetails.loanTerm.max} months`}
          suffix="months"
          inputMode="numeric"
          min={product?.minTerm ?? loanDetails.loanTerm.min}
          max={product?.maxTerm ?? loanDetails.loanTerm.max}
          defaultValue={values.loanTerm}
          error={errors.loanTerm}
        />
      </FormSection>

      <button
        type="submit"
        aria-disabled={pending}
        className="w-full rounded-sm bg-brand px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-disabled:cursor-wait aria-disabled:opacity-70 sm:w-auto"
      >
        {pending ? "Checking…" : "Check my eligibility"}
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-md bg-card p-5 shadow-card sm:p-6">
      <legend className="float-left mb-4 w-full text-lg font-semibold text-heading">{title}</legend>
      <div className="clear-both grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
