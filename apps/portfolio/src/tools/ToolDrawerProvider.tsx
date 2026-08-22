import * as React from "react";
import { toolRegistry, type ToolDefinition } from "./registry";

interface ToolDrawerContextValue {
  /** The active tool, or null when the drawer is closed. */
  activeTool: ToolDefinition | null;
  openTool: (id: string) => void;
  closeTool: () => void;
}

const ToolDrawerContext = React.createContext<ToolDrawerContextValue | null>(null);

export function ToolDrawerProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const value = React.useMemo<ToolDrawerContextValue>(
    () => ({
      activeTool: toolRegistry.find((tool) => tool.id === activeId) ?? null,
      openTool: (id: string) => setActiveId(id),
      closeTool: () => setActiveId(null),
    }),
    [activeId],
  );

  return <ToolDrawerContext.Provider value={value}>{children}</ToolDrawerContext.Provider>;
}

export function useToolDrawer(): ToolDrawerContextValue {
  const context = React.useContext(ToolDrawerContext);
  if (!context) throw new Error("useToolDrawer must be used within a ToolDrawerProvider.");
  return context;
}
