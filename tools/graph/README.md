# Proposition Graph

## Purpose

This tool authors proposition-and-relationship documents interactively and
generates self-contained SVG plus 2× PNG content from portable graph JSON. The
editor, domain model, layout, and SVG renderer are owned by
[`@th-m/graph-visualization`](../../libs/graph-visualization/README.md); this
tool is the local authoring shell and the CLI generator.

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

The same interactive editor is published on the portfolio as
[`/relationship-graph`](../../apps/portfolio/README.md), with a compact
read-only explorer in the global TOOLS drawer. Article pages embed the graph
directly as a dynamic React figure (`PropositionGraphFigure`) — the former
checked-in SVG/PNG blog assets and their legacy generators were removed.
