"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/components/blog/markdown-components";

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
      <div className="prose-blog">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
