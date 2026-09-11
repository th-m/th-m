---
name: thm-blog-authoring
description: Research, draft, revise, or prepare a th-m article for local publication using its MDX and asset contracts. Use for editorial deliverables, not general repository documentation or remote deployment.
---

# Author a Blog Deliverable

Read [blogs README](../../../libs/blogs/README.md),
[blogs AGENTS](../../../libs/blogs/AGENTS.md), and the
[article contract](../../../libs/blogs/articles/AGENTS.md). They own paths,
publication eligibility, assets, and verification.

Identify audience, thesis, requested output, and whether canonical local
publication is intentional. Continue the existing article workspace and choose
the requested deliverable before editing:

| Request | Destination and result | Verification route |
| --- | --- | --- |
| Research | `research/` with cited claims, source locators, limitations, and open questions. | Review evidence and links; private research alone does not invoke publication. |
| Private draft | `draft/` with an outline or coherent prose candidate; durable decisions in `notes/`. | Review audience, thesis, evidence, and voice; preserve private status. |
| Revision | Revise the requested draft or canonical article in place. | Follow the checks for that destination; canonical revisions are public-input changes. |
| Canonical local publication | `article.mdx`, `article-assets.ts`, and any registered assets or component wiring. | Run the owner publication checks and applicable portfolio checks on the assembled candidate. |

Research and draft requests do not introduce canonical publication files.
Use stable filenames that describe the material; preserve prior work unless
replacement is requested. Owner contracts remain authoritative for exact
paths, schemas, and verification commands.

Build an outline from evidence. Trace material factual claims to source
locators and dates where relevant; label inference and contradictions. Read
neighboring articles for voice without inheriting their factual claims. Source
counts are not proof.

Develop prose and visuals around the same explanation. Keep semantic scenes
and data with the article; reuse rendering via library APIs. Shared component
changes need a concrete deliverable requirement and owner/consumer checks.

For canonical output, assemble MDX, typed assets, and component wiring as one
candidate. Follow the owner verification matrix and inspect rendering for
presentation changes. No `blog_audit` implementation has been verified here;
use real publication checks for structure and identified editorial review
for clarity and evidence.

Return a coherent deliverable with paths, evidence, checks, and unresolved
items. Use [thm-team](../thm-team/SKILL.md) when delegation is requested. The
same procedure works with one agent. Local publication does not authorize
remote deployment.
