interface SkeletonLoaderProps {
  count?: number;
}

export function SkeletonLoader({ count = 24 }: SkeletonLoaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-skeleton-item
          className="animate-pulse rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
        >
          <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800" />
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-12 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
