# Five-Lens Editorial Review Contract

Use this contract to keep five independent reviews comparable without erasing
their distinct methods.

## Shared Brief

Every assignment receives:

| Field | Required content |
| --- | --- |
| Outcome | Comprehensive feedback synthesized by the coordinator. |
| Source | Exact article path or supplied text and the revision being reviewed. |
| Audience | Intended reader and assumed prior knowledge. |
| Purpose | Point, question, or problem the article is meant to address. |
| Stage | Exploratory draft, private draft, canonical article, or other explicit state. |
| Scope | Whole article or named sections; evaluation only unless revision is separately authorized. |
| Evidence | Stable line, paragraph, or section locators available to all reviewers. |
| Core Trinity | Coordinator's provisional primary and qualifying nested, parallel, or competing question-answer-steps units. |
| Stop condition | Return findings without editing source or creating publishable artifacts. |

For repository content, the coordinator records the canonical path and current
revision before dispatch. Notes can explain intent but do not count as clarity
or evidence present in the article.

Infer missing brief fields from the canonical source, frontmatter, and repository
context when doing so is unlikely to change the review. Label every inferred
field. Ask the user only when plausible alternatives would materially change the
review scope or judgment.

## Core Trinity Baseline

The coordinator creates this baseline before specialist dispatch. It is a
text-grounded hypothesis, not a claim about private authorial intent.

For the primary trinity and every qualifying secondary trinity, record:

| Field | Required content |
| --- | --- |
| ID | Stable label such as `T1` or `T1.1`. |
| Role | Primary, nested, parallel, or competing. |
| Scope | Article, section, or argument-thread boundary with stable locators. |
| Question | The problem, question, or theme the prose establishes. |
| Answer | The response or position the prose asks the reader to accept. |
| Steps | The ordered reasoning, evidence, examples, or sections used to reach the answer. |
| Question clarity | Clear, Strained, Broken, or N/O, with evidence and reader effect. |
| Answer clarity | Clear, Strained, Broken, or N/O, with evidence and reader effect. |
| Steps clarity | Clear, Strained, Broken, or N/O, with evidence and reader effect. |
| Relationship | How this trinity advances, qualifies, branches from, or conflicts with another. |

Use **Clear** when the relationship is recoverable without supplying missing
context, **Strained** when it imposes avoidable inference, **Broken** when a
missing or contradictory link prevents reliable understanding, and **N/O**
when the component is not observable. Assess the three components separately;
do not average them into a score.

A candidate counts as another trinity only when all three components exist.
A rhetorical question, example, definition, or section topic remains a step or
subpoint when it lacks its own answer or supporting path. When several trinities
qualify, test both their individual clarity and the clarity of their hierarchy.

## Assignments

| Reviewer | Skill | Unique responsibility |
| --- | --- | --- |
| Architecture | `essay-architecture` | Idea, Form, Voice, and cross-pattern design constraints. |
| Draft clarity | `draft-clarity` | Cold-reader thesis, section logic, point-reason-evidence, and certainty. |
| Reader psychology | `writing-hacks` | Topic continuity, old-to-new handoffs, vividness, and metadiscourse. |
| Clarity techniques | `clarity-techniques` | Character-action grammar, nominalizations, paragraph coherence, and index-discussion structure. |
| Information flow | `article-flow-diagram` | Topic-comment progression, framework fit, and the review diagram. |

These are task-scoped reviewers, not additions to `agents-graph.json`. Each
assignment must name its skill file and instruct the reviewer to read the skill
and required references before evaluating.

## Normalized Reviewer Return

Each reviewer returns its native report plus this compact structure:

### Verdict

- One-paragraph framework verdict.
- Strongest mechanism.
- Highest-cost constraint.

### Findings

For every material finding:

| Field | Meaning |
| --- | --- |
| Trinity | Affected Core Trinity ID, or `cross-cutting` when it spans several. |
| Locator | Stable section, paragraph, or line reference. |
| Observation | What is present in the prose, separated from interpretation. |
| Diagnosis | Framework-specific explanation. |
| Reader effect | Consequence for comprehension, trust, momentum, or memory. |
| Proposed move | Smallest useful structural or verbal change. |
| Dependency | Upstream issue that must be resolved first, if any. |
| Severity | High, medium, or low reader cost. |
| Confidence | High, medium, or low confidence in the interpretation. |
| Preserve | Meaning, voice, evidence, or working mechanism the change must retain. |

### Boundaries

- Assumptions the article does not establish.
- Factual or sourcing questions outside the review.
- Framework elements not observable at the assigned scope.
- Artifacts returned, including the Mermaid diagram from `article-flow-diagram`.
- Confirmed, refined, or challenged parts of the provisional Core Trinity map.

## Synthesis Method

1. Reconcile every material Core Trinity challenge and record the final map.
2. Group findings by affected trinity, then by locator.
3. Within each location, group symptoms that share a plausible root cause.
4. Record every framework that independently supports the cluster.
5. Separate corroboration from duplication: additional frameworks increase
   confidence only when their evidence or mechanism is genuinely independent.
6. Order clusters by dependency, architectural reach, reader cost, and
   confidence.
7. Keep a distinct cluster when a local repair remains necessary after the
   upstream issue is resolved.
8. Preserve disagreements when recommendations optimize different outcomes.

Common cross-framework clusters include:

- vague thesis → weak cohesion, scattered topics, and unearned certainty;
- missing section index → poor transitions, topic drift, and buried main action;
- unstable terminology → weak theme preview, broken handoffs, and cognitive
  overhead;
- abstract evidence → weak material, low vividness, and unclear support;
- excessive signposting → clear navigation but reduced momentum or voice.

These are hypotheses for clustering, not conclusions to impose on every article.

## Final Priority Table

Use this shape for the synthesized report:

| Priority | Trinity | Root issue | Location | Frameworks | Evidence and reader effect | Recommended move | Preserve / tradeoff |
| --- | --- | --- | --- | --- | --- | --- | --- |

Limit the main table to five clusters. Put genuinely unique lower-priority
findings in the framework appendix rather than discarding them or bloating the
main feedback. The appendix must retain every unique material finding, either
directly or through attached or linked native reviewer reports.
