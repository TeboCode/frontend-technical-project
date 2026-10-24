import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/insights/types";
import { CategoryIcon } from "./CategoryIcon";

type TransactionsTableProps = {
  transactions: Transaction[];
  currency: string;
};

/**
 * Renders a stacked list on small screens and a full table from `md` up, so
 * phones never need to scroll sideways. Only one is displayed at a time.
 */
export function TransactionsTable({ transactions, currency }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-sm bg-surface px-4 py-8 text-center text-sm text-body">
        No transactions match these filters.
      </p>
    );
  }

  return (
    <>
      <ul aria-label="Transactions" className="divide-y divide-black/5 md:hidden">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center gap-3 py-3">
            <CategoryIcon icon={transaction.icon} color={transaction.categoryColor} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-heading">{transaction.merchant}</p>
              <p className="truncate text-xs text-body">
                {transaction.category} ·{" "}
                <time dateTime={transaction.date}>{formatDate(transaction.date)}</time>
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-heading">
              {formatCurrency(transaction.amount, currency)}
            </p>
          </li>
        ))}
      </ul>

      <table className="hidden w-full text-left text-sm md:table">
        <caption className="sr-only">Transactions</caption>
        <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-body">
          <tr>
            <th scope="col" className="px-3 py-3 font-medium">Merchant</th>
            <th scope="col" className="px-3 py-3 font-medium">Category</th>
            <th scope="col" className="hidden px-3 py-3 font-medium lg:table-cell">Payment method</th>
            <th scope="col" className="px-3 py-3 font-medium">Date</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <th scope="row" className="px-3 py-3 font-normal">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={transaction.icon} color={transaction.categoryColor} />
                  <div>
                    <p className="font-medium text-heading">{transaction.merchant}</p>
                    <p className="text-xs text-body">{transaction.description}</p>
                  </div>
                </div>
              </th>
              <td className="px-3 py-3 text-body">{transaction.category}</td>
              <td className="hidden px-3 py-3 text-body lg:table-cell">{transaction.paymentMethod}</td>
              <td className="whitespace-nowrap px-3 py-3 text-body">
                <time dateTime={transaction.date}>{formatDate(transaction.date)}</time>
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-heading">
                {formatCurrency(transaction.amount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
