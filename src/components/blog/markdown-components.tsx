import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import type { Components, ExtraProps } from "react-markdown";

type MarkdownImageProps = ComponentPropsWithoutRef<"img"> & ExtraProps;

function MarkdownImage(props: MarkdownImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const alt = props.alt ?? "";

  if (!src) return null;

  return (
    <span className="my-8 block overflow-hidden rounded-xl border border-border">
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

export const markdownComponents: Components = {
  img: MarkdownImage,
};
