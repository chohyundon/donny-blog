"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { createComment, deleteComment, signOut } from "@/lib/actions/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Comment, CommentAuthor } from "@/types";

interface CommentSectionProps {
  postSlug: string;
  initialComments: Comment[];
  user: CommentAuthor | null;
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export default function CommentSection({
  postSlug,
  initialComments,
  user,
}: CommentSectionProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoggingIn(true);
    setError(null);

    const supabase = createClient();
    const next = `/blog/${postSlug}#comments`;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (authError) {
      setError("GitHub 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createComment(postSlug, content);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setContent("");
      router.refresh();
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteComment(commentId, postSlug);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      router.refresh();
    });
  };

  return (
    <section id="comments" className="mt-16 border-t border-white/8 pt-10">
      <h2 className="text-lg font-semibold text-white">
        댓글 {initialComments.length > 0 && (
          <span className="font-normal text-white/40">{initialComments.length}</span>
        )}
      </h2>

      <p className="mt-2 text-sm text-white/40">
        끝까지 읽어주셔서 감사합니다. 좋아요와 응원 댓글은 블로그 운영에 큰 힘이 됩니다!
      </p>

      <div className="mt-8">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white/80">{user.name}</p>
                  {user.github && (
                    <p className="text-xs text-white/35">@{user.github}</p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSignOut}
                disabled={isPending}
                className="h-auto p-0 text-xs text-white/35 hover:bg-transparent hover:text-white/70"
              >
                로그아웃
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 남겨주세요..."
              rows={4}
              maxLength={2000}
              className="resize-y rounded-xl border-white/10 bg-white/4 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {content.length}/2000
              </p>
              <Button
                type="submit"
                disabled={isPending || !content.trim()}
                className="disabled:opacity-40"
              >
                {isPending ? "등록 중..." : "댓글 등록"}
              </Button>
            </div>
          </form>
        ) : (
          <Card className="gap-0 rounded-xl border border-dashed border-white/12 bg-white/2 px-5 py-8 text-center ring-0">
            <p className="text-sm text-white/45">
              댓글을 남기려면 GitHub 로그인이 필요합니다.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleGitHubLogin}
              disabled={isLoggingIn}
              className="mt-5 self-center border-white/12 bg-white/5 text-white/80 hover:bg-white/8 hover:text-white"
            >
              <GitHubIcon />
              {isLoggingIn ? "이동 중..." : "GitHub으로 로그인"}
            </Button>
          </Card>
        )}

        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </div>

      <ul className="mt-10 space-y-6">
        {initialComments.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            아직 댓글이 없습니다.
          </li>
        ) : (
          initialComments.map((comment) => {
            const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
              locale: ko,
            });
            const isOwner = user?.id === comment.user_id;

            return (
              <li key={comment.id} className="flex gap-3">
                <Avatar size="sm" className="mt-0.5 size-9">
                  <AvatarImage
                    src={comment.author_avatar ?? undefined}
                    alt={comment.author_name}
                  />
                  <AvatarFallback>{comment.author_name.slice(0, 1)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-white/80">
                      {comment.author_name}
                    </span>
                    {comment.author_github && (
                      <a
                        href={`https://github.com/${comment.author_github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-white/55"
                      >
                        @{comment.author_github}
                      </a>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {timeAgo}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/60">
                    {comment.content}
                  </p>
                  {isOwner && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isPending}
                      className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-destructive"
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
