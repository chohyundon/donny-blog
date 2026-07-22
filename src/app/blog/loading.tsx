import PostGridSkeleton from "@/components/ui/PostGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>

        <PostGridSkeleton />
      </div>
    </div>
  );
}
