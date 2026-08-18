# Content Tools

## Purpose

`tools/` contains local authoring applications that turn explicit inputs into
durable visual content.

## Ontology

Tools are interactive local runtimes with deterministic command-line
generators. `graph` renders proposition graphs; `set-theory` renders TypeScript
type relationships as set atlases.

## Key Terms

- **Generator:** a Bun TypeScript CLI invoked through the `gen` Nx target.
- **Input document:** the explicit source file supplied by the caller.
- **Artifact pair:** a self-contained SVG and corresponding 2× PNG.
