# Blog Posts

## Purpose

This library owns the Obsidian authoring workflow, the typed publication API,
and the local content artifact for the AI, ontology, software-development, and
knowledge-work essays. Editorial content lives under
[`articles/`](./articles/README.md); the library root owns the scripts, tests,
and `src/publish.ts` API that turn intentionally public articles into
`dist/`. It is a library, not an app: `publish` stages a content artifact that
the portfolio app compiles and serves, and `start` opens the Obsidian editor —
neither starts nor deploys an application runtime.

## Ontology

| Path | Meaning |
| --- | --- |
| [`articles/`](./articles/README.md) | Private working material, explicit public source, and optional React page for each article. |
| [`src/`](./src/) and [`scripts/`](./scripts/) | Publication and Obsidian authoring tools. |
| [`tests/`](./tests/) | Verification of the publication contract. |
| `dist/` | Generated content artifact consumed by the portfolio app. |

An article directory is an editorial boundary. The publisher discovers only
immediate children of `articles/` and selects a post only when that directory
contains a valid `article.md`. A sibling `index.tsx` and its immediate sibling
TSX/CSS modules are published together as the article's React page.

## Key Terms

- **Article workspace:** one directory beneath `articles/` containing a private
  `draft/` workshop and optional notes, research, public article, page, and
  assets.
- **Article:** intentionally public Markdown stored as `article.md`.
- **Page:** an intentionally public React component stored as `index.tsx`; its
  default export receives `{ post, assetUrl }` and renders the article page.
- **Page module:** a non-empty, kebab-case TSX or CSS sibling imported by an
  article page; it is published and compiled with that page.
- **Manifest:** the deterministic, newest-first index of published articles
  using schema version 2.
- **Publish:** validate public source and recreate the local `dist/` artifact;
  it does not deploy remotely.

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

The command uses Obsidian's desktop URI handler. On Linux, register the
`obsidian://` URI scheme and make sure `xdg-open` is available.

## Publishing

Run the publisher with:

```sh
bun run nx run blogs:publish
```

Only `articles/*/article.md`, its validated metadata, a sibling non-empty
`assets/` directory, and an optional sibling `index.tsx` page with immediate
non-empty, kebab-case `*.tsx` and `*.css` modules can enter `dist/`. Auxiliary
modules require a page. Outlines, notes, research, drafts, nested private page
modules, and article-workspace documentation remain private. See the [writing component
conventions](../../apps/portfolio/docs/writing-component-conventions.md) for
when an article should ship a custom React page.
