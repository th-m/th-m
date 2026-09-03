# THOM UI

## Purpose

`@th-m/ui` owns the reusable, THOM-styled interface primitives shared by the
portfolio app and the React article pages: buttons, cards, tooltips, hover
cards, dialogs, the right-side drawer, the cursor-tracking card spotlight,
the cursor-magnifying floating dock, the link-preview destination card, and
the bento grid. Components are ports of the
[shadcn/ui](https://ui.shadcn.com) primitives and the
[Aceternity tooltip-card](https://ui.aceternity.com/components/tooltip-card),
[card-spotlight](https://ui.aceternity.com/components/card-spotlight),
[floating-dock](https://ui.aceternity.com/components/floating-dock),
[link-preview](https://ui.aceternity.com/components/link-preview), and
[bento-grids](https://ui.aceternity.com/blocks/bento-grids),
restyled onto the THOM design tokens from `@th-m/design-theme`.

## Ontology

The library exposes React components with typed props and a single
`styles.css` that consumes the shared `--color-*`, `--font-*`, and `--ease-*`
CSS variables. Consumers import `@th-m/ui/styles.css` once and compose the
components; the library does not own application layout, routes, or the tool
drawer shell (that shell is portfolio composition).

## Key Terms

- **Primitive:** one reusable component (Button, Card, Tooltip, HoverCard,
  Dialog, Drawer, CardSpotlight, FloatingDock, LinkPreview, BentoGrid).
- **TooltipCard:** the Aceternity-style card that reveals a floating detail
  panel on hover or focus.
- **CardSpotlight:** the Aceternity-style card whose gold spotlight, border
  glow, and grain noise follow the cursor while hovered or focused.
- **FloatingDock:** the Aceternity-style bar whose icon buttons magnify toward
  the cursor and reveal a mono label on hover or focus; each item is an
  accessible anchor, and positioning is left to the consumer.
- **LinkPreview:** the Aceternity-style link that reveals a small floating
  destination card (hostname + path, a custom preview, or a static image) on
  hover or focus; `asChild` keeps SPA links.
- **Popover:** a Radix-anchored, nonmodal click/touch/keyboard surface with
  Escape/outside dismissal and focus return. Compose its trigger, content,
  and close control for interactive references that need to stay open.
- **BentoGrid:** the Aceternity-style mixed-size grid; `BentoGridItem` cells
  may span columns and rows, and render as external links via `href`.
- **Surface tokens:** the `card`, `hover-card`, `popover`, and `dialog`
  foundation colors that give each primitive its material.
- **Consumer:** an app or React article page that imports the components and
  the shared stylesheet.

Import `@th-m/ui/styles.css` once in the consuming application.
