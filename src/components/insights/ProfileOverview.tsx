import { formatCurrency, formatDate } from "@/lib/format";
import type { CustomerProfile } from "@/lib/insights/types";

type ProfileOverviewProps = {
  profile: CustomerProfile;
};

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] sm:p-6">
      <div>
        <p className="text-sm text-body">Welcome back,</p>
        <p className="text-xl font-semibold text-heading">{profile.name}</p>
        <p className="mt-1 text-sm text-body">
          <span className="mr-2 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand">
            {profile.accountType}
          </span>
          Member since{" "}
          <time dateTime={profile.joinDate}>{formatDate(profile.joinDate)}</time>
        </p>
      </div>

      <dl className="text-left sm:text-right">
        <dt className="text-sm text-body">Total spent to date</dt>
        <dd className="text-2xl font-semibold text-heading">
          {formatCurrency(profile.totalSpent, profile.currency)}
        </dd>
      </dl>
    </div>
  );
}
