import { Link } from "@tanstack/react-router";
import type { ArticleAssetRegistry } from "@th-m/blogs/mdx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkPreview,
  ToolLauncher,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@th-m/ui";
import type { MDXComponents } from "mdx/types";
import { Children, cloneElement, isValidElement, type ComponentType, type HTMLAttributes, type ReactNode } from "react";
import type { PublishedArticle } from "../content/blog-content";
import { articleAssetUrl } from "../content/blog-content";

function linkElement(href: string, children: ReactNode, props: Record<string, unknown> = {}) {
  if (href === "/") return <Link to="/" {...props}>{children}</Link>;
  if (href === "/writing" || href === "/writing/") return <Link to="/writing" {...props}>{children}</Link>;
  const articleMatch = href.match(/^\/writing\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  if (articleMatch) return <Link to="/writing/$slug" params={{ slug: articleMatch[1] }} {...props}>{children}</Link>;
  const external = /^https?:\/\//i.test(href);
  return <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
}

function Section({ index, title, children }: { index?: string; title: string; children: ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index ?? ""}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Lede({ children }: { children: ReactNode }) {
  return <div className="article-outline__lede article-mdx__lede">{children}</div>;
}

function inlineMdxChildren(children: ReactNode): ReactNode {
  const content = Children.toArray(children).map((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    const nested = inlineMdxChildren(child.props.children);
    return child.type === "p" ? nested : cloneElement(child, undefined, nested);
  });
  if (content.length === 0) return null;
  return content.length === 1 ? content[0] : content;
}

function Paragraph({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props}>{inlineMdxChildren(children)}</p>;
}

function Callout({
  label,
  title,
  emphasis = false,
  children,
}: {
  label?: string;
  title?: string;
  emphasis?: boolean;
  children: ReactNode;
}) {
  return (
    <Card className={`article-claim${emphasis ? " article-claim--emphasis" : ""}`}>
      {label || title ? (
        <CardHeader>
          {label ? <p className="eyebrow">{label}</p> : null}
          {title ? <CardTitle>{title}</CardTitle> : null}
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Term({ definition, children }: { definition: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent>{definition}</TooltipContent>
    </Tooltip>
  );
}

function Gloss({
  definition,
  example,
  href,
  children,
}: {
  definition: ReactNode;
  example?: ReactNode;
  href?: string;
  children: ReactNode;
}) {
  return (
    <HoverCard openDelay={120} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>{definition}</div>
        {example ? <p>{example}</p> : null}
        {href ? <p>{linkElement(href, "Read more ↗")}</p> : null}
      </HoverCardContent>
    </HoverCard>
  );
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
    return (
      <LinkPreview url={href} asChild preview={<Preview />}>
        {linkElement(href, children)}
      </LinkPreview>
    );
  }

  const components = {
    h1: () => null,
    a: ({ href, children, node: _node, ...props }: { href?: string; children?: ReactNode; node?: unknown }) => {
      if (!href) return <a {...props}>{children}</a>;
      return <LinkPreview url={href} asChild>{linkElement(href, children, props)}</LinkPreview>;
    },
    img: ({ src, node: _node, ...props }: { src?: string; node?: unknown }) => (
      <img {...props} src={src ? articleAssetUrl(article, src) : src} loading="lazy" />
    ),
    table: ({ children, node: _node, ...props }: { children?: ReactNode; node?: unknown }) => (
      <div className="article-table-scroll" tabIndex={0}><table {...props}>{children}</table></div>
    ),
    Asset,
    Callout,
    Flow: ({ children }: { children: ReactNode }) => <div className="article-outline__flow">{children}</div>,
    Gloss,
    Lede,
    P: Paragraph,
    PreviewLink,
    Quote: ({ children, plain = false }: { children: ReactNode; plain?: boolean }) => (
      <blockquote className={plain ? "article-quote--plain" : undefined}>{children}</blockquote>
    ),
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
