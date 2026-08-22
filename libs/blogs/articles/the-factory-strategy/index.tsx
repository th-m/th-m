import type { PublishedPost } from "@th-m/blogs/publish";

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return <h1>{post.title}</h1>;
}
