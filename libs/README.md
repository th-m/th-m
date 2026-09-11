# Libraries

## Purpose

`libs/` contains reusable, non-deployable capabilities shared by apps and
tools.

## Boundaries

Libraries expose reusable public APIs or the explicitly owned blog content
artifact. Apps and tools own product runtime composition. Libraries may own
generation and authoring commands for their data or content. Library names identify
capabilities, not agent roles; runtime and domain tags remain in each manifest.
See the [workspace ontology](../README.md) for shared terms.

## Ontology

A library exposes a public API or content contract without owning a deployable
product. The blogs authoring command opens Obsidian; its publisher builds the
library's local content artifact. Design adapters for editorial and technical
diagrams live in `diagram-theme`, including controlled browser motion. Foundation
tokens live in `design-theme`; reusable THOM identity components and geometry
live in `thom-brand`; the browser-safe tokenizer visualization lives in
`tokenizer-visualization`; the proposition graph domain, editor, explorer, and
dynamic article figure live in `graph-visualization` (with a React-free `core`
entry for CLI generators); the TypeScript set atlas domain, renderers, and
dynamic figure live in `set-theory-visualization` (with a React-free `core`
entry, analysis owned by `knowledge-model`); reusable verification support
lives in `testing`;
the curated laws of UX and software development live in `laws`;
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
