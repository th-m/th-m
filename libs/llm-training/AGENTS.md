# LLM Training Agent Contract

## Operational Flow

Keep deterministic corpus data, step metadata, and the loss trace in the
model, walkthrough transitions in the reducer, and consumer-facing React APIs
only through the package root. Consumers supply the page shell and import the
component stylesheet through the package export.

## Required Verification Parameters Within Nested Context

Run `llm-training:typecheck` and `llm-training:test` for library changes. Run
every consumer app's `typecheck`, `test`, and `publish` targets when changing
runtime components, styles, or the package contract.

## Required Invariants Within Folder Context

The component remains explanatory rather than simulational, training material
stays explicitly labeled as training-only and never appears as an inference
step, and deterministic examples do not depend on randomness, services, or
model APIs. The library never imports application or tool source.
