# Diagram Theme Agent Contract

## Operational Flow

Keep theme roles derived from design-theme and browser adaptation independent
of apps and tool source. Preserve source labels, relationship IDs, and geometry.

## Required Verification Parameters Within Nested Context

Run `diagram-theme:typecheck`, `diagram-theme:test`, `diagrams:typecheck`, and
`diagrams:test`. Smoke-test `diagrams:gen` after theme, SVG, or motion changes.

## Required Invariants Within Folder Context

Motion is opt-in and pausable. Reduced motion and initial HTML show complete
information. Source SVG is inert before insertion. New brand values belong in
design-theme; scene geometry and source installation belong to consumers.
