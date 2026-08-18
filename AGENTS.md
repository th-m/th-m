# TH-M Workspace Agent Contract

## Operational Flow

1. Read the nearest `README.md` and `AGENTS.md` before changing a subtree.
2. Identify one owning Nx project for each changed implementation file.
3. Keep source, tests, configuration, and operational documentation with that
   owner; reusable behavior belongs in `libs/`.
4. Use Bun TypeScript for repository scripts and invoke project work through Nx.
5. Run the required owner verification before handing off a change.

## Required Verification Parameters Within Nested Context

- Run `<project>:typecheck` and `<project>:test` for every affected project.
- Run app `publish` when changing its build inputs or artifact contract.
- Smoke-test tool `gen` when changing schemas, layout, rendering, fonts, or CLI
  argument handling.
- Run `bun run nx show projects` after workspace or package metadata changes.
- Run `testing:test` after adding or changing repository-owned documentation.

## Required Invariants Within Folder Context

- Every repository-owned `README.md` has a sibling `AGENTS.md`.
- Every README defines `Purpose`, `Ontology`, and `Key Terms`.
- Every AGENTS file defines the three operational sections used in this file.
- Apps never import another app's source; tools never import another tool's
  source. Shared behavior moves into a library.
- App `publish` creates local artifacts only. Remote Netlify deployment remains
  outside this repository contract until `netlify/TODO.md` is completed.
- Generated content writes only to explicit paths inside the workspace.
