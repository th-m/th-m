# MDX Migration Deltas

## Purpose

The rendered React pages supplied the component and layout behavior for the catalog-wide MDX migration. Markdown prose and rendered-only material are consolidated in the canonical `article.mdx`; `goals-solutions-and-value` explicitly combines the fuller authored Markdown explanation with the rendered page's figures, previews, callouts, and tooltips.

The three working-tree Markdown files that contained unrendered or uncommitted editorial changes were preserved verbatim as `notes/pre-mdx-markdown.md` in their article workspaces because automatically choosing between those conflicting revisions would overwrite user work.

## Preserved Workspaces

- `the-cognitive-factory/notes/pre-mdx-markdown.md`
- `the-knowledge-factory/notes/pre-mdx-markdown.md`
- `truth-entropy-and-inference/notes/pre-mdx-markdown.md`

## Catalog Review

| Article | Consolidation result |
| --- | --- |
| `goals-solutions-and-value` | Rebuilt as Markdown-first MDX, combining the fuller authored explanation with all rendered figures, tables, previews, callouts, and tooltips. |
| `ai-consciousness-is-incoherent` | Restored the full theory-membership distinction, access-evidence qualification, and empirical-asymmetry explanation around the rendered figures. |
| `consciousness-is-incoherent` | Restored the addendum note, theory-specific predicates, evidentiary qualification, practical-lesson distinction, and full four-part evidence standard. |
| `building-an-llm` | Restored the next-token probability table, embedding caveat, runtime/decoding explanation, and complete end-to-end flow around the interactives. |
| `the-cognitive-factory` | Restored the authored compounding-loop statement alongside its registered figure. |
| `the-knowledge-factory` | Restored the authored product-change pipeline and the implicit-versus-explicit factory distinction alongside their registered figures. |
| `truth-entropy-and-inference` | Promoted the reviewed theological parallels and semantic-composition introduction from the preserved Markdown into the canonical MDX. |
| `the-ontology-factory` | Reviewed with no Markdown-only prose gaps; the MDX already retained the complete authored text and registered visuals. |
| `understanding-is-the-bottleneck` | Reviewed with no Markdown-only prose gaps; the MDX already retained the complete authored text and registered interactives. |

Registered figures may replace an earlier Mermaid or text-only diagram, but the canonical MDX retains the surrounding explanation and any authored claim needed to interpret that asset.

## Historical Snapshots

The three private snapshots remain as an audit trail. Their relevant Markdown-only revisions have been reviewed and promoted into the canonical `article.mdx` files.
