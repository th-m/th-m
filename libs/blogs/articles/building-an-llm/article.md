---
title: Building an LLM
description: How text becomes tokens, training turns prediction error into learned weights, embeddings organize those patterns, and inference generates one token at a time.
publishedAt: 2026-08-26
tags: [Artificial Intelligence, Language Models, Machine Learning, Software Systems]
---
# Building an LLM

## Overview

A large language model is a pattern-prediction machine. It receives tokens,
uses learned weights to estimate a probability distribution over possible next
tokens, selects one, appends it to the context, and repeats.

Building that machine requires four different operations that are easy to blur
together:

1. **Input:** a tokenizer converts text into token IDs.
2. **Training:** prediction error changes the model's weights.
3. **Model and embeddings:** the learned weights represent statistical
   regularities in language.
4. **Inference:** fixed weights turn a prompt into one next-token prediction
   after another.

> **Core thesis — Training changes the weights. Inference uses the weights.**
> What the model learns is a structure of conditional patterns: given this
> context, which token is likely to come next?

This is not a complete recipe for producing a frontier model. It leaves out
data acquisition, distributed infrastructure, architecture search,
post-training, evaluation, and deployment. Its purpose is narrower: to make the
computational loop legible from input to generated text.

## 1. Input: Text Becomes Tokens

The model does not receive words directly. A **tokenizer** divides text into
units from a fixed vocabulary and assigns each unit an integer ID. A token may
be a word, part of a word, punctuation, whitespace, or a byte-level fragment.

One influential family of tokenizers uses **byte-pair encoding**. The tokenizer
learns frequently recurring symbol pairs and gives them reusable vocabulary
entries. The same tokenizer must be used to encode the prompt and decode the
generated token IDs back into text.

```text
text → tokenizer → token IDs
token IDs → tokenizer decoder → text
```

Tokenization is reversible, but it is not semantically neutral. Different
vocabularies divide the same sentence differently, changing sequence length
and the units whose relationships the model must learn.

For a sequence of tokens `x₁, x₂, …, xₙ`, a decoder language model is trained
to estimate:

```text
P(xₜ | x₁, x₂, …, xₜ₋₁)
```

Every position asks the same question: given the tokens so far, what token
came next in the training text?

## 2. Training: Prediction Error Changes Weights

During pretraining, almost every token becomes the answer to a prediction made
from its preceding context. Given:

> The cat sat on the …

the model might assign:

| Possible next token | Probability |
| --- | ---: |
| `mat` | 70% |
| `floor` | 15% |
| `chair` | 5% |
| everything else | 10% |

If the observed training text continues with `mat`, cross-entropy loss scores
the probability assigned to that token:

```text
loss = -ln P(observed token)
```

A high probability for the observed token produces a small loss. A low
probability produces a large one. The training loop then repeats three steps:

1. The **loss function** measures the prediction error.
2. **Backpropagation** identifies how the parameters contributed to that
   error.
3. The **optimizer** adjusts the parameters to improve future predictions.

```text
context → token probabilities → observed token → loss
→ backpropagation → updated weights
```

Repeated across an enormous body of text, this process adjusts billions of
parameters. It does not store the corpus as a searchable collection of
sentences. It distills statistical regularities into weights that make some
continuations more likely than others.

Training can continue through instruction tuning, preference optimization, or
other post-training methods. Those methods change which behaviors the model
reliably produces, but they still work by changing parameters before ordinary
inference begins.

## 3. The Model: Learned Weights and Embeddings

The trained model combines an architecture with learned parameters:

- **embeddings** map token IDs into learned numerical representations;
- **attention** combines information from different positions in the context;
- **feed-forward layers** transform each contextualized representation; and
- an **output projection** turns the final representation into one score, or
  logit, per vocabulary token.

For vocabulary `V` and embedding width `d`, a learned table
`E ∈ ℝ^{|V|×d}` maps token ID `xᵢ` to vector `eᵢ = E[xᵢ] ∈ ℝᵈ`.
The rows begin as arbitrary values and acquire predictive structure during
training.

Repeated contexts give the space geometry. Tokens used in similar contexts
often develop nearby or directionally related embeddings. That geometry is
useful, but it is not a complete theory of meaning and does not establish that
a relationship is true in the world.

The interactive explorer on the rendered page compresses a much larger space
into three hand-authored teaching dimensions. Its vector arithmetic is
geometric intuition, not a measured identity from a production model.

An input embedding is only the starting state. Position, attention, and
feed-forward layers transform it into a **contextual hidden state**. The token
*stable* therefore produces different internal states in *stable counting sort*
and *stable employment*.

```text
token ID → input embedding → contextual hidden state
→ output logits → next-token probabilities
```

Embeddings and weights are learned parameters that persist across requests.
Contextual hidden states and probabilities are temporary activations computed
for the current prompt.

## 4. Inference: One Token at a Time

At inference time, training has stopped and the model's weights are fixed. A
prompt moves through a repeated forward-pass loop:

1. Tokenize the current text.
2. Look up the input embeddings.
3. Use attention and feed-forward layers to build contextual hidden states.
4. Project the final position into one logit per vocabulary token.
5. Apply softmax to obtain `P(next token | prompt)`.
6. Use a decoding rule to choose a token.
7. Append that token to the context and run the model again.

```text
prompt → tokens → learned representations → logits → probabilities
→ selected token → append → repeat
```

Prediction and selection are different operations. The model produces logits;
softmax converts them into a distribution; a decoding strategy decides what to
do with that distribution. Greedy decoding selects the most probable token.
Temperature, top-k, and top-p can reshape or restrict the available choices
before sampling.

The same model and prompt can therefore produce different continuations without
changing any learned weight. Runtime context and decoding determine which
learned patterns are activated and how the resulting probabilities become
text.

## 5. What Pattern Prediction Means

Calling an LLM a pattern-prediction machine is a description of its operating
contract, not a claim that its behavior must be trivial. The learned patterns
can include syntax, genre, factual associations, algorithms, explanations,
tool-use conventions, and long sequences that resemble deliberate reasoning.
All of them are expressed through the same interface: conditional next-token
probabilities.

The model does not retrieve one predetermined answer from its weights. It
reconstructs a continuation from the prompt, its learned parameters, its
temporary activations, and the decoding rule. Small changes in any of those can
change the generated path.

Inference also does not establish that a continuation is correct, meaningful,
or worth adopting. As [The Understanding
Bottleneck](/writing/understanding-is-the-bottleneck) argues, generation
produces a candidate artifact; people and institutions still have to ground,
interpret, evaluate, and absorb it.

The complete flow is therefore:

```text
human language → tokens → training examples → prediction error
→ learned weights and embeddings → prompt-conditioned activations
→ next-token probabilities → decoded tokens → generated text
```

The machinery is remarkably capable, but its basic operation remains stable:
learn patterns by predicting tokens, then use those learned patterns to predict
again.

## Sources

- Philip Gage, [“A New Algorithm for Data Compression”](https://www.derczynski.com/papers/archive/BPE_Gage.pdf) (1994). Introduces byte-pair encoding as a lossless compression technique.
- Rico Sennrich, Barry Haddow, and Alexandra Birch, [“Neural Machine Translation of Rare Words with Subword Units”](https://aclanthology.org/P16-1162/) (2016). Adapts byte-pair encoding to subword tokenization.
- Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A Neural Probabilistic Language Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003). Connects conditional word prediction with learned distributed representations.
- Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean, [“Efficient Estimation of Word Representations in Vector Space”](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) (2013). Introduces efficient architectures for learning word-vector relationships.
- Ashish Vaswani and colleagues, [“Attention Is All You Need”](https://arxiv.org/abs/1706.03762) (2017). Introduces the Transformer architecture underlying modern decoder language models.
- Claude E. Shannon, [“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951). Uses next-character prediction to estimate the redundancy of English.
