# Embedding Space

## Purpose

`@th-m/embedding-space` provides a reusable, accessible React visualization
for explaining static decoder-token embeddings, fixed-basis projection, cosine
neighborhoods, explicit vector transformations, and a small co-occurrence
teaching model. Its two modes separate production-token inspection from the
pedagogical training objective.

## Ontology

The library separates licensed source vectors and deterministic projection
metadata from vector math, interaction state, and presentation. The default
scenario is a curated excerpt of GPT-2's learned 768-dimensional input token
embedding table. Single-token entries are model parameters; multi-token
entries are clearly marked mean-pooled teaching composites. PCA supplies one
fixed two-dimensional projection basis, while similarity and transformations
remain in the original 768-dimensional source space.

For browser delivery, generated tensor values are rounded to four decimal
places. This preserves dimensionality and stable neighborhood ordering for the
curated teaching scenario while keeping the offline artifact compact.

## Key Terms

- **Static token embedding:** A learned input-table row for one GPT-2 token.
- **Teaching composite:** The mean of multiple static token rows; GPT-2 does not
  store it as one universal word or concept vector.
- **Source space:** The original 768-dimensional coordinate system.
- **Projection:** A deterministic, lossy 2D PCA view of the curated source
  vectors.
- **Transformation:** An explicit source-space offset that is subsequently
  projected through the same fixed basis.
- **Explore mode:** The precomputed GPT-2 token atlas, source-space neighbors,
  and explicit 768D transformations.
- **Train mode:** A visibly progressive replay of deterministic skip-gram with
  negative-sampling checkpoints, learned vectors, similarities, and analogies.
- **Public API:** `EmbeddingSpaceVisualization`, the default scenario, typed
  Explore and Train datasets, typed configuration, search/query helpers, and
  framework-independent vector math. Advanced training-only exports are
  available from `@th-m/embedding-space/training` so the default Explore entry
  can load checkpoint data only when Train mode is opened.

## Data and License

The generated dataset uses the `wte.weight` tensor and GPT-2 byte-pair
vocabulary from
[`openai-community/gpt2`](https://huggingface.co/openai-community/gpt2),
published under OpenAI's Modified MIT License. See
[`LICENSE-GPT2.txt`](LICENSE-GPT2.txt). No model or network call runs in the
browser.

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

The teaching corpus is original to this project. A deterministic Bun script
trains a compact skip-gram model with negative sampling and stores checkpoints
for an offline browser replay. This demonstrates how co-occurrence can shape
neighborhoods; it does not claim that GPT-2 or production decoder LLMs are
trained with Word2Vec.
