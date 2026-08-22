import * as React from "react";
import { cn } from "./cn";
import { ToolDrawerContext, type ToolDrawerOptions } from "./tool-drawer";

export type ToolLauncherOptions = ToolDrawerOptions;

export interface ToolLauncherProps {
  /** Tool id to open in the application drawer (e.g. "relationship-graph"). */
  toolId: string;
  /** Optional options passed to the opened tool. */
  options?: ToolLauncherOptions;
  /**
   * Fallback destination rendered as a plain link when no tool drawer
   * context is provided above the page.
   */
  href: string;
  /** Button label; a gold "→" arrow is appended automatically. */
  label?: string;
  className?: string;
}

/**
 * The gold "Explore →" affordance that opens an auxiliary interactive in the
 * application tool drawer. Uses the shared drawer context when one is
 * present, and degrades to a plain anchor (the `href` fallback) when it is
 * not, so pages that use it never break in isolation.
 */
export function ToolLauncher({ toolId, options, href, label = "Explore", className }: ToolLauncherProps) {
  const drawer = React.useContext(ToolDrawerContext);
  const content = (
    <>
      {label}
      <span aria-hidden="true"> →</span>
    </>
  );
  if (!drawer) {
    return (
      <a href={href} className={cn("thom-tool-launcher", className)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cn("thom-tool-launcher", className)} onClick={() => drawer.openTool(toolId, options)}>
      {content}
    </button>
  );
}
