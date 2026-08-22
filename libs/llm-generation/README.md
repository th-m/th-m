# LLM Generation

## Purpose

`@th-m/llm-generation` provides a deterministic, browser-only animated playback
of token-by-token LLM generation. Consumers get a compact interactive that
walks an example prompt through every inference stage — embedding, attention,
feed-forward, logits, decoding, and the append step — one generated token at a
time, with transport controls, keyboard shortcuts, and autoplay.

## Ontology

The library separates deterministic authored example traces, the playback
state reducer, and the React presentation. Example traces and stage metadata
live in the model; playback transitions (play, pause, tick, step, skip,
example and speed selection) live in the reducer; the component renders both
on the THOM design tokens without owning a page shell.

## Key Terms

- **Generation example:** an authored trace of a prompt plus its generated
  token steps, each with candidate logits, probabilities, attention weights,
  and a short note.
- **Stage:** one explanatory transformation applied per generated token.
- **Trace:** deterministic teaching data, never a recording from a live model.
- **Playback transport:** the play/pause, step, next-token, skip-to-end, and
  reset controls plus autoplay pacing.

## Public API

Import `GenerationPlayback` from `@th-m/llm-generation`, or use the model and
reducer exports to drive a custom surface. Import
`@th-m/llm-generation/styles.css` once in the web consumer after the THOM
design-theme CSS.

## Reference Experience

The interaction model is informed by
[`kasnerz/animated-llm`](https://github.com/kasnerz/animated-llm) (MIT),
especially its text-generation view, keyboard shortcuts, and per-token
playback. This library independently implements a deterministic teaching
instrument on the THOM design system: it does not copy the reference's code,
fonts, assets, data, or live-model traces.
