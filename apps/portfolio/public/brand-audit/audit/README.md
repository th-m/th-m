# THOM Brand Snapshot Audit

## Purpose

This directory records the reviewed visual evidence for the current THOM brand
snapshot.

## Ontology

Audit images are point-in-time evidence derived from brand source and browser
captures. They document comparison results but do not define runtime geometry;
the typed brand source remains authoritative.

## Key Terms

- **Snapshot:** a checked-in visual observation from a specific audit run.
- **Mismatch:** the recorded perceptual or pixel difference from a reference.
- **Acceptance ceiling:** the documented threshold used by the audit workflow.

## Scope

The supplied `brand-logo-idea.png` board was compared with the current generated T, H, O, and M glyph assets. Each source glyph and current glyph was normalized to a `320 × 240` black frame before comparison.

## Results

| Glyph | Perceptual mismatch | Improvement from recorded baseline | Refined treatment |
| --- | ---: | ---: | --- |
| T / π | 14.0% | 45.1% | Classical Bézier silhouette and champagne-metal depth |
| H | 17.0% | 20.5% | Classical pillars, paired catenaries, midpoint, and axis |
| O | 5.1% | 68.0% | Twelve anchors, nineteen chords, distributed highlights |
| M | 3.0% | 76.8% | Calibrated 122-unit curve with eleven persistent FFT partials |

Average content-normalized perceptual mismatch: **9.8%**, below the **14.2%** acceptance ceiling.

The report retains the strict raw changed-pixel ratio for continuity. M uses that strict ratio as its acceptance gate: **10.4%**, improved **23.4%** from the recorded **13.6%** M baseline. Its silhouette IoU is **0.64**.

## Verdict

The refined identity now carries the reference’s classical, dimensional, luminous, and ornamental material language while preserving deterministic generation and the four mathematical concepts. Display applications retain the construction richness; compact, light, and monochrome applications simplify it deliberately.

## Evidence

- `01-overview.png` — complete comparison report
- `02-glyph-t.png` — T / π comparison
- `03-glyph-h.png` — H comparison
- `04-glyph-o.png` — O comparison
- `05-glyph-m.png` — M comparison
- `06-refined-overview.png` — normalized source, refined mark, and perceptual difference in one QA board
- `07-site-desktop.png` — browser-rendered settled desktop hero
- `08-site-mobile.png` — browser-rendered settled mobile hero
- `09-strict-playwright-diff.png` — strict raw source, implementation, and difference board
- `10-m-reconstruction.png` — focused M reconstruction gate with threshold metrics
