# Distributional Meaning, Tokens, and Embeddings

## Reference

The canonical quotation is:

> “You shall know a word by the company it keeps.”

It comes from British linguist **J. R. Firth**, in his 1957 essay
[*A Synopsis of Linguistic Theory, 1930–1955*](https://www.ling.upenn.edu/courses/ling5900/Firth1957.pdf).
The wording “ye shall know them by the company they keep” likely blends Firth's
line with the biblical “by their fruits ye shall know them.”

Firth's idea is commonly associated with **distributional meaning**: part of a
word's meaning can be inferred from the linguistic contexts in which it
repeatedly occurs.

## Relationship to LLMs

The idea maps onto LLMs roughly like this:

```text
Text → tokens → initial embeddings → contextual representations → prediction
```

- A **tokenizer** divides text into processable symbols. These may be words,
  word fragments, punctuation marks, or bytes. Tokenization does not determine
  their meaning.
- An **input embedding** assigns each token ID a learned vector. Before
  contextual processing, the same token normally begins with the same base
  vector.
- During training, the model repeatedly learns how tokens relate to their
  “company”—the tokens appearing around them—because those relationships help
  it predict missing or subsequent tokens.
- **Self-attention** combines a token's initial representation with information
  from its current context, producing a contextual representation. The
  original Transformer paper describes this as mapping token embeddings
  through self-attention into context-sensitive representations:
  [*Attention Is All You Need*](https://papers.neurips.cc/paper/7181-attention-is-all-you-need.pdf).

For example:

```text
The river bank was eroding.
The bank approved the loan.
```

`bank` may begin with the same input embedding, but its contextual
representation becomes different:

```text
river + eroding → geographical-bank representation
approved + loan → financial-bank representation
```

This is Firth's principle made computational: the model resolves what `bank` is
doing by examining the company it keeps. BERT explicitly formalized this as
learning representations conditioned on surrounding context:
[BERT](https://research.google/pubs/bert-pre-training-of-deep-bidirectional-transformers-for-language-understanding/).

## Important Qualification

Embeddings do not simply place words that appear together near each other.
They often place tokens near one another when they occur in **similar
contexts**. This is why antonyms such as `hot` and `cold` can be geometrically
similar: they keep much of the same company despite expressing opposite
values. Earlier systems such as GloVe made the connection explicit by learning
vectors from word–word co-occurrence statistics:
[GloVe](https://nlp.stanford.edu/projects/glove/).

The philosophical boundary is:

> An LLM learns the textual company associated with an experience, not
> necessarily the experience itself.

It can learn that `pain` keeps company with `injury`, `sharp`, `relief`,
`fear`, and `hospital`. That produces a rich representation of how people
describe and respond to pain, but it does not establish that the model feels
pain. Firth's principle explains **distributional or use-based meaning**; it
does not by itself establish phenomenal meaning, reference, understanding, or
subjective awareness.
