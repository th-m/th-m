# LLM Learning Resources: Interactive Visualizations

A curated set of interactive web tools that explain how large language models
work, with an emphasis on **inference** — the token-by-token generation loop in
which the model repeatedly turns the current context into a probability
distribution over the next token.

The tools fall into two broad families:

- **Schematic walkthroughs:** hand-built teaching visuals that step through the
  transformer forward pass with illustrative values. Great for comprehension;
  they do not run a real model.
- **Live-model demos:** real LLM weights running in the browser. You watch
  actual inference — live attention, logits, and sampling — but the internals
  are only as legible as the tool makes them.

## Guided walkthroughs (schematic)

- **[LLM Visualization (Brendan Bycroft)](https://bbycroft.net/llm)** — the gold
  standard: a 3D, click-through of a GPT-style transformer forward pass
  (tokenization → embedding → attention → feed-forward → softmax → sampling).
  You watch one token get predicted, see it appended to the input, and repeat —
  literally inference, step by step. Fully in-browser and free.
  GitHub mirror: [shauryashaurya/bbycroft-llm-viz](https://github.com/shauryashaurya/bbycroft-llm-viz).
- **[LLM Explorer (hrmnns)](https://github.com/hrmnns/llm-explorer)** — a
  browser-based learning environment that walks through tokenization,
  embeddings, attention, logits, and decoding step by step, with something to
  tweak at every stage.
- **[Animated LLM (kasnerz)](https://github.com/kasnerz/animated-llm)** — D3.js
  + GSAP animated explanations of how LLMs generate text. Presented at an NLP
  teaching workshop: [paper PDF](https://aclanthology.org/anthology-files/pdf/teachingnlp/2026.teachingnlp-1.1.pdf).
- **[Microgpt](https://hn.nuxt.dev/item/47026186)** — a small GPT you can
  visualize in the browser (Show HN). Related explainer for Karpathy's
  microGPT: [Sjs2332/microGPT_Visualizer](https://github.com/Sjs2332/microGPT_Visualizer).

## Live-model demos (real inference in the browser)

- **[Transformer Explainer (Georgia Tech / poloclub)](https://github.com/poloclub/transformer-explainer)**
  — runs a real GPT-2 in the browser (ONNX/WASM). Type a prompt and watch the
  actual attention heads light up, the logits, and the top-k candidate tokens
  with probabilities *as the model genuinely generates*. Adjust temperature and
  sampling and see the output change. Paper:
  [ACM DL](https://dl.acm.org/doi/10.1145/3772318.3791725).
- **[logprobs (joelochlann)](https://github.com/joelochlann/logprobs)** —
  visualizes the probability distribution over next tokens for real LLM
  predictions: the core inference decision made visible.
- **[LLM-Xray (swarina)](https://huggingface.co/spaces/swarina/llm-xray)** —
  a Hugging Face Space that inspects a model's internal activations across
  layers during inference.

## Full-scale and research-grade

- **[neuropulse](https://zenodo.org/records/20505471)** — a real-time, 1:1
  visualization of a full-scale LLM forward pass in the browser; much more
  literal about production-sized models than the schematic demos.
- **[WebGPU 3D LLM Visualization](https://www.webgpu.com/showcase/3d-interactive-llm-visualization-gpt-style-transformers/)**
  — a 3D interactive walkthrough of GPT-style transformers rendered on WebGPU
  (signup-gated showcase).

## Inference systems and infrastructure

- **[LLM-Infra-Explorer (skyliulu)](https://github.com/skyliulu/LLM-Infra-Explorer)**
  — less about the math, more about the *serving* side of inference: KV cache,
  batching, prefill/decode stages, and GPU memory. Best pick when "how inference
  works" means the systems angle.

## Curated learning hubs

- **[AI-Beacon (Akashkunwar)](https://github.com/Akashkunwar/AI-Beacon)** — a
  broader interactive learning resource covering LLM internals, useful as a
  starting point beyond inference alone.

## Choosing between them

- Want to *understand the mechanism* cleanly? Start with
  [Bycroft's LLM Visualization](https://bbycroft.net/llm), then
  [LLM Explorer](https://github.com/hrmnns/llm-explorer).
- Want the visceral "this is really the model predicting" feeling? Start with
  [Transformer Explainer](https://github.com/poloclub/transformer-explainer) and
  [logprobs](https://github.com/joelochlann/logprobs).
- Want the serving/engineering reality of inference? Go to
  [LLM-Infra-Explorer](https://github.com/skyliulu/LLM-Infra-Explorer).
