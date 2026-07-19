import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <h1 className="text-xl font-semibold text-white">로그인에 실패했습니다</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
        GitHub 인증 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.
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
