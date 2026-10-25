"use client"; // Error boundaries must be Client Components.

import { House, RotateCcw, TriangleAlert } from "lucide-react";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { primaryActionClass, secondaryActionClass, StatusMessage } from "@/components/ui/StatusMessage";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { applyStoredTheme, DEFAULT_THEME } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * Last-resort screen for errors in the root layout itself. It replaces the
 * whole document, so it brings its own <html>, styles, font and theme, and
 * skips the header and footer in case they caused the error.
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    applyStoredTheme();
    // Replace with an error reporting service when one is added.
    console.error(error);
  }, [error]);

  return (
    <html
      lang={siteConfig.locale}
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface">
        <title>{`Something went wrong | ${siteConfig.name}`}</title>
        <main className="flex flex-1 flex-col justify-center">
          <StatusMessage
            icon={TriangleAlert}
            eyebrow="Error"
            title="Oops! Something went wrong."
            description="We're having trouble loading the site. Please try again, or go back to the home page."
            actions={
              <>
                {/* A plain link (full page load) so the broken layout is rebuilt from scratch. */}
                <a href={routes.home} className={primaryActionClass}>
                  <House aria-hidden="true" className="size-4" />
                  Go to home
                </a>
                <button type="button" onClick={() => retry()} className={secondaryActionClass}>
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Try again
                </button>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
