# Diagram Theme

## Purpose

Adapt Diagram Design compositions and Fireworks semantic SVGs to the THOM
foundation, with reusable browser playback for construction and data flow.

## Boundaries

This library owns theme adaptation, the canonical AI Factory icon catalog and
glyph geometry, shared diagram reading roles, and reusable browser motion. The design
foundation owns brand tokens; the diagrams tool owns upstream setup, source
generation, and export paths. Diagram authors own labels and geometry.

## Ontology

`createDiagramTheme` maps `@th-m/design-theme` into diagram roles. Overrides
change those roles without changing a diagram's labels, geometry, or topology.
`themeSvg` accepts SVG and rejects executable or external content; it preserves
semantic IDs and motion metadata. `mountDiagramMotion` animates declared edges
in stage/order sequence, leaving nodes and the camera fixed. Its initial and
reduced-motion states show the entire diagram.

`icon-catalog` defines concepts; `icons` renders their shared SVG geometry.
`icons.css` and `styles.css` apply foundation tokens to live figures. The
`export-icons` entry renders the same geometry for `themeSvg` icon slots:
`<g data-thom-icon="goal" transform="translate(40 40) scale(.4)"/>` uses a
160-unit frame. Pass `diagramIconFragments()` as the fifth `themeSvg` argument;
the diagrams tool supplies this map and embeds the icon CSS automatically.
Fragments receive the same inert-content validation as source SVG.

Information blue highlights the truth/evaluation family and evidence provenance;
it does not certify a claim. Gold marks purpose, agency, and selected paths.
Red marks faults or contradictions; missing connections retain their gold cross.
Neutral geometry carries structure. Shapes and labels preserve these meanings
without color. Live icons use `--color-info`; exported diagrams use the same
foundation value through the `info` theme role, including
`data-thom-role="info"` on evidence labels or edges.

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
