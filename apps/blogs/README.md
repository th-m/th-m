# Blog Posts

## Purpose

This app owns the working material and explicit publication artifacts for the
AI, ontology, and software-economics blog series. Start the authoring workflow
with `bun run nx run blogs:start` and build the public content artifact with
`bun run nx run blogs:publish`.

## Ontology

A post directory is an editorial ownership boundary. `outline.md`, `notes/`,
and `research/` are private authoring material. A post becomes publishable only
when it contains a valid `article.md`; only its public Markdown, metadata, and
`assets/` are copied to the versioned artifact in `dist/`.

## Key Terms

- **Outline:** the canonical editorial brief for a developing post.
- **Article:** explicit public Markdown stored as `article.md`.
- **Research:** evidence and source analysis that remains outside publication.
- **Frontmatter:** required YAML metadata containing `title`, `description`,
  `publishedAt`, and optional `updatedAt` and `tags`.
- **Manifest:** the deterministic, newest-first index of explicitly published
  articles using schema version 2.

## Obsidian Vault

The repository root is an Obsidian vault, so its Markdown notes and `.obsidian`
configuration remain tracked alongside the workspace. After installing and
launching [Obsidian](https://obsidian.md/) at least once, run:

```sh
bun run nx run blogs:start
```

This opens the blogs README. To open another note, pass its path relative to the
repository root:

```sh
bun run nx run blogs:start -- apps/blogs/your-soulless-clanker-will-never-discover-opportunity/outline.md
```

The command uses Obsidian's desktop URI handler. On Linux, register the
`obsidian://` URI scheme and make sure `xdg-open` is available.

This directory contains the working material for the **AI, ontology, and software economics** blog series. Each post has its own directory so its outline, notes, and research can evolve independently without turning the top-level folder into a collection of unrelated files.

## Posts

| Post | Working title | Status |
| --- | --- | --- |
| [ai-knows-propositions-humans-navigate-relationships](./ai-knows-propositions-humans-navigate-relationships/) | AI Knows Propositions; Humans Navigate Relationships | Outline and research in progress |
| [your-soulless-clanker-will-never-discover-opportunity](./your-soulless-clanker-will-never-discover-opportunity/) | Your Soulless Clanker Will Never Discover Opportunity | Outline and research in progress |
| [the-next-abstraction-layer](./the-next-abstraction-layer/) | The Next Abstraction Layer: Software Engineering Becomes Ontology Design | Outline and research in progress |
| [moats-in-the-ai-era](./moats-in-the-ai-era/) | What Are Our Moats in the AI Era? | Outline in progress |
| [the-knowledge-factory](./the-knowledge-factory/) | The Knowledge Factory: Capital as the New Multiplier | Outline in progress |
| [understanding-is-the-bottleneck](./understanding-is-the-bottleneck/) | Understanding Is the Bottleneck | Outline in progress |

## Directory Structure

Every post follows the same structure:

```text
blogs/
└── post-slug/
    ├── article.md (only when intentionally public)
    ├── assets/ (optional public article assets)
    ├── outline.md
    ├── notes/
    └── research/
```

### `article.md`

Publication requires YAML frontmatter followed by an H1 that exactly matches
the title. Dates use `YYYY-MM-DD`, `updatedAt` cannot precede `publishedAt`, and
tags are an optional array of non-empty strings:

```md
---
title: A Public Title
description: A concise summary for listings and metadata.
publishedAt: 2026-08-16
updatedAt: 2026-08-17
tags: [Ontology, Software]
---
# A Public Title

Article body.
```

Run `bun run nx run blogs:publish` to validate articles and recreate `dist/`.
Frontmatter itself is not included in the published Markdown body.

### `outline.md`

The editorial plan for the post. It should contain the working thesis, intended audience, section-by-section notes, examples, visual ideas, caveats, and candidate ending. The outline is the primary source for drafting the article.

### `notes/`

Informal material produced while developing the post, including:

- author observations and anecdotes;
- questions and unresolved ideas;
- fragments or alternate framings;
- interview and conversation notes; and
- feedback on the outline or draft.

Use descriptive kebab-case filenames such as `customer-interview-notes.md` or `alternate-opening.md`. Notes do not need to meet publication or citation standards.

### `research/`

Evidence and source analysis used to test the post's claims, including:

- research reviews and audits;
- source summaries;
- fact-checking notes;
- study limitations;
- links, citations, and quotations; and
- competing evidence or counterarguments.

Use descriptive kebab-case filenames such as `research-review.md`, `creativity-studies.md`, or `aviation-language-sources.md`. Clearly distinguish a source's findings from the author's interpretation, and verify primary sources before promoting a claim into the article.

## Working Conventions

- Directory names use stable, unnumbered kebab-case slugs.
- Keep one canonical editorial brief at `outline.md` for each post.
- Put developing ideas in `notes/` and evidentiary work in `research/`.
- Preserve uncertainty, counterevidence, and source limitations rather than flattening them into a stronger claim.
- Treat videos and secondary summaries as research leads; prefer the underlying study or primary source for publication claims.
- Keep candidate language in the outline until a separate article draft is introduced.

## Adding a Post

Create a directory from the working-title slug with the standard artifacts:

```text
new-post-slug/
├── article.md (only when ready to publish)
├── assets/ (optional)
├── outline.md
├── notes/
└── research/
```

Then add the post to the table above. Do not add numbered prefixes to the directory name; ordering belongs in editorial planning rather than the filesystem path.
