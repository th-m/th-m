# THOM Design Instructions for Agents

## Purpose

Use this document when creating visual design assets for Thomas Valadez and the
THOM identity. It consolidates the brand concept, color system, typography,
wordmark rules, composition patterns, motion language, and delivery checks into
one standalone brief.

Treat these instructions as constraints, not loose inspiration. Preserve the
established identity unless the task explicitly asks for a rebrand or a
deliberate departure.

## Brand Essence

THOM presents technical thought with editorial warmth. The visual language is
dark, restrained, precise, spacious, and quietly luminous. It combines
mathematical construction with humanist typography rather than looking purely
mechanical or conventionally corporate.

The central statement is:

> Start with what remains true. Balance constraints. Let relationships create
> structure. Compose the result.

The four letters express four related principles:

| Letter | Principle | Meaning |
| --- | --- | --- |
| T | Foundations / constant | Begin with principles, invariants, and things that remain true while scale and context change. |
| H | Equilibrium / proportion | Balance competing constraints instead of pretending they can be removed. |
| O | Emergence / relationship | Relationships between simple elements reveal structures that are not visible in the elements alone. |
| M | Superposition / composition | Simple ideas, technologies, and disciplines combine into something more expressive than any one part. |

Designs should feel considered and systemic. Prefer a few clear relationships
over a collection of unrelated decorative gestures.

## Visual Character

Aim for:

- A near-black canvas with warm ivory text.
- Warm gold used as the consistent brand signal.
- Large editorial typography paired with small technical annotations.
- Fine rules, measured grids, geometric constructions, and generous negative
  space.
- Square, precise surfaces rather than a field of soft rounded cards.
- Subtle grain and restrained glow that add material character without reducing
  clarity.
- Asymmetric editorial composition held together by strong alignment.
- Motion that draws, reveals, converges, or composes instead of bouncing or
  behaving playfully without purpose.

Avoid turning the identity into generic luxury branding, neon science fiction,
or a standard SaaS dashboard. The tone is thoughtful and exact, not flashy.

## Color System

### Foundation colors

| Role | Value | Use |
| --- | --- | --- |
| Background | `#050505` | Default page or asset canvas. |
| Surface | `#0c0b09` | Quiet regions placed above the canvas. |
| Surface raised / card | `#15120d` | Raised panels and cards. |
| Hover card | `#19150f` | Hovered neutral surface. |
| Popover | `#1d1811` | Floating contextual surface. |
| Dialog | `#211b13` | Highest focused neutral surface. |
| Scrim | `rgb(0 0 0 / 72%)` | Modal or focus-overlay scrim. |
| Foreground | `#f2e5cf` | Default warm-ivory content. |
| Foreground strong | `#fff5dc` | Highest-emphasis text and highlights. |
| Foreground muted | `#a99b87` | Supporting copy and secondary metadata. |
| Foreground subtle | `#8f816e` | Lowest-emphasis readable content. |
| Foreground inverse | `#17130f` | Text or symbols on light and chromatic fills. |
| Border | `#30291f` | Quiet rules and decorative boundaries. |
| Border strong / input | `#776951` | Controls and meaningful boundaries. |
| Brand / primary / focus | `#d6b06a` | Brand emphasis, principal actions, selection, and focus. |

### Primary interaction states

| State | Fill | Foreground |
| --- | --- | --- |
| Default | `#d6b06a` | `#17130f` |
| Hover | `#e3bd76` | `#17130f` |
| Active | `#c9a35d` | `#17130f` |

Gold is the brand constant. Reserve it for identity, principal emphasis,
selection, focus, and the most important action. Do not make every heading,
border, icon, and decoration gold.

### Semantic colors

Semantic colors communicate state. Always pair them with text, a symbol, or
another non-color cue.

| Role | Default | Hover | Active | Foreground |
| --- | --- | --- | --- | --- |
| Success | `#7cb57d` | `#88c28a` | `#70a971` | `#17130f` |
| Information | `#69aed5` | `#76bbe2` | `#5da1c8` | `#17130f` |
| Warning | `#e1a263` | `#efaf6f` | `#d49656` | `#17130f` |
| Error / destructive | `#dd766f` | `#eb827b` | `#cf6963` | `#17130f` |

Do not use semantic colors as arbitrary decoration. Their meanings must remain
stable.

### Categorical accents

Use accents for categories, diagrams, and visualization series. They do not
replace semantic status colors.

| Order | Name | Value |
| ---: | --- | --- |
| 1 | Blue | `#7a8aff` |
| 2 | Rose | `#e579c4` |
| 3 | Lime | `#c8bc00` |
| 4 | Violet | `#be9df7` |
| 5 | Teal | `#009084` |
| 6 | Plum | `#ad65be` |

Keep the order stable when colors represent a sequence. Prefer one accent
family inside a component or small composition. Place chromatic text on neutral
surfaces and verify its contrast at the final size.

### Light-background exception

The identity is dark by default. When a light treatment is required, use:

- Background: `#f4efe6`
- Ink: `#17130f`
- Light-treatment gold: `#8a652a`

Use the approved light wordmark rather than mechanically recoloring the dark
master.

### Color composition rules

1. Begin with the neutral canvas and content hierarchy.
2. Add gold only where it communicates brand or priority.
3. Add semantic color only when the asset communicates a state.
4. Add categorical accents only when categories need differentiation.
5. Use `#30291f` for quiet structure and `#776951` for meaningful boundaries.
6. Let elevation progress from background to surface, raised surface, popover,
   and dialog rather than relying on strong shadows.

## Typography

### Font families

| Role | Typeface | Guidance |
| --- | --- | --- |
| Interface and body | Inter Variable | Default for UI, explanatory copy, controls, and compact information. |
| Display and editorial | Newsreader Variable | Headlines, statements, editorial body copy, and moments that need human warmth. |
| Technical and metadata | IBM Plex Mono, weight 400 | Eyebrows, indices, captions, labels, formulas, code, and measurements. |

Do not substitute unrelated typefaces when these fonts are available. Do not
use faux bold, faux italic, or synthetic styling.

### Typographic voice

Newsreader supplies the expressive voice. It is generally light rather than
heavy, with tight leading and negative tracking at large sizes. Inter remains
quiet and readable. IBM Plex Mono creates the technical counterpoint through
small sizes, uppercase text, and deliberate tracking.

Recommended working ranges:

| Content role | Family | Typical size | Weight | Line height | Tracking |
| --- | --- | ---: | ---: | ---: | ---: |
| Hero or major display | Newsreader Variable | `46–112px` | `350` | `0.86–0.98` | `-0.025em` to `-0.055em` |
| Section or card title | Newsreader Variable | `24–58px` | `350–430` | `0.92–1.08` | `-0.025em` to `-0.045em` |
| Editorial body | Newsreader Variable | `19–23px` | `400–480` | about `1.72` | normal |
| Interface or supporting body | Inter Variable | `14–19px` | regular to medium | `1.6–1.75` | normal |
| Metadata or eyebrow | IBM Plex Mono | `9–13px` | `400` | `1.5–1.9` | `0.08em–0.20em` |
| Code or measured notation | IBM Plex Mono | `12–16px` | `400` | `1.6–1.9` | normal to `0.04em` |

These are ranges, not a requirement to use every size. Build a clear hierarchy
with as few distinct text styles as the asset needs.

### Typography rules

- Use fluid or proportional scaling rather than shrinking a desktop layout as
  one unit.
- Keep major Newsreader headings light, tightly led, and confidently large.
- Use sentence case for editorial headlines. Reserve uppercase for small mono
  labels, indices, captions, and metadata.
- Use warm ivory for primary reading text, strong ivory sparingly, and muted
  warm gray for supporting text.
- Keep continuous prose within a comfortable measure; do not stretch body copy
  across the full canvas.
- Preserve generous separation between a mono eyebrow and its display heading.
- Do not add tracking to ordinary body copy.
- Use bold weight for semantic emphasis, not as a substitute for hierarchy.

## THOM Wordmark and Identity Assets

### Canonical geometry

The THOM wordmark is custom artwork, not typeset text. Never recreate it with a
font or reinterpret its glyph geometry.

- Canonical artboard: `460 × 120` master units.
- Nominal cap line: `15u`.
- Construction axis: `60u`.
- Baseline: `104u`.
- Cap height: `89u`.
- Preserve the supplied SVG view box and transparent background.
- Scale uniformly. Never fit the wordmark using independent horizontal and
  vertical scales.
- Do not simplify paths, alter spacing, change stroke relationships, or redraw
  individual letters.

The T, H, O, and M use deliberately different construction techniques. Their
shared alignment, optical weight, spacing, color, and motion make them a single
system. Mechanical equality is not the goal.

### Optical profiles

Choose the wordmark profile from its rendered width:

| Rendered wordmark width | Profile | Treatment |
| ---: | --- | --- |
| Greater than `300px` | Display / master | Full construction detail and luminous material treatment. |
| `121–300px` | Compact | Simplified internal detail and strengthened small-size forms. |
| `120px` or less | Micro | Minimal detail optimized for recognition. |

Use the existing master, compact, and micro assets. Do not downscale the master
and assume it replaces the optical profiles.

### Approved asset roles

- **Master mark:** large brand moments and hero treatments.
- **Compact mark:** headers, medium placements, and constrained layouts.
- **Micro mark:** very small wordmark use.
- **Light mark:** approved treatment on the warm light background.
- **Monochrome mark:** one-color production constraints.
- **Avatar:** square social or profile identity.
- **Favicon:** browser and very small icon use.
- **Individual glyph assets:** construction explanations or a composition that
  explicitly discusses the four principles. Do not casually recombine them
  into a different logo.

### Logo material language

On the dark canvas, the full mark may use a restrained metallic transition:

`warm shadow → gold → strong ivory → ivory → warm shadow`

Supporting values include:

- Warm shadow: `#765237`
- Gold: `#d6b06a`
- Strong highlight: `#fff5dc`
- Ivory: `#f2e5cf`
- Construction line: `rgb(214 176 106 / 35%)`
- Glow: `rgb(214 176 106 / 18%)`

The material treatment should feel like controlled illumination, not chrome,
glitter, or a loud gradient effect.

### Wordmark prohibitions

Do not:

- Typeset `THOM` as a replacement for the mark.
- Stretch, skew, rotate, or apply perspective distortion.
- Change glyph spacing or proportions.
- Crop through the mark or let nearby content collide with it.
- Add outlines, bevels, drop shadows, textures, or gradients that compete with
  the approved material treatment.
- Place the detailed display mark at a size where its construction becomes
  visual noise.
- Claim that the golden ratio or any other construction relationship is a
  universal law of beauty. It is part of the identity narrative and a design
  prior, not proof of preference.

## Composition and Layout

### Core structure

- Use a wide editorial canvas with generous margins.
- Establish one dominant idea or focal element per composition.
- Combine large Newsreader statements with small IBM Plex Mono annotations.
- Use fine `1px` rules and controlled grid gaps to organize related content.
- Let negative space carry hierarchy; avoid filling every region.
- Prefer alignment, proportion, and common regions over decorative containers.
- Use neutral surfaces for grouping and elevation before introducing new color.
- Keep corners square by default. Reserve circles and rounded shapes for
  geometric motifs, orbits, nodes, and small status indicators.

For responsive digital work, a useful large-canvas reference is a maximum width
of `1440px` with `24px` outer gutters, reducing to approximately `12px` gutters
on narrow mobile canvases. Adapt the composition to the medium instead of
blindly reproducing web dimensions in every asset.

### A reliable THOM composition recipe

1. Set a near-black canvas.
2. Place one principal wordmark, image, diagram, or editorial statement.
3. Introduce a small mono label, index, or measurement as a technical anchor.
4. Use Newsreader for the expressive statement and Inter for explanatory copy.
5. Add a fine structural rule or grid only where it clarifies grouping.
6. Apply gold to the primary signal.
7. Add at most one categorical accent family unless the content is a genuine
   multi-series visualization.
8. Remove any decoration that does not strengthen hierarchy, relationship, or
   meaning.

### Diagrams and data visualization

- Use warm neutrals for axes, scaffolding, labels, and secondary geometry.
- Use gold for the primary path, selected state, or central relationship.
- Assign categorical colors in their defined order.
- Use semantic colors only when the data actually represents success,
  information, warning, or error.
- Label lines, regions, or points directly when possible. Never make color the
  only way to understand the graphic.
- Technical notation may use IBM Plex Mono, but explanatory titles should retain
  the editorial hierarchy.

## Texture, Light, and Effects

- A very subtle monochrome grain may be used at roughly `4–6%` opacity.
- Use the gold glow sparingly: `0 0 42px rgb(214 176 106 / 14%)` is the reference
  large glow.
- Prefer fine luminous lines and localized radial light over broad glossy
  gradients.
- Effects must remain subordinate to content and should survive conversion to a
  static or reduced-detail version.
- Avoid heavy blur, strong shadows, glassmorphism, saturated ambient gradients,
  and decorative noise that weakens text contrast.

## Motion Language

When the deliverable includes motion, use animation to reveal construction or
relationships.

- Draw easing: `cubic-bezier(.22, 1, .36, 1)`.
- Converge easing: `cubic-bezier(.16, 1, .3, 1)`.
- Appropriate verbs include draw, trace, reveal, converge, orbit, assemble, and
  compose.
- Interface transitions should usually be brief and controlled. Larger
  construction reveals may be slower when the sequence carries meaning.
- Avoid elastic bounce, arbitrary parallax, constant motion without hierarchy,
  or effects added only to make a still design feel busier.
- Provide a reduced-motion or static equivalent that preserves the final
  information and composition.

## Accessibility and Legibility

- Verify contrast at the final output size and on the actual background.
- Do not communicate meaning through color alone.
- Keep important text as live text when the medium allows it.
- Ensure small mono labels remain readable; their technical tone is not a reason
  to make required information tiny.
- Preserve logical reading order and clear heading hierarchy in digital assets.
- Provide useful alternative text for meaningful images and diagrams.
- Do not place essential copy over visually complex artwork without a stable,
  high-contrast region.
- Check responsive assets at narrow widths and inspect raster exports at their
  actual display size.

## Agent Workflow

Before designing:

1. Identify the asset's audience, medium, dimensions, required content, and
   primary communication goal.
2. Decide whether the THOM wordmark is central, supporting, or unnecessary.
3. Select the correct wordmark optical profile for its final rendered size.
4. Define the neutral hierarchy before adding gold, semantic color, or accents.
5. Choose one principal typographic voice and one supporting voice.

While designing:

1. Maintain a single clear focal point.
2. Use the established fonts and exact color values.
3. Preserve supplied vector identity artwork without reinterpretation.
4. Check legibility at actual size, not only while zoomed in.
5. Remove effects or decoration that do not clarify hierarchy or relationship.

Before delivery:

1. Confirm the wordmark profile and geometry are correct.
2. Confirm colors use the intended semantic or categorical role.
3. Check text contrast, spelling, alignment, and crop safety.
4. Inspect both the largest and smallest requested variants.
5. Verify that reduced-motion or static output still communicates the design.
6. Export only to the requested paths and formats.

## Delivery Requirements

Unless the task specifies otherwise:

- Preserve an editable source for compositions that may need revision.
- Use SVG for vector identity, diagrams, and line-based artwork.
- Use PNG for raster delivery when transparency or lossless text rendering is
  important.
- Provide explicit pixel dimensions for raster assets.
- Produce high-density variants when the asset will be used on modern screens.
- Keep text and key identity elements inside safe crop regions for social and
  responsive outputs.
- Name variants by their purpose, size, or profile rather than with ambiguous
  suffixes such as `final-2`.

## Final Design Review

A successful THOM asset should answer yes to these questions:

- Does it feel dark, warm, editorial, technical, and restrained?
- Is there one obvious primary idea?
- Does gold function as a meaningful brand signal rather than general
  decoration?
- Are Newsreader, Inter, and IBM Plex Mono performing distinct roles?
- Is the custom wordmark used as supplied and at the correct optical profile?
- Do rules, grids, geometry, and motion reveal relationships instead of merely
  adding complexity?
- Is the design readable and understandable without relying on color alone?
- Does the result still work when effects and motion are removed?

If the answer to any of these is no, revise before delivery.
