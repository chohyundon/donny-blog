"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/markdown/render";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: TocHeading[];
  className?: string;
}

export default function TableOfContents({
  headings,
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={cn("text-sm", className)} aria-label="목차">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
        목차
      </p>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block border-l-2 py-0.5 pl-3 transition-colors",
                activeId === heading.id
                  ? "border-primary font-medium text-foreground"
                  : "border-border text-foreground/45 hover:text-foreground",
              )}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
