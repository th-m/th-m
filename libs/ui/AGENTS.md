# THOM UI Agent Contract

## Operational Flow

Keep reusable, brand-styled interface primitives in this library. Application
layout, the global tool drawer shell, and page-specific composition remain with
the owning app. Port upstream component sources (shadcn, Aceternity) only in
their standard API shape and restyle them onto the shared THOM tokens.

## Required Verification Parameters Within Nested Context

Run `ui:typecheck` and `ui:test` for library changes. Verify affected consumer
projects (the portfolio app and React article pages) after public API or
stylesheet changes.

## Required Invariants Within Folder Context

The library never imports application or tool source. Public React APIs are
exported from the package root, styling remains available through
`styles.css`, and components consume design tokens through CSS variables rather
than copying canonical palette values.
