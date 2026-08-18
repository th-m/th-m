import { Link } from "@tanstack/react-router";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PublishedArticle } from "../content/blog-content";
import { articleAssetUrl } from "../content/blog-content";

export function ArticleMarkdown({ article }: { article: PublishedArticle }) {
  const body = article.markdown.replace(/^#[\t ]+[^\r\n]+[\t ]*(?:\r?\n)+/, "");

  return (
    <div className="article-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        urlTransform={(value) => defaultUrlTransform(articleAssetUrl(article, value))}
        components={{
          a: ({ href, children, node: _node, ...props }) => {
            if (href === "/") return <Link to="/">{children}</Link>;
            if (href === "/writing" || href === "/writing/") return <Link to="/writing">{children}</Link>;
            const articleMatch = href?.match(/^\/writing\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
            if (articleMatch) {
              return <Link to="/writing/$slug" params={{ slug: articleMatch[1] }}>{children}</Link>;
            }
            const external = href ? /^https?:\/\//i.test(href) : false;
            return <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
          },
          img: ({ node: _node, ...props }) => <img {...props} loading="lazy" />,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
