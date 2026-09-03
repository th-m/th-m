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

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export { Card, CardContent, CardHeader, CardTitle, DecodingExplorer, EmbeddingCompositionExplorer, formatDate, GenerationPlayback, Link, LinkPreview, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TrainingWalkthrough };
export default defineArticleComponents(articleAssets, () => ({
  "decoding-explorer": DecodingExplorer,
  "embedding-composition-explorer": EmbeddingCompositionExplorer,
  "generation-playback": GenerationPlayback,
  "training-walkthrough": TrainingWalkthrough,
}));
