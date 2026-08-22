# Libraries

## Purpose

`libs/` contains reusable, non-deployable capabilities shared by apps and
tools.

## Ontology

A library has a typed public API and no independently started runtime. Design
tokens live in `design-theme`; reusable THOM identity components and geometry
live in `thom-brand`; the browser-safe tokenizer visualization lives in
`tokenizer-visualization`; reusable verification support lives in `testing`;
the essays' editorial content, publication pipeline, and content artifact
live in `blogs`; and the deterministic LLM teaching instrumentals live in
`llm-visualization` (guided inference trace and transformer lab),
`llm-generation` (token-by-token generation playback), `llm-decoding`
(decoding strategies), and `llm-training` (a training-loop walkthrough).

## Key Terms

- **Public API:** the exports consumers may depend on.
- **Design foundation:** shared visual tokens without product-specific layout.
- **Testing support:** reusable fixtures and configuration, not owner-specific
  product expectations.
