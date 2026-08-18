# Blogs Agent Contract

## Operational Flow

Develop ideas in each post's outline, notes, and research. Introduce
`article.md` only when content is intentionally public, keep its public assets
in the sibling `assets/`, and use the app publisher to stage the artifact.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for scripts or publication rules. Run
`blogs:publish` when changing an article, public asset, manifest behavior, or
publication selection. Verify that every published entry has valid required
frontmatter, an H1 equal to its title, a stable slug, and only intentional
public files in `dist/`.

## Required Invariants Within Folder Context

Outlines, notes, and research never enter `dist/`. Post directories use stable
kebab-case slugs, published articles satisfy the schema-version-2 metadata
contract, publication order is newest first, and the publisher writes only
beneath `apps/blogs/dist`.
