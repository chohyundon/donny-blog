import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { PluggableList } from "unified";

export const remarkPlugins: PluggableList = [remarkGfm];

export const previewRehypePlugins: PluggableList = [rehypeRaw];
