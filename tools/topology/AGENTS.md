# Layered Topology Tool Agent Contract

## Operational Flow

Keep the UI, JSON validator, deterministic layered layout, and CLI renderer on
the same `TopologyDocument` contract (owned by
`@th-m/topology-visualization`). Require explicit input and output arguments
for CLI generation.

## Required Verification Parameters Within Nested Context

Run `topology:typecheck` and `topology:test`. Run `topology:gen` on a fixture
after CLI, schema, layout, font, theme, or renderer changes; use `topology:e2e`
for interaction changes.

## Required Invariants Within Folder Context

Input and output resolve inside the workspace. Generation always overwrites one
SVG and one 2× PNG as a pair, embeds fonts, uses the deterministic layered
layout, and does not mutate its JSON input.
