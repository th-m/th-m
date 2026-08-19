# Blog Articles

## Purpose

`articles/` is the canonical editorial home for the AI, ontology,
software-development, software-economics, and knowledge-work essays. Each
article has an independent workspace so its thesis, informal notes, evidence,
and public draft can evolve without mixing with app tooling or another post.

## Ontology

An immediate child directory is one article workspace. `outline.md`, `notes/`,
`research/`, and any `draft.md` are private authoring material. A workspace
becomes publishable only when it contains a valid `article.md`; only that public
Markdown, its metadata, and a sibling `assets/` directory can enter the app's
`dist/` artifact.

## Key Terms

- **Outline:** the canonical editorial brief for a developing article.
- **Notes:** informal observations, questions, fragments, and alternate
  framings that do not need publication-level evidence.
- **Research:** source analysis, fact-checking, limitations, and competing
  evidence used to test the article's claims.
- **Draft:** private prose that is not selected by the publisher.
- **Article:** explicit public Markdown stored as `article.md`.
- **Frontmatter:** YAML metadata containing `title`, `description`,
  `publishedAt`, and optional `updatedAt` and `tags`.

## Articles

The articles now form a coordinated sequence. Their directory names remain
unnumbered so editorial order can change without destabilizing paths.

| Order | Workspace | Subject | Status |
| --- | --- | --- | --- |
| 1 | [solutions-meaning-and-value](./solutions-meaning-and-value/) | **Solutions, Meaning, and Value:** human stakes, opportunity, and accountable definitions of value | Nearly complete private draft, outline, notes, and research |
| 2 | [truth-entropy-and-inference](./truth-entropy-and-inference/) | **Truth, Entropy, and Inference:** truth practices, predictive language, code constraints, and domain fluency | Newly coordinated outline; inherited research and visuals need expansion |
| 3 | [understanding-is-the-bottleneck](./understanding-is-the-bottleneck/) | **Understanding Is the Bottleneck:** leaders who distill meaning and multiply team solutioning | Refocused outline in progress |
| 4 | [the-knowledge-factory](./the-knowledge-factory/) | **The Knowledge Factory:** distributed solutioning, factory engineers, graph context, and reusable organizational capital | Refocused outline in progress |
| 5 | [the-factory-ontology](./the-factory-ontology/) | **The Factory — Ontology:** human domain mapping, in-context learning, controlled language, and semantic infrastructure | Refocused outline and research in progress |
| 6 | [the-factory-strategy](./the-factory-strategy/) | **The Factory — Strategy:** narrative, customer empathy, adversarial and diplomatic opportunity, feedback, and the organizational second brain | Refocused outline; research queue established |

### Series Architecture

- Articles 1–3 establish the landscape: human value, the strengths and limits
  of predictive language, and understanding-centered leadership.
- Article 4 introduces the organizational response: an explicit knowledge
  factory that turns learning into reusable capability.
- Articles 5–6 develop its two human-governed disciplines: ontology maps the
  domain, while strategy chooses and revises direction.

## Workspace Structure

```text
articles/
└── post-slug/
    ├── article.md  (only when intentionally public)
    ├── assets/     (optional public article assets)
    ├── draft.md    (optional private prose)
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

Run `bun run nx run blogs:publish` from the workspace root to validate public
articles and recreate `apps/blogs/dist/`. Frontmatter itself is omitted from
the published Markdown body.

### `outline.md`

The outline is the primary source for drafting an article. Keep its working
thesis, intended audience, section notes, examples, visual ideas, caveats, and
candidate ending together.

### `notes/`

Use notes for author observations, anecdotes, unresolved questions, fragments,
alternate framings, interview material, and draft feedback. Prefer descriptive
kebab-case names such as `customer-interview-notes.md` or
`alternate-opening.md`.

### `research/`

Use research for evidence reviews, source summaries, fact-checking, study
limitations, citations, quotations, and counterarguments. Clearly distinguish
a source's findings from the author's interpretation, and verify primary
sources before promoting a claim into `article.md`.

## Working Conventions

- Keep one canonical editorial brief at `outline.md` for each article.
- Put developing ideas in `notes/` and evidentiary work in `research/`.
- Preserve uncertainty, counterevidence, and source limitations.
- Treat videos and secondary summaries as research leads; prefer primary
  sources for publication claims.
- Keep private prose in `draft.md` or the outline until publication is
  intentional.
- Use stable, unnumbered kebab-case directory names for articles.

## Adding an Article

Create a stable kebab-case directory with the standard private artifacts:

```text
new-article-slug/
├── outline.md
├── notes/
└── research/
```

Add `article.md` and optional `assets/` only when the content is intentionally
public, then add the workspace to the inventory above. Ordering belongs in
editorial planning rather than the filesystem name.
