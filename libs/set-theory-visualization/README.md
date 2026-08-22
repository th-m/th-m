# Set Theory Visualization

## Purpose

`@th-m/set-theory-visualization` owns the TypeScript set atlas domain,
deterministic scene layout, browser-safe SVG/PNG renderers, the interactive
canvas, and the dynamic `SetAtlasVisualization` React component that renders an
atlas from compiler analysis data. It is the shared home for the atlas
rendering used by both the local authoring tool (`tools/set-theory`) and the
portfolio, and the reason blog pages no longer need pre-generated atlas
figures.

## Ontology

The TypeScript compiler is the semantic authority: `@th-m/knowledge-model`
owns `analyzeSetAtlas` (which runs the compiler and cannot run in the
browser). This library owns everything downstream of analysis: the versioned
document model, `buildSetAtlasScene` (deterministic layout of regions, cards,
and members), `renderSetAtlasSvg`/`createSetAtlasSvg` (self-contained SVG with
optional font embedding), browser PNG rasterization, and the React canvas. The
`./core` entry excludes React so the CLI generator stays Bun/Node-safe.

## Key Terms

- **Analysis:** an `AnalyzeResult` — symbols, relations, atoms, and
  diagnostics produced offline by the compiler.
- **Scene:** the laid-out atlas (`SetAtlasScene`) derived deterministically
  from an analysis.
- **SetAtlasVisualization:** the dynamic, read-only React figure — analysis in,
  pan/zoom/select atlas out.
- **Curated analysis:** a committed `AnalyzeResult` for a hand-picked snippet
  (`curatedSetAtlasAnalyses`), so the static site renders atlases with no
  compiler.
- **Overlap figure:** a static, placement- and color-controlled SVG of
  overlapping set groups produced by `scripts/render-overlap.ts` — the general
  output path that replaced the tool's artifact generation.

## Usage

```ts
import { SetAtlasVisualization, curatedSetAtlasAnalyses } from "@th-m/set-theory-visualization";
import "@th-m/set-theory-visualization/styles.css";
```

Browser consumers provide the design theme tokens
(`@th-m/design-theme/theme.css`); the stylesheet is scoped to `.set-app` /
`.set-figure`. CLI consumers import `@th-m/set-theory-visualization/core`.

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
With `"analysis"` pointing at an `AnalyzeResult` JSON (or
`{ "source": "...", "tsconfig": "..." }`), groups are derived from the
compiler analysis and the `groups` entries override them by label or symbol
id. The SVG is sized exactly to the placed ellipses, so outputs never get
unexpected dimensions. `--print` writes the resolved groups back as a pure
spec for hand-tuning.

## Verification

Run `set-theory-visualization:typecheck` and `set-theory-visualization:test`.
The library depends on the `testing` support library for the vitest setup.
