# THOM M Reconstruction — Design QA

final result: passed

## Comparison Context

- Source visual truth: `/Users/thom/Sites/th-m/th-m/public/brand-logo-idea.png` (`1491 × 1055`).
- Authoritative M crop: `/Users/thom/Sites/th-m/th-m/public/brand-audit/reference/m.png` (`320 × 240`).
- Settled implementation capture: `/Users/thom/Sites/th-m/th-m/public/brand-audit/current/m.png` (`320 × 240`).
- Focused source/current/difference board: `/Users/thom/Sites/th-m/th-m/public/brand-audit/audit/10-m-reconstruction.png` (`1200 × 520`).
- State: isolated display M at rest, after the introduction; no hover replay or construction motion in progress.
- Rendering paths: generated display SVG for strict board matching, plus a settled WebGL/SVG geometry-parity browser check.

## Findings

No actionable P0, P1, or P2 differences remain within the M reconstruction scope.

- Shape and layout: The M is exactly symmetric, fills the committed `122 × 120` isolated viewBox, and uses the same `1.22` horizontal treatment in the isolated asset and `416 × 120` master lockup. Peak, center, and endpoint placement remain within the required thresholded size tolerance.
- Mathematical field: Eleven visible resting layers are cumulative sums of real FFT-derived harmonics. The final line is the twelve-term sum; compact output is the four-term sum from the same coefficient set.
- Color and material: The champagne partial field, gold middle, edge-attenuated ivory highlight, and static halo recover the source board's luminous depth without bloom or an idle render loop.
- Image quality: The SVG is clean at display size with no crop, compression, or transparency artifacts. The source is raster; the implementation remains deterministic vector/WebGL geometry as required.
- Motion and behavior: Component construction, partial accumulation, final resolution, isolated replay, reduced-motion settlement, and stopped render loops are preserved. The isolated WebGL camera now matches the `122 × 120` SVG framing without leaking adjacent glyph geometry.
- Typography, copy, icons, spacing, and page structure: unchanged by this scoped reconstruction. Desktop/mobile smoke checks found no overflow or content regression.
- Accessibility: Canvas remains hidden from assistive technology, the generated SVG remains beneath it, the explainer is keyboard operable, reduced motion is static, and automated serious/critical findings remain clear.

## Quantitative Acceptance

- Strict raw M mismatch: **10.4%** (required `≤ 10.8%`).
- Recorded strict M baseline: **13.6%**.
- Relative strict improvement: **23.4%** (required `≥ 20%`).
- Thresholded silhouette IoU: **0.64** (required `≥ 0.50`; prior `0.23`).
- Luminance `18`: width delta **3.3%**, height delta **0.7%**, density delta **1.6%**.
- Luminance `55`: width delta **1.6%**, height delta **1.5%**, density delta **9.0%**.
- Luminance `140`: width delta **2.6%**, height delta **4.2%**, density delta **8.5%**.
- Settled WebGL/SVG high-luminance ridge parity: passed at IoU **≥ 0.72**, width delta **≤ 5%**, and height delta **≤ 5%**.

## Comparison History

1. Initial reconstruction — blocked:
   - P1: isolated M was too narrow and the resolved curve lacked the source board's width and depth.
   - P1: resting layers collapsed into parallel outlines rather than a legible Fourier field.
   - P2: SVG and isolated WebGL framing differed, exposing a sliver of the adjacent O in WebGL.
2. FFT geometry pass — improved:
   - Added the reference-board calibration script, exact symmetry, radix-2 FFT bins, twelve harmonics, twelve partial sums, and the four-term compact sum.
   - Expanded the master placement and isolated viewBox to 122 units.
3. Material and QA pass — passed:
   - Calibrated the paired controls and deterministic accumulation order through Playwright raster scoring.
   - Tuned the partial field and edge-attenuated final highlight to pass strict mismatch, silhouette, three-level dimensions, and three-level density gates together.
   - Aligned SVG/WebGL material constants and isolated camera framing, then updated intentional M and lockup snapshots.

## Follow-up Polish

- P3: The source board's raster glow has slight irregularities; the implementation intentionally resolves those into reproducible line layers.
- P3: The WebGL line rasterizer and SVG filter differ subtly below high luminance, while their resolved ridge geometry is locked by the parity check.

## Implementation Checklist

- [x] Reference-derived symmetric spline controls committed.
- [x] Deterministic radix-2 FFT and inverse-FFT test coverage.
- [x] Twelve display harmonics, eleven resting partials, and four-term compact output.
- [x] `122 × 120` isolated asset and corrected master placement.
- [x] Shared SVG/WebGL geometry and material metadata.
- [x] Strict mismatch, silhouette, luminance-size, and density acceptance gates.
- [x] Desktop/mobile, reduced-motion, no-JavaScript, fallback, accessibility, render-loop, and production-build validation.
