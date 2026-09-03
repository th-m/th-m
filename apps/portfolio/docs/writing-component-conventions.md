# Writing Component Conventions

## Purpose

Dense articles need context placed where the reader's attention already is —
not dumped in their way. This document is the canonical decision rule for the
contextual components available to canonical MDX articles (`@th-m/ui`
primitives and the portfolio tool drawer): when to use a tooltip, a hover card,
a card, a modal, or the global right-side drawer, and how each one must look so
the writing stays unmistakably THOM.

The MDX article and tagged-asset contract is documented in
[`libs/blogs/articles/README.md`](../../../libs/blogs/articles/README.md); this
document governs the presentation layer. The reusable implementations and
styles live in [`@th-m/blogs/components`](../../../libs/blogs/components/README.md).
The portfolio supplies routing through `BlogLinkProvider` and keeps asset and
tool adapters in `ArticleMdx.tsx`; article modules keep their figures and data.

## Shared Markdown typography

Every `article.mdx` uses the same root layout and shared prose styles. The root
layout loads upright and real italic faces for Newsreader (body and display),
Inter (sans-serif text and tables), and IBM Plex Mono (code and labels).
`font-synthesis: none` remains intentional; load the actual font face whenever
adding a new font or style.

Use standard Markdown: `*emphasis*` or `_emphasis_`, `**strong emphasis**`, and
`***both***`. These semantics also work inside shared `P`, `Section`, `Callout`,
and `Quote` components. Keep font loading in the root layout and reusable prose
styles in `@th-m/blogs/components`; articles need no per-file font imports or
formatting wrappers.

## The six contextual surfaces

| Surface | Shape | Reading posture | Home for |
| --- | --- | --- | --- |
| **Tooltip** | ≤ 3-line floating gloss, `--color-popover` | Attention stays in the sentence | Inline jargon, abbreviations, token-level definitions |
| **LinkPreview** | Floating destination card, `--color-popover` | Hover or focus on any output link | **Every link the article outputs** — external references, citations, sources, cross-article links |
| **HoverCard / TooltipCard** | Structured floating card, `--color-hover-card` | Hover or focus on a term | Desktop glosses with definition + example + link |
| **Card** | Always-visible block in the flow, `--color-card` | The paragraph pauses | Glossaries, key claims, "in short" boxes, formulas, comparisons |
| **Modal / Dialog** | Blocking centered panel, `--color-dialog` + scrim | The reader stops to act | Confirmations, single focused tasks, large single artifacts |
| **Drawer (right)** | Non-blocking side sheet, `--color-dialog` | The reader reads both at once | **Auxiliary interactives** — explorers, labs, glossaries, references, calculators |

### Decision rules

1. **One sentence of clarification → Tooltip.** First mention of a term that
   can be defined in a breath (embedding, cross-entropy, BPE, logit). Trigger
   is the term itself, styled with the dotted-underline `thom-tooltip-trigger`
   treatment. Tooltips never contain links, controls, or more than ~45 words.
2. **A destination worth previewing → LinkPreview.** Every link an article
   outputs — external references and citations, further-reading sources, and
   cross-article links — is a `LinkPreview` (the Aceternity link-preview port
   in `@th-m/ui`). Hover or focus reveals a small floating card above the link
   showing where it goes: the destination hostname and path by default, or a
   custom `preview` / static `imageSrc` when the article has richer material.
   Internal site navigation keeps SPA behavior by passing the TanStack `Link`
   through `asChild`; external links keep `target="_blank" rel="noreferrer"`.
   The preview never replaces the link — it previews it.
3. **A structured gloss → HoverCard or TooltipCard.** The term needs a
   definition, one worked example, and a link or formula. HoverCard is the
   inline-term variant (desktop only — on touch it degrades, so pair it with a
   card or a drawer link for the same content). TooltipCard is the
   Aceternity-style card that reveals a floating detail panel on hover or
   focus; use it for a term that deserves a small named object (a model, a
   concept, an algorithm) inside a comparison or reference block.
4. **A block the reader should keep seeing → Card.** Glossary entries, key
   claims ("the claim in one paragraph"), "in short" recaps, formula plates,
   and comparison tables. Cards are always visible; never hide essential
   information behind hover.
5. **A forced decision → Modal.** Only when the reader must stop: confirm a
   destructive action, commit to a choice, or inspect one large artifact
   (a full derivation, a large diagram) in isolation. Modals are rare in
   essays — if the content is reference material, it belongs in the drawer or
   a card instead.
6. **An interactive the reader uses *alongside* the prose → Drawer.** The
   right drawer is the designated home for auxiliary interactives: the
   embedding explorer, the compact relationship graph explorer, token viewers,
   simulation labs, calculators, glossary lookups. The article stays visible;
   the reader consults the tool, then returns to the sentence. Pages open it
   with `useToolDrawer().openTool(id)` from an inline gold "Explore →"
   affordance, or `useToolDrawer().openTool(id, options)` when the tool should
   start on specific content — for example
   `openTool("relationship-graph", { graphId: "weather-kolob" })` opens the
   relationship graph explorer on that graph. The global right-edge tab opens
   the drawer anywhere; a switcher row inside the drawer header moves between
   tools without closing it.

### Inline figures and interactives (exception to the drawer rule)

A self-playing animation that *is* the figure — an animated neural net
replacing a static diagram, a looping constraint stack, a pulsing feedback
loop — belongs in the prose flow, not the drawer. The reader should see it
where the prose discusses it, and it must not require interaction to be
understood. Author reusable behavior in a visualization library, register the
article instance as a tagged `figure` or `interactive` in
`article-assets.ts`, wire its stable ID in `article-components.tsx`, and place
`<Asset id="the-figure" />` at the exact point it belongs in `article.mdx`.
Every animated asset must collapse to a static labeled frame under reduced
motion. It may offer optional step controls as long as it stays understandable
without interaction.

### Escalation ladder

Inline need → **tooltip**; a destination worth previewing → **link preview**;
needs structure → **hover card**; needs persistence → **card**; needs
interactivity → **drawer**; needs a decision → **modal**.
When two surfaces would fit, pick the less disruptive one: the reader should
never lose the sentence to learn a word.

## THOM styling contract

Every contextual component consumes `@th-m/design-theme` tokens — no copied
palette values, no rounded corners, no generic shadows.

- **Surfaces:** tooltip and link-preview cards use `--color-popover`;
  hover cards use `--color-hover-card`; cards use `--color-card`; modals and
  the drawer use `--color-dialog` with `--color-scrim` overlay. All panels get
  a `1px solid var(--color-border)` frame and `var(--shadow-glow)` where
  elevation is needed.
- **Type:** display and body copy use `--font-display` (Newsreader); labels,
  eyebrows, metadata, and microcopy use `--font-mono` (IBM Plex Mono),
  9–10px, `letter-spacing: .08–.16em`, uppercase.
- **Interactive cues:** gold (`--color-primary`) is the only interactive
  accent. Underlines, dotted underlines (tooltip triggers), arrows (`→`, `↗`),
  and focus rings (`2px solid var(--color-ring)` with 3px offset) all use it.
- **Motion:** `--ease-draw` for reveals and hover lifts; nothing moves more
  than a few pixels; `prefers-reduced-motion` (already global in
  `apps/portfolio/src/styles.css`) collapses all animation.
- **Shape:** square corners throughout; separation comes from 1px hairline
  borders and surfaces, not radius.
- **Accessibility:** every interactive trigger is a real button or link
  (Radix `asChild`); Radix handles focus trap, Escape, scroll lock, and
  aria-modal for dialogs and the drawer; tooltips, link previews, and hover
  cards are keyboard-reachable via focus.

## Trigger affordances

- Terms with glosses: dotted gold underline, `cursor: help`.
- Links and "open tool" actions: gold underline or the mono uppercase button
  label, always with a direction glyph (`→` opens the drawer, `↗` leaves the
  site).
- Never style a non-interactive word like a trigger.

## MDX authoring contract (summary)

Every published article is
`libs/blogs/articles/<slug>/article.mdx`; there is no separate React page or
Markdown fallback. The portfolio injects semantic prose components, automatic
link previews, responsive GFM tables, asset resolution, and tool-launching
behavior. Article-owned modules may import `@th-m/ui`, `@th-m/blogs` types,
`@tanstack/react-router`, and THOM visualization libraries to implement dynamic
figures. Reusable behavior belongs in the library; the article keeps its
semantic scene and registry wiring.

Use `article-assets.ts` for stable image, figure, interactive, and preview IDs.
Use `article-components.tsx` to map component IDs to React implementations with
the typed render context. Compose figure and interactive IDs with `<Asset>`,
custom link-preview IDs with `<PreviewLink>`, and drawer tools with `<ToolLink>`.
The raw frontmatter-free MDX and `assets.json` publish beside the prerendered
HTML, so authored content, component order, and the public source cannot drift
from the rendered article.
