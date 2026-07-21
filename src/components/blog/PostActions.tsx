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
    <div className="flex items-center gap-4 text-sm">
      <Link
        href={`/write/${slug}`}
        className="flex items-center gap-1.5 text-foreground/40 transition-colors hover:text-foreground">
        <Pencil size={14} />
        수정
      </Link>
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={isPending}
        className="flex items-center gap-1.5 text-foreground/40 transition-colors hover:text-rose-400 disabled:opacity-50">
        <Trash2 size={14} />
        삭제
      </button>
    </div>
  );
}
