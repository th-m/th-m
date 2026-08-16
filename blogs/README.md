# Blog Posts

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
    ├── outline.md
    ├── notes/
    └── research/
```

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
├── outline.md
├── notes/
└── research/
```

Then add the post to the table above. Do not add numbered prefixes to the directory name; ordering belongs in editorial planning rather than the filesystem path.
