# Writing Component Conventions

## Purpose

Dense articles need context placed where the reader's attention already is —
not dumped in their way. This document is the canonical decision rule for the
contextual components available to React article pages (`@th-m/ui` primitives
and the portfolio tool drawer): when to use a tooltip, a hover card, a card, a
modal, or the global right-side drawer, and how each one must look so the
writing stays unmistakably THOM.

The React article page contract itself is documented in
[`libs/blogs/articles/README.md`](../../../libs/blogs/articles/README.md); this
document governs the presentation layer.

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

### Inline animated figures (exception to the drawer rule)

A self-playing animation that *is* the figure — an animated neural net
replacing a static diagram, a looping constraint stack, a pulsing feedback
loop — belongs in the prose flow, not the drawer. The reader should see it
where the prose discusses it, and it must not require interaction to be
understood. Author it in a reusable visualization library
(`libs/neural-net-visualization` is the first), then register it in
`ArticleContent`'s `inlineFigures` map under a marker id, and place
`<!-- <marker-id> -->` in the article body at the exact point the figure
belongs. Every such component must collapse to a static labeled frame under
reduced motion. It may offer optional step controls (as
`libs/neural-net-visualization` does — numbered steps, Prev/Next, Play/Pause)
as long as it stays self-playing and understandable without any interaction.

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

## Page authoring contract (summary)

An article ships a React page as `libs/blogs/articles/<slug>/index.tsx` when
its presentation genuinely needs React. The default export receives
`{ post, assetUrl }`; it may import `@th-m/ui` components (including the
`useToolDrawer` hook for opening a drawer tool alongside the prose),
`@th-m/blogs/publish` types, `@tanstack/react-router` (`Link` for internal SPA
links), and THOM visualization libraries
(`@th-m/graph-visualization`, `@th-m/set-theory-visualization`, and peers) to
embed **dynamic figures** — for example
`<PropositionGraphFigure document={graph} />` or
`<SetAtlasVisualization analysis={curated.analysis} />`. Dynamic figures
render at runtime from data and replace the old checked-in SVG/PNG blog
assets; `assetUrl` remains for genuinely static content. Until a page exists,
the portfolio renders the published Markdown through the generic fallback — so
a page is an enhancement, never a requirement, and an article must remain
readable as pure Markdown. **The Knowledge Factory** page
(`libs/blogs/articles/the-knowledge-factory/index.tsx`) is the reference
implementation: it embeds a `PropositionGraphFigure` fed by an authored
`GraphDocument`, seeds that graph into the relationship-graph explorer's
library and opens it through `useToolDrawer().openTool("relationship-graph",
{ graphId })`, and ships its remaining illustrations as inline SVG components
styled by the `essay-*` classes in `apps/portfolio/src/styles.css`.
