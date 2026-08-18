# THOM T Bézier fine-tuning handoff

Continue from the current audit mockup, not production logo code:

- Reference image: `.codex/audits/logo-balance/final-review/14-alignment-mockup-perimeter-refined.png`
- Editable source: `.codex/audits/logo-balance/final-review/compose-alignment-mockup.ts`

The immediate task is to fine-tune only the T while using the reference image above as the visual baseline. The T is intentionally three independent, filled Bézier contours: `top-bar`, `left-pillar`, and `right-pillar`. Each contour has a paired outer/inner Bézier edge. Preserve the existing cap line, baseline, half-cap roof overflow, terminal character, and Pi-symbol composition.

Work by moving the paired edges of one segment closer together or farther apart—not by applying a blunt whole-letter scale or replacing curves with pointy polygons. Move corresponding anchors and adjacent control handles together along the local normal. Keep the tangent direction continuous at the cap joins, terminal turns, and all curve-to-curve joins. Retain enough anchors and handles to preserve the long, crisp sweep of the roof and the controlled flare of both pillars.

For each iteration:

1. Capture a fresh browser raster of the mockup.
2. Compare it directly to the current reference at the same size.
3. Check cap/baseline alignment and the construction-line black-ink spans against H and O.
4. Keep O, H, M, guides, and all production logo code unchanged.

The task is a perceptual typography refinement. Do not force identical numerical widths; use the shared master-unit system only to make comparisons meaningful.
