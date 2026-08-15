# THOM Logo Balance Implementation Plan

This plan implements the deterministic workflow in
`docs/logo-balance-orchestrator-handoff.md`. The handoff remains authoritative
if this tracking document and the handoff ever differ.

## Work plan

- [x] Freeze a harness-only baseline with deterministic 8x linear-light
  measurements, multiscale reports, temporal H frames, and comparison images.
- [ ] Create four isolated branches and worktrees from that exact baseline.
- [ ] Run exactly four specialist variants: ink budget, source stroke energy,
  spatial moments/counters/gaps, and temporal/multiscale balance.
- [ ] Require each specialist to provide implementation, JSON metrics, visual
  evidence, changed parameters, and validation output.
- [ ] Score all variants with the shared objective and reject every invariant
  violation before considering aggregate score.
- [ ] Reproduce only compatible winning decisions on the synthesis branch.
- [ ] Iterate on the full acceptance suite and visual comparison until every
  deterministic threshold passes or a genuine blocker is documented.
- [ ] Commit generated assets, measurements, screenshots, tests, scorecard, and
  decision record; open a ready-for-review PR and do not merge it.

## Fixed branch topology

```mermaid
flowchart LR
  H["codex/logo-balance-harness"] --> I["ink-budget worktree"]
  H --> E["stroke-energy worktree"]
  H --> S["spatial worktree"]
  H --> M["motion worktree"]
  I --> C["shared scorecard"]
  E --> C
  S --> C
  M --> C
  C --> Y["codex/logo-balance-synthesis"]
  Y --> Q["acceptance + visual QA"]
  Q --> P["ready-for-review PR"]
```

## Current status

The shared measurement harness is deterministic and validated by typecheck and
the full unit/component suite. Baseline balancing parameters remain unchanged.
