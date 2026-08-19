# Design Theme

## Purpose

This library provides the typed and Tailwind-backed THOM visual foundation
shared by portfolio pages, local content tools, and generated artifacts.

## Ontology

The design foundation contains stable color, typography, easing, and effect
tokens. TypeScript is authoritative for runtime and generated-artifact
consumers; `theme.css` is generated from the same values and exposes Tailwind
v4 utilities to web consumers. The package does not own product layout, tool
geometry, React components, or generated assets.

## Key Terms

- **Foundation token:** a reusable visual value with semantic meaning.
- **Intent color:** primary, success, info, warning, or error with explicit
  default, hover, active, and foreground values.
- **Accent color:** one of six non-semantic categorical colors, available by
  stable hue name and ordinal.
- **Consumer theme:** a tool-owned extension of the foundation.
- **Tailwind theme:** the generated `@th-m/design-theme/theme.css` export.
- **Public API:** `ThomDesignTokens`, `thomDesignTokens`, semantic names, and
  the ordered accent palette.

Regenerate the shared CSS after changing typed tokens:

```sh
bun run nx run design-theme:generate-theme
```
