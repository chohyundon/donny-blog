"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, PenLine, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/comments";
import { AUTHOR_EMAIL } from "@/lib/auth/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CommentAuthor } from "@/types";

const NAV_ITEMS = [
  { label: "Featured", href: "/blog?tab=trending" },
  { label: "React", href: "/blog?tag=React" },
  { label: "TypeScript", href: "/blog?tag=TypeScript" },
  { label: "Next.js", href: "/blog?tag=Next.js" },
  { label: "CSS", href: "/blog?tag=CSS" },
];

type NavUser = CommentAuthor & { email: string | null };

function mapUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): NavUser {
  const meta = user.user_metadata ?? {};
  const github =
    (meta.user_name as string | undefined) ??
    (meta.preferred_username as string | undefined) ??
    null;

  return {
    id: user.id,
    email: user.email ?? null,
    name:
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      github ??
      "GitHub User",
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
    github,
  };
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [isPending, startTransition] = useTransition();

  const isAuthor =
    !!user?.email && user.email.toLowerCase() === AUTHOR_EMAIL.toLowerCase();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(mapUser(data.user));
      else setUser(null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(mapUser(session.user));
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGitHubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname)}`,
      },
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      setUser(null);
      router.refresh();
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#10101a]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-white">
          donny.log
        </Link>

        {searchOpen ? (
          <div className="mx-8 flex flex-1 items-center gap-3 rounded-xl border border-white/12 bg-white/5 px-4 py-2">
            <Search size={15} className="shrink-0 text-white/40" />
            <Input
              autoFocus
              placeholder="포스트 검색..."
              className="h-auto flex-1 border-0 bg-transparent p-0 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
            />
            <Button
              type="button"
              aria-label="검색 닫기"
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchOpen(false)}
              className="text-white/40 hover:bg-transparent hover:text-white">
              <X size={15} />
            </Button>
          </div>
        ) : (
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-white/50 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {!searchOpen && (
            <Button
              type="button"
              aria-label="검색"
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-white/50 hover:bg-white/8 hover:text-white">
              <Search size={17} />
            </Button>
          )}

          {user ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              disabled={isPending}
              className="hidden items-center gap-2 border-white/15 text-white/60 hover:bg-white/8 hover:text-white sm:flex">
              {user.avatarUrl ? (
                <Avatar size="sm" className="size-5">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
              ) : null}
              로그아웃
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleGitHubLogin}
              className="hidden border-white/15 text-white/60 hover:bg-white/8 hover:text-white sm:flex">
              GitHub 로그인
            </Button>
          )}

          {isAuthor ? (
            <Link href="/write" className={buttonVariants({ size: "sm" })}>
              <PenLine size={14} />
              글쓰기
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
