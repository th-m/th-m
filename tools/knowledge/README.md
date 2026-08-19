# Knowledge Representation Proof

## Purpose

`knowledge` imports established textual semantics and generates a static review
board whose alternative views apply domain-specific organization rules. The
first proof covers Mermaid system flowcharts, PostgreSQL/Supabase schema dumps,
and a multi-package TypeScript schema domain.

## Ontology

Adapters normalize source syntax into `@th-m/knowledge-model`. A manifest asks
for perspectives over those semantics. Renderers derive native baselines,
topology, phased process, ERD, package hierarchy, dependency, public API, and
set-atlas evidence. Normalized snapshots and visual artifacts are derived;
there is no canonical author-facing knowledge DSL in this iteration.

## Key Terms

- **Snapshot:** read-only, provenance-pinned semantics imported from an external
  repository.
- **Proof manifest:** a versioned workspace-contained request joining sources
  and perspectives.
- **Review board:** a self-contained HTML comparison of generated evidence.
- **Native baseline:** Mermaid's own rendering of the source or generated ERD.

Import a read-only TypeScript domain:

```sh
bun run nx run knowledge:snapshot -- \
  --repository /absolute/path/to/repository \
  --source libs/schema \
  --tsconfig tsconfig.base.json \
  --output tools/knowledge/fixtures/domain/model.json
```

Generate a proof board:

```sh
bun run nx run knowledge:gen -- \
  --manifest tools/knowledge/fixtures/first-proof/proof.json \
  --output dist-knowledge/proofs/first-proof
```
