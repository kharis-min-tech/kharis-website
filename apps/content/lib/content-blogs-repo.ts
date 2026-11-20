import { studioData } from "@/lib/studio-data";
import {
  CONTENT_BLOGS_KEY,
  emptyContentBlogsStore,
  parseContentBlogsStore,
  prepareContentBlogForSave,
  type ContentBlog,
  type ContentBlogsStore,
} from "./content-blogs";

async function getStore(): Promise<ContentBlogsStore> {
  const [row] = await studioData.list<{ value: unknown }>("app_config", {
    where: { key: CONTENT_BLOGS_KEY },
    limit: 1,
  });
  if (!row) return emptyContentBlogsStore();
  return parseContentBlogsStore(row.value);
}

async function saveStore(store: ContentBlogsStore) {
  await studioData.upsert("app_config", {
    key: CONTENT_BLOGS_KEY,
    value: { blogs: store.blogs },
  });
  return store;
}

export async function listContentBlogs() {
  const store = await getStore();
  return store.blogs;
}

export async function saveContentBlog(blog: ContentBlog) {
  const store = await getStore();
  const normalized = prepareContentBlogForSave(blog);
  const index = store.blogs.findIndex((item) => item.id === normalized.id);
  const blogs =
    index >= 0
      ? store.blogs.map((item, i) => (i === index ? normalized : item))
      : [...store.blogs, normalized];
  const saved = await saveStore({ blogs });
  return saved.blogs.find((item) => item.id === normalized.id) ?? normalized;
}

export async function deleteContentBlog(id: string) {
  const store = await getStore();
  const blogs = store.blogs.filter((blog) => blog.id !== id);
  await saveStore({ blogs });
}
