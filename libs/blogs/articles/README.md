# Blog Articles

## Purpose

`articles/` is the canonical editorial home for the AI, ontology,
software-development, software-economics, and knowledge-work essays. Each
article has an independent workspace so its thesis, evidence, private working
material, public prose, figures, and interactives can evolve without mixing
with app tooling or another post.

## Ontology

An immediate child directory is one article workspace. Its `draft/`, `notes/`,
and `research/` directories are private. A workspace becomes publishable only
when it contains both `article.mdx` and `article-assets.ts`. The MDX file owns
the article's prose and render order; the registry owns stable tagged asset IDs;
optional immediate TS/TSX/CSS modules implement article-specific components.

## Key Terms

- **Draft workspace:** `draft/`, where outlines, prose experiments, and voice
  work can evolve freely.
- **Notes:** durable observations, feedback, preserved pre-migration copy, and
  retired directions outside the active draft.
- **Research:** source analysis, fact-checking, limitations, and competing
  evidence used to test an article's claims.
- **Canonical article:** the public `article.mdx` document containing metadata,
  prose, GFM, and component composition.
- **Asset:** a stable ID in `article-assets.ts` with a kind and non-empty tags.
- **Component asset:** a figure, interactive, or preview implemented in React
  and wired by `article-components.tsx`.
- **Article module:** a non-empty immediate kebab-case `.ts`, `.tsx`, or `.css`
  sibling imported by the MDX or component factory.
- **Frontmatter:** YAML metadata containing `title`, `description`,
  `publishedAt`, and optional `updatedAt`, `addendumTo`, and `tags`.

## Articles

Directory names remain unnumbered so editorial order can change without
destabilizing URLs.

| Order | Workspace | Subject | Status |
| --- | --- | --- | --- |
| 1 | [goals-solutions-and-value](./goals-solutions-and-value/) | AI problem fit, functional cognition, goals, agency, and theories of value | Published canonical MDX with tagged figures and an interactive training asset |
| 2 | [truth-entropy-and-inference](./truth-entropy-and-inference/) | Truth practices, predictive language, code constraints, and domain fluency | Published canonical MDX with tagged static assets, figures, and interactives |
| 3 | [understanding-is-the-bottleneck](./understanding-is-the-bottleneck/) | Turning abundant output into shared models and bounded action | Published canonical MDX with tagged explanatory figures |
| 4 | [the-knowledge-factory](./the-knowledge-factory/) | Distributed solutioning, factory engineers, and the knowledge-factory stack | Published canonical MDX with tagged factory figures |
| 5 | [the-ontology-factory](./the-ontology-factory/) | Repository ontology as the factory's semantic infrastructure | Published canonical MDX with registered images and graph composition |
| 6 | [the-cognitive-factory](./the-cognitive-factory/) | Graph context, executable context, compounding learning, and cognitive light cones | Published canonical MDX with tagged diagnostic assets |

### Related Essays

| Workspace | Subject | Status |
| --- | --- | --- |
| [building-an-llm](./building-an-llm/) | A visual primer from tokenization through training and inference | Published canonical MDX with four tagged interactives |
| [consciousness-is-incoherent](./consciousness-is-incoherent/) | A coherent evidentiary standard for machine-consciousness claims | Published MDX addendum |
| [ai-consciousness-is-incoherent](./ai-consciousness-is-incoherent/) | Why access-like function and theory-derived indicators do not establish phenomenal experience | Published canonical MDX with tagged argument figures |

## Workspace Structure

```text
articles/
└── post-slug/
    ├── article.mdx             (canonical public prose and composition)
    ├── article-assets.ts       (required typed tagged registry)
    ├── article-components.tsx  (optional component-asset factory)
    ├── figure-name.tsx         (optional immediate article module)
    ├── figure-name.css         (optional immediate article style)
    ├── assets/                 (optional registered static assets)
    ├── draft/
    ├── notes/
    └── research/
```

`index.tsx` is not part of this structure. Keeping prose in a second React page
would recreate the divergence this MDX contract is designed to remove.

## Canonical `article.mdx`

Publication requires YAML frontmatter followed by an H1 that exactly matches
the title. Dates use `YYYY-MM-DD`, `updatedAt` cannot precede `publishedAt`,
`addendumTo` names another published slug, and tags are optional non-empty
strings:

```mdx
---
title: A Public Title
description: A concise summary for listings and metadata.
publishedAt: 2026-08-16
updatedAt: 2026-08-17
tags: [Ontology, Software]
---
# A Public Title

<Lede>
  Opening context.
</Lede>

<Section index="01" title="The First Claim">
  Prose can use **GFM**, tables, links, and the shared component vocabulary.
</Section>
```

The portfolio supplies `Section`, `Lede`, `P`, `Callout`, `Term`, `Gloss`,
`Quote`, `Flow`, `Asset`, `PreviewLink`, and `ToolLink`. Standard Markdown links
receive link previews automatically, and GFM tables receive the shared
responsive wrapper. `P` is available when authored JSX needs paragraph props or
contains JSX components; ordinary prose should remain Markdown.

MDX may use named imports from immediate kebab-case modules for article-local
layout helpers. Reusable behavior belongs in a library. Figures, interactives,
static images, and custom previews should be composed through stable registry
IDs rather than unnamed comment markers or a second page source.

## Tagged Assets and Components

Every workspace has an asset registry, even when it is empty:

```ts
import { defineArticleAssets } from "@th-m/blogs/mdx";

export default defineArticleAssets({
  "system-map": {
    kind: "image",
    source: "assets/system-map.svg",
    alt: "A system map",
    tags: ["article-figure", "architecture"],
  },
  "training-lab": {
    kind: "interactive",
    label: "Training lab",
    tags: ["article-interactive", "machine-learning"],
  },
  "source-preview": {
    kind: "preview",
    label: "Source preview",
    tags: ["link-preview", "research"],
  },
});
```

Static images render with `<Asset id="system-map" />`. Component assets are
wired by a typed factory:

```tsx
import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import { TrainingLab } from "./training-lab";
import { SourcePreview } from "./source-preview";

export default defineArticleComponents(articleAssets, () => ({
  "training-lab": TrainingLab,
  "source-preview": SourcePreview,
}));
```

Then compose them in the prose with `<Asset id="training-lab" />` or
`<PreviewLink href="https://example.com" previewId="source-preview">Source</PreviewLink>`.
Asset IDs and tags use kebab-case. Every file under `assets/` must be registered,
every registered image must exist, and the publisher rejects unknown IDs.

## Publication Artifact

Run from the workspace root:

```sh
bun run nx run blogs:publish
```

The schema-v3 artifact includes frontmatter-free raw `article.mdx`, serialized
`assets.json`, optional static files, and compile modules. The portfolio compiles
the same MDX to React and publishes the raw MDX beside the HTML. Private
workspaces never enter the artifact.

## Working Conventions

- Keep one singular `draft/` workspace in every article directory.
- Keep durable supporting material and retired directions in `notes/`; keep
  evidentiary work in `research/`.
- Preserve uncertainty, counterevidence, and source limitations.
- Prefer primary sources for publication claims.
- Use stable, unnumbered kebab-case directory, module, asset, and tag names.
- Keep the `Sources` section last.
- Treat `article.mdx` as the only canonical public prose and render order.
- Move reusable components into `libs/`; keep article-specific semantic scenes
  and wrappers with their article.

## Adding an Article

Create a stable kebab-case directory with private workspaces first:

```text
new-article-slug/
├── draft/
├── notes/
└── research/
```

Add `article.mdx` and `article-assets.ts` when publication is intentional. Add
registered `assets/` and an `article-components.tsx` factory only as needed,
then add the workspace to the inventory above.
