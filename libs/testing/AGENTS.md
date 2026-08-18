# Testing Support Agent Contract

## Operational Flow

Add only reusable testing mechanisms here. Keep product expectations and
fixtures with their owners, and expose shared behavior through package exports.

## Required Verification Parameters Within Nested Context

Run `testing:typecheck` and `testing:test`. Verify at least one consumer when
changing a setup or Playwright helper export.

## Required Invariants Within Folder Context

Shared setup is deterministic and does not depend on an app or tool. The
documentation policy excludes generated/vendor trees and checks every
repository-owned README.
