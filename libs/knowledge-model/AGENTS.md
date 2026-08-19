# Knowledge Model Agent Contract

## Operational Flow

Keep source adaptation and rendering outside this library. Extend the versioned
model additively where possible and update every consumer when changing an
existing contract. Keep TypeScript set analysis compiler-owned and read-only.

## Required Verification Parameters Within Nested Context

Run `knowledge-model:typecheck` and `knowledge-model:test`, plus typecheck and
tests for every affected consuming project.

## Required Invariants Within Folder Context

The library has no UI or generator runtime, does not depend on tool source, and
does not couple semantic relation kinds to arrow direction, layout weight, or
visual style. Compiler analysis never writes imported source files.
