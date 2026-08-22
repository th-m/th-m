# Topology Visualization Agent Contract

## Operational Flow

Keep the domain model, deterministic layered layout, SVG renderer, and
interactive canvas on the same `TopologyDocument` contract, and keep the
`./core` entry free of React and reagraph imports so CLI generators stay
Bun/Node-safe.

## Required Verification Parameters Within Nested Context

Run `topology-visualization:typecheck` and `topology-visualization:test`.
After schema, layout, theme, rendering, or interaction changes, also run the
consuming tool's checks (`topology:typecheck`, `topology:test`) and a
`topology:gen` smoke run on a fixture (inspect both artifacts).

## Required Invariants Within Folder Context

The library does not start or publish an application and never imports app or
tool source. Generation is deterministic: the same `TopologyDocument` always
produces the same layout and the same SVG. The stylesheet is scoped to the
canvas surface and relies on consumers for resets and theme tokens.
