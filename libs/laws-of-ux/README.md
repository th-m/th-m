# Laws of UX

## Purpose

`@th-m/laws-of-ux` owns the 30 laws of UX from
[lawsofux.com](https://lawsofux.com/) as typed, deterministic content plus the
THOM-styled React components that present them. Each law keeps its definition,
takeaways, long-form copy, further reading links, related laws, and the
original SVG artwork — with the artwork recolored at render time from the
source palette onto the THOM brand (gold shapes on a darkened, hue-tinted
tone of the law's original color).

## Ontology

The library separates content from presentation. The framework-independent
data layer (`types.ts`, `laws/*`, `adapt.ts`) is usable without React; the
component layer (`LawGraphic`, `LawCard`, `LawDetail`, `LawsGrid`) consumes the
shared `--color-*`, `--font-*`, and `--ease-*` variables from
`@th-m/design-theme`. Consumers import `@th-m/laws-of-ux/styles.css` once and
compose the components; the library does not own application layout or routes.

## Key Terms

- **Law record:** one typed `Law` entry with graphic, definition, takeaways,
  copy, and further reading links.
- **Source artwork:** the original lawsofux.com SVG, stored verbatim in the
  law's data file.
- **Adaptation:** the deterministic transform that recolors source artwork
  onto the THOM theme (`adaptLawGraphic`) and derives a dark tint from the
  source color (`adaptLawColor`).
- **Slug:** the stable ASCII kebab-case identifier for a law. The source site's
  `law-of-pr%C3%A4gnanz` is stored as `law-of-praegnanz`.
- **Public API:** `laws`, `lawBySlug`, the `Law` types, the adaptation
  functions, and the four components.

## Usage

```tsx
import "@th-m/laws-of-ux/styles.css";
import { LawsGrid, lawBySlug } from "@th-m/laws-of-ux";

export function App() {
  return <LawsGrid />; // all 30 laws as cards
}
```

```tsx
import { LawDetail, lawBySlug } from "@th-m/laws-of-ux";

const fitts = lawBySlug["fittss-law"];
export function FittsPage() {
  return <LawDetail law={fitts} />;
}
```

## Regenerating the content snapshot

The per-law data files are generated from the live site:

```sh
bun run nx run laws-of-ux:fetch-laws
```

The generator fetches the lawsofux.com homepage and each law page, extracts the
definition, takeaways, origins copy, source, further reading links, related
laws, and banner SVG, and writes `src/laws/<slug>.ts` plus `src/laws/index.ts`.
Treat the generated files as the content snapshot; edit copy through the
generator, not by hand.

## Attribution

Content and artwork are © Jon Yablonski and the Laws of UX project
([lawsofux.com](https://lawsofux.com/)), mirrored here with attribution for
reference. Every law record links back to its source page (`siteUrl`) and, where
present, its cited source; further reading links point to the original
publishers. Verify the site's license terms before publishing any derivative
material publicly. The source SVG strings are rendered with
`dangerouslySetInnerHTML`; they are version-controlled static data owned by
this package, so the surface is trusted — do not pass untrusted SVG into
`LawGraphic`.

## Related

- [`libs/design-theme`](../design-theme/README.md) — the THOM foundation tokens
  these components consume.
- [`libs/ui`](../ui/README.md) — the shared THOM primitives (Card, Button) that
  follow the same styling conventions.
