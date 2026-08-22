# LLM Decoding

## Purpose

`@th-m/llm-decoding` provides a deterministic, browser-only explorer for LLM
decoding strategies. Consumers get a compact interactive that applies greedy,
temperature, top-k, and top-p decoding to one fixed set of next-token logits,
comparing the resulting distributions and selected tokens.

## Ontology

The library separates fixed teaching data, pure decoding math, interaction
state, and React presentation. Candidate logits and strategy descriptions live
in the model; softmax, temperature scaling, top-k, top-p, and seeded sampling
live in the pure math module; the reducer owns strategy and parameter
selection; the component renders everything on the THOM design tokens.

## Key Terms

- **Decoding strategy:** the rule that turns a probability distribution into a
  chosen next token.
- **Logits:** unnormalized preference scores for each candidate token.
- **Allowed set:** the candidates a strategy may select from.
- **Illustrative draw:** a deterministic, seeded sample outcome; the draw
  counter changes it without introducing real randomness.

## Public API

Import `DecodingExplorer` from `@th-m/llm-decoding`, or use the math and model
exports (`applyDecoding`, `softmax`, `topKAllowed`, `topPAllowed`, `baseLogits`)
to drive a custom surface. Import `@th-m/llm-decoding/styles.css` once in the
web consumer after the THOM design-theme CSS.

## Reference Experience

The interaction model is informed by
[`kasnerz/animated-llm`](https://github.com/kasnerz/animated-llm) (MIT),
especially its decoding-algorithms view. This library independently implements
deterministic teaching math on the THOM design system: it does not copy the
reference's code, fonts, assets, data, or live-model traces.
