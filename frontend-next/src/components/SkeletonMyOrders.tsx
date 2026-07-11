import { UI_CONTENT } from "@/constants/uiContent";

interface SkeletonMyOrdersProps {
  count?: number;
}

export function SkeletonMyOrders({ count = 5 }: SkeletonMyOrdersProps) {
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {UI_CONTENT.MY_ORDERS.TITLE}
      </h2>
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            data-skeleton-row
            className="animate-pulse grid grid-cols-[50px_2fr_1fr_1fr] items-center gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
          >
            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-8 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
