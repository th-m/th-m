# Graph Visualization

## Purpose

`@th-m/graph-visualization` owns the portable proposition-graph domain and the
interactive React experiences built on it: the full authoring editor, the
compact read-only relationship graph explorer, and the dynamic
`PropositionGraphFigure` for article pages. All interactive surfaces render on
the [reagraph](https://reagraph.dev/) WebGL canvas with THOM theme tokens,
brand fills, and the Newsreader / IBM Plex Mono typography mapping — the former
`@xyflow/react` + ELK deterministic-layout stack was removed in the reagraph
refactor. The `GraphDocument` contract, storage, seeds, and model remain the
shared source of truth.

## Ontology

A proposition states what can be asserted; a relationship expresses how two or
more propositions participate together. A `GraphDocument` is the portable
source of truth; the canvas layout and any exported image are derived output.
The library separates the domain (types, model, history, storage, seeds) from
the reagraph adapter (`canvas.ts` maps documents to nodes and edges with theme
fills and force anchors) and the React components. The `./core` export entry
excludes React and reagraph so Bun/Node CLI generators never load the WebGL
runtime.

## Key Terms

- **Proposition:** a sphere node holding a single claim (foreground fill,
  primary fill when emphasized).
- **Relationship:** a larger primary-filled node connecting two or more
  propositions.
- **GraphDocument:** the versioned JSON contract shared by the editor, the
  explorer, the article figure, storage, and seeds.
- **PropositionGraphEditor:** the full authoring editor (library, toolbar,
  reagraph canvas, inspector, import/export). Relationships are created by
  meta/ctrl-clicking two or more propositions and confirming from the toolbar;
  statements are edited in the inspector.
- **RelationshipGraphExplorer:** the read-only drawer experience — pick a
  seeded graph, click a claim, follow its relationships.
- **PropositionGraphFigure:** the dynamic article figure — a `GraphDocument`
  in, a themed reagraph canvas out, rendered client-side. Blog figures use
  this instead of checked-in SVG/PNG assets.
- **Canvas PNG:** the WebGL canvas can export itself as a PNG data URL
  (`GraphCanvasRef.exportCanvas`); portable JSON export remains on every
  surface. Deterministic SVG export moved to the layered-topology domain
  (`@th-m/topology-visualization`).

## Usage

Consumers import the package and its stylesheet once:

```ts
import { PropositionGraphFigure } from "@th-m/graph-visualization";
import "@th-m/graph-visualization/styles.css";
```

Browser consumers must provide the design theme tokens
(`@th-m/design-theme/theme.css`); the stylesheet is scoped to `.graph-app` /
`.graph-explorer` / `.graph-figure` so it never leaks resets into the consumer
page. Reagraph requires a WebGL-capable browser; the figure and canvas surface
fall back to a status message when WebGL is unavailable. CLI consumers import
`@th-m/graph-visualization/core`.

## Verification

Run `graph-visualization:typecheck` and `graph-visualization:test`. The
library depends on the `testing` support library for the vitest setup.
Component tests mock the `reagraph` canvas; the pure document→canvas mapping
(`canvas.ts`) is unit-tested without a WebGL context.
