# Graph Visualization

## Purpose

`@th-m/graph-visualization` owns the portable proposition-graph domain and the
interactive React experiences built on it: the full authoring editor and the
compact read-only relationship graph explorer. It is the shared home for the
`GraphDocument` contract, deterministic ELK layout, SVG export, and the
`@xyflow/react` canvas used by both the local authoring tool (`tools/graph`)
and the portfolio app.

## Ontology

A proposition states what can be asserted; a relationship expresses how two or
more propositions participate together. A `GraphDocument` is the portable
source of truth; layout positions and rendered artifacts are derived output.
The library separates the domain (types, model, history, storage, seeds) from
the deterministic layout, the self-contained SVG renderer, and the React
components. The `./core` export entry excludes React so Bun/Node CLI
generators never load `@xyflow/react` or the ELK worker.

## Key Terms

- **Proposition:** a circle-shaped node holding a single claim.
- **Relationship:** a card-shaped node connecting two or more propositions.
- **GraphDocument:** the versioned JSON contract shared by the editor, the
  explorer, storage, and the CLI renderer.
- **PropositionGraphEditor:** the full authoring editor (library, toolbar,
  canvas, inspector, import/export).
- **RelationshipGraphExplorer:** the read-only drawer experience — pick a
  seeded graph, click a claim, follow its relationships.
- **Artifact pair:** `<output>.svg` and `<output>@2x.png`, produced by the
  `tools/graph` CLI from this library's renderer.

## Usage

Consumers import the package and its stylesheet once:

```ts
import { PropositionGraphEditor } from "@th-m/graph-visualization";
import "@th-m/graph-visualization/styles.css";
```

Browser consumers must provide the design theme tokens
(`@th-m/design-theme/theme.css`) and `@xyflow/react/dist/style.css`; the
stylesheet is scoped to `.graph-app` / `.graph-explorer` so it never leaks
resets into the consumer page. CLI consumers import `@th-m/graph-visualization/core`.

## Verification

Run `graph-visualization:typecheck` and `graph-visualization:test`. The
library depends on the `testing` support library for the vitest setup.
