# THOM Reference Balance Diff

Fresh Playwright captures compared with the supplied source-board glyph crops. Signed values are current minus reference; positive Y means the current glyph sits lower.

## Material silhouette · luminance 55

| Glyph | Width | Height | Top | Bottom | Centroid Y | Envelope match | Internal shape match |
|---|---:|---:|---:|---:|---:|---:|---:|
| T | -3 (-1.4%) | +0 (0.0%) | -1 | -1 | +4.1 | 82.5% | 56.4% |
| H | -60 (-23.4%) | -22 (-10.1%) | +8 | -14 | -7.2 | 87.7% | 57.3% |
| O | -10 (-4.1%) | -3 (-1.3%) | +2 | -1 | +1.5 | 97.1% | 34.2% |
| M | +6 (2.4%) | +3 (2.3%) | -3 | +0 | -0.1 | 92.4% | 46.5% |

## High-contrast core · luminance 140

| Glyph | Width | Height | Centroid Y |
|---|---:|---:|---:|
| T | -1 (-0.5%) | +2 (1.0%) | +50.1 |
| H | -60 (-23.6%) | +0 (0.0%) | +23.8 |
| O | -12 (-4.9%) | -6 (-2.5%) | +6.1 |
| M | -6 (-2.6%) | +0 (0.0%) | +0.7 |

Envelope match compares the outer row-by-row silhouette after removing width, height, and position. Internal shape match also includes counters, chords, and layered strokes.
