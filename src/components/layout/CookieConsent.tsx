"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { legalAnchors, routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { acceptConsent, readConsent, subscribeToConsent } from "@/lib/cookie-consent";

/** How long the full bar stays open before collapsing to the cookie icon. */
const AUTO_COLLAPSE_MS = 8000;

// Unknown on the server, so nothing renders until the browser has checked
// storage — customers who already accepted never see a flash of the bar.
const getServerConsent = () => null;

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, getServerConsent);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const focusAcceptOnOpen = useRef(false);

  // Pause the countdown while the customer is reading (hover) or using the
  // keyboard inside the bar, so it never disappears from under them.
  const isPaused = isHovered || hasFocus;

  // Every time the bar opens (on load or from the icon) it collapses back to
  // the icon if the customer doesn't interact with it.
  useEffect(() => {
    if (consent !== "pending" || !isExpanded || isPaused) return;
    const timer = setTimeout(() => setIsExpanded(false), AUTO_COLLAPSE_MS);
    return () => clearTimeout(timer);
  }, [consent, isExpanded, isPaused]);

  // After a keyboard reopen, move focus to the Accept button.
  useEffect(() => {
    if (isExpanded && focusAcceptOnOpen.current) {
      focusAcceptOnOpen.current = false;
      acceptButtonRef.current?.focus();
    }
  }, [isExpanded]);

  if (consent !== "pending") return null;

  const reopen = (event: MouseEvent<HTMLButtonElement>) => {
    // `detail` is 0 for keyboard-activated clicks. Keyboard users need focus
    // moved because the icon they were on disappears; that focus also pauses
    // the countdown while they're in the bar. Mouse and touch opens leave
    // focus alone, so the countdown runs.
    focusAcceptOnOpen.current = event.detail === 0;
    setIsExpanded(true);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
  };

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={reopen}
        aria-label="Show cookie notice"
        title="Cookie notice"
        className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex size-12 items-center justify-center rounded-full bg-card text-brand-dark shadow-raised transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none starting:scale-0"
      >
        <Cookie aria-hidden="true" className="size-6" />
      </button>
    );
  }

  return (
    <section
      aria-label="Cookie notice"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={handleBlur}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_-4px_16px_rgb(0_0_0/0.5)] transition-transform duration-300 motion-reduce:transition-none starting:translate-y-full"
    >
      <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex items-start gap-3 text-sm text-body">
          <Cookie aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-dark" />
          <span>
            We use cookies to make your experience on the {siteConfig.name} website better. By
            using our website you agree to our{" "}
            <Link href={`${routes.legal}#${legalAnchors.cookiePolicy}`} className="font-medium text-brand-dark underline">
              cookie policy
            </Link>
            .
          </span>
        </p>
        <button
          ref={acceptButtonRef}
          type="button"
          onClick={acceptConsent}
          className="shrink-0 rounded-sm bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Accept cookies
        </button>
      </div>
    </section>
  );
}
