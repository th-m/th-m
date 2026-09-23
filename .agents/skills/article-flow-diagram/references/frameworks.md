# Topic-Comment Frameworks and Diagram Grammar

This reference adapts the user-supplied notes from a tutorial on four writing
frameworks for clarity and momentum. The shared principle is **old before new**:
a unit begins with a familiar topic and ends with a new comment.

The topic is the reader's doorstep. The comment is the room the sentence or
section opens onto. Familiarity must be earned by prior text, shared audience
knowledge appropriate to the article, or an explicit index.

## Framework Selection

| Framework | Relationship | Best fit | Primary failure |
| --- | --- | --- | --- |
| Elaboration | One topic → several comments | Description or multifaceted development | Stagnation or repetitive accumulation |
| Linking | Comment A → Topic B → Comment B | Process, travel, causality, or method | Drift away from the governing purpose |
| Taxonomy | Named whole → distinct parts | Classification or decomposition | Parts appear unrelated because the whole is implicit |
| Theme preview | Index [A, B, C] → development of A, B, C | Multi-strand argument or section roadmap | Preview terms mutate and become hard to track |

Patterns can mix across sentence, paragraph, section, and article resolutions.
Select at the resolution being evaluated.

## 1. Elaboration

Elaboration holds one topic steady while successive comments reveal different
features, consequences, or dimensions.

```text
TOPIC T → comment 1
TOPIC T → comment 2
TOPIC T → comment 3
```

Pronouns and close equivalents can carry the topic when their referent remains
obvious. Repetition is useful because it stabilizes the reader's position.

Critique questions:

- Is the repeated topic the passage's real center of attention?
- Does each comment add a distinct dimension?
- Does the sequence accumulate toward a point, or merely remain in place?
- Does the passage know when to leave the elaboration pattern?

Source-note range: approximately 259.2s–361.2s.

## 2. Linking

Linking promotes new information from one unit into the familiar topic of the
next, creating visible momentum.

```text
topic A → COMMENT B
          TOPIC B → COMMENT C
                    TOPIC C → comment D
```

The lexical pickup can be exact, pronominal, or a close conceptual restatement,
but the reader must recognize it without reconstructing a hidden inference.

Critique questions:

- Can the reader see each comment-to-topic pickup?
- Does the chain represent a real process, causal relation, or spatial movement?
- Has the chain wandered beyond the original purpose?
- Would returning to the initial topic provide useful closure?

Source-note range: approximately 416.6s–771.4s.

## 3. Taxonomy

Taxonomy names a whole before presenting different parts. The whole makes
otherwise varying sentence topics coherent.

```text
introduction → WHOLE
               ├─ part A → comment
               ├─ part B → comment
               └─ part C → comment
```

The umbrella must be explicit enough that the reader can predict why the parts
belong together. A vague theme inferred only after the list does not provide the
same support.

Critique questions:

- Is the whole named before the parts?
- Do the parts use one defensible basis of classification?
- Are categories parallel, distinct, and collectively useful?
- Does each part visibly reconnect to the whole?

Source-note range: approximately 780.4s–1039.6s.

## 4. Theme Preview

A theme preview uses an index unit to name several strands, then develops those
strands in a recognizable order.

```text
INDEX → [theme A, theme B, theme C]
          ↓        ↓        ↓
       develop A develop B develop C
```

Reuse the exact preview terms or very close morphological variants. Stylish
synonym changes can make readers wonder whether the article introduced a new
theme.

Critique questions:

- Does the index name the real strands at the right level of abstraction?
- Does later development preserve recognizable terms and order?
- Is every previewed theme developed, and is every major development previewed?
- Does the final strand reconnect the set to the article's larger point?

Source-note range: approximately 1119.3s–1270.4s.

## Diagram Grammar

Use a flowchart or relationship map with this semantic vocabulary:

| Concept | Node treatment | Edge label |
| --- | --- | --- |
| Topic / familiar information | Strong border; `T` label | `DEVELOPS` to its comment |
| Comment / new information | Neutral border; `C` label | `PICKS UP` when promoted to a later topic |
| Whole / umbrella | Containing or parent node; `WHOLE` label | `CONTAINS` to parts |
| Preview / index | Focal node; `INDEX` label | `PREVIEWS` to named themes |
| Drift or missing bridge | Dashed warning treatment | `UNPREPARED` or `DROPS` |

Draw reading order left to right when possible. Use one focal path, direct labels,
and orthogonal edges. Keep topics and comments visually distinct without relying
on color alone. Use gold for the principal THOM path only when producing a
branded artifact through `thom-diagrams`.

For Mermaid, use subgraphs to show taxonomy containment or article regions and
solid arrows for observed flow. Use dashed arrows only for inferred, missing, or
recommended relationships, and label them accordingly.
