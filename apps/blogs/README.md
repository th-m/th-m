# Blog Posts

## Purpose

This app owns the Obsidian authoring workflow and local publication artifact for
the AI, ontology, software-development, and knowledge-work essays. Editorial
content lives under [`articles/`](./articles/README.md); the app root owns the
scripts and tests that turn intentionally public articles into `dist/`.

## Ontology

| Path | Meaning |
| --- | --- |
| [`articles/`](./articles/README.md) | Private working material and explicit public source for each article. |
| [`src/`](./src/) and [`scripts/`](./scripts/) | Publication and Obsidian authoring tools. |
| [`tests/`](./tests/) | Verification of the publication contract. |
| `dist/` | Generated local artifact consumed by the portfolio app. |

An article directory is an editorial boundary. The publisher discovers only
immediate children of `articles/` and selects a post only when that directory
contains a valid `article.md`.

## Key Terms

- **Article workspace:** one directory beneath `articles/` containing a private
  `draft/` workshop and optional notes, research, public article, and assets.
- **Article:** intentionally public Markdown stored as `article.md`.
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
bun run nx run blogs:start -- apps/blogs/articles/solutions-meaning-and-value/draft/draft\ 2.md
```

The command uses Obsidian's desktop URI handler. On Linux, register the
`obsidian://` URI scheme and make sure `xdg-open` is available.

## Publishing

Run the publisher with:

```sh
bun run nx run blogs:publish
```

Only `articles/*/article.md`, its validated metadata, and a sibling non-empty
`assets/` directory can enter `dist/`. Outlines, notes, research, drafts, and
the article-workspace documentation remain private.
