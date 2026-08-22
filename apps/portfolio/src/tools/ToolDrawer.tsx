import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@th-m/ui";
import { toolRegistry } from "./registry";
import { useToolDrawer } from "./ToolDrawerProvider";

/**
 * Global right-side tool drawer. Mounted once in the root layout; any page can
 * open a registered tool through `useToolDrawer().openTool(id)`. The fixed
 * right-edge tab is the always-available affordance.
 */
export function ToolDrawer() {
  const { activeTool, openTool, closeTool } = useToolDrawer();
  const ActiveTool = activeTool?.content ?? null;

  return (
    <>
      <button
        type="button"
        className="tool-drawer-tab"
        aria-expanded={activeTool !== null}
        aria-label={activeTool ? "Close tool drawer" : "Open tool drawer"}
        onClick={() => (activeTool ? closeTool() : openTool(toolRegistry[0].id))}
      >
        <span aria-hidden="true">↖</span>
        Tools
      </button>

      <Drawer open={activeTool !== null} onOpenChange={(open) => { if (!open) closeTool(); }}>
        {activeTool ? (
          <DrawerContent>
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
              {ActiveTool ? <ActiveTool /> : null}
            </DrawerBody>
            <p className="tool-drawer-footnote">
              Auxiliary interactives live beside the prose — the article stays visible.
            </p>
          </DrawerContent>
        ) : null}
      </Drawer>
    </>
  );
}
