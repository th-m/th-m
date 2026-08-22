# TypeScript Set Theory

## Purpose

This tool is the local interactive workbench for TypeScript types as sets of
possible values: paste TypeScript, and the compiler-backed analyzer turns it
into compiler-proven containment, equivalence, overlap, and disjointness on a
live, pannable canvas. The atlas domain, scene layout, renderers, and canvas
are owned by
[`@th-m/set-theory-visualization`](../../libs/set-theory-visualization/README.md);
the compiler analysis itself lives in `@th-m/knowledge-model` and runs only
locally. Static set-diagram output is produced by that library's general
overlap renderer — this tool deliberately does not generate artifacts.

## Ontology

The TypeScript compiler determines assignability and diagnostics. The analyzer
turns compiler evidence into symbols and relations; layout turns that analysis
into regions, cards, and labels; the canvas renders an explanatory figure, not
a proof of arbitrary program behavior. When you need a shareable diagram, the
general overlap renderer (`set-theory-visualization:render:overlap`) draws the
same groups as translucent, placement- and color-controlled SVGs.

## Key Terms

- **Source file:** a `.ts`, `.tsx`, `.mts`, or `.cts` analysis input.
- **Set relation:** compiler-proven, derived, approximate, or indeterminate
  relationship between represented types.
- **Atlas:** the deterministic visual scene derived from a valid analysis.

The interactive source inspector supports pasted virtual TypeScript and project
files inside this workspace. It follows local imports through an explicit or
discovered `tsconfig.json`, never writes source, persists only authoring state in
browser `localStorage`, and preserves the last valid atlas when edits contain
compiler errors. Compiler-proven containment and equivalence render directly;
approximations and type-system exceptions remain visibly qualified.

The portfolio publishes a read-only "Set atlas" drawer tool that renders the
same atlases dynamically from committed curated analyses — no compiler in the
browser.
