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
| [`src/publish.ts`](./src/publish.ts) | Discovery, MDX validation, asset validation, and schema-v3 manifest generation. |
| [`src/mdx.ts`](./src/mdx.ts) | Shared types and helpers for tagged article assets and component factories. |
| [`scripts/`](./scripts/) | Bun TypeScript entrypoints for publication and Obsidian authoring. |
| [`tests/`](./tests/) | Verification of metadata, MDX, asset, module, and source-section invariants. |
| `dist/` | Generated content artifact consumed by the portfolio app. |

An immediate directory beneath `articles/` is one editorial boundary. It is
published only when it contains `article.mdx` and `article-assets.ts`. Optional
immediate TypeScript, TSX, and CSS modules support article-owned figures and
interactives. `index.tsx` is deliberately obsolete: the MDX document owns the
prose order and the rendered component composition.

## Key Terms

- **Canonical article:** the frontmatter-bearing `article.mdx` file that owns
  both prose and render composition.
- **Asset registry:** `article-assets.ts`, a typed map of stable IDs to tagged
  image, figure, interactive, or preview metadata.
- **Component factory:** optional `article-components.tsx` wiring non-image
  asset IDs to React components with access to the post and asset URL resolver.
- **Article module:** a non-empty immediate kebab-case `.ts`, `.tsx`, or `.css`
  sibling used by the MDX or component factory.
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
bun run nx run blogs:start -- libs/blogs/articles/goals-solutions-and-value/draft/draft\ 2.md
```

## Publishing

Run the publisher with:

```sh
bun run nx run blogs:publish
```

The publisher compiles every article with MDX and GFM, validates the component
vocabulary and local named imports, checks all tagged assets, and writes a
schema-v3 artifact. Each post contains frontmatter-free `article.mdx`,
`assets.json`, optional public static assets, and its immediate compile modules.
Drafts, notes, research, nested modules, and workspace documentation remain
private. The portfolio stages the raw MDX beside its generated React module so
the public artifact and rendered HTML originate from the same article source.

See the [article workspace contract](./articles/README.md) and [writing
component conventions](../../apps/portfolio/docs/writing-component-conventions.md)
for the supported composition model.
