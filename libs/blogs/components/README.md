# Blog Components

## Purpose

This directory, owned by the `blogs` Nx project, provides shared article
presentation. Import prose and links from `@th-m/blogs/components` and import
`@th-m/blogs/components/styles.css` after the theme and UI styles in the host.
UI primitives remain in `@th-m/ui`; article-specific data and figures remain
with their articles. Reusable walkthroughs have their own subdirectory exports.

## Boundaries

This is a presentation boundary within the `blogs` Nx project, not a separate
project. Articles own meaning and asset registration; the host owns routing and
asset resolution; `ui` owns reusable interface primitives.

## Ontology

- `prose.tsx`: Section, Lede, Paragraph, Callout, Term, Gloss, Quote, Flow, Table.
- `links.tsx`: preview-enabled BlogLink, ArticleLink, ExternalLink, and the host
  routing provider. Without a provider, links render ordinary anchors.
- `styles.css`: shared article typography, surfaces, and responsive tables.
- `audio-player.tsx` and `audio-player.css`: an accessible audio icon that starts
  playback, reveals native controls, supports a starting cue, and pauses when
  other media starts. The host supplies the registered recording's resolved URL.
- `document-popover.tsx`: click/touch/keyboard-accessible, scrollable reference
  content with a persistent close button. Supply a title, inline trigger, and
  rendered content; the original article remains visible.
- `neural-training-figure/`: reusable training walkthrough, styles, and tests.

Canonical MDX receives the shared vocabulary from its renderer; it does not
import the package directly. React article modules may use package imports,
which survive publication staging. Do not use relative imports that reach out
of an article directory. The host owns asset resolution and tool routing.

Use `Term definition={...}` for an inline definition and `Callout` for a block
claim. Use `ArticleLink slug="..."` for another essay, `ExternalLink href="..."`
for a reference, and `BlogLink href="..."` for other destinations. Ordinary
Markdown supplies subheadings and tables. The renderer maps Markdown tables
to the responsive Table and `P` to Paragraph.

## Key Terms

- **Shared vocabulary:** presentation components injected into every MDX page.
- **Routing adapter:** the host's BlogLinkProvider renderer, which preserves
  client navigation without importing application code into this library.
- **Article asset:** an article-registered figure, interactive, image, audio, or preview;
  extraction does not transfer ownership of its registration or article data.
