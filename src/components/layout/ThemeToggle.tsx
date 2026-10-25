"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, readTheme, setTheme, subscribeToTheme } from "@/lib/theme";

const getServerTheme = () => DEFAULT_THEME;

/**
 * A single "Dark mode" toggle button. The icon is chosen with CSS from the
 * `data-theme` attribute, so it's correct on first paint even before React
 * hydrates; `aria-pressed` follows once the stored theme has been read.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, getServerTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      aria-label="Dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-heading transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Moon aria-hidden="true" className="size-5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-5 dark:block" />
    </button>
  );
}
