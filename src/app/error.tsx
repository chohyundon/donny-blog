"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <h1 className="text-xl font-semibold text-foreground">문제가 발생했어요</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/45">
        예상하지 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Button variant="outline" onClick={() => reset()}>
          다시 시도
        </Button>
        <Link
          href="/"
          className="text-sm text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground/60">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
