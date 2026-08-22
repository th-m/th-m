# Graph Visualization Agent Contract

## Operational Flow

Keep the domain model, deterministic layout, SVG renderer, editor, and
explorer on the same `GraphDocument` contract, and keep the `./core` entry
free of React imports so CLI generators stay Bun/Node-safe.

## Required Verification Parameters Within Nested Context

Run `graph-visualization:typecheck` and `graph-visualization:test`. After
schema, layout, theme, rendering, or interaction changes, also run the
consuming projects' checks: `graph:typecheck`, `graph:test`, and a `graph:gen`
smoke run on a fixture (inspect both artifacts), plus `portfolio:typecheck`
and `portfolio:test`.

## Required Invariants Within Folder Context

The library does not start or publish an application and never imports app or
tool source. The editor and explorer are read-only consumers of the same
storage key; the explorer never mutates the library. The stylesheet is scoped
to `.graph-app` / `.graph-explorer` and relies on consumers for resets, theme
tokens, and `@xyflow/react/dist/style.css`.
