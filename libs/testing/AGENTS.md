# Testing Support Agent Contract

## Operational Flow

Add only reusable testing mechanisms here. Keep product expectations and
fixtures with their owners, and expose shared behavior through package exports.

Maintain documentation parsing in `src/documentation-policy.ts`, preserving
the public `documentationViolations(root)` signature and `{ path, message }`
results. Keep required heading names aligned with the root contract. Add
representative valid and invalid fixtures for policy changes; fixtures belong
under the ignored workspace scratch directory and must clean up after tests.

## Required Verification Parameters Within Nested Context

Run `testing:typecheck` and `testing:test`. Verify at least one consumer when
changing a setup or Playwright helper export.

## Required Invariants Within Folder Context

Shared setup is deterministic and does not depend on an app or tool. The
documentation policy excludes generated/vendor trees and checks every
repository-owned README and standalone AGENTS file in its scan. Skills must
have valid metadata, folder/name agreement, and root/catalog routing. Do not
treat structural validation as proof of accurate ontology or editorial quality.
Keep `testing:test` uncached while its policy reads the whole repository.
