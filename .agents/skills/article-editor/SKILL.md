---
name: article-editor
description: Assess an article's primary and additional question-answer-steps Core Trinities, then coordinate five specialist subagents and synthesize their evidence into prioritized editorial feedback. Use for a comprehensive multi-framework article review or editorial panel. Do not use for a single-framework review or routine revision without parallel synthesis.
---

# Article Editor

Run a five-lens editorial review, then turn overlapping specialist reports into
one coherent set of feedback. The coordinator owns the final judgment; subagent
results are evidence, not votes.

## Establish the Shared Brief

Identify the exact article source, revision, intended audience, purpose, draft
stage, and requested feedback depth. Ensure every reviewer reads the same source
snapshot. For a repository article, distinguish canonical prose from drafts,
research, and private notes before dispatch.

Infer missing audience, purpose, stage, or scope from the canonical source,
frontmatter, and repository context when the inference is unlikely to change the
review. Label those assumptions in the shared brief. Ask the user only when an
unresolved ambiguity would materially change what the reviewers evaluate.

Default to feedback only. Review agents remain read-only, and the coordinator
does not revise the article, register assets, publish, commit, or push unless the
user separately authorizes that work.

Read [the review contract](references/review-contract.md) and follow
[thm-team](../thm-team/SKILL.md) for delegation and integration boundaries.

## Assess the Core Trinity First

Before dispatching specialists, read the complete article and identify its
**Core Trinity**:

- **Question:** the problem, question, or theme the author asks the reader to
  consider;
- **Answer:** the author's main response, solution, or position;
- **Steps:** the ordered arguments, examples, distinctions, or sections that
  move the reader from the question to the answer.

Locate each component in the text and assess it independently as **Clear**,
**Strained**, **Broken**, or **N/O**. Test whether the answer responds to the
same question and whether the steps make that answer feel earned. Do not infer
clarity from notes or author context that the reader cannot see.

Identify additional trinities only when a passage has its own distinct question,
answer, and supporting path. Classify each as nested beneath the primary
trinity, parallel to it, or competing with it. Rhetorical questions, examples,
and section topics are not separate trinities unless they complete all three
parts. Evaluate every qualifying trinity separately, then test whether their
relationships are legible and whether each one advances the article's primary
answer.

Record this as a provisional, evidence-located map before delegation. Give it
to reviewers as a hypothesis to confirm, refine, or challenge—not as an answer
they must adopt.

## Dispatch Five Specialist Reviews

Create one independent assignment for each skill:

1. [essay-architecture](../essay-architecture/SKILL.md)
2. [draft-clarity](../draft-clarity/SKILL.md)
3. [writing-hacks](../writing-hacks/SKILL.md)
4. [clarity-techniques](../clarity-techniques/SKILL.md)
5. [article-flow-diagram](../article-flow-diagram/SKILL.md)

Give every reviewer the shared brief, its exact skill path, the article path or
content, the provisional Core Trinity map, the normalized return schema, and a
read-only stop condition. Ask each reviewer to apply its own skill completely,
tag findings to the affected trinity when applicable, and challenge unsupported
parts of the provisional map rather than approximating either rubric.

Use available subagent coordination rather than creating separate user-owned
tasks. Dispatch independent reviews in parallel up to the supported concurrency;
when fewer than five worker slots are available, run them in waves. If subagents
are unavailable, perform the five reviews sequentially and disclose that the
results lack independent context.

## Collect Complete Returns

Wait for all five assignments before synthesis. A reviewer return must include
its framework verdict, strengths, evidence-located findings, reader effects,
recommended moves, uncertainties, and native artifact such as the information-
flow diagram.

Retry a failed or incomplete assignment once with the missing requirement made
explicit. If the retry still does not produce a complete return, complete that
lens sequentially or mark it unavailable and record the final blocker; do not
silently synthesize four reviews as five.

## Synthesize, Do Not Concatenate

Reconcile the provisional Core Trinity map against the five independent returns.
Explain material changes rather than replacing the baseline silently. Normalize
findings, then cluster them by affected trinity, passage, and likely root cause.
Merge duplicate symptoms while preserving the independent frameworks that
observed them. Prefer an upstream explanation when it accounts for downstream
friction, but retain local findings that need separate action.

Resolve recommendations against the article's audience, purpose, evidence, and
scale. Treat disagreements—such as repetition versus variation, active versus
passive voice, early thesis versus delayed reveal, or explicit signposting
versus immersion—as editorial tradeoffs. Explain the choice or leave it as a
decision for the author; do not manufacture consensus.

Rank feedback by reader cost, architectural reach, confidence, and dependency.
Do not average unlike numeric scores or let repeated wording count as additional
evidence. Preserve mechanisms that multiple reviewers identify as strengths.

## Deliver One Editorial Report

Return:

1. **Core Trinity assessment:** the primary and every qualifying secondary
   trinity, with evidence locations, separate Question/Answer/Steps clarity
   states, relationships, and the highest-cost break in each.
2. **Editor's verdict:** the article's promise, strongest mechanism, and central
   constraint.
3. **Preserve:** the choices that already work and should survive revision.
4. **Priority feedback:** no more than five root-cause clusters with affected
   trinity, locations, corroborating frameworks, evidence, reader effect,
   recommended move, and tradeoff.
5. **Information-flow diagram:** the diagram from the article-flow review, with
   only the context needed to interpret it.
6. **Disagreements and decisions:** material conflicts among reviewers and the
   coordinator's resolution or author-facing choice.
7. **Revision sequence:** an ordered pass from upstream structure to dependent
   local prose, without implementing it unless requested.
8. **Framework appendix:** one concise verdict from each specialist plus every
   unique material finding omitted from the priority table. Attach or link the
   complete native reports when their detail would otherwise be lost. Record
   unavailable or uncertain coverage.
9. **Verification boundary:** factual, sourcing, audience, and intent questions
   these editorial reviews cannot establish.

If the user later requests revision, choose one integration writer, apply the
accepted priorities in dependency order, and rerun only the specialist lenses
affected by the changes before final owner verification.
