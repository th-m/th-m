import { lazy, type ComponentType } from "react";
import { EmbeddingExplorer } from "./embedding/EmbeddingExplorer";
import { LlmExplorer } from "./llm-explorer/LlmExplorer";

/**
 * Options passed to a tool's content component when opened programmatically
 * (e.g. an article asking the drawer to open a specific graph).
 */
export interface ToolOptions {
  /** Graph document id for tools that render a proposition graph. */
  graphId?: string;
}

export interface ToolRenderProps {
  options?: ToolOptions;
}

export interface ToolDefinition {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  content: ComponentType<ToolRenderProps>;
}

// The relationship graph explorer renders ReactFlow + the ELK worker, so it is
// lazy-loaded to keep the heavy chunk out of the main bundle; ToolDrawer wraps
// tool content in a Suspense boundary.
const RelationshipGraphExplorer = lazy(() =>
  import("./relationship-graph/RelationshipGraphExplorer").then((module) => ({
    default: module.RelationshipGraphExplorer,
  })),
);

const SetAtlasExplorer = lazy(() =>
  import("./set-atlas/SetAtlasExplorer").then((module) => ({
    default: module.SetAtlasExplorer,
  })),
);

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
  {
    id: "llm-explorer",
    label: "LLM explorer",
    eyebrow: "Auxiliary interactive",
    description: "Watch token-by-token generation, decoding strategies, and training in the browser.",
    content: LlmExplorer,
  },
  {
    id: "relationship-graph",
    label: "Relationship graph",
    eyebrow: "Auxiliary interactive",
    description: "Explore proposition graphs: pick a seed, click a claim, follow its relationships.",
    content: RelationshipGraphExplorer,
  },
  {
    id: "set-atlas-explorer",
    label: "Set atlas",
    eyebrow: "Auxiliary interactive",
    description: "Inspect TypeScript types as sets — curated snippets, rendered from compiler analysis.",
    content: SetAtlasExplorer,
  },
];
