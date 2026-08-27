import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import type { ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Claim({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="article-claim">
      <CardHeader><p className="eyebrow">{label}</p></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Term({ children, definition }: { children: ReactNode; definition: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">{definition}</TooltipContent>
    </Tooltip>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

export { Card, CardContent, CardHeader, Claim, ExternalLink, formatDate, LinkPreview, Section, Term, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
export default defineArticleComponents(articleAssets, () => ({}));
