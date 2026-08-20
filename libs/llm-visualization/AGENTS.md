# LLM Visualization Agent Contract

## Operational Flow

Keep scientific content and deterministic examples in the stage model, keep
interaction transitions in the reducer, and expose consumer-facing React APIs
only through the package root.

## Required Verification Parameters Within Nested Context

Run `llm-visualization:typecheck` and `llm-visualization:test`. Run every
consumer app's `typecheck`, `test`, and `publish` targets when changing runtime
components, styles, or the package contract.

## Required Invariants Within Folder Context

The component remains explanatory rather than simulational, inference never
includes training-only backpropagation, learned parameters and temporary
activations remain distinguishable without color, and deterministic examples
do not depend on randomness, services, or model APIs.
