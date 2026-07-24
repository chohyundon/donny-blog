import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { mapGithubUser } from "@/lib/github-user";
import type { Comment, CommentAuthor } from "@/types";

export function mapUserToCommentAuthor(user: User): CommentAuthor {
  return mapGithubUser(user);
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
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}
