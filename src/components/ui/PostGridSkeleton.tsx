import { Skeleton } from "@/components/ui/skeleton";

interface PostGridSkeletonProps {
  count?: number;
}

export default function PostGridSkeleton({
  count = 6,
}: PostGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="flex flex-col gap-3 p-5">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
