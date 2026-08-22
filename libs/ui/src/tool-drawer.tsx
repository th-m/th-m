import * as React from "react";

/**
 * Options passed to a drawer tool when it is opened programmatically — for
 * example an article page opening the relationship graph explorer on a
 * specific graph document.
 */
export interface ToolDrawerOptions {
  /** Graph document id for tools that render a proposition graph. */
  graphId?: string;
}

export interface ToolDrawerContextValue {
  /** The id of the active tool, or null when the drawer is closed. */
  activeToolId: string | null;
  /** Options passed to the active tool's content component. */
  activeOptions: ToolDrawerOptions | null;
  openTool: (id: string, options?: ToolDrawerOptions) => void;
  closeTool: () => void;
}

/**
 * Shared context for the global tool drawer. The provider is application
 * composition (it owns the tool registry and the drawer UI), but the context
 * and hook live here so article pages — which may import only from `@th-m/ui`
 * and THOM visualization libraries — can open a drawer tool alongside the
 * prose.
 */
export const ToolDrawerContext = React.createContext<ToolDrawerContextValue | null>(null);

export function useToolDrawer(): ToolDrawerContextValue {
  const context = React.useContext(ToolDrawerContext);
  if (!context) throw new Error("useToolDrawer must be used within a ToolDrawerProvider.");
  return context;
}
