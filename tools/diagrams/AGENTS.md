# Diagrams Agent Contract

## Operational Flow

Use the pinned upstream tools and shared diagram-theme package. Resolve all
input and output paths within this worktree, including symlink targets. Keep
source artifacts and receipts distinct from generated themed exports.

## Required Verification Parameters Within Nested Context

Run `diagrams:typecheck` and `diagrams:test`, then `diagrams:gen` for each affected
engine. Inspect PNGs and verify playback and reduced motion in generated HTML.
Run `testing:test` for documentation changes.

## Required Invariants Within Folder Context

Repository scripts use Bun TypeScript; upstream Python is invoked as an external
tool. Install only the revisions in upstreams.ts. Inputs remain unchanged.
Output paths must be explicit. Upstream scene validation is never claimed for
the separate THOM animation adapter.
