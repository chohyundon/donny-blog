export default function PostCardSkeleton() {
  return (
    <div className="h-full animate-pulse overflow-hidden rounded-2xl border border-white/[0.07] bg-card">
      <div className="h-44 bg-white/[0.06]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-4/5 rounded bg-white/[0.08]" />
        <div className="h-3 w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}
