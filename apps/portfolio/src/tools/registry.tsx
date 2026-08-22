import type { ComponentType } from "react";
import { EmbeddingExplorer } from "./embedding/EmbeddingExplorer";

export interface ToolDefinition {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  content: ComponentType;
}

/**
 * Registry of auxiliary interactives available in the global tool drawer.
 * The drawer is the designated home for small interactive experiences that
 * help readers digest dense articles alongside the prose.
 */
export const toolRegistry: ToolDefinition[] = [
  {
    id: "embedding-explorer",
    label: "Embedding explorer",
    eyebrow: "Auxiliary interactive",
    description: "Search the curated GPT-2 token space and inspect nearest neighbors.",
    content: EmbeddingExplorer,
  },
];
