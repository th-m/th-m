# Portfolio Agent Contract

## Operational Flow

Keep public runtime code in `src/`, served assets in `public/`, brand and visual
automation in `scripts/`, route files in `src/routes/`, writing-UI conventions
in `docs/writing-component-conventions.md`, and portfolio evidence in `docs/`
or the audit asset tree. Generate brand data and stage published blog content
before starting, typechecking, testing, or publishing the app: `prepare:content`
rebuilds `public/_content` from `libs/blogs/dist` (excluding React and page-style
sources) and regenerates `src/generated/blog-pages/` with each page's immediate
TSX/CSS modules plus its slug registry from every manifest post with
`page: true`.

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
includes raw page TSX or CSS source. React article pages are compiled with
their sibling modules from the generated `src/generated/blog-pages/` tree
(gitignored, rebuilt by `prepare:content`);
the `/writing/:slug` route dispatches to a page by slug and falls back to
Markdown. The global tool drawer and its tool registry are portfolio
composition; the `@th-m/ui` primitives they compose live in the library.
Generated brand and content files must remain reproducible, every public route
must hydrate, and Netlify publication must use `dist/client` without a server
function.
