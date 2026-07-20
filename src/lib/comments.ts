import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Comment, CommentAuthor } from "@/types";

export function mapUserToCommentAuthor(user: User): CommentAuthor {
  const meta = user.user_metadata ?? {};
  const github =
    (meta.user_name as string | undefined) ??
    (meta.preferred_username as string | undefined) ??
    null;

  return {
    id: user.id,
    name:
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      github ??
      "GitHub User",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
    github,
  };
}

export async function getCommentsBySlug(postSlug: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as Comment[]) ?? [];
  } catch {
    return [];
  }
}
