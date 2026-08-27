# Portfolio Agent Contract

## Operational Flow

Keep public runtime code in `src/`, served assets in `public/`, brand and visual
automation in `scripts/`, route files in `src/routes/`, writing-UI conventions
in `docs/writing-component-conventions.md`, and portfolio evidence in `docs/`
or the audit asset tree. Generate brand data and stage published blog content
before starting, typechecking, testing, or publishing the app: `prepare:content`
rebuilds `public/_content` from `libs/blogs/dist` (excluding TS, TSX, and CSS
compile sources) and regenerates `src/generated/blog-pages/` with every post's
MDX, asset registry, immediate compile modules, and slug registry.

## Required Verification Parameters Within Nested Context

Run `portfolio:typecheck` and `portfolio:test` for implementation changes (both
run `prepare:content` first so the generated page registry exists). Run
`portfolio:publish` for build, route, public asset, prerender, content staging,
or brand generation changes. Inspect `dist/client` when changing SPA or Netlify
routing. Run `portfolio:e2e` or `portfolio:audit` when the affected behavior
requires browser or visual evidence. Do not bypass the static artifact verifier
in the publish command.

## Required Invariants Within Folder Context

The portfolio does not own blog drafts, article workspaces, or tool runtimes.
Only the blogs publish artifact may enter `public/_content`, and it never
includes raw TS, TSX, or CSS compile source. Raw frontmatter-free article MDX
and serialized asset metadata remain public. React article modules are compiled
from the same canonical MDX and sibling modules in the generated
`src/generated/blog-pages/` tree (gitignored and rebuilt by `prepare:content`);
the `/writing/:slug` route requires a generated MDX entry for every published
slug. The global tool drawer and its tool registry are portfolio
composition; the `@th-m/ui` primitives they compose live in the library.
Generated brand and content files must remain reproducible, every public route
must hydrate, and Netlify publication must use `dist/client` without a server
function.
