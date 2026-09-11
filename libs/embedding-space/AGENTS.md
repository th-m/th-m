# Embedding Space Agent Contract

## Operational Flow

Keep source vectors, deterministic projection metadata, vector math, React
presentation, tests, and generation scripts under this owner. Export consumer
contracts through the package root and keep app routes composition-only.

### Composition Review CSV

Generate the reviewer-facing composition inventory to its explicit
library-owned path:

```sh
bun run nx run embedding-space:gen-composition-review -- \
  --output /absolute/path/to/libs/embedding-space/generated/embedding-composition-review.csv
```

The generator enumerates canonical multisets of one to four control terms,
including repeated terms. Because vector addition is order-independent, each
row represents all equivalent slot orders and records their count in
`ordered_permutation_count`. Blank review columns sit beside the current
authored, exact, projected-neighbor, or invalid classification.

### Dataset generation

Regenerate the fixed dataset to an explicit library-owned path:

```sh
bun run nx run embedding-space:gen -- \
  --model /absolute/path/model.safetensors \
  --tokenizer /absolute/path/tokenizer.json \
  --output /absolute/path/to/libs/embedding-space/src/data/gpt2-embedding-space.json
```

Generate the independent skip-gram teaching checkpoints:

```sh
bun run nx run embedding-space:gen-training -- \
  --output /absolute/path/to/libs/embedding-space/src/data/skip-gram-training.json
```

## Required Verification Parameters Within Nested Context

Run `embedding-space:typecheck` and `embedding-space:test`. Smoke-test
`embedding-space:gen` after changes to the source schema, tokenizer mapping,
projection basis, or generated output. Verify affected consumer projects after
public API or stylesheet changes.

Run `embedding-space:gen-training` after changes to the original teaching
corpus, skip-gram optimizer, negative sampler, checkpoint schema, or training
projection.

## Required Invariants Within Folder Context

The browser runtime remains offline and deterministic. Similarity and
transformations use source vectors, then the same fixed projection basis.
Projected distance is never presented as source-space distance, pooled terms
remain visibly distinct from learned token rows, and generated output writes
only to an explicit path inside this library.

The skip-gram teaching model remains explicitly distinct from production LLM
token training. Its checkpoint replay is labeled precomputed and deterministic.
