# Blog Articles Agent Contract

## Operational Flow

Read this directory's README before editing an article workspace. Treat each
immediate child directory as one editorial boundary: develop the thesis in
`outline.md`, keep informal material in `notes/`, keep evidence and limitations
in `research/`, and introduce `article.md` only when publication is intentional.
Keep public article assets in the sibling `assets/` directory.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for changes that affect publication
inputs or conventions. Run `blogs:publish` after changing `article.md`, public
assets, publication selection, or the artifact contract. Run `testing:test`
after changing a repository-owned README or AGENTS file. Private outline, note,
research, and draft changes do not by themselves require publication.

## Required Invariants Within Folder Context

Only immediate children of `articles/` are article workspaces. Workspace names
use stable, unnumbered kebab-case slugs. Each workspace has one canonical
`outline.md`. Outlines, notes, research, drafts, and workspace documentation
never enter `dist/`; only a valid `article.md` and its intentional assets may
publish. Generated content writes only to explicit paths inside the workspace,
and every repository-owned README has a sibling `AGENTS.md`.
