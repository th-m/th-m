# THOM Tokenizer Agent Contract

## Operational Flow

Keep this application as a thin runtime wrapper around
`@th-m/tokenizer-visualization`; move all reusable behavior and presentation
into the library.

## Required Verification Parameters Within Nested Context

Run `tokenizer:typecheck`, `tokenizer:test`, and `tokenizer:publish` for runtime,
dependency, or build changes.

## Required Invariants Within Folder Context

The app imports the tokenizer only through its package API, publishes solely to
its own `dist/` tree, performs no remote deployment, and adds no server or API
key requirement.
