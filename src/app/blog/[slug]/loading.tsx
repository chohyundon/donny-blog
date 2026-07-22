import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto w-full max-w-3xl px-6">
        <Skeleton className="mb-5 h-4 w-32" />

        <Skeleton className="mb-6 h-44 w-full rounded-xl" />

        <div className="mb-4 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="mb-6 h-9 w-4/5" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
