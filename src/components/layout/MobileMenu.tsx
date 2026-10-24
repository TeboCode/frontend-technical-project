"use client";

import { useState, type ReactNode } from "react";

type MobileMenuProps = {
  children: ReactNode;
};

export function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-sm p-2 text-heading hover:bg-surface"
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <div
        id="mobile-menu"
        hidden={!isOpen}
        // Close the menu once a link is followed.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setIsOpen(false);
        }}
        className="absolute inset-x-0 top-full border-t border-black/5 bg-white px-4 py-4 shadow-md"
      >
        {children}
      </div>
    </div>
  );
}
