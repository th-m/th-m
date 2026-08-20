# Tokenizer Visualization

## Purpose

`@th-m/tokenizer-visualization` provides two browser-safe views of text
tokenization in a responsive THOM interface:

- a from-scratch BPE laboratory with merge playback, pair rankings, a learned
  vocabulary, and live compression statistics;
- an `o200k_base` inspector with production token IDs, byte fragments, visible
  whitespace, and line breaks.

## Ontology

The learning view pre-tokenizes the supplied corpus, starts with Unicode code
points, and repeatedly merges the most frequent adjacent pair within each
pre-token. Pair frequency is weighted by repeated pre-tokens; ties resolve in
stable corpus order. Its vocabulary is specific to the current sample.

The inspection view fixes its interpretation to OpenAI's `o200k_base`
byte-pair encoding through `gpt-tokenizer`. A model token is an
encoding-specific ID with a byte-preserving display value. Both views use a
deterministic THOM palette assignment whose immediate neighbor is always
different. The consuming app owns only the runtime mount point.

Token boundaries differ across encodings and model families. Results shown by
this library describe `o200k_base`; they are not universal token boundaries.

## Key Terms

- **Encoding:** the vocabulary and byte-pair merge rules used to map text to
  token IDs; the fixed inspector uses `o200k_base`.
- **BPE lab:** the educational tokenizer trained locally from only the supplied
  text. It demonstrates the learning process and is not a model tokenizer.
- **Pre-token:** a Unicode-aware word, individual whitespace character, or
  punctuation character. Learned merges stay inside these boundaries.
- **Merge rule:** a deterministic replacement of the highest-frequency
  adjacent pair with one new learned piece.
- **Token piece:** one token ID plus its decoded display, raw byte description,
  and deterministic accent.
- **Visible whitespace:** a presentation label such as `space`, `tab`, or
  `line break` that does not mutate the token's underlying decoded content.
- **Accent:** one of the six ordered THOM categorical colors.

Import `@th-m/tokenizer-visualization/styles.css` once in the consuming web
application.

The BPE lab is informed by the educational flow in
[`w3cj/how-llms-work`](https://github.com/w3cj/how-llms-work): corpus
pre-tokenization, weighted merge steps, learned vocabulary, final tokens, and
compression. This implementation runs synchronously in the browser instead of
streaming from a server and adds deterministic playback controls and pair
ranking.
