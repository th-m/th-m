# Sources and compatibility

Revisions are locked in `src/upstreams.ts` and checked before generation.
`diagrams:setup` installs full source and licenses without modifying either tool.

| Source | Use | Revision |
| --- | --- | --- |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Editorial types, semantic patterns, templates | `8d8b2993ee2256ee7dfc0eeb3b5713aba3b60792` |
| [Fireworks Tech Graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) | JSON validation, SVG generation, technical patterns, motion reference | `31fea364eda5f1852b1175f3d9e29ea31d22dcb4` |

`examples/pipeline.svg` applies Diagram Design's flowchart grammar to THOM's
editorial language. `examples/loop.html` adapts its dark six-station Loop example
with motion metadata. MIT terms are in `licenses/diagram-design.txt`. Fireworks
examples retain source labels and topology; its license is in
`licenses/fireworks-tech-graph.txt`.

THOM's motion adapter uses the construction-followed-by-flow approach: fixed
nodes, directed route draw-on, then moving packets. The upstream
[motion contract](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/31fea364eda5f1852b1175f3d9e29ea31d22dcb4/references/motion-effects.md)
requires specific scene structures, schedules, and source colors. Recolored
arbitrary diagrams do not satisfy that contract. THOM playback and GIF export
have their own implementation and receipts; upstream presets remain intact.

Fireworks source is checked before adaptation. Themed output preserves IDs,
labels, and edge geometry, embeds THOM's Latin fonts, and checks declared text
width budgets in Chromium. Source palette receipts do not attest to the themed
palette. Inspect the actual themed exports before sharing.

Diagram Design imports retain SVG and scoped template CSS. Known built-in
light/dark literals and semantic variables are mapped; custom colors should use
explicit THOM roles. HTML exports contain the diagram only. Motion requires
semantic edge attributes; static sources are not assigned invented process
order. Fireworks styles 1–7 and 9–12 use generators; style 8 remains authored SVG
and can be imported through the SVG route.

Available outputs are SVG, PNG, controlled offline HTML, and opt-in GIF. Portfolio
React wrappers, a live theme-switching UI, and scene-specific Fireworks motion
signatures are not implemented. Consumers can reuse the library's theme and
browser playback APIs when adding those surfaces.
