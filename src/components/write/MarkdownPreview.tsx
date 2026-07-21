"use client";

import ReactMarkdown from "react-markdown";
import { markdownComponents } from "@/components/blog/markdown-components";
import { remarkPlugins, previewRehypePlugins } from "@/lib/markdown/config";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <div className="flex h-full min-h-[24rem] items-center justify-center rounded-xl border border-border bg-surface-subtle text-sm text-foreground/25">
        미리보기가 여기에 표시됩니다.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[24rem] overflow-y-auto rounded-xl border border-border bg-surface-subtle px-4 py-3">
      <div className="prose-blog max-w-[65ch]">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={previewRehypePlugins}
          components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
