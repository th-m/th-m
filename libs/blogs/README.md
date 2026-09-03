# Blog Posts

## Purpose

This library owns the Obsidian authoring workflow, the typed MDX publication
contract, and the local content artifact for THOM essays. Editorial content
lives under [`articles/`](./articles/README.md); the library root owns the
scripts, tests, and publication API that validate intentionally public articles
and recreate `dist/`. It is a library, not an app: `publish` creates local build
inputs for the portfolio, while `start` opens the Obsidian editor.

## Ontology

| Path | Meaning |
| --- | --- |
| [`articles/`](./articles/README.md) | Private editorial workspaces and their explicit public MDX sources. |
| [`components/`](./components/) | Reusable essay modules with colocated TSX, CSS, and tests, exposed through package exports. |
| [`src/publish.ts`](./src/publish.ts) | Discovery, MDX validation, asset validation, and schema-v3 manifest generation. |
| [`src/mdx.ts`](./src/mdx.ts) | Shared types and helpers for tagged article assets and component factories. |
| [`scripts/`](./scripts/) | Bun TypeScript entrypoints for publication and Obsidian authoring. |
| [`tests/`](./tests/) | Verification of metadata, MDX, asset, module, and source-section invariants. |
| `dist/` | Generated content artifact consumed by the portfolio app. |

An immediate directory beneath `articles/` is one editorial boundary. It is
published only when it contains `article.mdx` and `article-assets.ts`. Optional
TypeScript, TSX, and CSS modules beside the MDX or directly inside its local
`components/` folder support article-owned figures and interactives. `index.tsx`
beside the MDX is deliberately obsolete: the MDX document owns the
prose order and the rendered component composition.

Shared walkthroughs live in `components/<name>/`. Import
`NeuralTrainingFigure` from `@th-m/blogs/components/neural-training-figure`
inside an article's component factory; each article keeps its own asset
registration. The walkthrough owns its teaching scene and styles, while the
animation engine remains in `@th-m/neural-net-visualization`. Shared modules
are bundled through package imports, not copied into article artifacts. Their
colocated tests run in jsdom under `blogs:test`; publication tests run in Node.

Shared prose, contextual definitions, link previews, and responsive table
presentation live in [`components/`](./components/README.md) and are exported
from `@th-m/blogs/components`. The portfolio injects them into MDX and supplies
routing, asset resolution, and tool integration; articles do not duplicate them.

## Key Terms

- **Canonical article:** the frontmatter-bearing `article.mdx` file that owns
  both prose and render composition.
- **Asset registry:** `article-assets.ts`, a typed map of stable IDs to tagged
  image, figure, interactive, or preview metadata.
- **Component factory:** optional `article-components.tsx` wiring non-image
  asset IDs to React components with access to the post and asset URL resolver.
- **Article module:** a non-empty kebab-case `.ts`, `.tsx`, or `.css` file beside
  the MDX or directly in its local `components/` folder, used by the MDX or
  component factory.
- **Manifest:** the deterministic newest-first schema-v3 index of published
  articles.
- **Publish:** validate public sources and recreate `dist/`; it never deploys
  remotely.

## Authoring with Obsidian

The repository root is an Obsidian vault. Start the authoring workflow with:

```sh
bun run nx run blogs:start
```

This opens this README. Browse the [article catalog and working
conventions](./articles/README.md), or pass a note path relative to the
repository root:

```sh
bun run nx run blogs:start -- libs/blogs/articles/vision-and-values/draft/draft\ 2.md
```

## Publishing

Run the publisher with:

```sh
bun run nx run blogs:publish
```

The publisher compiles every article with MDX and GFM, validates the component
vocabulary and local named imports, checks all tagged assets, and writes a
schema-v3 artifact. Each post contains frontmatter-free `article.mdx`,
`assets.json`, optional public static assets, and compile modules beside the MDX
or directly inside its local `components/` folder. Module paths are preserved.
Drafts, notes, research, other nested modules, and workspace documentation remain
private. The portfolio excludes all compile modules from public downloads and
stages the raw MDX beside its generated React module so
the public artifact and rendered HTML originate from the same article source.

See the [article workspace contract](./articles/README.md) and [writing
component conventions](../../apps/portfolio/docs/writing-component-conventions.md)
for the supported composition model.
