import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PublishedArticle } from "../content/blog-content";
import { articleAssetUrl } from "../content/blog-content";

export type InlineFigures = Record<string, ComponentType>;

interface MarkdownSegment {
  kind: "markdown";
  content: string;
}
interface FigureSegment {
  kind: "figure";
  id: string;
}

/**
 * Splits markdown on `<!-- <marker-id> -->` comments so the caller can place an
 * inline interactive figure exactly where a static figure would sit. Markers
 * without a registered figure are simply dropped, so the same article stays
 * readable as pure Markdown in any renderer that ignores HTML comments.
 */
function splitOnInlineFigures(markdown: string, markerIds: string[]): MarkdownSegment[] | Array<MarkdownSegment | FigureSegment> {
  if (markerIds.length === 0) return [{ kind: "markdown", content: markdown }];
  const escaped = markerIds.map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`<!--\\s*(${escaped.join("|")})\\s*-->`, "g");
  const segments: Array<MarkdownSegment | FigureSegment> = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(markdown)) !== null) {
    if (match.index > cursor) {
      segments.push({ kind: "markdown", content: markdown.slice(cursor, match.index) });
    }
    segments.push({ kind: "figure", id: match[1] });
    cursor = match.index + match[0].length;
  }
  if (cursor < markdown.length) {
    segments.push({ kind: "markdown", content: markdown.slice(cursor) });
  }
  return segments;
}

function Markdown({ content, article }: { content: string; article: PublishedArticle }) {
  return (
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
      {content}
    </ReactMarkdown>
  );
}

function FigureSlot({ id, figures }: { id: string; figures: InlineFigures }) {
  const Figure = figures[id];
  return (
    <figure className="article-figure" data-figure={id}>
      {Figure ? <Figure /> : null}
    </figure>
  );
}

export function ArticleMarkdown({
  article,
  inlineFigures = {},
}: {
  article: PublishedArticle;
  inlineFigures?: InlineFigures;
}) {
  const body = article.markdown.replace(/^#[\t ]+[^\r\n]+[\t ]*(?:\r?\n)+/, "");
  const markerIds = Object.keys(inlineFigures);
  const segments = splitOnInlineFigures(body, markerIds);

  return (
    <div className="article-markdown">
      {segments.map((segment, index) =>
        segment.kind === "figure" ? (
          <FigureSlot id={segment.id} figures={inlineFigures} key={`figure-${segment.id}-${index}`} />
        ) : (
          <Markdown content={segment.content} article={article} key={`md-${index}`} />
        ),
      )}
    </div>
  );
}
