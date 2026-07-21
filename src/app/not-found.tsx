import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <h1 className="text-xl font-semibold text-white">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
        요청하신 페이지가 존재하지 않거나 삭제되었어요.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
