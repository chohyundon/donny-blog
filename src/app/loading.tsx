import PostGridSkeleton from "@/components/ui/PostGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="pt-16">
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-14 sm:px-8 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-14">
          <div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-4 h-9 w-full max-w-md" />
            <Skeleton className="mt-6 h-4 w-full max-w-xl" />
            <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
          </div>
          <div className="min-w-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>

          <PostGridSkeleton />
        </div>
      </section>
    </div>
  );
}
