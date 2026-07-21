import Link from "next/link";
import { GitFork, X, Rss } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const LINKS = {
  blog: [
    { label: "Featured", href: "/blog?tab=trending" },
    { label: "React", href: "/blog?tag=React" },
    { label: "TypeScript", href: "/blog?tag=TypeScript" },
    { label: "Next.js", href: "/blog?tag=Next.js" },
  ],
  me: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "RSS Feed", href: "/feed.xml" },
  ],
};

const socialIconClass = cn(
  buttonVariants({ variant: "outline", size: "icon" }),
  "border-border text-foreground/40 hover:border-foreground/20 hover:bg-transparent hover:text-foreground",
);

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="text-lg font-bold text-foreground">
              donny.log
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60">
              React, TypeScript, Next.js 그리고 더 나은 웹을 위한 실전 경험과
              인사이트를 기록합니다.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={socialIconClass}
                aria-label="GitHub">
                <GitFork size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={socialIconClass}
                aria-label="X (Twitter)">
                <X size={16} />
              </a>
              <Link
                href="/feed.xml"
                className={socialIconClass}
                aria-label="RSS 피드">
                <Rss size={16} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
                Blog
              </p>
              <ul className="space-y-3">
                {LINKS.blog.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/50 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
                More
              </p>
              <ul className="space-y-3">
                {LINKS.me.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/50 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mt-12 bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-xs text-foreground/50">
            © 2025 Donny. All rights reserved.
          </p>
          <p className="text-xs text-foreground/50">Built with Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  );
}
