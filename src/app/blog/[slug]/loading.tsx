export default function PostLoading() {
  return (
    <div className="animate-pulse pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-8">
        <div className="mb-10 h-5 w-32 rounded bg-white/[0.06]" />
        <div className="mb-10 h-56 rounded-2xl bg-white/[0.06]" />
        <div className="mb-6 h-4 w-1/2 rounded bg-white/[0.05]" />
        <div className="mb-8 h-9 w-3/4 rounded bg-white/[0.07]" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-white/[0.05]" />
          <div className="h-4 w-full rounded bg-white/[0.05]" />
          <div className="h-4 w-2/3 rounded bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
