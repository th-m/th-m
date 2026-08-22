# Set Theory Visualization Agent Contract

## Operational Flow

Keep analysis out of this library — `@th-m/knowledge-model` owns the compiler.
Own everything downstream: the document model, deterministic scene layout, SVG
and PNG renderers, the canvas, and the dynamic figure. Keep the `./core` entry
free of React and CodeMirror so the CLI generator stays Bun/Node-safe.

## Required Verification Parameters Within Nested Context

Run `set-theory-visualization:typecheck` and `set-theory-visualization:test`.
After schema, layout, theme, rendering, or interaction changes, also run the
consuming projects' checks: `set-theory:typecheck`, `set-theory:test`, a
`set-theory:gen` smoke run on a fixture (inspect both artifacts), and
`portfolio:typecheck` with `portfolio:test`. After changing the curated
snippets or the analyzer contract, regenerate `src/data/curated-atlases.ts`
and commit it.

## Required Invariants Within Folder Context

The library does not start or publish an application and never imports app or
tool source. Curated analyses are committed data, not fetched or compiled at
runtime. The stylesheet is scoped to `.set-app` / `.set-figure` and relies on
consumers for resets and theme tokens.
