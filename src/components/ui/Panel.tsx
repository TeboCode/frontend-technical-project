import type { ReactNode } from "react";

type PanelProps = {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** A titled content card; its heading labels the section for assistive tech. */
export function Panel({ id, title, description, action, className = "", children }: PanelProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-6 rounded-md bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-heading">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-body">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
