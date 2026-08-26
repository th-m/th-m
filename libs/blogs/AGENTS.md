# Blogs Agent Contract

## Operational Flow

Develop ideas under `articles/` according to its README and AGENTS contract.
Introduce `article.md` and an optional `index.tsx` page with immediate sibling
TSX/CSS modules only when content is intentionally public, keep public assets
in the sibling `assets/`, and use the publisher to stage the artifact. This project is a library: `publish` stages a
content artifact for the portfolio app and never deploys, and `start` opens the
Obsidian editor rather than an application runtime.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for scripts or publication rules. Run
`blogs:publish` when changing an article, public asset, page, manifest
behavior, or publication selection. Verify that every published entry has valid
required frontmatter, an H1 equal to its title, a stable slug, and only
intentional public files in `dist/`. A published `index.tsx` must be non-empty
and export a default React component. Its immediate auxiliary modules must be
non-empty and use kebab-case `*.tsx` or `*.css` names; full type checking of the
page and its modules happens in the portfolio build.

## Required Invariants Within Folder Context

Only immediate children of `articles/` are publication candidates. Outlines,
notes, drafts, research, and nested private page modules never enter `dist/`.
Auxiliary page modules never publish without `index.tsx`. Published article
directories use stable kebab-case slugs, articles satisfy the schema-version-2
metadata contract, publication order is newest first, and the publisher writes
only beneath `libs/blogs/dist`. The library never imports application or tool
source.
