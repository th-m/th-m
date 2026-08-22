# LLM Training

## Purpose

`@th-m/llm-training` provides a deterministic, browser-only walkthrough of the
LLM training loop. Consumers get a compact interactive that moves from a fixed
corpus through next-token prediction, loss, backpropagation, and optimizer
updates, with a simple view and a model view plus a loss curve.

## Ontology

The library separates deterministic teaching data, walkthrough state, and
React presentation. Corpus sentences, step metadata, and the loss trace live in
the model; playback transitions (play, pause, tick, step, mode selection) live
in the reducer; the component renders both on the THOM design tokens without
owning a page shell.

## Key Terms

- **Training mode:** the simple corpus-level walkthrough or the model-level
  forward/backward walkthrough.
- **Step:** one explanatory transformation in the training loop.
- **Loss trace:** a deterministic per-epoch curve of illustrative loss values.
- **Training-only:** backpropagation and optimizer updates belong to training;
  they are never part of ordinary next-token inference.

## Public API

Import `TrainingWalkthrough` from `@th-m/llm-training`, or use the model and
reducer exports to drive a custom surface. Import
`@th-m/llm-training/styles.css` once in the web consumer after the THOM
design-theme CSS.

## Reference Experience

The interaction model is informed by
[`kasnerz/animated-llm`](https://github.com/kasnerz/animated-llm) (MIT),
especially its pretraining views. This library independently implements a
deterministic teaching instrument on the THOM design system: it does not copy
the reference's code, fonts, assets, data, or live-model traces, and it keeps
training material explicitly separate from inference material.
