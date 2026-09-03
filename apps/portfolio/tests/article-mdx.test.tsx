import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { ArticleLink, BlogLink, BlogLinkProvider, Callout, ExternalLink, Flow, Gloss, Lede, Paragraph, Quote, Section, Term } from "@th-m/blogs/components";
import { describe, expect, it } from "vitest";
import { createArticleMdxComponents, renderArticleLink } from "../src/writing/ArticleMdx";

const article = {
  slug: "vision-and-values",
  title: "Vision and Values",
  description: "An essay.",
  publishedAt: "2026-08-16",
  tags: [],
  articlePath: "posts/vision-and-values/article.mdx",
  assetRegistryPath: "posts/vision-and-values/assets.json",
};

describe("portfolio shared MDX adapter", () => {
  it("injects the library implementations without redefining presentation", () => {
    expect(createArticleMdxComponents(article, {})).toMatchObject({
      ArticleLink, BlogLink, Callout, ExternalLink, Flow, Gloss, Lede, P: Paragraph, Quote, Section, Term,
    });
  });

  it("keeps shared cross-article links on the client router", async () => {
    const root = createRootRoute({ component: () => <BlogLinkProvider renderLink={renderArticleLink}><Outlet /></BlogLinkProvider> });
    const index = createRoute({ getParentRoute: () => root, path: "/writing", component: () => <ArticleLink slug="vision-and-values">Read Vision</ArticleLink> });
    const post = createRoute({ getParentRoute: () => root, path: "/writing/$slug", component: () => <h1>Article destination</h1> });
    const router = createRouter({ routeTree: root.addChildren([index, post]), history: createMemoryHistory({ initialEntries: ["/writing"] }) });
    await router.load();
    render(<RouterProvider router={router} />);
    fireEvent.click(screen.getByRole("link", { name: "Read Vision" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/writing/vision-and-values"));
    expect(await screen.findByRole("heading", { name: "Article destination" })).toBeInTheDocument();
  });
});
