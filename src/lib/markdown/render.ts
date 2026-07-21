import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import { visit } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import type { Element, Root } from "hast";
import { markdownComponents } from "@/components/blog/markdown-components";
import { prettyCodeOptions } from "@/lib/markdown/config";

export interface TocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

function rehypeCollectHeadings(headings: TocHeading[]) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "h2" && node.tagName !== "h3") return;
      const id = node.properties?.id;
      if (typeof id !== "string") return;
      headings.push({
        id,
        text: hastToString(node),
        depth: node.tagName === "h2" ? 2 : 3,
      });
    });
  };
}

export async function renderMarkdown(source: string) {
  const headings: TocHeading[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(() => rehypeCollectHeadings(headings))
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: markdownComponents,
    })
    .process(source);

  return { content: file.result, headings };
}
