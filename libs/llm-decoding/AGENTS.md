# LLM Decoding Agent Contract

## Operational Flow

Keep fixed teaching data in the model, pure decoding math in the math module,
interaction selection in the reducer, and consumer-facing React APIs only
through the package root. Consumers supply the page shell and import the
component stylesheet through the package export.

## Required Verification Parameters Within Nested Context

Run `llm-decoding:typecheck` and `llm-decoding:test` for library changes. Run
every consumer app's `typecheck`, `test`, and `publish` targets when changing
runtime components, styles, or the package contract.

## Required Invariants Within Folder Context

The component remains explanatory rather than simulational, decoding examples
use fixed illustrative logits, sampling outcomes are seeded and deterministic
rather than random, and the library never imports application or tool source.
