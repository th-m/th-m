# THOM Motion + Multiscale Balance Report

## Outcome

The selected production strategy keeps the authored `42 × 64` φ plane, adds a deterministic low-frequency gold halo, aligns the transient centroid, and uses normalized crossfade weights. It is lower-scoring than both the untouched baseline and the required enlarged-plane comparison while keeping φ visibly distinct.

The variant changes only H animation presentation and replay determinism. Settled T/H/O/M geometry, placements, materials, generated brand assets, O seed/topology, and M construction remain unchanged.

## Revisions and Environment

- Shared harness baseline: `4ba2cc4f018c2dbaba9b6aa9e6c8b11ac7b00845`.
- Final implementation revision measured by the canonical bundle: `fc3edd76f6577896231660a38b441b8a40683241`.
- Implementation commits: `50fb5d6` (strategy/evidence harness), `e1d71ce` (SVG/WebGL halo parity), `fc3edd7` (deterministic interrupted replay).
- Bun: `1.3.8`.
- Raster engine: `@resvg/resvg-js`, 8× supersampling, linear-light luminance.
- Shared viewport: `416 × 120`; display heights: `24`, `48`, and `120` px.
- Temporal cadence: every `25 ms` from `0–700 ms`, inclusive (`29` frames).

## Strategy Scorecard

| Strategy | Revision | Motion score | Aggregate score | φ hold deviation | Maximum crossfade deviation | Maximum centroid drift |
|---|---|---:|---:|---:|---:|---:|
| Untouched `42 × 64` baseline | `4ba2cc4` | `0.422290` | `0.232177` | `16.8171%` | `16.1384%` | `0.980438` units |
| Enlarged `59 × 90` plane | `e1d71ce` | `0.154231` | `0.191968` | `0.3242%` | `2.2340%` | `0.205332` units |
| `42 × 64` material + normalized crossfade | `e1d71ce` | `0.106132` | `0.184753` | `0.0162%` | `0.8772%` | `0.037815` units |
| Canonical selected output | `fc3edd7` | `0.106132` | `0.184753` | `0.0162%` | `0.8772%` | `0.037815` units |

The selected strategy reduces the motion component by `74.87%` and the shared aggregate score by `20.43%` relative to the untouched baseline. Static score components are intentionally identical across strategies.

## Changed Parameters

### Evaluated enlarged strategy

| Parameter | Baseline | Evaluated value | Measured effect |
|---|---:|---:|---|
| φ plane width | `42` | `59` | Raises hold energy into tolerance when paired with calibrated opacity. |
| φ plane height | `64` | `90` | Preserves the source aspect treatment at approximately `1.40×` linear scale. |
| φ center X | `50` | `51.42` | Reduces image-intrinsic left centroid bias. |
| φ core opacity | `1` | `0.61` | Normalizes the enlarged mask from an otherwise overweight hold. |
| φ halo opacity | none | `0` | Enlarged comparison uses scale, not halo, as its compensation mechanism. |

### Selected production strategy

| Parameter | Baseline | Selected value | Measured effect |
|---|---:|---:|---|
| φ core plane | `42 × 64` | `42 × 64` | Preserves the authored symbol size and distinct silhouette. |
| φ center X | `50` | `50.71` | Brings maximum transient drift from `0.980438` to `0.037815` units. |
| φ center Y | `60` | `60` | No vertical placement change. |
| φ core opacity | `1` | `1` | Keeps a high-contrast symbol core rather than replacing it with glow. |
| radial halo size | none | `50 × 72` | Adds low-frequency material around, not inside, the authored core plane. |
| radial halo opacity | none | `0.319` | Brings hold energy from `498.000096` to `598.777751` against settled `598.680519`. |
| crossfade weights | independent linear expressions | explicitly normalized φ/H weights summing to `1` | Limits maximum crossfade error to `0.8772%`. |
| H replay target | scalar `h: 1` after mutation | explicit keyframes `h: [0, 1]` | Makes keyboard/focus interruption restart the full 700 ms narrative deterministically. |

The halo color and linear radial falloff are identical in the measurement SVG and WebGL shader.

## Temporal Acceptance

| Requirement | Threshold | Selected result | Status |
|---|---:|---:|---|
| Sampling | `25 ms`, `0–700 ms` | `29` inclusive frames | Pass |
| φ hold energy | within `5%` of H | `0.0162%` deviation | Pass |
| Crossfade envelope | no frame beyond `7%` | `0.8772%` maximum | Pass |
| Horizontal centroid | no more than `1` unit | `0.037815` units | Pass |
| Distinct φ | visible high-contrast core | nonzero core and occupied bounds in every hold frame | Pass |
| Reduced motion | immediate settled construction | pixel-identical to settled SVG | Pass |
| Static fallback | settled construction | pixel-identical to settled SVG | Pass |

Frame data is in [`metrics.json`](metrics.json). The energy/centroid plot is [`h-animation-plot.png`](h-animation-plot.png), and the labeled φ-in/φ-hold/crossfade/settled sheet is [`h-animation-contact-sheet.png`](h-animation-contact-sheet.png).

## Multiscale Survival

The shared full-construction renderer retains all requested feature groups at both small sizes. Values below are linear-light optical energy for the isolated feature group.

| Feature | 24 px | 48 px | Audit |
|---|---:|---:|---|
| H endpoint/division ticks | `0.054910` | `0.211168` | Occupied and visually present; below the high-contrast threshold in isolation. |
| H full-unit brace | `0.486823` | `2.011118` | Occupied with a surviving core. |
| O circumference | `10.481372` | `42.932693` | High-contrast core survives. |
| O seeded network | `5.915198` | `23.431778` | Network bounds and core survive. |
| M final core | `20.682750` | `82.611967` | High-contrast whispy core survives. |
| M partial layers | `4.432521` | `17.254177` | Layer bounds and core survive without replacing the final core. |

The labeled desktop/compact/mobile/reduced-motion/static comparison is [`responsive-motion-static-comparison.png`](responsive-motion-static-comparison.png). Full production and monochrome 24/48/120 px rasters are adjacent in this directory.

## Invariant Audit

- T: no topology, contour, material, placement, or asset changes.
- H: two classical pillars, exact golden-ratio split, all three ticks, and full-unit under-brace are unchanged.
- H ratio: `1.618034` in the shared metrics; focused geometry tests pass at existing tolerance.
- H narrative: φ-in, φ-hold, crossfade, settled, reduced-motion, and static states remain present.
- O: `THOM-01` circle/chord/anchor/intersection topology is untouched and deterministic tests pass.
- M: Fourier partials, final core, deterministic layers, and whispy silhouette are untouched.
- Generated public brand assets: `bun run generate:brand` generated all `14` assets with no diff from the shared harness revision because settled construction did not change.

## Shared Acceptance Context

This motion-only variant intentionally does not modify inherited settled balance. Therefore it should not be accepted as the final synthesis by itself:

- Settled 120 px shares remain `44.0521 / 21.2512 / 14.1439 / 20.5527%` versus target bands `31–33 / 25–28 / 16–18 / 24–27%`.
- Settled 24 px shares remain `43.9773 / 21.4352 / 13.9668 / 20.6206%`.
- Settled 48 px shares remain `44.0722 / 21.3578 / 14.0952 / 20.4749%`.
- The inherited H crossbar optical centroid is `-2.537347` units from center; this specialist did not change proportional line materials.
- Optical-gap maximum deviation is `9.3023%` at 24 px, `11.7647%` at 48 px, and `12.5%` at 120 px; this specialist did not change placement.

These static failures belong to the ink/stroke/spatial synthesis. All temporal and requested multiscale-survival checks pass.

## Commands and Results

| Command | Result |
|---|---|
| `bun install --frozen-lockfile` | Pass; `173` packages installed. |
| `bun run measure:brand:balance --variant=motion-before` | Pass; baseline aggregate `0.232177`. |
| `bun run measure:brand:balance --variant=motion-enlarged --motion-strategy=enlarged` | Pass; aggregate `0.191968`. |
| `bun run measure:brand:balance --variant=motion-material --motion-strategy=material` | Pass; aggregate `0.184753`. |
| `bun run measure:brand:balance --variant=motion` | Pass on `fc3edd7`; canonical aggregate `0.184753`. |
| `bun run generate:brand` | Pass; generated `14` deterministic assets. |
| `bun run typecheck` | Pass. |
| `bun run test` | Pass; `8` files, `44` tests. |
| `bun run build` | Pass; production client and semantic prerender complete; existing chunk-size warning only. |
| `bun run test:e2e` | Site scope passes: `23` passed and `7` intended mobile skips. Command exits nonzero only because its shared matcher also runs four `tests/graph-e2e` cases against the site preview URL; all four fail to find graph UI. |
| Focused motion/responsive/fallback Playwright grep | Pass; `18` passed and `2` intended mobile skips. |
| Focused H replay/parity test | Pass; IoU `0.845830`, width delta `1.2712%`, height delta `0.8511%`. |
| `bun run audit:brand` | Nonzero on the inherited T snapshot/reference gate (`0.540400` IoU versus `0.6` threshold); no static T or generated-brand diff exists in this branch. |

## Artifacts

- Canonical selected output: [`index.html`](index.html)
- Canonical metrics/frame data: [`metrics.json`](metrics.json)
- Temporal plot: [`h-animation-plot.svg`](h-animation-plot.svg)
- Labeled phase contact sheet: [`h-animation-contact-sheet.png`](h-animation-contact-sheet.png)
- Responsive/motion/static comparison: [`responsive-motion-static-comparison.png`](responsive-motion-static-comparison.png)
- Enlarged strategy evidence: [`../motion-enlarged/metrics.json`](../motion-enlarged/metrics.json)
- Material strategy evidence: [`../motion-material/metrics.json`](../motion-material/metrics.json)
- Untouched before evidence: [`../motion-before/metrics.json`](../motion-before/metrics.json)

## Synthesis Recommendation

Adopt the selected `material` motion constants, radial halo shader, normalized weight helper, and explicit H replay keyframes. They are compatible with settled geometry changes from the other specialists because they reference the measured settled H envelope rather than modifying pillars, ratio segments, ticks, brace, placements, O topology, or M layers.

After static synthesis, rerun the shared harness and recalibrate only `halo.opacity` if the settled H energy changes materially. Keep the `42 × 64` core plane and `50.71` centroid correction unless synthesis changes the H placement itself. Paper review is deferred to the orchestrator because no Paper integration is available in this isolated specialist worktree; the comparison sheet is prepared for that review.
