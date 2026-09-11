# THOM Diagrams

## Purpose

Use Diagram Design's editorial grammars and Fireworks Tech Graph's technical
patterns with THOM colors, typography, and draw-then-flow animation.

## Boundaries

This tool owns pinned upstream setup, CLI inputs, and local diagram artifacts.
`diagram-theme` owns shared theme adaptation and browser motion; articles own
their explanatory content and figure registration. Setup and generation
commands live in [AGENTS.md](AGENTS.md).

## Ontology

This local Bun/Nx tool installs pinned upstream source under the ignored
`.bun-tmp/diagram-tools` directory. It generates a THOM style guide for agents,
uses Fireworks' actual JSON-to-SVG generator, and passes SVG from either source
through `@th-m/diagram-theme`. The tool owns offline HTML, PNG, and GIF export.
Source content stays editable; reports distinguish upstream geometry checks
from THOM adaptation. It does not deploy or change existing article figures.

## Key Terms

- **Engine:** `fireworks` for generated JSON, `diagram-design` for authored SVG/HTML.
- **Motion:** `none` (default), `draw`, or `flow`; complete static HTML loads first.
- **Theme override:** JSON with optional `colors`, `fonts`, `easing`, and `series`
  matching `DiagramThemeOverrides`. Colors are six-digit hex strings.
- **Output stem:** explicit workspace path; outputs append `.svg`, `@2x.png`,
  `.html`, `.receipt.json`, and optionally `.gif`.
