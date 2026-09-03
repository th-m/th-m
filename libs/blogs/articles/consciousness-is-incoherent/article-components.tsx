import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
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

export { Card, CardContent, CardHeader, formatDate, LinkPreview, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
export default defineArticleComponents(articleAssets, () => ({}));
