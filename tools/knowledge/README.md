# Knowledge Representation Proof

## Purpose

`knowledge` imports established textual semantics and generates a static review
board whose alternative views apply domain-specific organization rules. The
first proof covers Mermaid system flowcharts, PostgreSQL/Supabase schema dumps,
and a multi-package TypeScript schema domain.

## Boundaries

This tool owns source adapters, snapshot import, layout, and evidence generation.
The `knowledge-model` library owns normalized semantics. Imported repositories
remain read-only inputs; generated boards are derived evidence, not source.

## Ontology

Adapters normalize source syntax into `@th-m/knowledge-model`. A manifest asks
for perspectives over those semantics. Renderers derive native baselines,
topology, phased process, ERD, package hierarchy, dependency, and public API
evidence. Normalized snapshots and visual artifacts are derived;
there is no canonical author-facing knowledge DSL in this iteration.

## Key Terms

- **Snapshot:** read-only, provenance-pinned semantics imported from an external
  repository.
- **Proof manifest:** a versioned workspace-contained request joining sources
  and perspectives.
- **Review board:** a self-contained HTML comparison of generated evidence.
- **Native baseline:** Mermaid's own rendering of the source or generated ERD.
