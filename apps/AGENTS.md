# Applications Agent Contract

## Operational Flow

Read the selected app's README and AGENTS file, keep app-specific code and
content inside that app, and use its package-owned Nx targets.

## Required Verification Parameters Within Nested Context

Run the app's `typecheck` and unit `test` targets. Run `publish` for changes to
content selection, generated assets, public files, bundling, or prerendering.

## Required Invariants Within Folder Context

Apps do not import other apps. A publish target must produce only its own
`dist/` tree and must not perform a remote deployment.
