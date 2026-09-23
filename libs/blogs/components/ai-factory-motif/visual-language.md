# AI Factory visual language

This is the implemented presentation baseline for the shared motif diagrams,
series map, and portfolio icon review sheet. `blogs` owns the components and
tokens in `ai-factory-motif.css`; `portfolio` owns the review-page composition.
The foundation remains `@th-m/design-theme`, not a second brand palette.

## Icon-card contract

`icon-catalog.ts` is the canonical registry for every inventory specimen:

| Field | Placement and purpose |
| --- | --- |
| `semanticRole` | Top left: the concept's role in this visual language, from a closed vocabulary. |
| `iconId` | Internal stable identifier for references and anchors; not displayed on the card. |
| `title` | Reader-facing concept name. |
| `subheading` | Optional line beneath the title that refines the icon's intent and meaning; it may be a question or a statement. |
| `definition` | Meaning independent of the drawing. |
| `visualGrammar` | Separately labeled note describing encoding and its limits. |

The visible hierarchy is semantic role → title → optional subheading →
definition → visual grammar. Icon IDs remain in the field contract without
repeating the title in the card's top-right corner.

See [the vocabulary glossary](CONTEXT.md) for field and role meanings. Roles
do not control glyph selection, visual family, inventory order, or layout.
The renderer key selects the unchanged glyph; the ordered key list preserves
inventory order. Legacy `morpheme-diffuse` and `morpheme-refined` renderer keys
and anchors remain compatible while their public icon IDs are `idea-diffuse`
and `idea-refined`. Both anchor forms resolve on the review page.

Standalone accessible names derive from the same title and definition. A
caller may still provide a contextual label. The portfolio inventory, legend,
and language sequence consume this registry instead of maintaining separate
definitions. Diagram-specific narrative remains contextual, not a glossary.

This normalization preserves titles and glyph geometry. Abstract/concrete
describe ideas, not simply dotted/solid boundaries; the visual notes make that
distinction explicit. Consequence is used as an evaluation by outcomes. Token
and Embedding remain singular concepts even though their specimens depict a
sequence or matrix. Those depiction limits belong in visual grammar.

## Type roles

| Role | Family | Size | Treatment |
| --- | --- | --- | --- |
| Edge / relationship | IBM Plex Mono | 8 SVG units | Regular, uppercase, 0.08em tracking, muted ivory |
| Diagram detail / axis | IBM Plex Mono | 8 SVG units | Supporting information |
| Metadata | IBM Plex Mono | 9px | Uppercase; gold only for the figure identity or index |
| Concept | Inter | 14 SVG units | Medium, strong ivory |
| Compact outcome concept | Inter | 12 SVG units | Only within the smaller outcome panels |
| Description / caption | Inter | 12px | Regular, muted ivory, generous leading |
| Article / inventory title | Newsreader | 24px | Regular; larger editorial headings remain fluid |

SVG units scale uniformly with the viewBox. Mobile diagrams keep their readable
width and scroll within a keyboard-focusable region instead of shrinking all
labels to fit the screen. HTML descriptions do not shrink with the diagrams.

## Surfaces and color

- **Figure:** the foundation surface, without a decorative gold wash.
- **Panel:** one quiet mix of the card and surface tokens.
- **Inset / edge label:** one darker neutral surface across cards and specimens.
- **Focal region:** a restrained 7% gold tint; gold strokes and centers retain
  their existing semantic roles.
- **Structure:** quiet border rules. Label frames use a muted intermediate rule,
  not the full-strength boundary used by a disconnected or uncertain outcome.
- **Relationships:** muted text; gold is carried by the focal path or glyph,
  not every verb. Dashed boundaries and the disconnected mark preserve meaning
  independently of color.

## Participant glyphs

- **Self:** one small solid gold dot, anchoring the individual perspective.
- **Others:** three equally sized solid gray dots in a compact cluster, expressing
  other people rather than an exact headcount.

These marks have no enclosing rings, text dashes, or directional spokes. Use the
shared `self` and `others` glyphs in both the inventory and composed diagrams;
color identifies perspective, not a difference in people's worth.

## Edge-label geometry

`ConnectorLabel` uses one profile: 16-unit frame height, 6-unit horizontal
padding, minimum width 40, and widths rounded up to a four-unit grid. Its 5.6-unit
character allowance includes the 8-unit mono font and tracking. Keep that
calculation in sync with the edge type tokens. There is no per-diagram compact
override. Empty typed-relation specimens use the same frame without text.

Inline labels interrupt their own edge intentionally. Preserve visible connector
segments, arrowhead clearance, and separation from the disconnected × marker.
Do not change glyph geometry, relationships, or copy to compensate for styling.

## Verification

Component tests cover common label metrics, centering, and node/marker clearance.
Inspect the review motifs, the series map, and the inventory in a browser;
verify loaded fonts, label bounds, and mobile horizontal scrolling. Run the owner
and consumer checks required by the parent component contract before handoff.
