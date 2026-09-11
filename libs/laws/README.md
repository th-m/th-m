# Laws

## Purpose

`@th-m/laws` owns a curated collection of famous laws, principles, and effects
from two layers — the fetched snapshots of the 30 laws of UX from
[lawsofux.com](https://lawsofux.com/) and the laws of software development from
[timsommer.be](https://www.timsommer.be/famous-laws-of-software-development/),
plus hand-curated extension collections covering information & language, AI/ML,
reasoning & epistemology, organizations & economics, operations & systems,
cognitive effects, and physical metaphors — as typed, deterministic content
plus THOM-styled React components that present them. Each law keeps its
definition, domain labels, takeaways, long-form copy, further reading links,
related laws, provenance URLs, and (where the source provides it) the original
SVG artwork, recolored at render time onto the THOM brand: gold shapes on a
darkened, hue-tinted tone of the law's source color.

## Boundaries

This library owns attributed snapshots, curated records, adaptation, and reusable
law presentation. Source publishers own the original material; consuming apps
own routes and selection. Generated and hand-curated records remain distinct.

## Ontology

The library separates content from presentation. The framework-independent
data layer (`types.ts`, `laws/*`, `adapt.ts`) is usable without React; the
component layer (`LawGraphic`, `LawCard`, `LawDetail`, `LawsGrid`) consumes the
shared `--color-*`, `--font-*`, and `--ease-*` variables from
`@th-m/design-theme`. Consumers import `@th-m/laws/styles.css` once and compose
the components; the library does not own application layout or routes.

## Key Terms

- **Law record:** one typed `Law` entry with definition, labels, takeaways,
  copy, further reading links, and provenance.
- **Labels:** the curated `LawLabel` taxonomy (`ui`, `design`, `psychology`,
  `cs`, `software-engineering`, `architecture`, `management`, `product`,
  `security`, `ai`, `information`, `economics`, `epistemology`, `physics`)
  describing the domains and theories a law applies to.
- **Snapshot:** the generator-owned `src/laws/` records fetched from
  lawsofux.com and timsommer.be by `scripts/fetch-laws.ts`.
- **Curated layer:** the hand-authored `src/laws-curated/` records for the
  extension collections, with Wikipedia and canonical provenance; the public
  `laws`/`lawBySlug` exports merge the snapshot with this layer.
- **Source artwork:** the original lawsofux.com SVG, stored verbatim in the
  law's data file; laws without artwork render a monogram fallback tile.
- **Adaptation:** the deterministic transform that recolors source artwork
  onto the THOM theme (`adaptLawGraphic`) and derives a dark tint from the
  source color (`adaptLawColor`).
- **Provenance:** each record's `sources` URLs; laws found on both sites
  (Postel's Law, Pareto Principle) are merged into one record listing both.
- **Slug:** the stable ASCII kebab-case identifier for a law. The source site's
  `law-of-pr%C3%A4gnanz` is stored as `law-of-praegnanz`.
- **Public API:** `laws`, `lawBySlug`, `lawLabels`, the `Law` types, the
  adaptation functions, and the four components.

## Usage

```tsx
import "@th-m/laws/styles.css";
import { LawsGrid, lawBySlug } from "@th-m/laws";

export function App() {
  return <LawsGrid />; // the current collection as cards
}
```

```tsx
import { LawDetail, lawBySlug } from "@th-m/laws";

const fitts = lawBySlug["fittss-law"];
const conway = lawBySlug["conways-law"];
export function LawPages() {
  return (
    <>
      <LawDetail law={fitts} />   {/* source artwork */}
      <LawDetail law={conway} />  {/* monogram fallback tile */}
    </>
  );
}
```

## Attribution

The lawsofux.com content and artwork are © Jon Yablonski and the Laws of UX
project ([lawsofux.com](https://lawsofux.com/)); the software-development
content is by Tim Sommer
([timsommer.be](https://www.timsommer.be/famous-laws-of-software-development/)).
Both are mirrored here with attribution for reference — every record's
`sources` links back to its source pages, and further reading links point to
the original publishers. Verify the source sites' license terms before
publishing any derivative material publicly. The source SVG strings are
rendered with `dangerouslySetInnerHTML`; they are version-controlled static
data owned by this package, so the surface is trusted — do not pass untrusted
SVG into `LawGraphic`.

## Related

- [`libs/design-theme`](../design-theme/README.md) — the THOM foundation tokens
  these components consume.
- [`libs/ui`](../ui/README.md) — the shared THOM primitives (Card, Button) that
  follow the same styling conventions.
