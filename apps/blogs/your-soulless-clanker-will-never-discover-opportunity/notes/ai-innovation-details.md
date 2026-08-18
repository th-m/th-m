# AI Innovation Details

## Source video

[I Built an LLM From Scratch](https://youtu.be/YmLp8qe87A0?is=hQ22-95MRxjaAG4k)

## Video description and chapter markers

> Verified against the video’s description on August 16, 2026. These links are the sources supplied by the video; they still need claim-by-claim assessment before publication.

In this video, CJ explains chatbots, neural networks, tokenization, embeddings, transformers, and more. He shows working code for each concept and provides historical context along the way.

**Code repository:** [w3cj/how-llms-work](https://github.com/w3cj/how-llms-work)

- 00:00 — Intro
- 01:54 — History of chatbots
- 04:21 — Chatbot code
- 06:49 — Black-box thinking
- 07:41 — What are neural networks?
- 08:33 — History of neural networks
- 10:27 — XOR neural-network code
- 15:35 — What is tokenization?
- 16:32 — History of tokenization
- 17:55 — Tokenizer code
- 21:37 — What are embeddings?
- 22:04 — History of embeddings
- 23:33 — What is a vector?
- 24:39 — Embedding code
- 30:48 — History of transformers
- 32:33 — What is a transformer?
- 33:11 — What is self-attention?
- 34:25 — What is a feed-forward network?
- 34:37 — What are stacked transformer blocks?
- 41:37 — What are softmax, temperature, and top-p?
- 42:54 — The autoregressive loop
- 43:28 — The context window
- 44:45 — The full picture
- 45:26 — What is fine-tuning?
- 46:39 — RLHF
- 47:24 — Tool calling
- 48:36 — The AI summit
- 49:51 — Final thoughts

## Historical and technical source leads from the video description

### Language, chatbots, and early AI

- [Claude Shannon](https://en.wikipedia.org/wiki/Claude_Shannon)
- [Betty Shannon](https://en.wikipedia.org/wiki/Betty_Shannon)
- Shannon, [*Prediction and Entropy of Printed English* (1951)](https://www.princeton.edu/~wbialek/rome/refs/shannon_51.pdf)
- [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing) and [the Turing test](https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence)
- [Joseph Weizenbaum](https://en.wikipedia.org/wiki/Joseph_Weizenbaum) and [ELIZA](https://en.wikipedia.org/wiki/ELIZA)
- Weizenbaum, [*ELIZA* (1966)](https://dl.acm.org/doi/10.1145/365153.365168)
- [ELIZA Archaeology Project](https://sites.google.com/view/elizaarchaeology/blog/3-weizenbaums-secretary)
- Weizenbaum, [*Computer Power and Human Reason*](https://archive.org/details/computerpowerhum0000weiz_v0i3)
- [Kenneth Colby](https://en.wikipedia.org/wiki/Kenneth_Colby), [PARRY](https://en.wikipedia.org/wiki/PARRY), and [*Artificial Paranoia* (1971)](https://courses.cs.umbc.edu/graduate/671/fall20/resources/colby_71.pdf)
- [ELIZA connected to PARRY — RFC 439](https://datatracker.ietf.org/doc/html/rfc439)
- [ALICE](https://en.wikipedia.org/wiki/Artificial_Linguistic_Internet_Computer_Entity) and [SmarterChild](https://en.wikipedia.org/wiki/SmarterChild)

### Neural networks and optimization

- [McCulloch and Pitts (1943)](https://en.wikipedia.org/wiki/A_Logical_Calculus_of_the_Ideas_Immanent_in_Nervous_Activity)
- [Frank Rosenblatt](https://en.wikipedia.org/wiki/Frank_Rosenblatt) and the [perceptron](https://en.wikipedia.org/wiki/Perceptron)
- [Rosenblatt’s perceptron — Cornell](https://news.cornell.edu/stories/2019/09/professors-perceptron-paved-way-ai-60-years-too-soon)
- [*New Navy Device Learns by Doing* — *New York Times* (1958)](https://timesmachine.nytimes.com/timesmachine/1958/07/08/issue.html)
- [*Perceptrons*](https://en.wikipedia.org/wiki/Perceptrons_(book))
- Rumelhart, Hinton, and Williams, [backpropagation (1986)](https://www.nature.com/articles/323533a0)

### Tokenization and embeddings

- Philip Gage, [byte-pair encoding (1994)](https://www.derczynski.com/papers/archive/BPE_Gage.pdf)
- [Byte-pair encoding](https://en.wikipedia.org/wiki/Byte-pair_encoding)
- Sennrich, Haddow, and Birch, [BPE for neural machine translation (2015)](https://arxiv.org/abs/1508.07909)
- [Gottlob Frege](https://en.wikipedia.org/wiki/Gottlob_Frege), [*Foundations of Arithmetic* (1884)](https://archive.org/details/foundationsofari00fregrich), and the [context principle](https://en.wikipedia.org/wiki/Context_principle)
- [J. R. Firth](https://en.wikipedia.org/wiki/John_Rupert_Firth), [*Studies in Linguistic Analysis* (1957)](https://archive.org/details/studiesinlinguis0000vari)
- Mikolov et al., [Word2Vec (2013)](https://arxiv.org/abs/1301.3781) and [negative sampling](https://arxiv.org/abs/1310.4546)

### Attention and transformers

- Bahdanau, Cho, and Bengio, [attention mechanism (2014)](https://arxiv.org/abs/1409.0473)
- Wu et al., [Google Neural Machine Translation (2016)](https://arxiv.org/abs/1609.08144)
- Glorot and Bengio, [Xavier initialization (2010)](https://proceedings.mlr.press/v9/glorot10a.html)
- Vaswani et al., [*Attention Is All You Need* (2017)](https://arxiv.org/abs/1706.03762)
- [Transformer](https://en.wikipedia.org/wiki/Transformer_(deep_learning))
- [Common Crawl](https://en.wikipedia.org/wiki/Common_Crawl)
- [RLHF](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback)

### AI history and possible architectural successors

- [Dartmouth Workshop (1956)](https://en.wikipedia.org/wiki/Dartmouth_workshop) and [Dartmouth AI Proposal (1955)](https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html)
- Gu and Dao, [Mamba (2023)](https://arxiv.org/abs/2312.00752)
- Beck et al., [xLSTM (2024)](https://arxiv.org/abs/2405.04517)
- Lieber et al., [Jamba (2024)](https://arxiv.org/abs/2403.19887)
- Yann LeCun, [JEPA (2022)](https://openreview.net/pdf?id=BZ5a1r-kVsf)

## Production context supplied with the video

- [Syntax](http://www.syntax.fm)
- Brought to viewers by Syntax and [Sentry](https://sentry.io/syntax)
- Tags: `#LLM` `#machinelearning` `#programming` `#explained` `#javascript` `#typescript` `#syntax` `#syntaxfm`

## Why it may matter

Use this as a source lead for the post's distinction between a trained base model and a wider AI system. Building an LLM from scratch can make the engineered components of a system concrete: training data, tokenization, objectives, optimization, parameter updates, inference, context, retrieval, tools, controllers, and feedback loops.

Do not treat a video title or implementation walkthrough as evidence for claims about consciousness, human-like memory, imagination, agency, or innovation. Extract timestamped technical claims, then support publication-facing claims with primary papers, official documentation, or reproducible technical evidence.

## Questions to review against the video

- Which parts are trained parameters versus runtime system components?
- What data, objective, labels, reward signals, or targets shape the model?
- What does the demonstration call “learning,” and does it mean weight updates, context adaptation, memory writing, or all three?
- Which behavior comes from the base model, and which comes from retrieval, tools, a controller, or scaffolding?
- Does the example show genuine external feedback, or only a closed-loop evaluation?
- Which innovation claims are demonstrated, benchmarked, or merely asserted?

## Potential editorial use

This note can support a practical claim: improvements in AI capability often arise from a system design—data pipeline, objective, infrastructure, retrieval, tooling, feedback, and evaluation—not from a disembodied base model independently discovering what matters. Keep that claim scoped to the demonstrated system and distinguish it from a claim about the metaphysical limits of all AI.
