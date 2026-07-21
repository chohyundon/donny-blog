import PostCardSkeleton from "@/components/ui/PostCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-7xl animate-pulse px-8 pt-20 pb-10">
        <div className="h-10 w-2/3 rounded bg-white/[0.06]" />
        <div className="mt-4 h-4 w-1/3 rounded bg-white/[0.05]" />
      </div>

      <section className="mt-4">
        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
