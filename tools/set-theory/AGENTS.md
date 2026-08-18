# TypeScript Set Theory Agent Contract

## Operational Flow

Use the TypeScript compiler as semantic authority, keep analysis independent of
rendering, and require explicit source/output paths for CLI generation.

## Required Verification Parameters Within Nested Context

Run `set-theory:typecheck` and `set-theory:test`. Run `set-theory:gen` after
analyzer, relation, layout, font, theme, or renderer changes; use
`set-theory:e2e` for interaction changes.

## Required Invariants Within Folder Context

Inputs and outputs remain inside the workspace. Compiler errors prevent output;
non-fatal approximation warnings are embedded in the SVG. Every successful run
overwrites one self-contained SVG and one 2× PNG.
