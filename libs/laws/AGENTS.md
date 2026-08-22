# Laws Agent Contract

## Operational Flow

Keep the lawsofux.com and timsommer.be content snapshots, their deterministic
brand adaptation, and the THOM-styled presentation components in this library.
Regenerate data files with the `fetch-laws` script when a source site changes,
keep the adaptation pure and tested, and keep the curated label map complete
for every law.

## Required Verification Parameters Within Nested Context

Run `laws:typecheck` and `laws:test` for library changes. Run `testing:test`
after touching README or AGENTS documentation. Run the consumer app's
`typecheck` and `test` targets when changing component props, styling, or
public exports.

## Required Invariants Within Folder Context

The library never imports application or tool source. The content snapshot is
generated deterministically by `scripts/fetch-laws.ts` and edited only through
that generator. Every law has at least one label from the typed `LawLabel`
taxonomy, and every law has at least one provenance `sources` URL. Adaptation
functions stay pure and side-effect free, and the source artwork stays stored
verbatim so the adaptation remains reversible. Component styling consumes
`@th-m/design-theme` CSS variables; canonical THOM colors are never hardcoded
in this package.
