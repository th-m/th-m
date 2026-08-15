# THOM Logo Balance: Source-Level Stroke Energy

## Scope and Reproduction

- Specialist: source-level stroke energy.
- Shared-harness baseline: `4ba2cc4f018c2dbaba9b6aa9e6c8b11ac7b00845`.
- Frozen implementation revision: `77b921481924a5ddf850995b32141439c983e148`.
- Branch: `codex/logo-balance-stroke-energy`.
- Raster environment: `416x120` viewport, pixel ratio/supersample `8`, `@resvg/resvg-js`, sRGB decoded to linear-light luminance.
- Baseline output: `.codex/audits/logo-balance/stroke-energy-before/`.
- Variant output: `.codex/audits/logo-balance/stroke-energy/`.
- Source equation: `E = sum(length * width * opacity * linearLuminance) + sum(area * opacity * linearLuminance)`.
- Control equation: `q_next = clamp(q * sqrt(E_target / E_rendered), 0.8, 1.2)`.
- Assumptions: source layers are additive; deterministic Bézier sampling and polygon integration measure authored geometry; gradient luminance is trapezoid-integrated in linear light; baseline calibration absorbs raster overlap, clipping, antialiasing, and filters.

## Result Summary

All four glyphs enter their target optical-energy bands at every tested size. The common aggregate score falls from `0.232177` to `0.129760` (`44.1%` lower). The mass component falls from `0.234261` to `0.009653`, while the core component falls from `0.309577` to `0.190341`. The H crossbar optical centroid improves from `-2.537347` to `+0.043570` design units from center, and authored a/b source energy per unit becomes exactly equal.

| Size | T before → after | H before → after | O before → after | M before → after |
| --- | ---: | ---: | ---: | ---: |
| 24 px | 43.9773% → 31.5144% | 21.4352% → 26.5329% | 13.9668% → 16.7721% | 20.6206% → 25.1805% |
| 48 px | 44.0722% → 31.6583% | 21.3578% → 26.2927% | 14.0952% → 16.9868% | 20.4749% → 25.0621% |
| 120 px | 44.0521% → 31.6951% | 21.2512% → 26.3286% | 14.1439% → 16.9745% | 20.5527% → 25.0017% |

Target bands are T `31–33%`, H `25–28%`, O `16–18%`, and M `24–27%`.

## Changed Parameters

No placements, path coordinates, cap height, H split, O topology, M harmonic ordering, seeds, animation timings, or interpolation curves changed.

### Shared Controls

| Glyph | `q` | `q²` source scale | Intended control |
| --- | ---: | ---: | --- |
| T | 0.852298 | 0.726411880804 | Reduce filled-material energy while preserving π geometry and rim |
| H | 1.116686 | 1.246987622596 | Raise pillar material energy; separately equalize a/b stroke stacks |
| O | 1.096325 | 1.201928505625 | Scale stroke widths by `q²` and circular marker radii by `q` |
| M | 1.113872 | 1.240710832384 | Scale final and partial stroke widths by `q²` |

### T Parameters

| Parameter | Before | After |
| --- | --- | --- |
| Static fill correction | 1 | `PI_FILL_ENERGY_SCALE = 0.6658886957191723` |
| Static gold | `#a67f50` | `#8a6941` |
| Static ivory | `#beb19f` | `#9e9384` |
| Static highlight | `#f1dfbd` | `#c9ba9d` |
| Shadow | `#50382f` | unchanged |
| Edge | `#ead7b5` | unchanged |
| Edge width | `0.38` | unchanged |
| WebGL fill material | shared static palette | original palette in `PI_WEBGL_MATERIAL`, opacity `1` |
| Visual-audit occupied-silhouette threshold | `55` | `5`, separating topology occupancy from material luminance |

The T path, internal leg insets, outline, placement, and animation are unchanged. Static material is reduced to satisfy raster energy; WebGL retains the original palette to preserve SVG/WebGL parity.

### H Parameters

| Parameter | Before | After |
| --- | ---: | ---: |
| b halo width / opacity | `2.8 / 0.045` | `3.8 / 0.055` |
| b middle width / opacity | `1.2 / 0.22` | `1.55 / 0.28` |
| b core width / opacity | `0.68 / 0.84` | `0.82 / 1` |
| b core color | gold | highlight, matching a |
| Static b width / opacity | `hStrokeWorldWidth(0.9) / 0.72` | `hStrokeWorldWidth(1.15) / 1` |
| Compact b width / opacity | `1.5 / 0.72` | `1.8 / 1` |
| Pillar edge | `#bd9a63` | `#d1aa6e` |
| Pillar body | `#d2bc96` | `#e8cfa6` |
| Pillar highlight | `#e2d2b4` | `#f9e8c7` |
| Pillar edge width | `0.34` | `0.424` |

The a stack remains `3.8/0.055`, `1.55/0.28`, `0.82/1`; matching b to it produces source per-unit energies `a=0.735332`, `b=0.735332`, ratio `1.000000`. The exact authored ratio remains `1.618034`, split X remains `55.346940`, and the raster crossbar per-unit ratio improves from `1.631222` to `0.973853`.

### O Parameters

| Parameter | Before | After |
| --- | ---: | ---: |
| Circle halo / middle / core widths | `8 / 4.8 / 2.15` | `9.615 / 5.769 / 2.584` |
| Chord halo width | `4` | `4.808` |
| Reference chord core width | `0.7` | `0.841` |
| Dynamic core base / weight coefficient | `0.5 / 0.58` | `0.601 / 0.697` |
| Anchor halo / core radii | `3.1 / 0.8` | `3.399 / 0.877` |
| Intersection radius | `0.4` | `0.439` |
| Highlight halo / core radii | `3.5 / 1.15` | `3.837 / 1.261` |

All O opacities, the `THOM-01` seed, 12 anchors, 19 chords, 41 intersections, 8 highlights, and the ordered chord endpoint list remain unchanged.

### M Parameters

| Parameter | Before | After |
| --- | ---: | ---: |
| Final halo / middle / core widths | `8.8 / 6.85 / 3.1` | `10.918 / 8.499 / 3.846` |
| WebGL final-core parity factor | `1` | `1.12` |

All final opacities remain `0.11 / 0.56 / 0.96`. Every resting partial keeps its amplitude, opacity, halo opacity, order, and path; only width and halo width change:

| Partial | Width before → after | Halo before → after |
| ---: | ---: | ---: |
| 1 | 0.736 → 0.914 | 3.087 → 3.830 |
| 2 | 0.705 → 0.875 | 2.888 → 3.583 |
| 3 | 0.685 → 0.849 | 2.882 → 3.576 |
| 4 | 0.662 → 0.821 | 2.827 → 3.508 |
| 5 | 0.642 → 0.797 | 2.835 → 3.517 |
| 6 | 0.622 → 0.771 | 2.829 → 3.510 |
| 7 | 0.602 → 0.747 | 2.840 → 3.523 |
| 8 | 0.581 → 0.721 | 2.814 → 3.491 |
| 9 | 0.572 → 0.709 | 3.007 → 3.731 |
| 10 | 0.543 → 0.673 | 2.845 → 3.530 |
| 11 | 0.522 → 0.648 | 2.838 → 3.522 |

## Predicted Versus Rendered

The prediction is baseline-calibrated per glyph and compared with the deterministic 120 px raster. Positive error means the source model overpredicts rendered energy.

| Glyph | Source E | Predicted raster E | Rendered E | Prediction error | Rendered share |
| --- | ---: | ---: | ---: | ---: | ---: |
| T | 712.800595 | 899.083406 | 872.291678 | +3.0714% | 31.6951% |
| H | 678.346273 | 741.168083 | 724.599759 | +2.2865% | 26.3286% |
| O | 445.414290 | 477.382619 | 467.161993 | +2.1878% | 16.9745% |
| M | 673.013521 | 715.894071 | 688.081683 | +4.0420% | 25.0017% |

All source-model prediction errors are below `4.1%`. The final bounded next-step recommendations are T `1.004799`, H `1.003249`, O `1.000750`, and M `1.009915`; no further tuning was applied because all raster shares are already in band.

## Parameter Sensitivity

For the documented local response `E(q)=E(1)q²`, a ±5% q perturbation yields `-9.75%/+10.25%` energy and elasticity `2` for every glyph.

| Glyph | E at q=0.95 | E at q=1.00 | E at q=1.05 | Relative response |
| --- | ---: | ---: | ---: | --- |
| T | 643.302537 | 712.800595 | 785.862656 | -9.75% / +10.25% |
| H | 612.207512 | 678.346273 | 747.876766 | -9.75% / +10.25% |
| O | 401.986397 | 445.414290 | 491.069255 | -9.75% / +10.25% |
| M | 607.394703 | 673.013521 | 741.997407 | -9.75% / +10.25% |

## Invariant Audit

| Invariant | Result | Evidence |
| --- | --- | --- |
| T remains π and keeps asymmetrical internal leg structure | Pass | Path and inset coordinates unchanged; occupied-silhouette IoU `0.612188` |
| H crossbar is one exact `a:b = φ:1` span | Pass | Ratio `1.618034`, split X `55.346940`, existing golden-ratio tests pass |
| H crossbar optical centroid within 0.25 units | Pass | X `50.043570`, offset `+0.043570` |
| H a/b source energy per unit equalized | Pass | `0.735332 / 0.735332`, ratio `1.000000` |
| O deterministic topology and seed | Pass | `THOM-01`; 12 anchors, 19 chords, 41 intersections, 8 highlights unchanged |
| M deterministic layered/whispy harmonic construction | Pass | 11 ordered partials preserved; widths only |
| Placements and cap-height relationships | Pass | No placement or glyph-path coordinate changes |
| Reduced-motion/static construction consistency | Pass | Generated SVGs updated and focused browser parity checks pass |

No character invariant is broken, so this specialist result is eligible for synthesis.

## Acceptance Scorecard

| Criterion | Result | Measurement |
| --- | --- | --- |
| 120 px energy bands | Pass | T/H/O/M `31.6951/26.3286/16.9745/25.0017%` |
| 24 and 48 px energy bands/core survival | Pass | Every share is inside its exact band; core areas remain nonzero and recognizable |
| Balance not primarily halo-dependent | Pass | 120 px high-contrast core areas T/H/O/M `2041.484375/1076.375/746.250000/1110.687500` |
| H centroid and exact φ geometry | Pass | `+0.043570` units; `1.618034` ratio |
| φ hold within 5% of settled H | Residual | hold `498.000096`, settled `724.469520`, deviation `31.2600%` |
| Crossfade within 7% envelope | Residual | maximum deviation `30.1143%` |
| H animation centroid drift ≤1 unit | Residual | `1.010379` units, `0.010379` over limit |
| Optical gaps within 10% | Mixed | 24 px `9.3023%` pass; 48 px `11.7647%`, 120 px `11.6822%` residual |
| Determinism/invariants | Pass | Geometry and deterministic unit tests pass |
| Generated asset consistency | Pass | Master, compact, light, monochrome, glyph, Open Graph, and unchanged avatar/favicon outputs generated together |
| Focused validation | Pass | Typecheck, unit tests, build, focused browser suite, and focused brand audit pass |

The temporal residual is outside this specialist's bounded source-energy remit: increasing settled H energy exposes the pre-existing φ-plane mismatch. Gap variance improves at 120 px from `12.5000%` to `11.6822%` but remains above the synthesis threshold.

## Validation Commands and Results

| Command | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Pass; frozen dependency graph installed, 173 packages |
| `bun run measure:brand:balance --variant=stroke-energy-before` | Pass; baseline revision `4ba2cc4f018c2dbaba9b6aa9e6c8b11ac7b00845` written to `.codex/audits/logo-balance/stroke-energy-before/metrics.json` |
| `bun run measure:brand:source-energy --variant=stroke-energy-before` | Pass; baseline source model written to `.codex/audits/logo-balance/stroke-energy-before/source-energy.json` |
| `bun run generate:brand` | Pass; 14 deterministic brand assets generated |
| `bun run typecheck` | Pass |
| `bun run test` | Pass; 8 files, 45 tests |
| `bun run build` | Pass; existing Vite chunk-size warning only |
| `bun run test:e2e` | Configured aggregate command did not pass: Playwright's desktop/mobile project matching also selected four unrelated `tests/graph-e2e` cases against the site base URL; an earlier pre-final run also exposed the M parity issue corrected by `M_WEBGL_CORE_PARITY_SCALE=1.12` |
| `bunx playwright test tests/e2e/site.spec.ts --project=desktop --project=mobile --workers=1` | Pass after the final parity correction; 23 passed, 7 intentional mobile skips |
| `bun run audit:brand:update` | Pass; intended snapshots updated after the material-only T audit threshold correction |
| `bun run audit:brand` | Pass; 1 focused visual audit passed and QA boards composed |
| `bun run measure:brand:balance --variant=stroke-energy` | Pass; revision `77b921481924a5ddf850995b32141439c983e148` written to `.codex/audits/logo-balance/stroke-energy/metrics.json` |
| `bun run measure:brand:source-energy --variant=stroke-energy --baseline=stroke-energy-before` | Pass; predicted-versus-rendered and sensitivity data written to `.codex/audits/logo-balance/stroke-energy/source-energy.json` |
| `bun run compose:brand:stroke-energy` | Pass; before/after production, monochrome, and multiscale comparison boards composed |

Final focused SVG/WebGL parity measurements were T IoU `0.852489`, H `0.848820`, O `0.674185`; M IoUs were `0.818005/0.809281/0.803286` with density deltas `0.167349/0.182743/0.187770`, all within their configured gates.

## Visual Evidence

- `before-after-production.png`: baseline and variant production rendering.
- `before-after-monochrome.png`: baseline and variant monochrome rendering.
- `before-after-multiscale.png`: 24/48/120 px comparison.
- `production-monochrome-comparison.png`: final production versus monochrome state.
- `h-animation-contact-sheet.png`: deterministic 25 ms H animation sampling.
- `index.html`: browsable evidence index.

## Synthesis Recommendation

Adopt the H a/b stack equalization, O width/radius controls, M partial/final width controls, and T static-material reduction as compatible source-energy decisions rather than merging this branch wholesale. Retain the separated T WebGL material and M `1.12` WebGL parity factor when those renderers are synthesized. Recompute the common scorecard after combining specialists.

For the temporal specialist, compensate the φ plane by approximately `sqrt(724.469520 / 498.000096) = 1.206` in energy-amplitude terms or normalize the crossfade envelope, then remeasure hold, crossfade, and centroid drift. For the spatial specialist, correct the remaining 48/120 px gap variance without changing glyph placements blindly; the T–H versus O–M edges should be evaluated from the synthesized occupied bounds. Review final desktop, compact, mobile, monochrome, reduced-motion, and animation states in Paper before acceptance.
