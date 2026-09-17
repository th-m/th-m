# theory

## Purpose

A local, visual-only music workspace for creating and exploring eight musical
shape families. Musical rules generate the diagrams; the reference images are
inspiration rather than authoritative theory charts.

## Boundaries

The `theory` Nx app owns its browser UI, study model, musical calculations,
layouts, tests, and local artifacts. There is no backend, audio engine, MIDI,
remote deployment, or account. Studies are stored in this browser, with JSON
backup/import and undo/redo. Switching studies keeps their edits independent.
The collected research and Figma notes remain under `notes/`.

## Ontology

| Concept | Representation and relationship |
| --- | --- |
| Workspace | `src/model.ts`: versioned collection of separate studies and an active study ID. |
| Study | A typed variant for Snowflake, Honeycomb, Garden, Mandala, Motif Tree, Register Spiral, Form Map, or Scale Lattice. Contains musical settings and an optional selected route. |
| Musical relationship | `src/music.ts`: deterministic interval, chord, key, rhythm, motif, register, and mode calculations in twelve-tone equal temperament. |
| Diagram | `src/graphs.ts`: derived nodes, edges, and explanations. `src/Canvas.tsx` owns camera state; layout coordinates are not saved musical data. |
| Definition / occurrence | Form definitions own motif notes; occurrences reference definitions. Linked duplication shares a definition; independent duplication copies it. |
| Snapshot transfer | Chord → Spiral and motif → Form create independent studies with source attribution. |
| Persistence | `src/storage.ts`: validated version-1 browser storage and JSON backups. Invalid imports leave existing studies intact. |

## Key Terms

- **Explore:** select items and relationships without automatically adding a route.
- **Build:** change the active study's musical rules or material.
- **Route:** a numbered selection of connected alternatives; it is not audio.
- **Visible depth:** detail shown in a recursive diagram, independent of a saved route.
- **Visual clock:** a silent rhythm cursor; enabled hits and accents remain editable.
- **Publish:** produce this app's local `dist/` directory only.

See [AGENTS.md](AGENTS.md) for commands and verification, and
[the design notes](notes/theory-graphical-music-language.md) for the broader concept.
