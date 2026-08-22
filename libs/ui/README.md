# THOM UI

## Purpose

`@th-m/ui` owns the reusable, THOM-styled interface primitives shared by the
portfolio app and the React article pages: buttons, cards, tooltips, hover
cards, dialogs, and the right-side drawer. Components are ports of the
[shadcn/ui](https://ui.shadcn.com) primitives and the
[Aceternity tooltip-card](https://ui.aceternity.com/components/tooltip-card),
restyled onto the THOM design tokens from `@th-m/design-theme`.

## Ontology

The library exposes React components with typed props and a single
`styles.css` that consumes the shared `--color-*`, `--font-*`, and `--ease-*`
CSS variables. Consumers import `@th-m/ui/styles.css` once and compose the
components; the library does not own application layout, routes, or the tool
drawer shell (that shell is portfolio composition).

## Key Terms

- **Primitive:** one reusable component (Button, Card, Tooltip, HoverCard,
  Dialog, Drawer).
- **TooltipCard:** the Aceternity-style card that reveals a floating detail
  panel on hover or focus.
- **Surface tokens:** the `card`, `hover-card`, `popover`, and `dialog`
  foundation colors that give each primitive its material.
- **Consumer:** an app or React article page that imports the components and
  the shared stylesheet.

Import `@th-m/ui/styles.css` once in the consuming application.
