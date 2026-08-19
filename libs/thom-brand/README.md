# THOM Brand

## Purpose

`@th-m/thom-brand` owns the reusable THOM identity components, deterministic
brand geometry, and WebGL animation runtime. Applications compose the exported
components and provide public image assets at the configured asset base path.

## Ontology

The library exposes a composed animated logo, lower-level logo and orbit
components, isolated glyph stages, and the geometry/rendering APIs used by
portfolio brand generation. React components are the runtime interface;
generated brand data is the deterministic bridge between geometry and motion.

## Key Terms

- **Animated logo:** the composed interactive wordmark and responsive orbit.
- **Wordmark:** the static or WebGL-backed `ThomLogo` component.
- **Orbit:** the SVG motif responding to the active T, H, O, or M glyph.
- **Glyph stage:** an isolated construction animation for one glyph.
- **Asset base path:** the public URL prefix containing generated THOM images.

## Public Components

- `AnimatedThomLogo` composes the interactive wordmark and orbit.
- `ThomLogo` renders hero, header, static, and icon variants.
- `HeroOrbit` renders the deterministic background motifs.
- `ThomGlyphStage` renders one isolated glyph construction.

Import `@th-m/thom-brand/styles.css` once in the consuming application.
