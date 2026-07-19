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
  "border-white/[0.1] text-white/40 hover:border-white/20 hover:bg-transparent hover:text-white",
);

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-[#10101a]">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="text-lg font-bold text-white">
              donny.log
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              React, TypeScript, Next.js 그리고 더 나은 웹을 위한 실전 경험과
              인사이트를 기록합니다.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={socialIconClass}>
                <GitFork size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={socialIconClass}>
                <X size={16} />
              </a>
              <Link href="/feed.xml" className={socialIconClass}>
                <Rss size={16} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Blog
              </p>
              <ul className="space-y-3">
                {LINKS.blog.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                More
              </p>
              <ul className="space-y-3">
                {LINKS.me.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mt-12 bg-white/[0.06]" />

        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-xs text-white/25">
            © 2025 Donny. All rights reserved.
          </p>
          <p className="text-xs text-white/25">Built with Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  );
}
