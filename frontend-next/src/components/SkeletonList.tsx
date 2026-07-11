interface SkeletonListProps {
  count?: number;
}

export function SkeletonList({ count = 12 }: SkeletonListProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
            All Foods List
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              data-skeleton-item
              className="animate-pulse rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="h-56 bg-gray-100 dark:bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-2/3 rounded bg-gray-100 dark:bg-slate-800" />
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
