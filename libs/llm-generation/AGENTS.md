# LLM Generation Agent Contract

## Operational Flow

Keep deterministic example traces and stage metadata in the model, playback
transitions in the reducer, and consumer-facing React APIs only through the
package root. Consumers supply the page shell and import the component
stylesheet through the package export.

## Required Verification Parameters Within Nested Context

Run `llm-generation:typecheck` and `llm-generation:test` for library changes.
Run every consumer app's `typecheck`, `test`, and `publish` targets when
changing runtime components, styles, or the package contract.

## Required Invariants Within Folder Context

The component remains explanatory rather than simulational, generation never
includes training-only backpropagation, learned parameters and temporary
activations remain distinguishable without color, and deterministic examples
do not depend on randomness, services, or model APIs. The library never
imports application or tool source.
