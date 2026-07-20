import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Post } from "@/types";

const STORE_DIR = path.join(process.cwd(), ".e2e");
const STORE_FILE = path.join(STORE_DIR, "posts.json");

async function readStore(): Promise<Post[]> {
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}

async function writeStore(posts: Post[]) {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(posts, null, 2), "utf8");
}

export function isE2EMockDbEnabled() {
  return process.env.E2E_MOCK_DB === "true";
}

export async function saveE2EPost(post: Post) {
  const posts = await readStore();
  const next = posts.filter((item) => item.slug !== post.slug);
  next.push(post);
  await writeStore(next);
}

export async function getE2EPostBySlug(slug: string): Promise<Post | null> {
  const posts = await readStore();
  return posts.find((item) => item.slug === slug) ?? null;
}

export async function deleteE2EPost(slug: string) {
  const posts = await readStore();
  await writeStore(posts.filter((item) => item.slug !== slug));
}
