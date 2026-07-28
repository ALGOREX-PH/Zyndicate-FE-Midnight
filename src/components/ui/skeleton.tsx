import { cx } from "../../lib/format";

/** Loading placeholder block. Pair with an sr-only "Loading" once per surface. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("animate-pulse rounded-[2px] bg-raise", className)}
    />
  );
}

/** A card-shaped skeleton used by list surfaces. */
export function SkeletonCard() {
  return (
    <div className="hairline rounded-[4px] bg-panel p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-5 w-1/2" />
      <div className="mt-5 flex gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
