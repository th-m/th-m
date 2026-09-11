# Laws Agent Contract

## Operational Flow

Keep the lawsofux.com and timsommer.be content snapshots, their deterministic
brand adaptation, the hand-curated extension collections, and the THOM-styled
presentation components in this library. Regenerate the fetched snapshot with
the `fetch-laws` script when a source site changes; hand-author new extension
laws under `src/laws-curated/` with real provenance (Wikipedia or canonical
references). Keep the adaptation pure and tested, and keep the curated label
map complete for every law.

### Regenerating the content snapshot

The per-law data files are generated from the live sources:

```sh
bun run nx run laws:fetch-laws
```

The generator fetches the lawsofux.com homepage and each law page plus the
timsommer.be software-development laws page, extracts the definitions,
takeaways, copy, sources, further reading links, related laws, and artwork,
applies the curated label map, merges the duplicated laws, and writes
`src/laws/<slug>.ts` plus `src/laws/index.ts`. Treat the generated files as
the content snapshot; edit copy or labels through the generator, not by hand.

## Required Verification Parameters Within Nested Context

Run `laws:typecheck` and `laws:test` for library changes. Run `testing:test`
after touching README or AGENTS documentation. Run the consumer app's
`typecheck` and `test` targets when changing component props, styling, or
public exports.

## Required Invariants Within Folder Context

The library never imports application or tool source. The fetched snapshot
under `src/laws/` is generated deterministically by `scripts/fetch-laws.ts`
and edited only through that generator; hand-curated records live separately
under `src/laws-curated/` and are never rewritten by the generator. The public
`laws`/`lawBySlug` exports merge the snapshot with the curated layer, and
curated slugs must never collide with snapshot slugs. Every law has at least
one label from the typed `LawLabel` taxonomy and at least one provenance
`sources` URL. Adaptation functions stay pure and side-effect free, and the
source artwork stays stored verbatim so the adaptation remains reversible.
Component styling consumes `@th-m/design-theme` CSS variables; canonical THOM
colors are never hardcoded in this package.
