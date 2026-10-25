import Link from "next/link";
import { routes } from "@/config/navigation";
import { buildHref, type RawSearchParams } from "@/lib/insights/search-params";
import type { Pagination } from "@/lib/insights/types";

type TransactionsPaginationProps = {
  pagination: Pagination;
  searchParams: RawSearchParams;
};

const linkClass =
  "rounded-sm border border-line-strong px-3 py-1.5 text-sm text-heading transition-colors hover:bg-surface";
const disabledClass =
  "rounded-sm border border-line px-3 py-1.5 text-sm text-body/50";

export function TransactionsPagination({ pagination, searchParams }: TransactionsPaginationProps) {
  const { total, limit, offset, hasMore } = pagination;
  if (total === 0) return null;

  const from = offset + 1;
  const to = Math.min(offset + limit, total);
  const hrefFor = (nextOffset: number) =>
    `${buildHref(routes.insights, searchParams, { offset: nextOffset || undefined })}#transactions`;

  return (
    <nav
      aria-label="Transactions pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-body">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        {offset > 0 ? (
          <Link href={hrefFor(Math.max(offset - limit, 0))} rel="prev" className={linkClass}>
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledClass}>Previous</span>
        )}
        {hasMore ? (
          <Link href={hrefFor(offset + limit)} rel="next" className={linkClass}>
            Next
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledClass}>Next</span>
        )}
      </div>
    </nav>
  );
}
