# Blog Articles Agent Contract

## Operational Flow

Read this directory's README before editing an article workspace. Treat each
immediate child as one editorial boundary: experiment in `draft/`, preserve
durable supporting material in `notes/`, keep evidence and limitations in
`research/`, and introduce `article.mdx` with `article-assets.ts` only when
publication is intentional. Keep public static files in `assets/`. Keep
article-specific semantic scenes and component wiring in immediate kebab-case
modules, while reusable rendering and interaction behavior belongs in the
owning library.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for changes to public MDX, registries,
modules, assets, or conventions. Run `blogs:publish` after changing any public
article input or the artifact contract. Run `portfolio:typecheck` and
`portfolio:test` when an MDX or component change affects rendered React. Run
`testing:test` after changing a repository-owned README or AGENTS file. Private
draft, note, and research changes do not by themselves require publication.

## Required Invariants Within Folder Context

Only immediate children are article workspaces. Workspace names use stable,
unnumbered kebab-case slugs and each has one singular `draft/`. Drafts, notes,
research, nested private modules, and workspace documentation never enter
`dist/`. Every published workspace contains `article.mdx` and
`article-assets.ts`; `article.md` cannot coexist as a public source and
`index.tsx` is obsolete. Public modules are non-empty immediate kebab-case TS,
TSX, or CSS files. Every static asset is registered, every image registry path
exists, and figure, interactive, and preview composition uses stable tagged
IDs. Generated content writes only to explicit paths inside the workspace, and
every repository-owned README has a sibling `AGENTS.md`.
