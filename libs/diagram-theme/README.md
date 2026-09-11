# Diagram Theme

## Purpose

Adapt Diagram Design compositions and Fireworks semantic SVGs to the THOM
foundation, with reusable browser playback for construction and data flow.

## Ontology

`createDiagramTheme` maps `@th-m/design-theme` into diagram roles. Overrides
change those roles without changing a diagram's labels, geometry, or topology.
`themeSvg` accepts SVG and rejects executable or external content; it preserves
semantic IDs and motion metadata. `mountDiagramMotion` animates declared edges
in stage/order sequence, leaving nodes and the camera fixed. Its initial and
reduced-motion states show the entire diagram.

The animation adapter is THOM-owned. It draws on Fireworks' construction and
settled-flow pattern; it does not reproduce or claim validation against the
upstream scene-specific GIF presets. See the tool's
[source and compatibility notes](../../tools/diagrams/UPSTREAMS.md).

## Key Terms

- **Role:** paper, surface, ink, muted, rule, accent, or a named state/category.
- **Semantic edge:** an SVG path, line, or polyline with `data-graph-role="edge"`.
- **Stage/order:** `data-motion-stage` and `data-motion-order`, determining sequence.
- **Static equivalent:** complete topology without moving overlays.

Import theme APIs from `@th-m/diagram-theme`; DOM-dependent APIs are under
`@th-m/diagram-theme/browser`. Artifact generation is owned by `diagrams`.
