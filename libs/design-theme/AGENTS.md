# Design Theme Agent Contract

## Operational Flow

Change semantic foundation tokens through the public API, then verify every
tool consumer and keep tool-specific geometry outside this package.

### Generation

Regenerate the shared CSS after changing typed tokens:

```sh
bun run nx run design-theme:generate-theme
```

## Required Verification Parameters Within Nested Context

Run `design-theme:typecheck` and `design-theme:test`, followed by
`graph-visualization`, `topology-visualization`, and
`set-theory-visualization` typechecks for public contract changes.

## Required Invariants Within Folder Context

The library remains framework-independent and side-effect free. Existing token
names keep their semantic meaning, and product-specific behavior is not added.
