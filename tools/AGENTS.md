# Content Tools Agent Contract

## Operational Flow

Read the selected tool contract, keep its UI and CLI on the same domain model,
and require explicit workspace-contained input and output paths for generation.

## Required Verification Parameters Within Nested Context

Run `typecheck` and unit `test`. When generator behavior changes, run `gen`
against a valid fixture and inspect both emitted artifacts.

## Required Invariants Within Folder Context

Tools do not publish or deploy themselves. They do not import another tool's
source, and generation never writes outside the workspace.
