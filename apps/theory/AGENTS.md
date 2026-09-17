# theory Agent Contract

## Operational Flow

Read the sibling README before edits. The owning Nx project is `theory`.
Use `bun run nx run theory:start` for the local server at 127.0.0.1:5193.
Build local artifacts with `bun run nx run theory:publish`.

Keep pure musical operations in `src/music.ts`, study ownership in
`src/model.ts`, import validation in `src/storage.ts`, and derived geometry in
`src/graphs.ts`. When changing a study variant, update its preset, validator,
controls, graph builder, and relevant fixtures together.

## Required Verification Parameters Within Nested Context

Run `theory:typecheck`, `theory:test`, and `theory:publish` through Nx.
Run `testing:test` after documentation edits and `nx show projects` after
package metadata changes. Browser-check changed explorers, keyboard selection,
view-only camera operations, and mobile overflow before handoff.

## Required Invariants Within Folder Context

Musical data uses twelve-tone equal temperament; names retain contextual
spelling where harmonic roles matter. The diagrams derive from data, not the
reverse. Camera changes cannot transpose, retime, or clear routes.

Study transfers create independent snapshots. Form occurrences explicitly share
or copy definitions. Import failure preserves the current workspace. Storage
failure preserves the current session and exposes JSON export.

Preserve the existing research under `notes/`. Local publication writes only
`dist/`; there is no remote deployment or audio engine in this app.
