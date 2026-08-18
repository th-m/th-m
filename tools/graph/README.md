# Proposition Graph

## Purpose

This tool authors proposition-and-relationship documents interactively and
generates self-contained SVG plus 2× PNG content from portable graph JSON.

## Ontology

A proposition states what can be asserted; a relationship expresses how two or
more propositions participate together. A `GraphDocument` is the portable
source of truth, while layout positions and rendered files are derived output.

## Key Terms

- **GraphDocument:** versioned JSON input shared by the UI and CLI.
- **Graph mode:** content-sized proposition graph output.
- **Poster mode:** fixed 1600×1000 editorial composition.
- **Artifact pair:** `<output>.svg` and `<output>@2x.png`.

Generate an artifact with:

```sh
bun run nx run graph:gen -- --input path/to/graph.json --output path/to/name [--mode graph|poster]
```
