import * as React from "react";
import {
  ToolDrawerContext,
  type ToolDrawerContextValue,
  type ToolDrawerOptions,
} from "@th-m/ui";

/**
 * Application-side provider for the global tool drawer. The context and the
 * `useToolDrawer` hook live in `@th-m/ui` so React article pages (which may
 * import only from `@th-m/ui` and THOM visualization libraries) can open a
 * drawer tool alongside the prose; this provider supplies the values from the
 * portfolio's tool registry.
 */
export function ToolDrawerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState<{ id: string; options: ToolDrawerOptions | null } | null>(
    null,
  );

  const value = React.useMemo<ToolDrawerContextValue>(
    () => ({
      activeToolId: active?.id ?? null,
      activeOptions: active?.options ?? null,
      openTool: (id: string, options?: ToolDrawerOptions) => setActive({ id, options: options ?? null }),
      closeTool: () => setActive(null),
    }),
    [active],
  );

  return <ToolDrawerContext.Provider value={value}>{children}</ToolDrawerContext.Provider>;
}

export { useToolDrawer } from "@th-m/ui";
