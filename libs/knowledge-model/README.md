# Knowledge Model

## Purpose

`@th-m/knowledge-model` is the renderer-independent semantic foundation for
knowledge representations. It normalizes entities, groups, relations,
provenance, diagnostics, and requested perspectives without prescribing an
author-facing syntax or a visual layout.

## Ontology

A knowledge document contains typed entities connected by semantic relations.
Groups express ownership or containment. Provenance records how derived
semantics can be traced to source. Perspectives request a projection of the
same model; arrow direction, layout influence, and visual treatment remain
separate from relation meaning.

The library also owns TypeScript compiler analysis for set semantics. Visual
region geometry and SVG rendering remain with the `set-theory` tool.

## Key Terms

- **Entity:** a stable semantic object such as a system, package, symbol, table,
  column, set, or atom.
- **Relation:** a typed statement between entity identifiers.
- **Perspective:** a renderer-independent request for a particular projection.
- **Provenance:** repository, file, span, revision, and content-hash evidence.
- **Semantic snapshot:** a versioned derived model containing no copied source.
