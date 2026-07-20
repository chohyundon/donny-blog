import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/components/blog/markdown-components";

interface MarkdownContentProps {
  source: string;
}

export default async function MarkdownContent({
  source,
}: MarkdownContentProps) {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
