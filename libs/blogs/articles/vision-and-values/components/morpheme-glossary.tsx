import { lazy, Suspense, type AnchorHTMLAttributes } from "react";
import { BlogLink, DocumentPopover, Table } from "@th-m/blogs/components";

// Explicit opt-in to this reference only. No research directory is staged.
const Glossary = lazy(() => import("@th-m/blogs/references/language-units-glossary.md"));
const glossaryComponents = {
  h1: () => null,
  table: Table,
  a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => href
    ? <BlogLink href={href} {...props}>{children}</BlogLink>
    : <a {...props}>{children}</a>,
};

export function MorphemeGlossary() {
  return (
    <DocumentPopover title="Grams and Language Units: A Cross-Domain Glossary" trigger="morpheme">
      <Suspense fallback={<p role="status">Loading glossary…</p>}>
        <Glossary components={glossaryComponents} />
      </Suspense>
    </DocumentPopover>
  );
}
