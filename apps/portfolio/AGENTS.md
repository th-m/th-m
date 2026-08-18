# Portfolio Agent Contract

## Operational Flow

Keep public runtime code in `src/`, served assets in `public/`, brand and visual
automation in `scripts/`, route files in `src/routes/`, and portfolio evidence
in `docs/` or the audit asset tree. Generate brand data and stage published blog
content before starting or publishing the app.

## Required Verification Parameters Within Nested Context

Run `portfolio:typecheck` and `portfolio:test` for implementation changes. Run
`portfolio:publish` for build, route, public asset, prerender, content staging,
or brand generation changes. Inspect `dist/client` when changing SPA or Netlify
routing. Run `portfolio:e2e` or `portfolio:audit` when the affected behavior
requires browser or visual evidence. Do not bypass the static artifact verifier
in the publish command.

## Required Invariants Within Folder Context

The portfolio does not own blog drafts or tool runtimes. Only the blogs publish
artifact may enter `public/_content`. Generated brand and content files must
remain reproducible, every public route must hydrate, and Netlify publication
must use `dist/client` without a server function.
