# Content Tools

## Purpose

`tools/` contains local authoring applications that turn explicit inputs into
durable visual content.

## Ontology

Tools are local authoring runtimes with deterministic command-line generators.
`graph` renders proposition graphs (its interactive editor, explorer, and
dynamic article figure are shared with the portfolio through
`@th-m/graph-visualization`); `set-theory` renders TypeScript type
relationships as set atlases (its rendering is shared through
`@th-m/set-theory-visualization`); `knowledge` normalizes established semantic
sources into domain-organized comparison boards. Each tool's interactive
surface is reusable through a library when the portfolio publishes it as an
interactive UI tool; blog figures render dynamically as React components
instead of checked-in SVG/PNG assets.

## Key Terms

- **Generator:** a Bun TypeScript CLI invoked through the `gen` Nx target.
- **Input document:** the explicit source file supplied by the caller.
- **Artifact pair:** a self-contained SVG and corresponding 2× PNG.
