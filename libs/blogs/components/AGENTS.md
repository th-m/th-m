# Blog Components Agent Contract

## Operational Flow

Read the sibling README. Keep shared presentation and its tests in this
directory, owned by the `blogs` Nx project. Keep article-specific content local
and use `@th-m/ui` for primitives. Expose reusable modules through package
exports; let the host supply routing, asset resolution, and tool integration.

## Required Verification Parameters Within Nested Context

Run `blogs:typecheck` and `blogs:test` for component changes. Run
`blogs:publish`, `portfolio:typecheck`, `portfolio:test`, and `portfolio:publish`
when changing rendered articles or their shared presentation. Run `testing:test`
after documentation changes and `bun run nx show projects` after package changes.

## Required Invariants Within Folder Context

The library never imports application or tool source. Shared behavior has one
implementation; article MDX receives the common vocabulary from the host.
Article component factories use package imports for shared modules so staging
does not break relative paths. Preserve keyboard access, link previews, and
responsive layouts. Every README has a sibling AGENTS file.
