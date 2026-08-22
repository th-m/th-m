import type { PublishedPost } from "@th-m/blogs/publish";

/**
 * Props contract for React article pages published by `@th-m/blogs` and
 * compiled from `src/generated/blog-pages`. `assetUrl` resolves a page-local
 * value such as "assets/x.png" to its published `/_content/...` URL.
 */
export interface ArticlePageProps {
  post: PublishedPost;
  assetUrl: (value: string) => string;
}
