"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthor } from "@/lib/auth/author";

export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadPostImage(
  formData: FormData,
): Promise<UploadImageResult> {
  const user = await requireAuthor();
  if (!user) {
    return { ok: false, error: "작성자만 이미지를 업로드할 수 있습니다." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "이미지 파일을 선택해 주세요." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "jpg, png, webp, gif만 업로드할 수 있어요." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "이미지는 5MB 이하만 가능합니다." };
  }

  try {
    const supabase = await createClient();
    const ext = sanitizeFileName(file.name).split(".").pop() || "png";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(path);

    return { ok: true, url: publicUrl };
  } catch (error) {
    console.error("Failed to upload post image:", error);
    return {
      ok: false,
      error:
        "이미지 업로드에 실패했어요. Storage 버킷(post-images)과 권한을 확인해 주세요.",
    };
  }
}
