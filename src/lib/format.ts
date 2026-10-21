const LOCALE = "en-ZA";
const TIME_ZONE = "Africa/Johannesburg";

export function formatCurrency(amount: number, currency = "ZAR") {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(LOCALE).format(value);
}

/** Formats a signed percentage change, e.g. "+12.5%" or "-3.2%". */
export function formatChange(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

/** Formats an ISO date or datetime, e.g. "16 Sept 2024". */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** Formats a "YYYY-MM" month key, e.g. "Jan 2024". */
export function formatMonth(month: string, style: "short" | "long" = "short") {
  return new Intl.DateTimeFormat(LOCALE, {
    month: style,
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`));
}
