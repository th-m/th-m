# Layered Topology Tool

## Purpose

This tool authors layered system topologies interactively and generates
self-contained SVG plus 2× PNG content from portable topology JSON. Layers,
nodes, links, deterministic layout, and the SVG renderer are owned by
[`@th-m/topology-visualization`](../../libs/topology-visualization/README.md);
this tool is the local authoring shell and the CLI generator.

## Ontology

A topology arranges nodes into ordered layers and connects them with directed
dependency links. A `TopologyDocument` is the portable source of truth, while
layout positions and rendered files are derived output. Topologies express
structural dependency systems — how the Factory layers flow from Apps down to
Platform, how a pipeline of proofs accumulates into canonical knowledge —
rather than semantic proposition graphs (those live in the portfolio's
`@th-m/graph-visualization` experiences).

## Key Terms

- **TopologyDocument:** versioned JSON input shared by the UI and CLI.
- **Layer:** an ordered band (column in `lr`, row in `td`) that nodes belong
  to.
- **Link:** a directed dependency between two nodes; may be labeled and
  dashed.
- **Graph mode:** content-sized topology output.
- **Poster mode:** fixed 1600×1000 editorial composition.
- **Artifact pair:** `<output>.svg` and `<output>@2x.png`.

Generate an artifact with:

```sh
bun run nx run topology:gen -- --input path/to/topology.json --output path/to/name [--mode graph|poster]
```
