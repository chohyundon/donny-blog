"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deletePost } from "@/lib/actions/posts";

interface PostActionsProps {
  slug: string;
}

export default function PostActions({ slug }: PostActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const actionClassName =
    "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground";

  const confirmDelete = (closeToast?: () => void) => {
    closeToast?.();
    startTransition(async () => {
      const result = await deletePost(slug);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("삭제했어요.");
      router.push("/blog");
      router.refresh();
    });
  };

  const handleDeleteClick = () => {
    toast(
      ({ closeToast }: { closeToast?: () => void }) => (
        <div className="text-sm text-foreground">
          <p className="mb-3">정말 삭제하시겠습니까?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => closeToast?.()}
              className="rounded-md px-3 py-1.5 text-xs text-foreground/60 hover:bg-surface-hover">
              취소
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(closeToast)}
              className="rounded-md bg-rose-500/90 px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-rose-500">
              삭제
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false },
    );
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href={`/write/${slug}`}
        className={actionClassName}>
        <Pencil size={14} />
        수정
      </Link>
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={isPending}
        className={`${actionClassName} hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/40`}>
        <Trash2 size={14} />
        삭제
      </button>
    </div>
  );
}
