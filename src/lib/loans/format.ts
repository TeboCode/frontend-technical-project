/** Rand amount without cents, for limits and hints, e.g. "R 50 000". */
export function formatRand(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
