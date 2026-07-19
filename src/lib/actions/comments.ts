"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CommentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createComment(
  postSlug: string,
  content: string,
): Promise<CommentActionResult> {
  const trimmed = content.trim();

  if (!trimmed) {
    return { ok: false, error: "댓글 내용을 입력해 주세요." };
  }

  if (trimmed.length > 2000) {
    return { ok: false, error: "댓글은 2000자까지 작성할 수 있어요." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: "GitHub 로그인이 필요합니다." };
    }

    const meta = user.user_metadata ?? {};
    const github =
      (meta.user_name as string | undefined) ??
      (meta.preferred_username as string | undefined) ??
      null;

    const { error } = await supabase.from("comments").insert({
      post_slug: postSlug,
      user_id: user.id,
      content: trimmed,
      author_name:
        (meta.full_name as string | undefined) ??
        (meta.name as string | undefined) ??
        github ??
        "GitHub User",
      author_avatar: (meta.avatar_url as string | undefined) ?? null,
      author_github: github,
    });

    if (error) throw error;

    revalidatePath(`/blog/${postSlug}`);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    };
  }
}

export async function deleteComment(
  commentId: string,
  postSlug: string,
): Promise<CommentActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: "로그인이 필요합니다." };
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath(`/blog/${postSlug}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "댓글을 삭제하지 못했어요." };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
