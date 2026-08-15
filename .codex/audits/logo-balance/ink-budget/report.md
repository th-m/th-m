# THOM Perceptual Ink-Budget Variant

## Revisions and Reproduction

- Shared harness baseline: `4ba2cc4f018c2dbaba9b6aa9e6c8b11ac7b00845`.
- Implementation commit measured after generation: `37f7abdda555ee60a085f96b5fb24d472743a45d`.
- Branch: `codex/logo-balance-ink-budget`.
- Master viewport: `416 × 120` design units.
- Measurement render: `@resvg/resvg-js`, `8×` supersampling, sRGB decoded to linear-light luminance.
- Before command: `bun run measure:brand:balance --variant=ink-budget-before`.
- After command: `bun run measure:brand:balance --variant=ink-budget`.
- Evidence command: `bun run scripts/brand/compose-logo-balance-evidence.ts --before=.codex/audits/logo-balance/ink-budget-before --after=.codex/audits/logo-balance/ink-budget --output=.codex/audits/logo-balance/ink-budget`.
- Before metrics: `.codex/audits/logo-balance/ink-budget-before/metrics.json`.
- After metrics: `.codex/audits/logo-balance/ink-budget/metrics.json`.
- Combined comparison: `.codex/audits/logo-balance/ink-budget/before-after-overview.png`.

## Outcome

The final settled production wordmark is inside every optical-energy band at 24, 48, and 120 px. The common aggregate score falls from `0.232177` to `0.134159` (`42.22%` lower), while the mass component falls from `0.234261` to `0.012605` (`94.62%` lower). The separate high-contrast-core component improves from `0.309577` to `0.213459` (`31.05%` lower).

| Height | T share | H share | O share | M share |
|---:|---:|---:|---:|---:|
| 24 px before | 43.9773% | 21.4352% | 13.9668% | 20.6206% |
| 24 px after | **31.9375%** | **26.3296%** | **16.9631%** | **24.7698%** |
| 48 px before | 44.0722% | 21.3578% | 14.0952% | 20.4749% |
| 48 px after | **32.0464%** | **26.1865%** | **17.1227%** | **24.6444%** |
| 120 px before | 44.0521% | 21.2512% | 14.1439% | 20.5527% |
| 120 px after | **32.0683%** | **26.1492%** | **17.1480%** | **24.6345%** |

Target bands are T `31–33%`, H `25–28%`, O `16–18%`, and M `24–27%`.

## Optical Energy and Core Coverage

| Height | Glyph | Optical energy before → after | Energy multiplier | Core area before → after | Core share before → after |
|---:|:---:|---:|---:|---:|---:|
| 24 | T | 49.126357 → 34.242178 | 0.6970 | 94.687500 → 84.578125 | 48.3678% → 43.4291% |
| 24 | H | 23.944962 → 28.229563 | 1.1789 | 41.484375 → 41.625000 | 21.1908% → 21.3736% |
| 24 | O | 15.602102 → 18.187159 | 1.1657 | 21.343750 → 24.859375 | 10.9027% → 12.7648% |
| 24 | M | 23.034925 → 26.557187 | 1.1529 | 38.250000 → 43.687500 | 19.5387% → 22.4326% |
| 48 | T | 197.554744 → 137.970679 | 0.6984 | 370.765625 → 328.875000 | 47.5131% → 42.5350% |
| 48 | H | 95.737153 → 112.741845 | 1.1776 | 168.781250 → 168.906250 | 21.6291% → 21.8454% |
| 48 | O | 63.181938 → 73.719216 | 1.1668 | 93.843750 → 106.515625 | 12.0260% → 13.7762% |
| 48 | M | 91.779181 → 106.102359 | 1.1561 | 146.953125 → 168.890625 | 18.8318% → 21.8434% |
| 120 | T | 1236.905337 → 864.171275 | 0.6987 | 2289.062500 → 2025.718750 | 47.1862% → 42.1981% |
| 120 | H | 596.696358 → 704.665739 | 1.1809 | 1045.859375 → 1046.546875 | 21.5591% → 21.8008% |
| 120 | O | 397.136315 → 462.100665 | 1.1636 | 612.031250 → 687.031250 | 12.6163% → 14.3117% |
| 120 | M | 577.084390 → 663.847761 | 1.1503 | 904.171875 → 1041.203125 | 18.6384% → 21.6895% |

The final balance is not halo-only: T retains its filled skeleton and full contour, H energy comes primarily from brighter pillars, O gains a thicker high-contrast circumference, and M gains wider/brighter deterministic core partials. At 120 px, O core area rises `12.25%` and M core area rises `15.16%`.

## Scorecard

| Component | Before | After | Effect |
|:---|---:|---:|---:|
| Mass | 0.234261 | 0.012605 | −94.62% |
| Core | 0.309577 | 0.213459 | −31.05% |
| Moments | 0.038359 | 0.037119 | −3.23% |
| Gaps | 0.074593 | 0.072776 | −2.44% |
| Motion | 0.422290 | 0.490530 | +16.16% regression |
| Aggregate | 0.232177 | 0.134159 | −42.22% |

## Bounded Iterations

| Pass | Aggregate | 120 px shares T/H/O/M | Primary bounded changes |
|:---|---:|:---|:---|
| Before | 0.232177 | 44.0521 / 21.2512 / 14.1439 / 20.5527 | Frozen harness baseline |
| Iteration 1 | 0.162373 | 35.1745 / 25.3839 / 15.6337 / 23.8078 | T material opacity; H flatter palette and b energy; O and M widths/opacities +6% |
| Iteration 2 | 0.135467 | 32.3813 / 25.4283 / 17.3154 / 24.8750 | Calibrated T opacity; second +6% O/M step; paired −6%/+6% H a/b widths |
| Final | 0.134159 | 32.0683 / 26.1492 / 17.1480 / 24.6345 | H palette lift; paired −3.6%/+3.6% a/b widths; renderer parity calibration |

No canonical path coordinate, placement, advance, scale, seed, anchor, chord, Fourier coefficient, harmonic order, or animation timing changed. Every canonical stroke-width iteration was at most `6%`. The final `1.20` M WebGL core-width renderer compensation is a documented exception: it corrects under-rasterization relative to SVG filters without changing canonical Fourier geometry or static measurement widths. Uniform halo scaling was rejected after browser evidence showed a `6.42%` height mismatch; only partial/core and final middle/core WebGL tessellation receive the compensation.

## Changed Parameters

### T

| Parameter | Before | Final | Measured effect |
|:---|:---|:---|:---|
| `PI_MATERIAL.fillOpacity` | implicit 1 | 0.646 | T optical energy becomes `0.6970–0.6987×` baseline |
| `PI_MATERIAL.webglFillOpacity` | implicit 1 | 0.960 | T SVG/WebGL silhouette IoU passes at `0.841831` |
| SVG fill behavior | opaque filtered fill | `fill-opacity=0.646`, full contour retained | Core area remains `88.49%` of baseline at 120 px |

### H

| Parameter | Before | Final |
|:---|:---|:---|
| Column edge | `#bd9a63` | `#cdb388` |
| Column body | `#d2bc96` | `#e3cfad` |
| Column highlight | `#e2d2b4` | `#efe1c7` |
| a halo width | 3.800 | 3.443 |
| a middle width | 1.550 | 1.405 |
| a core width | 0.820 | 0.743 |
| b halo width | 2.800 | 3.259 |
| b halo opacity | 0.045 | 0.055 |
| b middle width | 1.200 | 1.397 |
| b middle opacity | 0.220 | 0.280 |
| b core width | 0.680 | 0.792 |
| b core opacity | 0.840 | 1.000 |
| b core color | gold | highlight |

H optical energy becomes `1.1776–1.1809×` baseline. Crossbar energy-per-unit ratio moves from `1.631222` to `0.995781`, and the crossbar centroid offset moves from `−2.537347` to `−0.072306` design units while the authored golden ratio remains `1.618034`.

### O

| Parameter | Before | Final |
|:---|---:|---:|
| Circle halo width | 8.000 | 8.989 |
| Circle halo opacity | 0.055 | 0.062 |
| Circle middle width | 4.800 | 5.393 |
| Circle middle opacity | 0.300 | 0.337 |
| Circle core width | 2.150 | 2.416 |
| Circle core color | ivory | highlight |

O optical energy becomes `1.1636–1.1668×` baseline. The `THOM-01` seed, 12 anchors, 19 chords, intersections, highlights, and circle points are unchanged and deterministic.

### M Final Stack

| Parameter | Before | Final |
|:---|---:|---:|
| Halo width | 8.800 | 9.888 |
| Halo opacity | 0.110 | 0.124 |
| Middle width | 6.850 | 7.697 |
| Middle opacity | 0.560 | 0.629 |
| Core width | 3.100 | 3.483 |
| Core opacity | 0.960 | 1.000 |
| WebGL partial/core width scale | implicit 1 | 1.200 |

### M Deterministic Partial Layers

Amplitude scales, partial indices, Fourier coefficients, and harmonic order are unchanged. Width, opacity, halo width, and halo opacity receive two bounded `1.06×` steps (`1.1236×` cumulative, rounded deterministically).

| Partial | Width before → after | Opacity before → after | Halo width before → after | Halo opacity before → after |
|---:|:---|:---|:---|:---|
| 0 | 0.736 → 0.827 | 0.500 → 0.562 | 3.087 → 3.469 | 0.045 → 0.051 |
| 1 | 0.705 → 0.792 | 0.472 → 0.530 | 2.888 → 3.245 | 0.045 → 0.051 |
| 2 | 0.685 → 0.769 | 0.444 → 0.499 | 2.882 → 3.238 | 0.045 → 0.051 |
| 3 | 0.662 → 0.743 | 0.416 → 0.467 | 2.827 → 3.177 | 0.045 → 0.051 |
| 4 | 0.642 → 0.721 | 0.388 → 0.436 | 2.835 → 3.185 | 0.045 → 0.051 |
| 5 | 0.622 → 0.698 | 0.360 → 0.404 | 2.829 → 3.179 | 0.045 → 0.051 |
| 6 | 0.602 → 0.677 | 0.332 → 0.373 | 2.840 → 3.191 | 0.045 → 0.051 |
| 7 | 0.581 → 0.653 | 0.304 → 0.342 | 2.814 → 3.162 | 0.045 → 0.051 |
| 8 | 0.572 → 0.642 | 0.276 → 0.310 | 3.007 → 3.378 | 0.045 → 0.051 |
| 9 | 0.543 → 0.610 | 0.248 → 0.279 | 2.845 → 3.197 | 0.045 → 0.051 |
| 10 | 0.522 → 0.587 | 0.220 → 0.247 | 2.838 → 3.189 | 0.045 → 0.051 |

M optical energy becomes `1.1503–1.1561×` baseline. SVG/WebGL parity passes with IoU `0.804829 / 0.887004 / 0.787032` at thresholds `18 / 55 / 140`.

### Validation Contract

- T visual-audit silhouette IoU floor changes from `0.60` to `0.53` because intentional material opacity changes normalization while coverage remains stable.
- New T guards require coverage delta `≤0.01` and quadrant-distribution delta `≤0.03`; measured values are `0.000729` and `0.021563`.
- Deterministic geometry, SVG, M payload, and aggregate generated-asset hashes are updated to the new authored result.

## Character Invariant Audit

- **T — pass:** original closed π/T path, calligraphic roof, two legs, terminals, counters, placements, and compact glyph remain unchanged. Only luminous material opacity and renderer parity are adjusted.
- **H — pass:** both thin classical pillar paths, centers, serifs, exact golden-ratio split, endpoint/division ticks, full-unit brace, 700 ms φ-to-H narrative, reduced-motion fallback, and static fallback remain. Geometry tests pass.
- **O — pass:** circle geometry, `THOM-01` seed, anchors, 19 chords, intersections, highlights, and deterministic topology remain unchanged. Only circumference material changes.
- **M — pass:** all Fourier coefficients, partial indices, harmonic order, component topology, and whispy layered construction remain deterministic. Existing partials are strengthened; no conventional outline replaces them.

## Acceptance Audit

| Criterion | Result | Evidence |
|:---|:---:|:---|
| 120 px energy bands | Pass | `32.0683 / 26.1492 / 17.1480 / 24.6345` |
| 24 and 48 px within allowed bands | Pass | All eight size/glyph checks inside primary bands |
| Recognizable high-contrast core | Pass | Core score −31.05%; O/M core areas increase; visual sheets reviewed |
| H crossbar centroid within 0.25 | Pass | `−0.072306` units |
| Exact H golden ratio | Pass | `1.618034`; geometry tests pass |
| φ hold within 5% | **Fail / synthesis dependency** | `29.5193%`; motion specialist should compensate brighter settled H |
| Crossfade within 7% | **Fail / synthesis dependency** | `28.4298%`; motion specialist should normalize envelope |
| H centroid motion within 1 unit | **Marginal fail / synthesis dependency** | `1.009186` units |
| Optical gaps within 10% | Pass at 24; **fail at 48/120** | max deviation `9.3023% / 11.7647% / 11.6822%`; placement unchanged |
| O topology deterministic | Pass | Unit contracts and generated hashes pass |
| M layered and deterministic | Pass | Unit contracts and generated hashes pass |
| Reduced-motion/static parity | Pass | Site browser tests pass |
| Generated asset family updated | Pass | Master, light, monochrome, glyphs, Open Graph, and audit assets regenerated |
| Typecheck/unit/build/focused audit | Pass | Commands below |
| Site/logo browser tests | Pass | 23 passed, 7 deliberate mobile skips |
| Umbrella `test:e2e` | **Baseline command issue** | 23 logo/site passes; 4 graph-route failures. Dedicated graph config passes 2/2 |

## Validation Commands and Results

| Command | Result |
|:---|:---|
| `bun install --frozen-lockfile` | Pass; 173 packages installed with Bun 1.3.8 |
| `bun run generate:brand` | Pass; 14 deterministic assets generated |
| `bun run typecheck` | Pass |
| `bun run test` | Pass; 8 files, 44 tests |
| `bun run build` | Pass; Vite production build and prerender complete; existing chunk-size warning only |
| `bun run audit:brand:update` | Pass after intentional snapshot refresh; 1 focused audit test |
| `bun run audit:brand` | Pass; 1 focused audit test |
| `bunx playwright test tests/e2e/site.spec.ts --project=desktop --project=mobile` | Pass; 23 passed, 7 skipped |
| `bun run test:graph:e2e` | Pass; 2 passed |
| `bun run test:e2e` | Partial; 23 site/logo passed, 7 skipped, 4 graph tests failed because the site preview does not serve the graph route |
| `bun run measure:brand:balance --variant=ink-budget` | Pass; aggregate `0.134159` at implementation revision `37f7abd` |

## Generated Evidence

- Before and after production and monochrome rasters at 24, 48, and 120 px are retained in `.codex/audits/logo-balance/ink-budget-before/` and `.codex/audits/logo-balance/ink-budget/`.
- Explicit four-panel comparisons are `before-after-24px.png`, `before-after-48px.png`, `before-after-120px.png`, and `before-after-overview.png` under the final variant directory.
- Deterministic intermediate metrics and images are retained under `ink-budget-iteration-1/` and `ink-budget-iteration-2/`.
- Production browser/design QA output is updated under `public/brand-audit/`.

## Synthesis Recommendation

Adopt the T luminous fill calibration, O circumference stack, M `1.1236×` deterministic partial-layer stack, and H a/b energy leveling. The H crossbar correction is especially compatible: it centers the optical crossbar without changing the exact golden split. Pair the brighter H palette with the motion specialist’s φ hold/crossfade normalization before synthesis acceptance. Preserve placement decisions for the spatial specialist, because this variant improves but does not independently clear the 48/120 px optical-gap gate. Recompute the common score after combining any motion or placement decisions.
