import { useToolDrawer } from "@th-m/ui";
import { toolRegistry } from "./registry";

export interface ToolsTriggerProps {
  placement: "edge" | "header";
}

/** Portfolio-owned trigger composition shared by desktop and mobile placements. */
export function ToolsTrigger({ placement }: ToolsTriggerProps) {
  const { activeToolId, openTool, closeTool } = useToolDrawer();
  const open = activeToolId !== null;

  return (
    <button
      type="button"
      className={placement === "edge" ? "tool-drawer-tab" : "site-header-tools"}
      aria-expanded={open}
      aria-controls="portfolio-tool-drawer"
      aria-label={open ? "Close tool drawer" : "Open tool drawer"}
      onClick={() => (open ? closeTool() : openTool(toolRegistry[0].id))}
    >
      <span aria-hidden="true">↖</span>
      Tools
    </button>
  );
}
