# Blogs Agent Contract

## Operational Flow

Develop ideas under `articles/` according to its README and AGENTS contract.
Introduce `article.mdx` together with `article-assets.ts` only when publication
is intentional. Keep public static files in `assets/`, article-owned React and
style modules as immediate kebab-case siblings, and wire tagged component assets
through `article-components.tsx`. Use the publisher to stage the artifact. This
project is a library: `publish` never deploys, and `start` opens Obsidian rather
than an application runtime.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for publication code, types, article
modules, or publication rules. Run `blogs:publish` when changing canonical MDX,
public assets, component registries, manifest behavior, or publication
selection. Verify every published article has valid frontmatter, an H1 equal to
its title, a stable slug, a valid typed asset registry, and only intentional
public files in `dist/`. Full MDX and React module type checking also occurs in
the portfolio project.

## Required Invariants Within Folder Context

Only immediate children of `articles/` are publication candidates. Every
published workspace contains exactly one canonical `article.mdx` and one
`article-assets.ts`; `article.md` cannot publish beside it and `index.tsx` is
obsolete. MDX imports are named imports from immediate kebab-case modules.
Every public static asset is registered, every registered image exists, and
component assets use stable tagged IDs. Drafts, notes, research, nested private
modules, and workspace documentation never enter `dist/`. Published article
directories use stable kebab-case slugs, articles satisfy schema version 3,
publication order is newest first, and generated content writes only beneath
`libs/blogs/dist`. The library never imports application or tool source.
