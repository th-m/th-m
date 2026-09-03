import { Link } from "@tanstack/react-router";
import type { ArticleAssetRegistry } from "@th-m/blogs/mdx";
import { ArticleLink, BlogLink, Callout, ExternalLink, Flow, Gloss, Lede, Paragraph, Quote, Section, Table, Term, type BlogLinkProps } from "@th-m/blogs/components";
import { ToolLauncher } from "@th-m/ui";
import type { MDXComponents } from "mdx/types";
import type { ComponentType, ReactNode } from "react";
import type { PublishedArticle } from "../content/blog-content";
import { articleAssetUrl } from "../content/blog-content";

export function renderArticleLink({ href, children, ...props }: BlogLinkProps) {
  if (href === "/") return <Link to="/" {...props}>{children}</Link>;
  if (href === "/writing" || href === "/writing/") return <Link to="/writing" {...props}>{children}</Link>;
  const articleMatch = href.match(/^\/writing\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  if (articleMatch) return <Link to="/writing/$slug" params={{ slug: articleMatch[1] }} {...props}>{children}</Link>;
  return <a href={href} {...props}>{children}</a>;
}

export function createArticleMdxComponents(
  article: PublishedArticle,
  assets: ArticleAssetRegistry,
  articleComponents: Record<string, ComponentType<never>> = {},
): MDXComponents {
  function Asset({ id, ...componentProps }: { id: string } & Record<string, unknown>) {
    const asset = assets[id];
    if (!asset || asset.kind === "preview") throw new Error(`${article.slug} cannot render unknown Asset ${id}.`);
    if (asset.kind === "image") {
      return (
        <figure className="article-figure" data-asset={id} data-tags={asset.tags.join(" ")}>
          <img src={articleAssetUrl(article, asset.source)} alt={asset.alt} loading="lazy" />
          {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
        </figure>
      );
    }
    const Component = articleComponents[id] as unknown as ComponentType<Record<string, unknown>> | undefined;
    if (!Component) throw new Error(`${article.slug} is missing component asset ${id}.`);
    return <Component {...componentProps} />;
  }

  function PreviewLink({ href, previewId, children }: { href: string; previewId: string; children: ReactNode }) {
    const asset = assets[previewId];
    const Preview = articleComponents[previewId] as unknown as ComponentType<Record<string, never>> | undefined;
    if (asset?.kind !== "preview" || !Preview) throw new Error(`${article.slug} is missing preview asset ${previewId}.`);
    return <BlogLink href={href} preview={<Preview />}>{children}</BlogLink>;
  }

  const components = {
    h1: () => null,
    a: ({ href, children, node: _node, ...props }: { href?: string; children?: ReactNode; node?: unknown }) => {
      if (!href) return <a {...props}>{children}</a>;
      return <BlogLink href={href} {...props}>{children}</BlogLink>;
    },
    img: ({ src, node: _node, ...props }: { src?: string; node?: unknown }) => (
      <img {...props} src={src ? articleAssetUrl(article, src) : src} loading="lazy" />
    ),
    table: ({ children, node: _node, ...props }: { children?: ReactNode; node?: unknown }) => (
      <Table {...props}>{children}</Table>
    ),
    Asset,
    ArticleLink,
    BlogLink,
    Callout,
    ExternalLink,
    Flow,
    Gloss,
    Lede,
    P: Paragraph,
    PreviewLink,
    Quote,
    Section,
    Term,
    ToolLink: ({
      tool,
      href,
      label,
      options,
    }: {
      tool: string;
      href: string;
      label?: string;
      options?: Record<string, unknown>;
    }) => <ToolLauncher toolId={tool} href={href} label={label} options={options} />,
  };
  return components as unknown as MDXComponents;
}
