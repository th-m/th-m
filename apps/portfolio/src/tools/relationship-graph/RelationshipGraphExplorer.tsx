import { RelationshipGraphExplorer as GraphExplorer } from "@th-m/graph-visualization";
import type { ToolRenderProps } from "../registry";

/**
 * Compact relationship graph explorer for the tool drawer. Composition lives
 * in the portfolio; the read-only explorer itself ships in the library so the
 * full authoring route can share the same model, layout, and export pipeline.
 */
export function RelationshipGraphExplorer({ options }: ToolRenderProps) {
  return <GraphExplorer initialGraphId={options?.graphId} />;
}
