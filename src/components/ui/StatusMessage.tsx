import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatusMessageProps = {
  icon: LucideIcon;
  /** Short label above the title, e.g. "404". */
  eyebrow: string;
  title: string;
  description: string;
  /** Buttons/links, e.g. "Go to home". */
  actions: ReactNode;
  children?: ReactNode;
};

/** Full-page message for the not-found and error screens. */
export function StatusMessage({ icon: Icon, eyebrow, title, description, actions, children }: StatusMessageProps) {
  return (
    // flex-1 fills the space between the header and footer.
    <div className="flex flex-1 flex-col bg-surface">
      <div className="container-page flex min-h-[60vh] flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
          <Icon aria-hidden="true" className="size-8" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-dark">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold text-heading sm:text-3xl">{title}</h1>
        <p className="mt-3 max-w-md text-body">{description}</p>
        {/* Stacked, equal-width buttons on phones; side by side from sm up. */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">{actions}</div>
        {children}
      </div>
    </div>
  );
}

/** Primary action style, shared by links and buttons on these screens. */
export const primaryActionClass =
  "inline-flex items-center justify-center gap-2 rounded-sm bg-brand-solid px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const secondaryActionClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-5 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
