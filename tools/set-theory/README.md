# TypeScript Set Theory

## Purpose

This tool analyzes TypeScript types as sets of possible values and generates a
self-contained SVG plus 2× PNG atlas from a source file.

## Ontology

The TypeScript compiler determines assignability and diagnostics. The analyzer
turns compiler evidence into symbols and relations; layout turns that analysis
into regions, cards, and labels; rendering produces an explanatory artifact,
not a proof of arbitrary program behavior.

## Key Terms

- **Source file:** a `.ts`, `.tsx`, `.mts`, or `.cts` analysis input.
- **Set relation:** compiler-proven, derived, approximate, or indeterminate
  relationship between represented types.
- **Atlas:** the deterministic visual scene derived from a valid analysis.
- **Artifact pair:** `<output>.svg` and `<output>@2x.png`.

Generate an artifact with:

```sh
bun run nx run set-theory:gen -- --input path/to/source.ts --output path/to/name [--tsconfig path/to/tsconfig.json]
```

The interactive source inspector supports pasted virtual TypeScript and project
files inside this workspace. It follows local imports through an explicit or
discovered `tsconfig.json`, never writes source, persists only authoring state in
browser `localStorage`, and preserves the last valid atlas when edits contain
compiler errors. Compiler-proven containment and equivalence render directly;
approximations and type-system exceptions remain visibly qualified.
