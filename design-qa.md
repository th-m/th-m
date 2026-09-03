# Design QA: Truth Instruments — SVG Fidelity Pass

## Source

- Reference: `/Users/thom/.codex/generated_images/01a03e2c-5b6f-73b2-8397-b05742bdefeb/exec-0c67e0b5-b9d0-486e-bf4b-f9222650a32a.png`
- Reference dimensions: 1080 × 1448 px
- Target: the situated-truth figure in `Truth and Inference`
- Intentional constraint: the three instrument illustrations are handcrafted SVG assets because the selected direction explicitly requires article-colocated SVGs.

## Implementation evidence

- Desktop: `/Users/thom/.codex/visualizations/2026/08/26/01a03e2c-5b6f-73b2-8397-b05742bdefeb/truth-instruments-tightened-desktop.png`
- Mobile: `/Users/thom/.codex/visualizations/2026/08/26/01a03e2c-5b6f-73b2-8397-b05742bdefeb/truth-instruments-tightened-mobile.png`
- Full-view side-by-side comparison: `/Users/thom/.codex/visualizations/2026/08/26/01a03e2c-5b6f-73b2-8397-b05742bdefeb/truth-instruments-tightened-comparison.png`
- Focused SVG comparison: `/Users/thom/.codex/visualizations/2026/08/26/01a03e2c-5b6f-73b2-8397-b05742bdefeb/truth-instruments-focused-final.png`
- Desktop viewport: 1080 × 1448 CSS px at browser device scale
- Mobile viewport: 390 × 844 CSS px at browser device scale
- State: article route loaded with expanded terms enabled; situated-truth figure in view

## Comparison

The implementation preserves the reference's editorial hierarchy: a quiet ruled header, three numbered instrument rows, proposition copy at left, an explanatory diagram in the center, feedback notes at right, and contextual parallels below. It adapts the composition to the article's existing content width and persistent site chrome instead of reproducing the reference as a full-page bitmap.

The focused comparison normalizes each source crop and SVG to a 480 × 300 px tile. This makes the line work, circle scale, axial alignment, wave amplitude, pan construction, labels, and optical center readable independently of the page grid.

The SVGs preserve the reference metaphors:

- acquaintance maps person, place, experience, and consequence;
- sincerity aligns inner state with outward expression;
- trustworthiness balances evidence, reliance, and risk.

## Findings

- P0: none.
- P1: none.
- P2: none remaining.
- P3: the article viewport gives the figure a slightly denser vertical rhythm than the standalone reference. This is intentional so the figure remains proportionate inside the existing essay.
- Responsive review: the mobile layout stacks proposition, SVG, feedback, and contextual parallel without horizontal overflow or text overlap.
- Browser console: no errors. The existing Three.js explorer emits an unrelated `THREE.Clock` deprecation warning.

## Iteration history

1. Replaced the generic situated-truth card grid with an editorial instrument layout.
2. Added three colocated SVG illustrations with meaningful alternative text.
3. Added tablet and mobile stacking rules.
4. Initial SVG review found P2 optical-balance drift: the acquaintance center row was off-axis and vertically compressed; the sincerity wave flattened early around an oversized center; and the trustworthiness pans read as closed triangles.
5. Aligned the acquaintance nodes on one axis, extended its lower diamond, reduced node weight, rebuilt the sincerity wave symmetrically around a smaller center, and reconstructed the trustworthiness hangers, shallow bowls, finial, and pedestal.
6. Post-fix focused evidence (`truth-instruments-focused-final.png`) shows the three instruments match the reference's geometry and restraint without the earlier P2 issues.
7. Rechecked the 1080 × 1448 desktop view and the 390 × 844 mobile state; no overflow, overlap, clipping, or new browser errors were found.

## Final result

passed
