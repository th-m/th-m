# Tokenizer Visualization Agent Contract

## Operational Flow

Keep BPE training and playback, encoding-specific mapping, deterministic accent
assignment, accessible React presentation, and component styling in this
library. Export consumers through the package boundary and keep runtime
mounting in an application.

## Required Verification Parameters Within Nested Context

Run `tokenizer-visualization:typecheck` and `tokenizer-visualization:test`.
Run the consuming app's `typecheck`, `test`, and `publish` targets for component
or styling changes.

## Required Invariants Within Folder Context

Tokenization remains local and browser-safe, BPE merges resolve ties
deterministically and never cross pre-token boundaries, the public fixed
encoding name stays explicit, adjacent token accents never match, token IDs and
byte content remain deterministic, and the library never imports application
or tool source.
