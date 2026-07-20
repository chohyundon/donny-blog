"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuthor } from "@/lib/auth/author";
import {
  deleteE2EPost,
  getE2EPostBySlug,
  isE2EMockDbEnabled,
  saveE2EPost,
} from "@/lib/e2e/mock-store";
import type { Post } from "@/types";

export type CreatePostResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type UpdatePostResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export type DeletePostResult = { ok: true } | { ok: false; error: string };

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function createPost(
  formData: FormData,
): Promise<CreatePostResult> {
  const user = await requireAuthor();
  if (!user) {
    return { ok: false, error: "작성자만 글을 쓸 수 있습니다." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim() || "개발일지";
  const thumbnailColor =
    String(formData.get("thumbnail_color") ?? "").trim() || "#6366f1";
  const thumbnailAccent =
    String(formData.get("thumbnail_accent") ?? "").trim() || "#4f46e5";
  const thumbnailUrl =
    String(formData.get("thumbnail_url") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  if (!title) {
    return { ok: false, error: "제목을 입력해 주세요." };
  }

  if (!content) {
    return { ok: false, error: "본문을 입력해 주세요." };
  }

  const slug = slugify(slugInput || title);
  if (!slug) {
    return { ok: false, error: "유효한 슬러그를 입력해 주세요." };
  }

  const now = new Date().toISOString();
  const post: Post = {
    id: crypto.randomUUID(),
    title,
    slug,
    excerpt: excerpt || content.slice(0, 140),
    content,
    tag,
    thumbnail_color: thumbnailColor,
    thumbnail_accent: thumbnailAccent,
    thumbnail_url: thumbnailUrl,
    read_time: estimateReadTime(content),
    published,
    published_at: published ? now : now,
    likes: 0,
    comments_count: 0,
    created_at: now,
  };

  if (isE2EMockDbEnabled()) {
    await saveE2EPost(post);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { ok: true, slug };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tag: post.tag,
      thumbnail_color: post.thumbnail_color,
      thumbnail_accent: post.thumbnail_accent,
      thumbnail_url: post.thumbnail_url,
      read_time: post.read_time,
      published: post.published,
      published_at: published ? now : null,
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "이미 같은 슬러그의 글이 있어요." };
      }
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { ok: true, slug };
  } catch {
    return {
      ok: false,
      error: "글을 저장하지 못했어요. DB 권한/테이블을 확인해 주세요.",
    };
  }
}

export async function createPostAndRedirect(formData: FormData) {
  const result = await createPost(formData);
  if (!result.ok) {
    redirect(`/write?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/blog/${result.slug}`);
}

export async function updatePost(
  slug: string,
  formData: FormData,
): Promise<UpdatePostResult> {
  const user = await requireAuthor();
  if (!user) {
    return { ok: false, error: "작성자만 글을 수정할 수 있습니다." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim() || "개발일지";
  const thumbnailColor =
    String(formData.get("thumbnail_color") ?? "").trim() || "#6366f1";
  const thumbnailAccent =
    String(formData.get("thumbnail_accent") ?? "").trim() || "#4f46e5";
  const thumbnailUrl =
    String(formData.get("thumbnail_url") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  if (!title) {
    return { ok: false, error: "제목을 입력해 주세요." };
  }

  if (!content) {
    return { ok: false, error: "본문을 입력해 주세요." };
  }

  const excerptValue = excerpt || content.slice(0, 140);
  const readTime = estimateReadTime(content);

  if (isE2EMockDbEnabled()) {
    const existing = await getE2EPostBySlug(slug);
    if (!existing) {
      return { ok: false, error: "글을 찾을 수 없어요." };
    }

    await saveE2EPost({
      ...existing,
      title,
      excerpt: excerptValue,
      content,
      tag,
      thumbnail_color: thumbnailColor,
      thumbnail_accent: thumbnailAccent,
      thumbnail_url: thumbnailUrl,
      read_time: readTime,
      published,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { ok: true, slug };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("posts")
      .update({
        title,
        excerpt: excerptValue,
        content,
        tag,
        thumbnail_color: thumbnailColor,
        thumbnail_accent: thumbnailAccent,
        thumbnail_url: thumbnailUrl,
        read_time: readTime,
        published,
      })
      .eq("slug", slug);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { ok: true, slug };
  } catch {
    return {
      ok: false,
      error: "글을 수정하지 못했어요. DB 권한을 확인해 주세요.",
    };
  }
}

export async function deletePost(slug: string): Promise<DeletePostResult> {
  const user = await requireAuthor();
  if (!user) {
    return { ok: false, error: "작성자만 글을 삭제할 수 있습니다." };
  }

  if (isE2EMockDbEnabled()) {
    await deleteE2EPost(slug);
    revalidatePath("/");
    revalidatePath("/blog");
    return { ok: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("slug", slug);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/blog");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "글을 삭제하지 못했어요. DB 권한을 확인해 주세요.",
    };
  }
}
