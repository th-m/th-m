# Design Theme Agent Contract

## Operational Flow

Change semantic foundation tokens through the public API, then verify every
tool consumer and keep tool-specific geometry outside this package.

## Required Verification Parameters Within Nested Context

Run `design-theme:typecheck` and `design-theme:test`, followed by graph and
set-theory typechecks for public contract changes.

## Required Invariants Within Folder Context

The library remains framework-independent and side-effect free. Existing token
names keep their semantic meaning, and product-specific behavior is not added.
