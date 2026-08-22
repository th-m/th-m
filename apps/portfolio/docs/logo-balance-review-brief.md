# THOM Logo Balance Review Brief

## Role

Act as an independent senior identity designer, type designer, and visual QA reviewer. Review the final adjusted THOM logo without changing its implementation. Separate what is visibly measurable from what is an informed design judgment and from what requires the owner's subjective preference.

## Repository State

- Repository: `th-m/th-m`.
- Default branch: `main`.
- Reviewed implementation: merge commit `321d9e53e461c80221b40e3cd23fb0595354b667` from PR #7.
- The deterministic balance implementation and user-directed refinement are complete and merged.
- This is a review-only phase. Do not edit logo geometry, materials, animation, generated assets, reference snapshots, or production code unless the user explicitly starts a later implementation phase.

## Required Context

Read these files completely before reviewing:

1. `AGENTS.md`
2. `docs/logo-balance-orchestrator-handoff.md`
3. `docs/logo-balance-decision-record.md`
4. `docs/logo-balance-implementation-plan.md`
5. `.codex/audits/logo-balance/user-directed-revision/acceptance.json`
6. `.codex/audits/logo-balance/user-directed-revision/metrics.json`

Historical comparison assets may be used to understand intent, but not as evidence for the new review:

- `.codex/audits/logo-balance/user-directed-revision/paper-user-revision-02.png`
- `.codex/audits/logo-balance/reference-diff/playwright-reference-diff.png`
- `public/brand-audit/audit/06-refined-overview.png`
- `public/brand-audit/audit/09-strict-playwright-diff.png`

## Current Adjustment Intent

The merged revision intentionally:

- makes the H pillars approximately 5.1% thinner;
- makes the H crossbar material approximately 5.9% more pronounced;
- uses the O intersection-dot material at the H golden-ratio split;
- shrinks the O uniformly by 2%;
- makes the M 3.2% taller while retaining the deterministic reference-fidelity gate;
- preserves the exact H golden-ratio construction and the established character invariants.

## Review Goal

Determine whether T, H, O, and M feel like one balanced wordmark at production sizes and whether any remaining incongruence comes primarily from:

- character shape;
- visible width;
- visible height or overshoot;
- stroke weight or luminous energy;
- counterspace and internal density;
- sidebearing or inter-character spacing;
- vertical alignment, baseline, or cap-line behavior;
- center of mass or directional tension;
- motion-to-static parity;
- small-size rasterization.

Do not equate equal bounding boxes with optical balance. Explain when mathematically unequal dimensions are typographically appropriate.

## Required Workflow

### 1. Establish A Fresh Capture Session

- Load the Product Design audit workflow and its required browser instructions.
- Use the in-app Browser in Codex Desktop.
- Build or run the merged production implementation from this review branch.
- Capture only fresh screenshots from the current run as review evidence.
- Save accepted screenshots in `.codex/audits/logo-balance/final-review/`.
- Inspect every saved screenshot before accepting it.
- Reject blank, loading, cropped, wrong-state, or visually unstable captures.

### 2. Capture The Adjusted Logo

Capture at minimum:

1. `01-desktop-lockup.png` — the complete production lockup in its normal desktop context.
2. `02-mobile-lockup.png` — the complete production lockup at a representative mobile viewport.
3. `03-isolated-glyphs-120.png` — T, H, O, and M isolated in equal review frames at 120 px.
4. `04-isolated-glyphs-48.png` — the same isolated comparison at 48 px.
5. `05-isolated-glyphs-24.png` — the same isolated comparison at 24 px.
6. `06-monochrome-multiscale.png` — monochrome 24, 48, and 120 px states together.
7. `07-spacing-and-alignment.png` — a full-lockup crop suitable for judging T–H, H–O, and O–M spacing, cap line, baseline, and optical centers.
8. `08-h-motion-keyframes.png` — representative H construction, spiral-trace, shell-hold/fade, and resting states if motion is available.

Use identical scaling and framing when comparing isolated characters. Do not stretch screenshots or substitute an old generated board for a fresh capture.

### 3. Present Evidence Before Conclusions

- Show the accepted screenshots inline in capture order.
- Label each screenshot with viewport, rendered logo size, state, and whether it is static, animated, or monochrome.
- Give a one-sentence neutral observation for each image before offering recommendations.

### 4. Ask The Owner For A Perceptual Read

After showing the screenshots, ask the owner these concise questions and wait for answers before issuing the final review:

1. Which character attracts your eye first when you view the wordmark for two seconds: T, H, O, or M?
2. Does the O now feel appropriately subordinate, too small, or still too dominant?
3. Does the M feel tall enough, or does its curved construction still make it appear shorter than H and O?
4. Do the thinner H pillars and stronger crossbar feel intentional, or does the H now feel too skeletal or internally busy?
5. Is the H ratio dot clear enough to read as part of the same system as the O intersections, or is it too faint or too prominent?
6. Which gap feels least comfortable: T–H, H–O, or O–M?
7. At 24 px and 48 px, which character loses its identity or feels disproportionately light or dark?
8. Would you prefer the final critique to prioritize geometric rigor, typographic convention, or the distinctive current identity when those goals conflict?

Do not collapse these into a generic approval question. Preserve the character-specific wording so the answers can distinguish size, shape, weight, and spacing concerns.

### 5. Apply Design And Typography Theory

After the owner responds, evaluate the evidence through these lenses:

- **Cap-height and overshoot:** compare flat H/M extrema with the round O and explain whether the O needs optical overshoot rather than literal equal height.
- **Baseline and top alignment:** inspect apparent alignment, not only path bounds, including glow and antialiasing.
- **Stroke and color:** compare perceived darkness, luminous energy, local contrast, edge softness, and the effect of layered materials.
- **Width and proportion:** distinguish a character that is geometrically narrow from one that merely feels narrow because of counterspace or diagonals.
- **Counters and apertures:** compare the O network's internal activity, H's open counter, M's curved valleys, and T's negative space.
- **Optical center and moments:** identify top-, bottom-, left-, or right-heavy characters and whether their centers of mass align across the wordmark.
- **Diagonal compensation:** evaluate whether the M's curves and diagonals need additional height or weight to match vertical stems.
- **Sidebearings and rhythm:** judge the three inter-character gaps by perceived whitespace area, not coordinate distance alone.
- **Distinctiveness versus convention:** note where the construction deliberately departs from conventional letterform practice and whether that improves or harms the identity.
- **Scale and rasterization:** compare 24, 48, and 120 px because optical problems can reverse across sizes.
- **Motion parity:** determine whether the animated H's brightest or widest moments create a temporary imbalance absent from its resting state.

Research current, primary or authoritative typography references on optical alignment, overshoot, spacing, stroke compensation, and logo legibility. Cite sources directly beside the principles they support. Prefer original type foundries, established typography references, standards bodies, or official design-system guidance. Clearly label any inference that applies general type-design guidance to this custom logo.

## Required Analysis Format

For each character, report:

| Character | Shape | Width | Height | Weight/Energy | Counterspace | Optical Center | Scale Behavior | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T |  |  |  |  |  |  |  |  |
| H |  |  |  |  |  |  |  |  |
| O |  |  |  |  |  |  |  |  |
| M |  |  |  |  |  |  |  |  |

Use one of these verdicts for each dimension: `balanced`, `slightly off`, `materially off`, or `inconclusive`.

Also report:

- the three pairwise spacing judgments: T–H, H–O, and O–M;
- the strongest and weakest character relationship;
- whether each issue is caused primarily by shape, width, height, material treatment, or spacing;
- confidence as `high`, `medium`, or `low`;
- evidence limits, especially anything screenshots cannot establish.

## Severity And Recommendation Rules

- **P0:** unusable or identity-breaking; reserve for severe failures.
- **P1:** clearly unbalanced across multiple production states.
- **P2:** noticeable incongruence with a credible targeted correction.
- **P3:** polish or preference that does not compromise the system.

Do not recommend a numerical geometry change unless screenshot evidence and the typographic rationale both support the direction. If a possible correction would break the established invariants or deterministic gates, state that trade-off explicitly.

## Deliverables

1. Fresh screenshots saved under `.codex/audits/logo-balance/final-review/` and rendered inline.
2. The owner's answers recorded verbatim or faithfully summarized.
3. A concise theory-grounded review saved as `docs/logo-balance-final-review.md`.
4. A character-by-character matrix and pairwise spacing assessment.
5. A prioritized list of remaining incongruences, including likely cause and confidence.
6. A final recommendation of one of:
   - accept as balanced;
   - accept with documented optical exceptions;
   - run one focused revision pass;
   - revisit the underlying character system.

## Acceptance Criteria

- Every conclusion points to a fresh screenshot, an owner response, a deterministic metric, or a cited typography principle.
- Subjective preference is not presented as objective failure.
- Geometric equality is not presented as the definition of optical balance.
- Shape, width, height, weight, spacing, and rasterization are assessed separately.
- The O's round-form overshoot and the M's curved/diagonal compensation receive explicit treatment.
- No production change is made during the review.
- The thread pauses for the owner's answers before finalizing `docs/logo-balance-final-review.md`.
