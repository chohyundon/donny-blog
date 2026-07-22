import type { CommentAuthor } from "@/types";

interface RawGithubUser {
  id: string;
  user_metadata?: Record<string, unknown> | null;
}

export function mapGithubUser(user: RawGithubUser): CommentAuthor {
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
