import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import type { PluggableList } from "unified";

export const remarkPlugins: PluggableList = [remarkGfm];

export const previewRehypePlugins: PluggableList = [rehypeRaw];

export const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};
