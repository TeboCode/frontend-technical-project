import { Panel } from "@/components/ui/Panel";
import { formatCurrency } from "@/lib/format";
import type { GoalStatus, SpendingGoal } from "@/lib/insights/types";

type SpendingGoalsProps = {
  goals: SpendingGoal[];
  currency: string;
};

const STATUS_STYLES: Record<GoalStatus, { label: string; text: string; bar: string }> = {
  on_track: { label: "On track", text: "text-brand-dark", bar: "bg-brand" },
  warning: { label: "Close to limit", text: "text-warning", bar: "bg-amber-500" },
  exceeded: { label: "Over budget", text: "text-danger", bar: "bg-danger" },
};

export function SpendingGoals({ goals, currency }: SpendingGoalsProps) {
  return (
    <Panel id="goals" title="Monthly budgets" description="How you're tracking against your goals">
      {goals.length === 0 ? (
        <p className="text-sm text-body">You haven&apos;t set any budgets yet.</p>
      ) : (
        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {goals.map((goal) => {
            const status = STATUS_STYLES[goal.status];
            const progressId = `${goal.id}-label`;

            return (
              <li key={goal.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p id={progressId} className="text-sm font-medium text-heading">
                    {goal.category}
                  </p>
                  <p className={`text-xs font-medium ${status.text}`}>{status.label}</p>
                </div>

                <div
                  role="progressbar"
                  aria-labelledby={progressId}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(goal.percentageUsed)}
                  aria-valuetext={`${goal.percentageUsed.toFixed(0)}% of budget used`}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-surface"
                >
                  <div
                    className={`h-full rounded-full ${status.bar}`}
                    style={{ width: `${Math.min(goal.percentageUsed, 100)}%` }}
                  />
                </div>

                <p className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-body">
                  <span>
                    {formatCurrency(goal.currentSpent, currency)} of{" "}
                    {formatCurrency(goal.monthlyBudget, currency)}
                  </span>
                  <span>{goal.daysRemaining} days remaining</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
