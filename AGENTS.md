# TH-M Workspace Agent Contract

## Operational Flow

1. Read the nearest `README.md` and `AGENTS.md` before changing a subtree.
2. Identify one owning Nx project for each changed implementation file.
3. Keep source, tests, configuration, and operational documentation with that
   owner; reusable behavior belongs in `libs/`.
4. Use Bun TypeScript for repository scripts and invoke project work through Nx.
5. Run the required owner verification before handing off a change.

### Setup and context

- Install existing dependencies with `bun install` when installation is in
  scope. Discover projects with `bun run nx show projects`; inspect an owner
  with `bun run nx show project <project> --json`.
- Invoke work with `bun run nx run <project>:<target>`. Blog authoring starts
  with `bun run nx run blogs:start`.
- Confirm targets and ownership in manifests, behavior in source and tests,
  and consumer boundaries in exports and imports. Prior investigations and
  diagrams provide context, not proof of current implementation.

### Documentation conventions

- Every repository-owned README uses `Purpose`, `Boundaries`, `Ontology`,
  and `Key Terms`, in that order. Ontology names concepts, relationships, and
  the paths or APIs encoding them.
- Preserve the three required AGENTS sections. Put setup/configuration and
  workflows under Operational Flow, checks under Required Verification, and
  constraints under Required Invariants. Add Skills and Downlinks as needed.
- Keep reusable procedures in skills and local obligations in owner contracts.
  Link shared definitions. Move command recipes out of revised READMEs into
  their AGENTS files without losing behavior or constraints.
- Keep plans and investigations as labeled Markdown beside their owner; use
  Mermaid for diagrams. Adopt accepted conventions into maintained contracts.
  Historical proposals are not active instructions.

### Delegation

For requested team or parallel work, use `thm-team`. Assign independent scopes
with explicit owners, inputs, allowed outputs, acceptance, and stop conditions.
The coordinator retains integration and final verification responsibility.
Routine single-owner edits do not need a team. Skills and instructions never
grant tools or sandbox permissions.

## Required Verification Parameters Within Nested Context

- Run `<project>:typecheck` and `<project>:test` for every affected project.
- Run app `publish` when changing its build inputs or artifact contract.
- Smoke-test tool `gen` when changing schemas, layout, rendering, fonts, or CLI
  argument handling.
- Run `bun run nx show projects` after workspace or package metadata changes.
- Run `testing:test` after adding or changing repository-owned documentation.

## Required Invariants Within Folder Context

- Every repository-owned `README.md` has a sibling `AGENTS.md`.
- Every README defines `Purpose`, `Boundaries`, `Ontology`, and `Key Terms`
  exactly once and in that order.
- Every AGENTS file defines the three operational sections used in this file
  exactly once and in that order.
- Apps never import another app's source; tools never import another tool's
  source. Shared behavior moves into a library.
- App `publish` creates local artifacts only. Remote Netlify deployment remains
  outside this repository contract until `netlify/TODO.md` is completed.
- Generated content writes only to explicit paths inside the workspace.

## Skills

| Task | Procedure |
| --- | --- |
| Ontology and README/AGENTS responsibilities | [thm-repo-docs](.agents/skills/thm-repo-docs/SKILL.md) |
| Named team or explicit delegation | [thm-team](.agents/skills/thm-team/SKILL.md) |
| Article research, drafting, or local publication | [thm-blog-authoring](.agents/skills/thm-blog-authoring/SKILL.md) |

## Downlinks

- [Apps](apps/AGENTS.md): product runtimes and publication.
- [Libraries](libs/AGENTS.md): reusable public capabilities.
- [Tools](tools/AGENTS.md): local authoring, inspection, and generation.
- [Blogs](libs/blogs/AGENTS.md): editorial and content workflow.
- [Netlify](netlify/AGENTS.md): hosting preparation.
- [Skills](.agents/skills/AGENTS.md): repository procedure maintenance.
