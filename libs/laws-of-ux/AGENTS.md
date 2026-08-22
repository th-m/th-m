# Laws of UX Agent Contract

## Operational Flow

Keep the lawsofux.com content snapshot, its deterministic brand adaptation, and
the THOM-styled presentation components in this library. Regenerate data files
with the `fetch-laws` script when the source site changes, and keep the
adaptation pure and tested.

## Required Verification Parameters Within Nested Context

Run `laws-of-ux:typecheck` and `laws-of-ux:test` for library changes. Run
`testing:test` after touching README or AGENTS documentation. Run the consumer
app's `typecheck` and `test` targets when changing component props, styling, or
public exports.

## Required Invariants Within Folder Context

The library never imports application or tool source. The content snapshot is
generated deterministically by `scripts/fetch-laws.ts` and edited only through
that generator. Adaptation functions stay pure and side-effect free, and the
source artwork stays stored verbatim so the adaptation remains reversible.
Component styling consumes `@th-m/design-theme` CSS variables; canonical THOM
colors are never hardcoded in this package.
