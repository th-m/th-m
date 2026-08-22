import { Suspense, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  useToolDrawer,
} from "@th-m/ui";
import { toolRegistry } from "./registry";
import { ToolsTrigger } from "./ToolsTrigger";

/**
 * Global right-side tool drawer. Mounted once in the root layout; any page can
 * open a registered tool through `useToolDrawer().openTool(id, options)`. The
 * fixed right-edge tab is the always-available affordance. Tool content is
 * wrapped in Suspense so lazy (heavy) tools like the relationship graph load
 * on open instead of inflating the main bundle.
 */
export function ToolDrawer() {
  const { activeToolId, activeOptions, openTool, closeTool } = useToolDrawer();
  const activeTool = toolRegistry.find((tool) => tool.id === activeToolId) ?? null;
  const ActiveTool = activeTool?.content ?? null;
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const open = activeTool !== null;
    if (open && !wasOpenRef.current) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    } else if (!open && wasOpenRef.current) {
      const target = restoreFocusRef.current;
      window.requestAnimationFrame(() => target?.focus());
    }
    wasOpenRef.current = open;
  }, [activeTool]);

  return (
    <>
      <ToolsTrigger placement="edge" />

      <Drawer open={activeTool !== null} onOpenChange={(open) => { if (!open) closeTool(); }}>
        {activeTool ? (
          <DrawerContent
            id="portfolio-tool-drawer"
            className={activeTool.fullPageHref ? "tool-drawer-content--preview" : undefined}
          >
            <DrawerHeader className="tool-drawer-header-stacked">
              <div className="tool-drawer-header-top">
                <div>
                  <p className="eyebrow">{activeTool.eyebrow}</p>
                  <DrawerTitle>{activeTool.label}</DrawerTitle>
                  <DrawerDescription>{activeTool.description}</DrawerDescription>
                </div>
                <DrawerClose className="thom-drawer-close" aria-label="Close tool drawer">
                  <span aria-hidden="true">×</span>
                </DrawerClose>
              </div>
              <nav className="tool-drawer-switcher" aria-label="Auxiliary tools">
                {toolRegistry.map((tool) => (
                  <button
                    type="button"
                    key={tool.id}
                    aria-pressed={activeTool.id === tool.id}
                    onClick={() => openTool(tool.id)}
                  >
                    {tool.label}
                  </button>
                ))}
              </nav>
            </DrawerHeader>
            <DrawerBody>
              <Suspense fallback={<p className="tool-drawer-loading">Opening…</p>}>
                {ActiveTool ? <ActiveTool options={activeOptions ?? undefined} /> : null}
              </Suspense>
            </DrawerBody>
            {activeTool.fullPageHref ? (
              <div className="tool-drawer-handoff">
                <p>Use the drawer to inspect. Use the full route to author, arrange, and export.</p>
                <a href={activeTool.fullPageHref} onClick={closeTool}>
                  {activeTool.fullPageLabel ?? "Open full page"} <span aria-hidden="true">↗</span>
                </a>
              </div>
            ) : null}
            <p className="tool-drawer-footnote">
              Auxiliary interactives live beside the prose — the article stays visible.
            </p>
          </DrawerContent>
        ) : null}
      </Drawer>
    </>
  );
}
