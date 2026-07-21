import PostCardSkeleton from "@/components/ui/PostCardSkeleton";

export default function BlogLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl animate-pulse px-8">
        <div className="mb-10">
          <div className="h-10 w-1/3 rounded bg-white/[0.06]" />
          <div className="mt-3 h-4 w-1/2 rounded bg-white/[0.05]" />
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 rounded-full bg-white/[0.05]" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
