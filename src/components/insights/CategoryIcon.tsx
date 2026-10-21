import {
  Car,
  Film,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon as CategoryIconName } from "@/lib/insights/types";

const ICONS: Record<CategoryIconName, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  zap: Zap,
};

type CategoryIconProps = {
  icon: string;
  color: string;
};

/** Decorative category badge — the category name is always shown alongside it. */
export function CategoryIcon({ icon, color }: CategoryIconProps) {
  const Icon = ICONS[icon as CategoryIconName] ?? Tag;

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: `${color}33`, color }}
    >
      <Icon className="size-4 brightness-75" strokeWidth={2.25} />
    </span>
  );
}
