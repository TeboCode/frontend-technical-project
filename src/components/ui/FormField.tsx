import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FieldShellProps = {
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (describedBy: string | undefined) => ReactNode;
};

/** Label, hint and error wiring shared by every field. */
function FieldShell({ name, label, hint, error, optional, className = "", children }: FieldShellProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-heading">
        {label}
        {optional && <span className="font-normal text-body"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-xs text-body">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children(describedBy)}</div>
      {/* Always rendered so errors that appear on blur are announced. */}
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-danger">
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const controlClass = (hasError: boolean) =>
  `block w-full min-w-0 rounded-sm border bg-white py-2.5 text-base text-heading focus:outline-2 focus:outline-offset-0 sm:text-sm ${
    hasError
      ? "border-danger focus:outline-danger/30"
      : "border-black/15 focus:border-brand focus:outline-brand/30"
  }`;

type NumberFieldProps = Omit<FieldShellProps, "children"> &
  Omit<ComponentPropsWithoutRef<"input">, "name" | "type" | "children"> & {
    prefix?: string;
    suffix?: string;
  };

export function NumberField({
  name,
  label,
  hint,
  error,
  optional,
  className,
  prefix,
  suffix,
  ...inputProps
}: NumberFieldProps) {
  return (
    <FieldShell name={name} label={label} hint={hint} error={error} optional={optional} className={className}>
      {(describedBy) => (
        <div className="relative">
          {prefix && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-body">
              {prefix}
            </span>
          )}
          <input
            id={name}
            name={name}
            type="number"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`${controlClass(Boolean(error))} ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-16" : "pr-3"}`}
            {...inputProps}
          />
          {suffix && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-body">
              {suffix}
            </span>
          )}
        </div>
      )}
    </FieldShell>
  );
}

type SelectFieldProps = Omit<FieldShellProps, "children"> &
  Omit<ComponentPropsWithoutRef<"select">, "name"> & {
    children: ReactNode;
  };

export function SelectField({
  name,
  label,
  hint,
  error,
  optional,
  className,
  children,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldShell name={name} label={label} hint={hint} error={error} optional={optional} className={className}>
      {(describedBy) => (
        <select
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${controlClass(Boolean(error))} px-3`}
          {...selectProps}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
