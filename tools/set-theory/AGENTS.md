# TypeScript Set Theory Agent Contract

## Operational Flow

Use the TypeScript compiler as semantic authority, keep analysis independent of
rendering, and keep the workbench a read-only analysis surface: it never writes
source or artifacts. Static set diagrams come from the overlap renderer in
`@th-m/set-theory-visualization`.

## Required Verification Parameters Within Nested Context

Run `set-theory:typecheck` and `set-theory:test`. Use `set-theory:e2e` for
workbench interaction changes.

## Required Invariants Within Folder Context

The workbench persists only authoring state in browser `localStorage` and never
writes source files. Compiler errors preserve the last valid canvas; non-fatal
approximation warnings remain visible in the diagnostics. The tool does not
generate SVG or PNG artifacts — use
`set-theory-visualization:render:overlap` for static output.
