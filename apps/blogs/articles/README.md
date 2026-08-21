# Blog Articles

## Purpose

`articles/` is the canonical editorial home for the AI, ontology,
software-development, software-economics, and knowledge-work essays. Each
article has an independent workspace so its thesis, voice, informal notes,
evidence, and public article can evolve without mixing with app tooling or
another post.

## Ontology

An immediate child directory is one article workspace. Its `draft/`, `notes/`,
and `research/` directories are private authoring material. A workspace becomes
publishable only when it contains a valid `article.md`; only that public
Markdown, its metadata, and a sibling `assets/` directory can enter the app's
`dist/` artifact.

## Key Terms

- **Draft workspace:** the `draft/` directory where outlines, prose versions,
  voice experiments, and attempts to clarify the article's ideas can evolve
  freely.
- **Notes:** durable observations, interview material, feedback, and retired
  directions worth preserving outside the active draft workspace.
- **Research:** source analysis, fact-checking, limitations, and competing
  evidence used to test the article's claims.
- **Draft:** any private experimental material beneath `draft/`; it is never
  selected by the publisher.
- **Article:** explicit public Markdown stored as `article.md`.
- **Frontmatter:** YAML metadata containing `title`, `description`,
  `publishedAt`, and optional `updatedAt` and `tags`.

## Articles

The articles now form a coordinated sequence. Their directory names remain
unnumbered so editorial order can change without destabilizing paths.

| Order | Workspace | Subject | Status |
| --- | --- | --- | --- |
| 1 | [solutions-meaning-and-value](./solutions-meaning-and-value/) | **Solutions, Meaning, and Value:** AI problem fit, functional cognition, agency, meaning, and theories of value | Draft 3 outline in progress; Draft 2 retained as source material and prior product-opportunity outline preserved in notes |
| 2 | [truth-entropy-and-inference](./truth-entropy-and-inference/) | **Truth, Entropy, and Inference:** truth practices, predictive language, code constraints, and domain fluency | Draft outline in progress; inherited research and visuals need expansion |
| 3 | [understanding-is-the-bottleneck](./understanding-is-the-bottleneck/) | **Understanding Is the Bottleneck:** leaders who distill meaning and multiply team solutioning | Draft outline in progress |
| 4 | [the-knowledge-factory](./the-knowledge-factory/) | **The Knowledge Factory:** distributed solutioning, factory engineers, graph context, and reusable organizational capital | Draft outline in progress |
| 5 | [the-factory-ontology](./the-factory-ontology/) | **The Factory — Ontology:** human domain mapping, in-context learning, controlled language, and semantic infrastructure | Draft outline and research in progress |
| 6 | [the-factory-strategy](./the-factory-strategy/) | **The Factory — Strategy:** narrative, customer empathy, adversarial and diplomatic opportunity, feedback, and the organizational second brain | Draft outline in progress; research queue established |

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
    ├── draft/
    │   ├── outline.md       (optional working structure)
    │   ├── draft-1.md       (optional prose experiment)
    │   └── voice-notes.md   (optional voice experiment)
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

### `draft/`

Use the singular `draft/` directory as the article's active workshop. Experiment
there with outlines, prose versions, structure, voice, examples, counterclaims,
and attempts to clarify the central ideas. Nothing inside it is canonical or
public, and its filenames and organization may change as the article develops.

### `notes/`

Use notes for supporting material that should remain stable while the active
draft changes: author observations, anecdotes, interview material, feedback,
and retired directions worth preserving. Prefer descriptive kebab-case names
such as `customer-interview-notes.md` or `retired-opening.md`.

### `research/`

Use research for evidence reviews, source summaries, fact-checking, study
limitations, citations, quotations, and counterarguments. Clearly distinguish
a source's findings from the author's interpretation, and verify primary
sources before promoting a claim into `article.md`.

## Working Conventions

- Keep one singular `draft/` workspace in every article directory.
- Develop outlines, prose, voice, and idea clarification inside `draft/` without
  treating any one working file as canonical.
- Keep durable supporting material and retired directions in `notes/`; keep
  evidentiary work in `research/`.
- Preserve uncertainty, counterevidence, and source limitations.
- Treat videos and secondary summaries as research leads; prefer primary
  sources for publication claims.
- Keep all experimental authoring material in `draft/` until publication is
  intentional.
- Use stable, unnumbered kebab-case directory names for articles.

## Adding an Article

Create a stable kebab-case directory with the standard private artifacts:

```text
new-article-slug/
├── draft/
├── notes/
└── research/
```

Add `article.md` and optional `assets/` only when the content is intentionally
public, then add the workspace to the inventory above. Ordering belongs in
editorial planning rather than the filesystem name.
