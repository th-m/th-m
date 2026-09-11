# Content Tools Agent Contract

## Operational Flow

Read the selected tool contract, keep its UI and CLI on the same domain model,
and require explicit workspace-contained input and output paths for generation.

## Required Verification Parameters Within Nested Context

Run the owner's `typecheck` and unit `test`. When a supported generator
changes, run its documented target against a valid fixture and inspect its
outputs. The `set-theory` workbench has no `gen` target.

## Required Invariants Within Folder Context

Tools do not publish or deploy themselves. They do not import another tool's
source, and generation never writes outside the workspace.

## Downlinks

- [knowledge](knowledge/AGENTS.md)
- [set-theory](set-theory/AGENTS.md)
- [topology](topology/AGENTS.md)
