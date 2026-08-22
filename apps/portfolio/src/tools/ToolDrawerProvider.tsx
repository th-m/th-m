import * as React from "react";
import { toolRegistry, type ToolDefinition, type ToolOptions } from "./registry";

interface ToolDrawerContextValue {
  /** The active tool, or null when the drawer is closed. */
  activeTool: ToolDefinition | null;
  /** Options passed to the active tool's content component (e.g. a graph id). */
  activeOptions: ToolOptions | null;
  openTool: (id: string, options?: ToolOptions) => void;
  closeTool: () => void;
}

const ToolDrawerContext = React.createContext<ToolDrawerContextValue | null>(null);

export function ToolDrawerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState<{ id: string; options: ToolOptions | null } | null>(
    null,
  );

  const value = React.useMemo<ToolDrawerContextValue>(
    () => ({
      activeTool: toolRegistry.find((tool) => tool.id === active?.id) ?? null,
      activeOptions: active?.options ?? null,
      openTool: (id: string, options?: ToolOptions) => setActive({ id, options: options ?? null }),
      closeTool: () => setActive(null),
    }),
    [active],
  );

  return <ToolDrawerContext.Provider value={value}>{children}</ToolDrawerContext.Provider>;
}

export function useToolDrawer(): ToolDrawerContextValue {
  const context = React.useContext(ToolDrawerContext);
  if (!context) throw new Error("useToolDrawer must be used within a ToolDrawerProvider.");
  return context;
}
