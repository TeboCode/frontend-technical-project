"use client"; // Error boundaries must be Client Components.

import { House, RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { primaryActionClass, secondaryActionClass, StatusMessage } from "@/components/ui/StatusMessage";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

/** Errors in any page; the header and footer from the root layout stay in place. */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Replace with an error reporting service when one is added.
    console.error(error);
  }, [error]);

  // Server errors carry a digest that matches the server logs; useful for support.
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  return (
    <>
      <title>{`Something went wrong | ${siteConfig.name}`}</title>
      <StatusMessage
        icon={TriangleAlert}
        eyebrow="Error"
        title="Oops! Something went wrong."
        description="We couldn't load this page. Please try again, or go back to the home page."
        actions={
          <>
            <Link href={routes.home} className={primaryActionClass}>
              <House aria-hidden="true" className="size-4" />
              Go to home
            </Link>
            <button type="button" onClick={() => retry()} className={secondaryActionClass}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Try again
            </button>
          </>
        }
      >
        {digest && <p className="mt-6 text-xs text-body">Reference: {digest}</p>}
      </StatusMessage>
    </>
  );
}
