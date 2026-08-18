import { describe, expect, it } from "vitest";
import type { PublishedPost } from "@th-m/blogs/publish";
import { articleAssetUrl } from "../src/content/blog-content";

const post: PublishedPost = {
  slug: "public-title",
  title: "Public title",
  description: "A concise public description.",
  publishedAt: "2026-08-16",
  tags: [],
  articlePath: "posts/public-title/article.md",
  assetsPath: "posts/public-title/assets",
};

describe("articleAssetUrl", () => {
  it("maps sibling article assets into the staged public content tree", () => {
    expect(articleAssetUrl(post, "assets/figure.svg")).toBe("/_content/posts/public-title/assets/figure.svg");
    expect(articleAssetUrl(post, "./assets/figure.svg?theme=dark#detail")).toBe(
      "/_content/posts/public-title/assets/figure.svg?theme=dark#detail",
    );
  });

  it("leaves external, root-relative, fragment, and escaping URLs unchanged", () => {
    for (const value of ["https://example.com/figure.svg", "/brand/thom.svg", "#detail", "../private.md"]) {
      expect(articleAssetUrl(post, value)).toBe(value);
    }
  });
});
