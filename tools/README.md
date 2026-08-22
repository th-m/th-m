# Content Tools

## Purpose

`tools/` contains local authoring applications that turn explicit inputs into
durable visual content.

## Ontology

Tools are local authoring runtimes with deterministic command-line generators.
`topology` authors layered system topologies (layers, nodes, directed
dependency links — the structural "how things connect" content) and renders
them through `@th-m/topology-visualization`; `set-theory` renders TypeScript
type relationships as set atlases (its rendering is shared through
`@th-m/set-theory-visualization`); `knowledge` normalizes established semantic
sources into domain-organized comparison boards. The portfolio publishes the
proposition-graph experiences (editor, explorer, article figures) directly
through `@th-m/graph-visualization`; blog figures render dynamically as React
components instead of checked-in SVG/PNG assets.

## Key Terms

- **Generator:** a Bun TypeScript CLI invoked through the `gen` Nx target.
- **Input document:** the explicit source file supplied by the caller.
- **Artifact pair:** a self-contained SVG and corresponding 2× PNG.
