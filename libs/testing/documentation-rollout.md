# Documentation and Skills Rollout

Implementation and verification report, 2026-09-11. This is a point-in-time
record; maintained requirements live in the [workspace contract](../../AGENTS.md)
and owner contracts.

## Implemented

All 31 repository-owned README/AGENTS pairs now use the shared conventions.
READMEs define Purpose, Boundaries, Ontology, and Key Terms; AGENTS files retain
the three operational sections. Command recipes moved into owner contracts,
with conceptual API examples and historical evidence preserved.

| Boundary | Pairs |
| --- | ---: |
| Workspace root | 1 |
| Apps, app owners, and portfolio audit evidence | 4 |
| Libraries, library owners, and nested blog contracts | 20 |
| Tools and tool owners | 4 |
| Netlify delivery documentation | 1 |
| Repository skill catalog | 1 |

The root ontology distinguishes projects, packages, domains, runtimes, targets,
artifacts, roles, and assignments. Parent contracts route to child owners.
Source review corrected stale ownership claims: set rendering belongs to
`set-theory-visualization`, the set-theory tool is a workbench, the graph editor
persists changes while its explorer is read-only, and libraries can own data
generation or editorial commands without owning a deployable product.

The [skill catalog](../../.agents/skills/README.md) routes three procedures:

- `thm-repo-docs`: source-backed contract review and a supporting checklist.
- `thm-team`: scoped assignments, five adaptable responsibilities, one
  integration writer, worker returns, and final acceptance records.
- `thm-blog-authoring`: research, private drafts, revisions, and intentional
  canonical local publication with owner-specific verification.

The earlier [team investigation](../blogs/agent-team-investigation.md) remains
historical research and a runtime proposal. This rollout implements repository
procedures and structural enforcement.

## Enforcement

The [documentation policy](src/documentation-policy.ts) parses Markdown and YAML
to check ordered unique sections, sibling pairing, standalone AGENTS files,
local links, skill metadata, and routing from the root Skills and catalog
Ontology sections. `documentationViolations(root)` retains its public signature
and `{ path, message }` result shape. Generated, dependency, vendor, and cache
trees are excluded; symlinked trees are not traversed.

Remote URLs, fragment anchors, arbitrary historical Markdown, semantic accuracy,
and runtime permissions are outside this check. `testing:test` is uncached so
contracts outside the testing project's dependency graph are checked each run.
The four direct parser/type dependencies already had resolutions in `bun.lock`;
only the testing workspace declarations changed.

## Skill Walkthroughs

These were manual walkthroughs against the written procedures and current
contracts, not independent agent executions or live article publication.

| Scenario | Reviewed outcome |
| --- | --- |
| Correct the set-analysis/rendering ownership documentation | `thm-repo-docs` reads manifests and exports, updates the owner README, preserves commands in AGENTS, and runs policy checks. The correction was applied in this rollout. |
| Rewrite an article introduction | Routes to blog authoring; repository-documentation procedure does not take over editorial prose. |
| Request a Thom Blog team for a private draft | Coordinator defines acceptance; researcher returns cited evidence; writer and designer receive disjoint draft/specification outputs; one writer integrates. Canonical files are outside the private-draft assignment. |
| Fix one README typo | Team coordination is unnecessary; the single owner handles the edit and required check. |
| Research an existing article | Produces evidence under `research/` with uncertainty and locators; does not introduce canonical MDX. |
| Revise canonical MDX and its React figure | Follows article checks for public inputs, local publication, and the portfolio consumer; actual executable results remain distinct from editorial review. |
| Change application routing | Blog authoring does not select itself merely because the app renders articles. |

## Verification

- `bun run nx show projects`: all 22 projects discovered.
- Testing manifest and `bun.lock` workspace declarations match.
- The skill-creator `quick_validate.py` validator passed for all three skills.
- `testing:typecheck` passed. `testing:test` passed all 33 tests, including the
  repository scan and positive/negative fixtures for contract and skill policy.
- `bun run nx run-many -t typecheck test --parallel=3`: 19 projects passed both
  targets (38 successful targets, including 357 passing tests). `ui:typecheck`
  and `ui:test` failed because the existing declared dependency
  `@radix-ui/react-popover` is absent. Nx consequently did not run the blogs
  or portfolio typecheck/test targets.
- `bun run nx run portfolio:publish` was attempted and blocked by the same UI
  prerequisites; the portfolio build is not verified.
- `git diff --check` passed.

Verification reused packages already present in the saved checkout through
ignored local dependency links. Existing font packages were copied into this
worktree's ignored `node_modules` to satisfy Vite's filesystem boundary; the
affected graph, set, and topology suites then passed. No dependencies were
downloaded or installed, and this was not a fresh frozen-lockfile install.

The remaining verification step is to make the already-declared Radix dependency
available under an installation-authorized task, then rerun the UI, blogs, and
portfolio checks and portfolio publication. No product source was changed to
work around that dependency failure.

## Integration with Origin

Before merging into `main`, integrated origin commits `9936f1e` and `895b7f5`,
preserving the article note, writing process, and diagram implementation.
Reconciled the five overlapping contracts and applied the conventions to the
new `diagram-theme` and `diagrams` owners. The catalog now routes four skills,
and the repository has 33 README/AGENTS pairs and 24 Nx projects.

The merged candidate passed `typecheck` and `test` for `testing`,
`diagram-theme`, and `diagrams`, plus their design-theme prerequisites.
The policy suite still passes all 33 tests; the new diagram owners pass 13
tests. The fourth skill also passed the skill-creator validator. The previously
recorded missing Radix dependency remains a limitation on full app verification.
