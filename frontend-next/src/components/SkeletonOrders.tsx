interface SkeletonOrdersProps {
  count?: number;
}

export function SkeletonOrders({ count = 8 }: SkeletonOrdersProps) {
  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-skeleton-item
          className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6"
        >
          <div className="h-[60px] w-[60px] rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-slate-800" />
            <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-slate-800" />
          </div>
          <div className="md:w-48 shrink-0 space-y-3">
            <div className="h-6 w-full rounded bg-gray-100 dark:bg-slate-800" />
            <div className="h-8 w-full rounded bg-gray-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
