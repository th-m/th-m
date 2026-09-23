# Repository Skills

## Purpose

This directory owns reusable th-m procedures. The [root contract](../../AGENTS.md)
routes work here.

## Boundaries

Skills describe procedures. They do not own production source, replace owner
contracts, expose tools, or enforce permissions. Unrelated personal skills
remain outside the repository.

## Ontology

| Skill | Responsibility |
| --- | --- |
| [article-editor](article-editor/SKILL.md) | Map primary and additional question-answer-steps trinities, then coordinate five specialist reviews and synthesize prioritized feedback. |
| [article-flow-diagram](article-flow-diagram/SKILL.md) | Critique topic-comment progression and diagram elaboration, linking, taxonomy, or theme-preview structure. |
| [clarity-techniques](clarity-techniques/SKILL.md) | Evaluate sentence, paragraph, and idea-level clarity with a nine-technique framework. |
| [draft-clarity](draft-clarity/SKILL.md) | Diagnose cold-reader clarity and logical support in messy point-driven nonfiction drafts. |
| [essay-architecture](essay-architecture/SKILL.md) | Evaluate essay design across Idea, Form, Voice, and their 27 diagnostic patterns. |
| [thm-repo-docs](thm-repo-docs/SKILL.md) | Align ontology and operating contracts with current source. |
| [thm-team](thm-team/SKILL.md) | Divide a brief into assignments and integrate verified results. |
| [thm-blog-authoring](thm-blog-authoring/SKILL.md) | Produce the requested editorial draft or local publication package. |
| [thom-diagrams](thom-diagrams/SKILL.md) | Create editorial and technical diagrams with THOM themes and controlled animation. |
| [writing-hacks](writing-hacks/SKILL.md) | Improve reader flow through topic alignment, information order, vividness, and earned signposting. |

A skill has a `SKILL.md` with a name, selection description, and procedure.
It links owner contracts rather than cloning rules. Coordination and domain
skills can work together because they own different responsibilities.

The named **Thom Blog** roster lives in the root
[role graph](../../agents-graph.json); `thm-team` owns how its roles coordinate.

## Key Terms

- **Procedure:** reusable guidance for one class of task.
- **Cold reader:** intended reader limited to concepts and relationships established in the draft.
- **Pattern:** recurring essay-design problem with multiple valid solutions.
- **Topic/comment:** familiar entry point and new contribution within one unit of prose.
- **Role:** team responsibility, independent of an execution instance.
- **Owner:** project or routing boundary accountable for changed files.
- **Return:** assignment evidence and artifacts awaiting integration.
