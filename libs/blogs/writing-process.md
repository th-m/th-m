# The writing process

Research → outline → illustrate → write → edit. Each stage hands over files
that the next stage can inspect. Evidence gaps return to research, structural
problems return to the outline, and changed explanations return to the figures.
The sequence gives an essay a first complete pass; revision can revisit earlier
stages without losing the original draft.

The complete draft must be committed and pushed to GitHub before editing starts.
Each meaningful editing pass then gets a separate, descriptive commit and is
pushed so its diff remains visible.

## Artifacts at a glance

Paths below are relative to `libs/blogs/articles/<slug>/`. They describe what a
stage creates on its first pass and what it changes on later passes. File names
such as `draft/article.md` and `notes/edit-review.md` are defaults for new work;
reuse an existing article's equivalent instead of creating competing copies.

| Stage | Creates | Modifies | Ready for the next stage when… |
| --- | --- | --- | --- |
| Research | `research/<topic>.md`: source links, claims, evidence, counterevidence, limitations, and open questions | Existing research notes; `notes/` when an observation changes the article's direction | Planned factual claims have traceable support, and unresolved questions are explicit. |
| Outline | `draft/outline.md`: audience, thesis, scope, section sequence, evidence links, and figure plan | The existing outline; research notes when a gap needs resolving | Each section has a purpose, a claim, supporting material, and any needed visual. |
| Illustrate assets | `draft/figures/`: editable SVG/JSON/TS inputs, candidate exports, and generation receipts | Existing figure sources; public `assets/`, `article-assets.ts`, and component modules when revising a publication-intended figure | The figure explains the intended relationship, labels and sources are checked, and the static and interactive forms are readable. |
| Write | `draft/article.md`: a complete first draft for a new private essay | The active draft; `article.mdx` for an existing public essay; outline, captions, and figure placement as needed | The complete writing baseline and its referenced assets are committed, pushed, and reachable on GitHub. |
| Edit | `notes/edit-review.md`: baseline commit link, findings, rationale, and unresolved issues | The same active prose file, its affected figures and registries, and research when a claim changes | Each meaningful pass has a visible commit and diff, affected checks pass, and unresolved issues are recorded. |

## 1. Research

Start with the article's question and the claims it needs to establish. Prefer
primary sources. Link each source to the specific claim it supports and record
its relevant section or passage when practical. Distinguish observation,
interpretation, and analogy; preserve uncertainty, counterevidence, and source
limitations. A source collection alone does not establish a claim.

Research stays in `research/`; durable observations and retired directions stay
in `notes/`. These are private editorial artifacts. Working material is excluded
from site builds; a GitHub push still shares it according to the repository's
visibility. Revisit the research when writing or editing introduces a new claim.

**Handoff:** the outliner can trace each planned factual claim to evidence and
see which questions remain open.

## 2. Outline

Name the reader, the consequential problem, the controlling thesis, and the
article's scope. Order sections so each develops what the reader has already
learned. For every section, record its point, evidence, concrete example, and
whether a diagram would explain a relationship better than prose alone.

Keep one active outline in the singular `draft/` workspace. Some older articles
have a root `outline.md`; use that existing source rather than silently moving
or duplicating it. Keep the public Sources section last. Preserve retired
directions in `notes/` when their rationale will matter later.

**Handoff:** the writer and illustrator can see what each section must explain
and which sources and figures support it.

## 3. Illustrate assets

Give each figure a teaching purpose, source material, labels, proposed placement,
and caption or alternative text. Use the [THOM diagram workflow](../../tools/diagrams/README.md)
for Diagram Design compositions and Fireworks generators or motion patterns.
Apply THOM tokens, keep labels complete, and preserve the editable source beside
the article. Save tool reports with private working assets when available.

Candidate sources and exports can live in `draft/figures/`. Only intentional
public static files belong in `assets/`; register every one in
`article-assets.ts` with a stable kebab-case ID, kind, tags, and image metadata.
Keep article-specific components and styles beside the MDX or directly in
`components/`, wired through `article-components.tsx`. Reusable rendering and
interaction behavior belongs in `libs/`.

Inspect assets at reading size and in their article context once embedded.
For animation, retain a complete static equivalent and respect reduced motion
in the interactive version. Commit editable sources and corresponding public
outputs together so a changed figure can be understood and reproduced.

**Handoff:** the writer has usable figures, their stable IDs or candidate paths,
and the explanation each one is meant to support.

## 4. Write and save the baseline

Write the complete argument in one active prose file. For a new private essay,
use the active file under `draft/`. Introduce `article.mdx` and
`article-assets.ts` together when publication is intentional. An existing public
essay continues to use its canonical `article.mdx`.

Use concrete subjects and active verbs, precise terms, and examples that make
the consequences visible. Lead a section with its point, then develop it. Link
familiar information to the next idea and place explanations beside the figures
they explain. Keep the Sources section last. These prose principles are already
used in the article-specific `notes/writing-guidelines-review.md` reviews.

Before editing begins:

1. Finish the writing pass, including the introduction, body, ending, sources,
   and intended figure placement. Label unresolved factual issues explicitly.
2. Review the article-scoped diff and stage its prose, supporting material, and
   referenced asset changes. Keep unrelated workspace changes outside this commit.
3. Create a descriptive baseline commit, for example
   `writing(<slug>): complete first draft`.
4. Push that commit to the working branch on GitHub. Verify the branch contains
   the baseline SHA; a local commit or attempted push alone is insufficient.
5. Record the baseline SHA and GitHub commit link in the edit review. Begin
   editorial changes only after the baseline is reachable remotely.

If the draft is already committed and reachable on GitHub, reuse that commit
as the baseline. If remote access fails, keep the baseline and record the
blocker; preparatory review notes can continue while prose editing waits for
the checkpoint or an explicit change to this convention.

**Handoff:** the editor can open the exact pre-edit draft on GitHub and compare
every subsequent revision against it.

## 5. Edit with visible history

Start from the saved baseline and record review findings in `notes/`. Review
structure and argument first, then clarity and voice, then copy and presentation.
Preserve the author's intended thesis and uncertainty. Support, narrow, or remove
unsupported claims; new factual claims return to research. A review-only request
produces notes and proposed wording until applying edits is in scope.

A **meaningful edit** changes the thesis or a claim, section structure,
substantial wording or voice, the interpretation of evidence, or what a figure
communicates. Give each coherent pass its own commit and push it to GitHub.
Explain the reason in the commit message or review note. Small related spelling
and punctuation fixes can share one copy-edit commit.

Example history, with illustrative messages rather than actual repository SHAs:

```text
writing(<slug>): complete first draft
edit(<slug>): move the example before the abstraction
edit(<slug>): qualify the claim with counterevidence
edit(<slug>): simplify figure labels and matching prose
edit(<slug>): correct copy and source links
```

Preserve the baseline and meaningful revision commits when integrating the work;
a squash that removes those checkpoints would defeat this convention. A branch,
commit link, and baseline-to-current diff make the history reviewable. Revisions
remain in the active file; Git supplies earlier versions.

Verify the artifact that changed: run the owning project's typecheck and tests,
regenerate changed diagrams, and inspect the rendered article for reader-visible
changes. Run `blogs:publish` for public article inputs and the portfolio checks
required by the [article agent contract](articles/AGENTS.md). Record failures
and remaining editorial questions alongside the result.

**Handoff:** the edited text, assets, review rationale, and GitHub history agree.

## Convention status and publication boundary

The article directory structure, canonical MDX/registry contract, primary-source
preference, private build exclusions, and Sources-last convention come from the
[existing article workspace contract](articles/README.md). The commit-before-edit
and meaningful-revision rules above document Thom's requested workflow. The
default working filenames and stage handoffs make that workflow concrete; they
do not rename existing articles.

Git checkpoints are applied by the author or agent. They are not currently
enforced by a Git hook or CI check. This document does not claim any article
has passed them. `blogs:publish` produces a local artifact; GitHub sync, a local
preview, and remote site deployment are distinct outcomes.

The [diagram source](../../tools/diagrams/examples/writing-process.svg) summarizes
this process. Generate its offline preview and static exports with:

```sh
bun run nx run diagrams:gen -- --engine diagram-design --input tools/diagrams/examples/writing-process.svg --output tools/diagrams/dist/writing-process --motion flow
```
