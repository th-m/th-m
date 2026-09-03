import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode, type TableHTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle, HoverCard, HoverCardContent, HoverCardTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@th-m/ui";
import { BlogLink } from "./links";

export function Section({ index, title, children }: { index?: string; title: string; children: ReactNode }) {
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

export function Lede({ children }: { children: ReactNode }) {
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

export function Paragraph({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props}>{inlineMdxChildren(children)}</p>;
}

export function Callout({ label, title, emphasis = false, children }: {
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

export function Term({ definition, children }: { definition: ReactNode; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent>{definition}</TooltipContent>
    </Tooltip>
  );
}

export function Gloss({ definition, example, href, children }: {
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
        {href ? <p><BlogLink href={href}>Read more ↗</BlogLink></p> : null}
      </HoverCardContent>
    </HoverCard>
  );
}

export function Quote({ children, plain = false }: { children: ReactNode; plain?: boolean }) {
  return <blockquote className={plain ? "article-quote--plain" : undefined}>{children}</blockquote>;
}

export function Flow({ children }: { children: ReactNode }) {
  return <div className="article-outline__flow">{children}</div>;
}

export function Table({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="article-table-scroll" tabIndex={0}><table {...props}>{children}</table></div>;
}
