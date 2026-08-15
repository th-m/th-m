# THOM Logo Balance Decision Record

## Outcome

The synthesized THOM wordmark passes all `28/28` deterministic balance gates at
implementation revision `dae841c930be4688078b67a2698bc806adbb8f25`.
Invariant and acceptance status outrank aggregate score; the final synthesis has
the lowest eligible objective score, `J = 0.069890`, versus `0.232177` at the
frozen baseline.

## Synthesis

Exactly four isolated specialist variants were measured from the shared harness
baseline. Their implementations were not merged wholesale.

| Specialist | Branch | Gates | J | Decision |
|---|---|---:|---:|---|
| Perceptual ink budget | `codex/logo-balance-ink-budget` | 23/28 | 0.1342 | Evidence retained; dominated by the source-energy result. |
| Source-level stroke energy | `codex/logo-balance-stroke-energy` | 23/28 | 0.1298 | Selected as the settled glyph-energy base. |
| Spatial moments, counters, gaps | `codex/logo-balance-spatial` | 13/28 | 0.2221 | Selected compatible placement and gap corrections. |
| Temporal and multiscale | `codex/logo-balance-motion` | 14/28 | 0.1848 | Selected normalized crossfade and material φ strategy. |

The final synthesis keeps the source-energy `Q` factors
`T=0.852298`, `H=1.116686`, `O=1.096325`, and `M=1.113872`; places the
glyphs at `T(20.1,1.5)`, `H(98.975,0)`, `O(185.625,0)`, and
`M(274.6,0)`; and uses the temporal material φ plane at `42×64`, centered
at `(50.71,60)`, with a `50×72` halo at opacity `0.717`.

The spatial specialist's `M` vertical stretch was rejected after synthesis
because the combined source-energy silhouette exceeded the focused visual gate.
Restoring the source-calibrated M vertical geometry and WebGL parity factor
`1.12` preserved the stronger compatible decisions and passed the audit.

## Final Measurements

| Height | T share | H share | O share | M share | Maximum gap deviation |
|---:|---:|---:|---:|---:|---:|
| 24 px | 31.4599% | 26.6888% | 16.7310% | 25.1203% | 4.5455% |
| 48 px | 31.6512% | 26.3360% | 16.9724% | 25.0404% | 2.3529% |
| 120 px | 31.6951% | 26.3286% | 16.9745% | 25.0017% | 1.8692% |

- H crossbar centroid offset: `0.043570` design units.
- H golden-ratio split: `1.618034`; source energy per-unit ratio: `1.000000`.
- φ hold deviation: `0.0676%`; maximum crossfade deviation: `1.8629%`.
- H animation horizontal centroid drift: `0.160003` design units.
- Reduced-motion and static-fallback parity: pass.
- Source-energy prediction error: `2.1878%–4.0420%` across the four glyphs.

## Invariants

- The H pillars, central golden-ratio crossbar, ticks, unit brace, and φ replay
  remain structurally exact.
- O chord topology and seed remain deterministic.
- M remains an eleven-layer FFT-derived field with a distinct high-contrast core.
- T, O, and M mathematical identities were not replaced or simplified.
- Core balance remains visible without relying primarily on halos or gradients.
- The generated master, compact, light, monochrome, glyph, favicon/avatar, and
  Open Graph outputs remain deterministic.

## Validation

| Command | Result |
|---|---|
| `bun run generate:brand` | Pass; 14 deterministic assets generated. |
| `bun run measure:brand:balance --variant=synthesis` | Pass; metrics reference implementation revision `dae841c`. |
| `bun run check:brand:balance --variant=synthesis` | Pass; 28/28 gates. |
| `bun run measure:brand:source-energy --variant=synthesis --baseline=stroke-energy-before` | Pass. |
| `bun run typecheck` | Pass. |
| `bun run test` | Pass; 8 files and 45 tests. |
| `bun run build` | Pass; existing Vite chunk-size warning only. |
| `bun run test:e2e` | Pass; 23 passed and 7 intentional mobile skips. |
| `bun run audit:brand` | Pass; focused reference-fidelity audit and QA boards composed. |

The browser command is now explicitly scoped to `tests/e2e/site.spec.ts`; the
separate graph suite retains its dedicated `test:graph:e2e` configuration.
The final same-revision measurement replay produced identical SHA-256 checksums
for every harness-generated synthesis artifact.

## Design Review

Paper file `THOM Weight & Balance Study` was used to review the final desktop,
compact, mobile, reduced-motion, static-fallback, and monochrome comparisons.
No P0–P2 visual issue remained. The imported final board and Paper screenshot are
preserved in the deterministic evidence directory.

## Evidence

- `.codex/audits/logo-balance/scorecard.md`
- `.codex/audits/logo-balance/synthesis/metrics.json`
- `.codex/audits/logo-balance/synthesis/acceptance.json`
- `.codex/audits/logo-balance/synthesis/source-energy.json`
- `.codex/audits/logo-balance/synthesis/responsive-motion-static-comparison.png`
- `.codex/audits/logo-balance/synthesis/production-monochrome-comparison.png`
- `.codex/audits/logo-balance/synthesis/h-animation-contact-sheet.png`
- `.codex/audits/logo-balance/synthesis/h-animation-plot.png`
- `.codex/audits/logo-balance/synthesis/paper-review.png`
