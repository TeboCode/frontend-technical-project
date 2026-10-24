// Shared between the Server Action and the client form — types only.

import type { EligibilityResponse, RateResponse } from "./types";

export type FieldName =
  | "age"
  | "employmentStatus"
  | "employmentDuration"
  | "monthlyIncome"
  | "monthlyExpenses"
  | "existingDebt"
  | "creditScore"
  | "loanPurpose"
  | "requestedAmount"
  | "loanTerm";

export type FormValues = Partial<Record<FieldName, string>>;
export type FieldErrors = Partial<Record<FieldName, string>>;

export type SimulatorState =
  | { status: "idle"; values: FormValues }
  | { status: "invalid"; values: FormValues; errors: FieldErrors }
  | {
      status: "success";
      values: FormValues;
      eligibility: EligibilityResponse;
      repayment?: RateResponse;
      productName: string;
    }
  | { status: "error"; values: FormValues; message: string };
