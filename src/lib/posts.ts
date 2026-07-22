import { createClient } from "@/lib/supabase/server";
import { getE2EPostBySlug, isE2EMockDbEnabled } from "@/lib/e2e/mock-store";
import type { Post } from "@/types";

export async function getPosts(tag?: string, q?: string): Promise<Post[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (tag && tag !== "트렌딩" && tag !== "최신") {
    query = query.eq("tag", tag);
  }

  if (q) {
    const escapedLike = q.replace(/\\/g, "\\\\").replace(/[%_]/g, (c) => `\\${c}`);
    const pattern = `%${escapedLike}%`.replace(/"/g, '\\"');
    query = query.or(`title.ilike."${pattern}",excerpt.ilike."${pattern}"`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }

  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isE2EMockDbEnabled()) {
    const e2ePost = await getE2EPostBySlug(slug);
    if (e2ePost) return e2ePost;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getPostBySlugForAuthor(
  slug: string,
): Promise<Post | null> {
  if (isE2EMockDbEnabled()) {
    return getE2EPostBySlug(slug);
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getTrendingPosts(): Promise<Post[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("likes", { ascending: false })
    .limit(6);

  if (error) return [];
  return data ?? [];
}

export async function likePost(postId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_likes", {
    post_id: postId,
  });
  if (error) throw error;
}
