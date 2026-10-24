const block = "animate-pulse rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]";

export function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading your spending insights…</span>
      <div className={`h-28 ${block}`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`h-28 ${block}`} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`h-80 ${block}`} />
        <div className={`h-80 ${block}`} />
      </div>
      <div className={`h-40 ${block}`} />
      <div className={`h-96 ${block}`} />
    </div>
  );
}
