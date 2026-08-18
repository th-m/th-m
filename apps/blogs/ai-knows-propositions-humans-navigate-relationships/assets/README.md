# Propositions and Relationships Graph

## Purpose

This directory owns the checked-in visual artifacts used by the propositions
and relationships essay.

## Ontology

SVG files are editable publication masters and `@2x.png` files are raster
previews of those masters. The graph tool owns generation behavior; the blog
post owns the resulting editorial assets and their meaning.

## Key Terms

- **Master:** the resolution-independent SVG publication source.
- **Preview:** the paired 2× PNG rendering.
- **Editorial use:** the alt text and caption contract accompanying an asset.

## Files

- `propositions-and-relationships.svg` is the editable, resolution-independent master.
- `propositions-and-relationships@2x.png` is a 3200 × 2000 publication preview.
- `weather-propositions-and-sensations.svg` is the editable weather-example master.
- `weather-propositions-and-sensations@2x.png` is its 3200 × 2000 publication preview.

Regenerate both files with:

```sh
bun run nx run graph:generate:legacy:propositions
bun run nx run graph:generate:legacy:weather
```

## Editorial use

Suggested alt text:

> A sparse network where factual propositions are nodes and the relationships that make those facts matter are labeled edges. A highlighted edge connects “touchscreen” to “felt possibility” through “invites gesture.”

Suggested caption:

> For this essay, propositions are drawn as nodes and the relationships that make them matter as edges. This is an illustrative visual grammar, not a definition from graph theory.

### Weather example

Suggested alt text:

> Six proposition nodes record August 15, 8:27, a temperature of 85, 24 percent humidity, a hooded jacket, and a person wet from sweat rather than rain. One relationship says the temperature and humidity feel warm and muggy; another says the August evening exposes beauty in glowing Kolob. Solid arrows show temperature, humidity, and the jacket contributing to sweat. Dashed lines converge on an image of ambivalent Iris gilding the sunlit cliffs with one hand while gathering rain with the other.

Suggested caption:

> Propositions record the evening's conditions. Solid arrows propose causal contribution, while labeled and converging relationships describe how the evening is experienced.
