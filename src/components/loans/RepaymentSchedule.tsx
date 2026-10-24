import { formatCurrency } from "@/lib/format";
import type { RateResponse } from "@/lib/loans/types";

// The currency is named once in the column headers so the table fits on phones.
const amount = new Intl.NumberFormat("en-ZA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type RepaymentScheduleProps = {
  repayment: RateResponse;
};

/** Collapsed by default; the table scrolls inside its own box on narrow screens. */
export function RepaymentSchedule({ repayment }: RepaymentScheduleProps) {
  return (
    <details className="group rounded-md bg-card shadow-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-base font-semibold text-heading sm:px-6 [&::-webkit-details-marker]:hidden">
        Repayment schedule
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>

      <div className="border-t border-line px-5 pb-5 sm:px-6">
        <p className="mt-4 text-xs text-body">
          {formatCurrency(repayment.monthlyPayment)} a month for {repayment.paymentSchedule.length} months.
          Total interest: {formatCurrency(repayment.totalInterest)}.
        </p>
        <div className="mt-3 max-h-80 overflow-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <caption className="sr-only">Monthly repayment schedule</caption>
            <thead className="sticky top-0 bg-card text-body">
              <tr>
                <th scope="col" className="py-2 pr-2 text-left font-medium">Month</th>
                <th scope="col" className="px-2 py-2 font-medium">Principal (R)</th>
                <th scope="col" className="px-2 py-2 font-medium">Interest (R)</th>
                <th scope="col" className="py-2 pl-2 font-medium">Balance (R)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-heading">
              {repayment.paymentSchedule.map((entry) => (
                <tr key={entry.month}>
                  <th scope="row" className="py-2 pr-2 text-left font-normal">{entry.month}</th>
                  <td className="whitespace-nowrap px-2 py-2">{amount.format(entry.principal)}</td>
                  <td className="whitespace-nowrap px-2 py-2">{amount.format(entry.interest)}</td>
                  <td className="whitespace-nowrap py-2 pl-2">{amount.format(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
