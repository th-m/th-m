import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import { Link } from "@tanstack/react-router";
import type { PublishedPost } from "@th-m/blogs/publish";
import { EmbeddingCompositionExplorer } from "@th-m/embedding-space/composition";
import { DecodingExplorer } from "@th-m/llm-decoding";
import { GenerationPlayback } from "@th-m/llm-generation";
import { TrainingWalkthrough } from "@th-m/llm-training";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import type { ReactNode } from "react";

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

function Term({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

function ArticleLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <LinkPreview url={`/writing/${slug}`} asChild>
      <Link to="/writing/$slug" params={{ slug }}>
        {children}
      </Link>
    </LinkPreview>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

function Flow({ children }: { children: ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

export { ArticleLink, Card, CardContent, CardHeader, CardTitle, DecodingExplorer, EmbeddingCompositionExplorer, ExternalLink, Flow, formatDate, GenerationPlayback, Link, LinkPreview, Section, Term, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TrainingWalkthrough };
export default defineArticleComponents(articleAssets, () => ({
  "decoding-explorer": DecodingExplorer,
  "embedding-composition-explorer": EmbeddingCompositionExplorer,
  "generation-playback": GenerationPlayback,
  "training-walkthrough": TrainingWalkthrough,
}));
