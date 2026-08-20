# LLM Visualization

## Purpose

`@th-m/llm-visualization` provides reusable React components for explaining
decoder-only language-model inference and exploring a deterministic
transformer learning lab. It uses local illustrative values and makes no live
model calls.

## Ontology

The library separates the scientific stage model, deterministic scenario data,
lab transforms, interaction reducers, and responsive rendering. Learned
parameters and temporary activations are explicit semantic kinds. The lab runs
its small BPE transform, parameter counting, softmax, and top-p math locally;
its loss and text checkpoints are seeded teaching traces. A consumer supplies
the page shell and imports the component stylesheet through the package export.

## Key Terms

- **Stage:** one explanatory transformation in the forward-pass sequence.
- **View:** a focused rendering of the pipeline, attention, feed-forward
  computation, or autoregressive loop.
- **Learned parameter:** a persistent weight changed during training and reused
  across inference requests.
- **Activation:** temporary request-specific data produced during a forward
  pass.
- **Illustrative tensor:** a deterministic, small value set chosen for teaching,
  not a production-model trace.
- **Teaching trace:** deterministic loss and text progression that explains the
  shape of training telemetry without claiming to train model weights.
- **Workbench:** the reusable switch between the guided inference trace and the
  configurable transformer lab.

## Public API

Import `LanguageModelWorkbench` for the complete default experience,
`NeuralNetworkVisualization` for the guided inference trace, or
`TransformerLab` for the configurable laboratory. Each component and its
minimal prop types are exported from `@th-m/llm-visualization`. Import
`@th-m/llm-visualization/styles.css` once in the web consumer after the THOM
design-theme CSS.

## Reference Model

The laboratory interaction model is informed by
[`w3cj/how-llms-work`](https://github.com/w3cj/how-llms-work), especially its
configurable transformer training tool, architecture summary, epoch telemetry,
and generated sample checkpoints. This library independently implements a
frontend-only teaching instrument: it does not copy the reference's server,
worker-thread training runtime, persisted weights, or claim equivalent model
training.
