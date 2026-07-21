import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

function getLanguage(code: Element): string {
  const classNames = (code.properties?.className as string[] | undefined) ?? [];
  const langClass = classNames.find(
    (name) => typeof name === "string" && name.startsWith("language-"),
  );
  return langClass ? langClass.slice("language-".length) : "text";
}

// Cloudflare Workers 무료 플랜 스크립트 용량 한도(3MiB) 때문에 Shiki 기반
// 문법 강조는 포기했다 — 대신 코드블록 헤더에 언어 라벨만 붙여준다.
export function rehypeCodeLanguage() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const [first] = node.children;
      if (node.tagName !== "pre" || first?.type !== "element" || first.tagName !== "code") {
        return;
      }
      node.properties = {
        ...node.properties,
        "data-language": getLanguage(first),
      };
    });
  };
}
