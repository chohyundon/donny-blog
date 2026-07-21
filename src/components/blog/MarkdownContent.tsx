import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import { markdownComponents } from "@/components/blog/markdown-components";
import { prettyCodeOptions } from "@/lib/markdown/config";

interface MarkdownContentProps {
  source: string;
}

export default async function MarkdownContent({
  source,
}: MarkdownContentProps) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: markdownComponents,
    })
    .process(source);

  return <div className="prose-blog">{file.result}</div>;
}
