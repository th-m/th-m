# Graph Visualization Agent Contract

## Operational Flow

Keep the domain model, reagraph adapter, editor, explorer, and figure on the
same `GraphDocument` contract, and keep the `./core` entry free of React and
reagraph imports so CLI generators stay Bun/Node-safe.

## Required Verification Parameters Within Nested Context

Run `graph-visualization:typecheck` and `graph-visualization:test`. After
schema, theme, rendering, or interaction changes, also run the consuming
projects' checks: `portfolio:typecheck` and `portfolio:test`, plus
`blogs:test` when figure or seed surfaces change.

## Required Invariants Within Folder Context

The library does not start or publish an application and never imports app or
tool source. The editor and explorer are read-only consumers of the same
storage key; the explorer never mutates the library. The reagraph adapter
(`canvas.ts`) stays React-free and the stylesheet stays scoped to
`.graph-app` / `.graph-explorer` / `.graph-figure`, relying on consumers for
resets, theme tokens, and a WebGL-capable browser. Deterministic artifact
generation lives in `@th-m/topology-visualization`, not here.
