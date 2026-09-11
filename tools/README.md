# Content Tools

## Purpose

`tools/` contains local authoring, source inspection, and visual content
generation applications.

## Boundaries

Tools own CLI inputs, local authoring, and output paths. Shared domain models
and renderers belong in libraries. Tools do not own site delivery or another
tool's source. The proposed agent coordinator is not an implemented tool here.

## Ontology

Tools are local authoring runtimes; projects that generate artifacts expose
explicit command-line operations.
`diagrams` combines Diagram Design's editorial patterns and Fireworks Tech
Graph's generators with THOM themes and controlled animation;
`topology` authors layered system topologies (layers, nodes, directed
dependency links — the structural "how things connect" content) and renders
them through `@th-m/topology-visualization`; `set-theory` inspects TypeScript
type relationships in an interactive workbench (its rendering is shared through
`@th-m/set-theory-visualization`); `knowledge` normalizes established semantic
sources into domain-organized comparison boards. The portfolio publishes the
proposition-graph experiences (editor, explorer, article figures) directly
through `@th-m/graph-visualization`; blog figures render dynamically as React
components instead of checked-in SVG/PNG assets.

## Key Terms

- **Generator:** a Bun TypeScript CLI invoked through the `gen` Nx target.
- **Input document:** the explicit source file supplied by the caller.
- **Artifact pair:** a self-contained SVG and corresponding 2× PNG.
