// Chart colours as CSS variables (defined in globals.css), so charts follow
// the light/dark theme without re-rendering.

export const chartColors = {
  grid: "var(--line-strong)",
  tick: "var(--body)",
  cursor: "var(--muted)",
} as const;

/** Spread onto Recharts <Tooltip>; its default box is always white. */
export const tooltipTheme = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--line-strong)",
    borderRadius: 4,
    color: "var(--heading)",
    boxShadow: "var(--raised-shadow)",
  },
  labelStyle: { color: "var(--heading)" },
  itemStyle: { color: "var(--heading)" },
} as const;
