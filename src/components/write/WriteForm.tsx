"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { createPost, updatePost } from "@/lib/actions/posts";
import { uploadPostImage } from "@/lib/actions/upload";
import MarkdownPreview from "@/components/write/MarkdownPreview";
import type { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { POST_TAGS as TAGS } from "@/lib/tags";

const COLORS = [
  { color: "#1DC4D0", accent: "#0D9AA8" },
  { color: "#BF95FA", accent: "#9A6CF0" },
  { color: "#FEC847", accent: "#E5A800" },
  { color: "#28CC8F", accent: "#1AAA74" },
  { color: "#FA6690", accent: "#E0345C" },
  { color: "#3879FA", accent: "#1B5CE0" },
  { color: "#6366f1", accent: "#4f46e5" },
];

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface WriteFormProps {
  initialError?: string;
  initialPost?: Post;
}

export default function WriteForm({ initialError, initialPost }: WriteFormProps) {
  const router = useRouter();
  const isEditMode = !!initialPost;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [tag, setTag] = useState(initialPost?.tag ?? TAGS[0]);
  const [colorIndex, setColorIndex] = useState(() => {
    const index = COLORS.findIndex(
      (item) => item.color === initialPost?.thumbnail_color,
    );
    return index === -1 ? 0 : index;
  });
  const [published, setPublished] = useState(initialPost?.published ?? true);
  const [error, setError] = useState(initialError ?? null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialPost?.thumbnail_url ?? null,
  );
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const selectedColor = COLORS[colorIndex];

  const previewSlug = useMemo(
    () => (slugTouched ? slug : toSlug(title)),
    [slug, slugTouched, title],
  );

  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent(
        (prev) =>
          `${prev}${prev.endsWith("\n") || !prev ? "" : "\n"}${snippet}`,
      );
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
    const needsTrailingNewline = after.length > 0 && !after.startsWith("\n");
    const next = `${before}${needsLeadingNewline ? "\n" : ""}${snippet}${needsTrailingNewline ? "\n" : ""}${after}`;
    const cursor =
      before.length +
      (needsLeadingNewline ? 1 : 0) +
      snippet.length +
      (needsTrailingNewline ? 1 : 0);

    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadPostImage(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const alt = file.name.replace(/\.[^.]+$/, "") || "image";
      insertAtCursor(`![${alt}](${result.url})`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCoverUpload = async (file: File) => {
    setError(null);
    setIsCoverUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadPostImage(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setCoverImageUrl(result.url);
    } finally {
      setIsCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("slug", previewSlug);
    formData.set("tag", tag);
    formData.set("thumbnail_color", selectedColor.color);
    formData.set("thumbnail_accent", selectedColor.accent);
    formData.set("thumbnail_url", coverImageUrl ?? "");

    startTransition(async () => {
      const result = isEditMode
        ? await updatePost(initialPost.slug, formData)
        : await createPost(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/blog/${result.slug}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="mb-2 text-sm font-normal text-white/45">제목</Label>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="글 제목"
          className="h-auto rounded-xl border-white/10 bg-white/4 px-4 py-3 text-base text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
        />
      </div>

      <div>
        <Label className="mb-2 text-sm font-normal text-white/45">슬러그</Label>
        <Input
          name="slug"
          value={previewSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(toSlug(e.target.value));
          }}
          readOnly={isEditMode}
          placeholder="my-post-slug"
          className="h-auto rounded-xl border-white/10 bg-white/4 px-4 py-3 font-mono text-sm text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0 read-only:opacity-50"
        />
        {isEditMode && (
          <p className="mt-2 text-xs text-muted-foreground">
            슬러그는 링크가 깨지지 않도록 수정할 수 없어요.
          </p>
        )}
      </div>

      <div>
        <Label className="mb-2 text-sm font-normal text-white/45">요약</Label>
        <Textarea
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="목록에 보일 짧은 소개"
          className="resize-y rounded-xl border-white/10 bg-white/4 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <Label className="text-sm font-normal text-white/45">본문</Label>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImageUpload(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isPending}
              className="border-white/10 bg-white/4 text-xs text-white/60 hover:bg-white/8 hover:text-white">
              {isUploading ? (
                <LoaderCircle size={13} className="animate-spin" />
              ) : (
                <ImagePlus size={13} />
              )}
              {isUploading ? "업로드 중..." : "이미지 넣기"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Textarea
            ref={textareaRef}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            placeholder={
              "마크다운으로 작성하세요.\n중간중간 [이미지 넣기]로 사진을 삽입할 수 있습니다."
            }
            className="resize-y rounded-xl border-white/10 bg-white/4 px-4 py-3 font-mono text-sm leading-relaxed text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0 lg:h-auto"
          />
          <div className="hidden lg:block">
            <MarkdownPreview content={content} />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          커서 위치에 <code className="text-white/45">![설명](url)</code>
          형식으로 들어갑니다. jpg/png/webp/gif, 최대 5MB.
        </p>
      </div>

      <div>
        <Label className="mb-2 text-sm font-normal text-white/45">
          커버 이미지
        </Label>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleCoverUpload(file);
          }}
        />
        {coverImageUrl ? (
          <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-white/10">
            <Image
              src={coverImageUrl}
              alt="커버 이미지 미리보기"
              fill
              sizes="320px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImageUrl(null)}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="커버 이미지 제거">
              <X size={14} />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => coverInputRef.current?.click()}
            disabled={isCoverUploading || isPending}
            className="border-white/10 bg-white/4 text-xs text-white/60 hover:bg-white/8 hover:text-white">
            {isCoverUploading ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <ImagePlus size={13} />
            )}
            {isCoverUploading ? "업로드 중..." : "이미지 선택"}
          </Button>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          선택하지 않으면 아래 썸네일 색으로 카드가 표시됩니다.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-2 text-sm font-normal text-white/45">태그</Label>
          <Select
            value={tag}
            onValueChange={(value) => setTag(value as string)}>
            <SelectTrigger className="h-auto w-full rounded-xl border-white/10 bg-[#16161f] px-4 py-3 text-sm text-white focus-visible:border-white/20 focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAGS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 text-sm font-normal text-white/45">
            썸네일 색
          </Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((item, index) => (
              <button
                key={item.color}
                type="button"
                onClick={() => setColorIndex(index)}
                className={`h-9 w-9 rounded-full border-2 transition-transform ${
                  colorIndex === index
                    ? "scale-110 border-white"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: item.color }}
                aria-label={`색상 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Label className="flex items-center gap-2 text-sm font-normal text-white/55">
        <Checkbox
          name="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(checked === true)}
        />
        바로 공개하기
      </Label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={isPending || isUploading}
          className="rounded-xl px-5 py-3 text-sm">
          {isPending ? "저장 중..." : isEditMode ? "수정 저장" : "글 발행"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="rounded-xl border-white/10 px-5 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white">
          취소
        </Button>
      </div>
    </form>
  );
}
