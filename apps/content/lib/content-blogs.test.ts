import { describe, expect, it } from "vitest";
import {
  emptyContentBlog,
  normalizeContentBlog,
  parseContentBlogsStore,
  prepareContentBlogForSave,
} from "./content-blogs";

describe("content-blogs", () => {
  it("defaults a new blog to draft with the given site", () => {
    const blog = emptyContentBlog(["kp2"]);
    expect(blog.status).toBe("draft");
    expect(blog.sites).toEqual(["kp2"]);
    expect(blog.gallery).toEqual([]);
  });

  it("normalizes unknown sites and status", () => {
    const blog = normalizeContentBlog({
      id: "a",
      title: "  Hello  ",
      body: "Body",
      publishedAt: "2026-05-01T12:00:00.000Z",
      featuredImageUrl: " https://images.kharis.org/x.jpg ",
      gallery: ["https://a", "", "https://b"],
      sites: ["kharis", "app", "kp2", "kharis"],
      status: "nope",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    expect(blog.title).toBe("Hello");
    expect(blog.publishedAt).toBe("2026-05-01");
    expect(blog.featuredImageUrl).toBe("https://images.kharis.org/x.jpg");
    expect(blog.gallery).toEqual(["https://a", "https://b"]);
    expect(blog.sites).toEqual(["kharis", "kp2"]);
    expect(blog.status).toBe("draft");
    expect(blog.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("bumps updatedAt on save prepare", () => {
    const blog = emptyContentBlog(["kharis"]);
    blog.updatedAt = "2020-01-01T00:00:00.000Z";
    const saved = prepareContentBlogForSave(blog, "2026-11-20T00:00:00.000Z");
    expect(saved.updatedAt).toBe("2026-11-20T00:00:00.000Z");
  });

  it("parses an empty store", () => {
    expect(parseContentBlogsStore(null)).toEqual({ blogs: [] });
    expect(
      parseContentBlogsStore({ blogs: [{ title: "One", sites: ["kharis"] }] }).blogs,
    ).toHaveLength(1);
  });
});
