import { createContext, useContext, type AnchorHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { LinkPreview } from "@th-m/ui";

export type BlogLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
export type BlogLinkRenderer = (props: BlogLinkProps) => ReactElement;

const LinkRendererContext = createContext<BlogLinkRenderer>((props) => <a {...props} />);

/** The host supplies routing; standalone consumers get ordinary anchors. */
export function BlogLinkProvider({ renderLink, children }: { renderLink: BlogLinkRenderer; children: ReactNode }) {
  return <LinkRendererContext.Provider value={renderLink}>{children}</LinkRendererContext.Provider>;
}

export function BlogLink({ href, children, preview, ...props }: BlogLinkProps & { preview?: ReactNode }) {
  const renderLink = useContext(LinkRendererContext);
  const external = /^https?:\/\//i.test(href);
  return (
    <LinkPreview url={href} asChild preview={preview}>
      {renderLink({ ...(external ? { target: "_blank", rel: "noreferrer" } : {}), ...props, href, children })}
    </LinkPreview>
  );
}

export function ArticleLink({ slug, children }: { slug: string; children: ReactNode }) {
  return <BlogLink href={`/writing/${slug}`}>{children}</BlogLink>;
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <BlogLink href={href} className="thom-link-preview__trigger" target="_blank" rel="noreferrer">{children}</BlogLink>;
}
