# Proposition Graph Agent Contract

## Operational Flow

Keep the UI, JSON validator, deterministic layout, and CLI renderer on the same
`GraphDocument` contract. Require explicit input and output arguments for CLI
generation.

## Required Verification Parameters Within Nested Context

Run `graph:typecheck` and `graph:test`. Run `graph:gen` on a fixture after CLI,
schema, layout, font, theme, or renderer changes; use `graph:e2e` for interaction
changes.

## Required Invariants Within Folder Context

Input and output resolve inside the workspace. Generation always overwrites one
SVG and one 2× PNG as a pair, embeds fonts, uses deterministic ELK layout, and
does not mutate its JSON input.
