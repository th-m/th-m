# Blog Articles Agent Contract

## Operational Flow

Read this directory's README before editing an article workspace. Treat each
immediate child as one editorial boundary: experiment in `draft/`, preserve
durable supporting material in `notes/`, keep evidence and limitations in
`research/`, and introduce `article.mdx` with `article-assets.ts` only when
publication is intentional. Keep public static files in `assets/`. Keep
article-specific semantic scenes, datasets, styles, and component wiring in
kebab-case modules beside the MDX or directly inside its local `components/`
folder, while reusable rendering and interaction behavior belongs in the
owning library.

### Editorial conventions

- Keep one singular `draft/` workspace in every article directory.
- Keep durable supporting material and retired directions in `notes/`; keep
  evidentiary work in `research/`.
- Preserve uncertainty, counterevidence, and source limitations.
- Prefer primary sources for publication claims.
- Use stable, unnumbered kebab-case directory, module, asset, and tag names.
- Keep the `Sources` section last.
- Treat `article.mdx` as the only canonical public prose and render order.
- Move reusable components into `libs/`; keep article-specific semantic scenes
  and wrappers with their article.

### Adding an article

Create a stable kebab-case directory with private workspaces first:

```text
new-article-slug/
├── draft/
├── notes/
└── research/
```

Add `article.mdx` and `article-assets.ts` when publication is intentional. Add
registered `assets/` and an `article-components.tsx` factory only as needed,
then add the workspace to the inventory in the sibling README.

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
root `index.tsx` is obsolete. Compile modules are non-empty kebab-case TS,
TSX, or CSS files beside the MDX or directly in `components/`; further directories
remain private. Keep `article-assets.ts` and the optional `article-components.tsx`
entrypoint beside the MDX. Every static asset is registered, every image registry
path exists, and figure, interactive, and preview composition uses stable tagged
IDs. Generated content writes only to explicit paths inside the workspace, and
every repository-owned README has a sibling `AGENTS.md`.

## Skills

Use [thm-blog-authoring](../../../.agents/skills/thm-blog-authoring/SKILL.md)
for editorial work and [thm-team](../../../.agents/skills/thm-team/SKILL.md)
when team delegation is requested.
