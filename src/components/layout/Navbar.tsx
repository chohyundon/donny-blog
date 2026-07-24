"use client";

import Link from "next/link";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, PenLine, X, Menu } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/comments";
import { AUTHOR_EMAIL } from "@/lib/auth/constants";
import { mapGithubUser } from "@/lib/github-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerPopup,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { BLOG_NAV_ITEMS } from "@/lib/nav";
import type { CommentAuthor } from "@/types";

const NAV_ITEMS = [...BLOG_NAV_ITEMS, { label: "CSS", href: "/blog?tag=CSS" }];

type NavUser = CommentAuthor & { email: string | null };

function mapUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): NavUser {
  return { ...mapGithubUser(user), email: user.email ?? null };
}

interface NavbarProps {
  initialUser: User | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(
    initialUser ? mapUser(initialUser) : null,
  );
  const [isPending, startTransition] = useTransition();

  const isAuthor =
    !!user?.email && user.email.toLowerCase() === AUTHOR_EMAIL.toLowerCase();

  useEffect(() => {
    const supabase = createClient();

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

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/blog?q=${encodeURIComponent(trimmed)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      setUser(null);
      router.refresh();
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-foreground">
          donny.log
        </Link>

        {searchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className="mx-8 flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-2">
            <Search size={15} className="shrink-0 text-foreground/40" />
            <Input
              autoFocus
              aria-label="포스트 검색"
              placeholder="포스트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-auto flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button
              type="button"
              aria-label="검색 닫기"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-foreground/40 hover:bg-transparent hover:text-foreground">
              <X size={15} />
            </Button>
          </form>
        ) : (
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/50 transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <Drawer open={navOpen} onOpenChange={setNavOpen}>
            <DrawerTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="메뉴 열기"
                  className="text-foreground/50 hover:bg-surface-hover hover:text-foreground md:hidden"
                />
              }>
              <Menu size={17} />
            </DrawerTrigger>
            <DrawerPortal>
              <DrawerBackdrop />
              <DrawerPopup>
                <DrawerTitle className="sr-only">메뉴</DrawerTitle>
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                  <span className="text-sm font-medium text-foreground/60">
                    메뉴
                  </span>
                  <DrawerClose
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="메뉴 닫기"
                        className="text-foreground/50 hover:bg-surface-hover hover:text-foreground"
                      />
                    }>
                    <X size={17} />
                  </DrawerClose>
                </div>

                <ul className="flex flex-col p-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setNavOpen(false)}
                        className="block rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:bg-surface-hover hover:text-foreground">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-border p-4">
                  {user ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setNavOpen(false);
                      }}
                      disabled={isPending}
                      className="flex w-full items-center gap-2 border-foreground/15 text-foreground/60 hover:bg-surface-hover hover:text-foreground">
                      {user.avatarUrl ? (
                        <Avatar size="sm" className="size-5">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>
                            {user.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      ) : null}
                      로그아웃
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleGitHubLogin();
                        setNavOpen(false);
                      }}
                      className="w-full border-foreground/15 text-foreground/60 hover:bg-surface-hover hover:text-foreground">
                      GitHub 로그인
                    </Button>
                  )}
                </div>
              </DrawerPopup>
            </DrawerPortal>
          </Drawer>
          <ThemeToggle />
          {!searchOpen && (
            <Button
              type="button"
              aria-label="검색"
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-foreground/50 hover:bg-surface-hover hover:text-foreground">
              <Search size={17} />
            </Button>
          )}

          {user ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              disabled={isPending}
              className="hidden items-center gap-2 border-foreground/15 text-foreground/60 hover:bg-surface-hover hover:text-foreground md:flex">
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
              className="hidden border-foreground/15 text-foreground/60 hover:bg-surface-hover hover:text-foreground md:flex">
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
