import { isValidElement, type ReactNode } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { ExtraProps } from "react-markdown";
import CopyCodeButton from "@/components/blog/CopyCodeButton";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> &
  ExtraProps & { "data-language"?: string };

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (isValidElement<{ children?: ReactNode; "data-line"?: string }>(node)) {
    const text = getTextContent(node.props.children);
    return node.props["data-line"] !== undefined ? `${text}\n` : text;
  }
  return "";
}

export default function CodeBlock(props: CodeBlockProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude from the ...rest spread onto <pre>
  const { children, node, "data-language": language, ...rest } = props;
  const code = getTextContent(children).replace(/\n$/, "");

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-code-border bg-code-bg">
      <div className="flex items-center justify-between border-b border-code-border px-4 py-2 text-xs text-foreground/40">
        <span>{language ?? "text"}</span>
        <CopyCodeButton code={code} />
      </div>
      <pre {...rest} data-language={language} className="overflow-x-auto px-4 py-3 text-[0.9rem]">
        {children}
      </pre>
    </div>
  );
}
