import Link from "next/link";
import { AUTHOR_EMAIL } from "@/lib/auth/author";

interface AuthorOnlyNoticeProps {
  mode: "create" | "edit";
}

export default function AuthorOnlyNotice({ mode }: AuthorOnlyNoticeProps) {
  const title =
    mode === "create" ? "글쓰기는 작성자만 가능합니다" : "글 수정은 작성자만 가능합니다";
  const verb = mode === "create" ? "작성" : "수정";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 pt-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-foreground/45">
        <span className="text-foreground/70">{AUTHOR_EMAIL}</span> 계정으로
        로그인한 경우에만 글을 {verb}할 수 있어요.
      </p>
      <div className="mt-8 flex items-center gap-4 text-sm">
        <Link
          href="/"
          className="text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground/60">
          홈으로
        </Link>
        <Link
          href="/blog"
          className="text-foreground/45 transition-colors hover:text-foreground/75">
          블로그
        </Link>
      </div>
    </div>
  );
}
