# LLM Key Terms

## Input and Representation

- **Training data:** Text and other material used to teach a model statistical
  patterns.
- **Corpus:** The complete collection of training documents or examples.
- **Tokenizer:** Converts text into token IDs the model can process and decodes
  token IDs back into text.
- **Token:** A unit processed by the model, such as a word, word fragment, byte,
  or punctuation mark.
- **Token ID:** The integer assigned to a token in the tokenizer's vocabulary.
- **Vocabulary:** The complete set of tokens recognized by a tokenizer.
- **Byte Pair Encoding (BPE):** An influential tokenization method that
  constructs reusable tokens by repeatedly merging frequent adjacent symbols.
- **Context:** The tokens currently available to the model when it makes a
  prediction.
- **Context window:** The maximum amount of context the model can process at
  once.
- **Embedding:** A learned numerical vector representing a token or other input
  inside the model.

## Model Structure

- **Model:** The architecture together with its learned parameters.
- **Architecture:** The fixed arrangement of computations the model can
  perform.
- **Parameter:** Any numerical value learned during training.
- **Weight:** A parameter used to scale or combine signals. “Weights” is also
  commonly used informally for all learned parameters.
- **Bias:** A learned parameter added to a computation, allowing its output to
  shift.
- **Transformer:** The architecture underlying most modern LLMs, built from
  repeated attention and feed-forward blocks.
- **Self-attention:** A mechanism that lets each token representation
  incorporate relevant information from other positions in the context.
- **Feed-forward network:** A learned transformation applied to each token
  representation within a transformer block.
- **Layer:** One stage of the model's repeated computations.
- **Hidden state:** A token's evolving internal representation as it passes
  through the model.

## Prediction

- **Next-token prediction:** Estimating which token is likely to follow the
  current context.
- **Logit:** A model's raw score for a possible next token.
- **Softmax:** Converts logits into a probability distribution.
- **Probability distribution:** The probabilities assigned across all possible
  next tokens.
- **Decoding:** The method used to select a token from that distribution.
- **Temperature:** Controls how concentrated or varied token selection is.
- **Top-k sampling:** Restricts selection to the *k* highest-probability tokens.
- **Top-p sampling:** Restricts selection to the smallest group of tokens whose
  cumulative probability reaches a threshold.

## Training

- **Pretraining:** General training on large datasets, usually through
  next-token prediction.
- **Self-supervised learning:** Training in which the data supplies its own
  labels—for an LLM, the observed next token supplies the answer.
- **Loss function:** A mathematical score measuring the model's prediction
  error.
- **Cross-entropy loss:** Penalizes the model according to how little
  probability it assigned to the observed next token.
- **Gradient:** The calculated direction and magnitude in which a parameter
  would change the loss.
- **Backpropagation:** Computes the loss gradient for each trainable parameter.
- **Optimizer:** Uses those gradients to update the parameters.
- **Learning rate:** Controls the size of each parameter update.
- **Batch:** A group of training examples processed before an update.
- **Checkpoint:** A saved copy of the model's parameters at a particular stage
  of training.
- **Fine-tuning:** Additional training that adapts a pretrained model to
  particular tasks or behavior.
- **Post-training:** Training after pretraining, often including supervised
  fine-tuning, preference learning, and safety conditioning.
- **Distillation:** Training a smaller model to approximate the probability
  distribution or behavior of a larger model.

## Use and Behavior

- **Inference:** Applying a trained model to new input without normally changing
  its parameters.
- **Prompt:** Input instructions or context supplied to the model.
- **System prompt:** Higher-priority runtime instructions defining the model's
  role and behavioral constraints.
- **Hallucination:** A plausible-sounding output that is unsupported,
  inaccurate, or fabricated.
- **Retrieval-augmented generation (RAG):** Supplying retrieved external
  information as context before generation.
- **Tool use:** Allowing a model to request actions from external systems such
  as search engines, calculators, or APIs.
- **Agent:** A model embedded in a system that can pursue goals through multiple
  steps, tools, memory, and feedback.

```text
text → tokens → embeddings → transformer → token probabilities
     → loss → gradients → parameter updates
     → inference → generated tokens → text
```

Training updates the model's parameters. Inference uses those parameters to
produce predictions. Neither process by itself establishes that the model
understands or experiences its output subjectively.
