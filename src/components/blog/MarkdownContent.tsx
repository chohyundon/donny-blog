import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

function MarkdownImage(props: ComponentPropsWithoutRef<"img">) {
  const src = typeof props.src === "string" ? props.src : "";
  const alt = props.alt ?? "";

  if (!src) return null;

  return (
    <span className="my-8 block overflow-hidden rounded-xl border border-white/8">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </span>
  );
}

const components = {
  img: MarkdownImage,
};

interface MarkdownContentProps {
  source: string;
}

export default async function MarkdownContent({ source }: MarkdownContentProps) {
  return (
    <div className="prose-blog">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
