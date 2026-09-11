# Set Theory Visualization Agent Contract

## Operational Flow

Keep analysis out of this library — `@th-m/knowledge-model` owns the compiler.
Own everything downstream: the document model, deterministic scene layout, SVG
renderers (scene + the general overlap script), the canvas, and the dynamic
figure. Keep the `./core` entry free of React and CodeMirror so the CLI
generator stays Bun/Node-safe.

### Static generation

Regenerate the curated analyses (requires a TypeScript compiler):

```sh
bun run nx run set-theory-visualization:generate:curated
```

Render a static overlap figure from a JSON spec — explicit placement and
coloring, optionally bootstrapped from an `AnalyzeResult`:

```sh
bun run nx run set-theory-visualization:render:overlap -- \
  --input dist-sets/known-sets.json --output dist-sets/known-sets
```

Each `groups` entry sets `label`, `cx`/`cy`/`rx`/`ry`, and `fill`/`opacity`/
`stroke`/`strokeWidth`; unspecified values fall back to the `style` defaults.
Groups without a color take the ordered accent palette one accent per group
(blue, rose, lime, violet, teal, plum — cycling), and the label text inside a
group inherits the group accent unless a global `style.labelColor` or a
per-group `labelColor` is given. With `"analysis"` pointing at an
`AnalyzeResult` JSON (or
`{ "source": "...", "tsconfig": "..." }`), groups are derived from the
compiler analysis and the `groups` entries override them by label or symbol
id. The SVG is sized exactly to the placed ellipses, so outputs never get
unexpected dimensions. `--print` writes the resolved groups back as a pure
spec for hand-tuning.

## Required Verification Parameters Within Nested Context

Run `set-theory-visualization:typecheck` and `set-theory-visualization:test`.
After schema, layout, theme, rendering, or interaction changes, also run the
consuming projects' checks: `set-theory:typecheck`, `set-theory:test`, a
`render:overlap` smoke run on a fixture (inspect the SVG dimensions and
stacking), and `portfolio:typecheck` with `portfolio:test`. After changing the
curated snippets or the analyzer contract, regenerate
`src/data/curated-atlases.ts` and commit it.

### Test coverage

The library depends on the `testing` support library for the vitest setup.

## Required Invariants Within Folder Context

The library does not start or publish an application and never imports app or
tool source. Curated analyses are committed data, not fetched or compiled at
runtime. The stylesheet is scoped to `.set-app` / `.set-figure` and relies on
consumers for resets and theme tokens. The overlap renderer writes only to
explicit output paths inside the workspace.
