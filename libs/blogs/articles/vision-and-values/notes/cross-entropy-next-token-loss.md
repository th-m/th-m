# Cross-Entropy Loss in Next-Token Prediction

During pretraining, a language model receives a sequence of tokens and predicts
a probability distribution over the token that might come next.

Given the context:

> The cat sat on the …

the model might predict:

| Possible next token | Assigned probability |
| --- | ---: |
| `mat` | 70% |
| `floor` | 15% |
| `chair` | 5% |
| Everything else | 10% |

If the training text continues with `mat`, cross-entropy loss evaluates the
probability assigned to that observed token:

\[
\text{loss} = -\ln P(\text{observed token})
\]

| Probability assigned to the observed token | Loss |
| ---: | ---: |
| 90% | 0.11 |
| 70% | 0.36 |
| 10% | 2.30 |
| 0.1% | 6.91 |

A high probability produces a small loss. A low probability produces a large
loss, so a confident mistake is penalized much more strongly than an uncertain
one. Backpropagation calculates how the model's parameters affected that loss,
and the optimizer adjusts them to make similar observed continuations more
probable in the future.

The logarithm also allows losses from successive token predictions to be added.
Minimizing their average is equivalent to increasing the probability the model
assigns to the observed training sequences.

## What the Loss Does Not Evaluate

Cross-entropy does not determine whether the observed token is true, meaningful,
ethical, or useful. It measures how surprising that token was under the model's
predicted distribution.

`floor` might be a coherent continuation, but if this training example contains
`mat`, then `mat` supplies the immediate training signal. Across many examples,
the model learns a distribution of linguistic continuations rather than a
direct test of their truth or value.

> **Cross-entropy rewards accurate prediction of the training distribution. It
> does not independently judge what the distribution describes.**
