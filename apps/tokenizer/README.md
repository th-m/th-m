# THOM Tokenizer

## Purpose

This Vite app is the minimal runnable surface for the reusable THOM tokenizer
visualization. Run `bun run nx run tokenizer:start` locally and
`bun run nx run tokenizer:publish` to create its local `dist/` artifact.

## Ontology

The app owns the HTML document, bundled font assets, and React mount point. All
tokenization, token presentation, interaction, and styling belong to
`@th-m/tokenizer-visualization` and are consumed through its public API.

## Key Terms

- **Runtime surface:** the Vite document and React root that make the library
  interactive in a browser.
- **Local publish:** a static `dist/` build; it does not deploy remotely.
- **Tokenizer visualization:** the library-owned synchronized text editor,
  from-scratch BPE learning lab, and `o200k_base` token inspector.
