---
name: thm-team
description: Coordinate an explicitly requested th-m team or parallel assignment from one brief to an integrated result. Use for delegation, not routine single-owner edits or installing an orchestration runtime.
---

# Coordinate a Team

Read the [root contract](../../../AGENTS.md) and owner contracts. Delegate only
when authorized and supported. Otherwise perform responsibilities sequentially
and disclose that limitation. This procedure implements no scheduler or filter.

Turn the brief into an outcome and acceptance list. Keep a short Markdown plan
with owners, dependencies, artifact paths, and verification, reusing an existing
owner-local plan when available. Ask only for missing decisions that matter.

For **Thom Blog**, read the [role graph](../../../agents-graph.json) for the
canonical team name, role IDs, responsibilities, and parent relations. Use only
the roles the brief needs. Parent relations identify delegation responsibility;
the task plan defines dependencies and allowed outputs for each assignment.
The graph's tool deny lists are requested restrictions. No repository runtime
currently loads the graph or enforces those lists.

Adapt roles for other work instead of requiring every role. The coordinator
owns the whole result. Use [thm-blog-authoring](../thm-blog-authoring/SKILL.md)
for editorial procedure.

Give each worker an objective, project owner, prerequisite artifacts, allowed
files, expected outputs, acceptance, and stop conditions. Require a summary,
exact paths, evidence/locators, actual checks, and blockers in the return.
A worker's success claim is only a candidate result.
Use the [delegation template](references/delegation-template.md) for a shared
brief and comparable returns. These are Markdown coordination records, not a
runtime API. Select one integration writer before assigning shared files.

Parallelize independent research or disjoint files. Prefer one integration
writer; isolate overlapping edits in worktrees when warranted. Shared workers
see each other's edits. A role name or deny list is not permission enforcement.

Choose proportional concurrency and attempt limits. Use time/token budgets
only when supported or requested; report unavailable measurements honestly.
Feed concrete failures into repairs and stop repeated identical failures.
Do not reset limits to disguise stalled work.

Collect results, resolve conflicts explicitly, integrate in dependency order,
and run owner verification on the final candidate. Use fresh-context review
for material risk when authorized; separate model judgment from executable
checks. Complete only when the deliverable and mandatory checks are satisfied.
Otherwise return artifacts, unfinished acceptance, and the exact blocker.

Capture accepted corrections in owner contracts when requested or required by
the change. Proposed instruction edits remain separate until accepted.
Commit, push, deployment, and scheduling remain governed by the user's scope.
