# Knowledge Tool Agent Contract

## Operational Flow

Keep adapters, layout rules, renderers, CLI, fixtures, and documentation with
this tool while sharing only renderer-independent semantics through
`@th-m/knowledge-model`. Generation accepts an explicit manifest and output;
external imports use the separate read-only snapshot target.

## Required Verification Parameters Within Nested Context

Run `knowledge:typecheck` and `knowledge:test`. Smoke-test `knowledge:snapshot`
and `knowledge:gen` after adapter, manifest, layout, rendering, font, or CLI
changes, and inspect the generated HTML, SVG, and PNG evidence.

## Required Invariants Within Folder Context

`gen` reads and writes only explicit workspace-contained paths. `snapshot`
requires an absolute external repository, rejects traversal and escaping
symlinks, requires a clean source subtree, never executes or modifies imported
code, and never persists a local absolute path. SQL adapters parse text only and
never connect to or execute against a database. Generation is deterministic and
does not expose partial output on failure.
