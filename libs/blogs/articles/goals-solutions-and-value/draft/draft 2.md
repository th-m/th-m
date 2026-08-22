# Goals, Solutions, and Value
## The Problem

[Harvard Just Caught AI Lying to Every Executive in America](https://www.youtube.com/watch?v=pd1Km6bT104)
[Google Accidentally Proved AI Is Less Creative than Humans](https://www.youtube.com/watch?v=Z_O6Lwj1yjQ)

These videos show objective limitations in our frontier models. I saw these after recently wasting week of tokens on some tasks that the model wasn't cut out for. I was frustrated and this guy very clearly lays out the research and evidence that would have prevented my naive and wastful token spend.  But how could I have reasoned about this before seeing the data? Would that even be possible?

Originally when thinking about this essay I considered the title "souless clankers will not solve your personal problems" or maybe something about AI psychosis leading to AI girlfriends.  I realized though while writing, the situation is more nuanced than that.

Popular atheists often argue for determinism—the idea that humans do not truly have free will. If that’s true, then being “loved by an AI” would be essentially equivalent to being loved by any other object without agency: neither can actually choose you.

To be fair, AI systems may solve your problems.  But, it depends on what type of problem you are dealing with and more specifically the statistical probability that the average semantic next token aligns with what you value as a solution.

The words we use to describe AI are all comingled with competing ideas, are overloaded, and smuggle unwanted baggage. In the worst case we have definitions for a term that intentionally contradict each other.

**_Consiousness_:**

- Neural dynamics of subjectivity defines consciousness as having a **biological component**.
- Computational functionalism explicitly postulates that consciousness can be separated from biological substrate.

I wonder what effect these competing definitions have within the token prediction machines... What if there was a correlation between a given term's semantic definition, the term's recorded usage, and the corresponding probability that semantic patterns cohere? []

Let's not get carried away with speculation now. Here is what we know and can agree on:
- We have not concretely proved that biological entails functionality beyond the mechanical.
- Terms lack consistent concrete formalizations and are intermingled with belief systems.

So how do we evaluate a systems ability to "problem solve", and what aspects of the AI system would explain the lack of  creativity or the inability to strategize in competitive space?

## The Goal

- Decompose the AI in to its functional components and line up to best fit human analog.
- Compare and contrast and highlight gaps between human capabilities.
- Then use Micheal Levins Cognitive Light Cone theory to apply pragmatic interpertation of cognition to see if we can distill some meaningful insights.

## AI Operational Components


| Aspect        | AI component                                                   | Human analogue                                                     | Human term     |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ | -------------- |
| **Input**     | Data, **Tokenizer**                                            | Sensory receptors, perceptual segmentation and  encoding | **Experience** |
| **Training**  | **Loss function, backpropagation, optimizer**                  | Teaching signals, credit assignment, neural plasticity and consolidation                                | **Learning**   |
| **Model**     | **Learned parameters (weights), including embeddings**         | Neural circuit organization shaped by experience                   | **Knowledge**  |
| **Inference** | **Transformer blocks: self-attention and feed-forward layers** | Attention, working memory, and cognitive control                   | **Reasoning**  |


## Compare and Contrast

The goal is to present a logical connection that allows a relative comparable analog. Obviously AI is missing a lot of what the human mind can do. It has no sense of self or percieved qualia,



### Input vs Experience

Ok I know AI will say the throughline is weak. But that is because it is overindexing on the difference betwen input data and input mechanism. It actually has no idea that our input mechanisms are always streaming data.  So it has a hard time making those intuitive leaps. Logically we say our input data is entwined with our constant sensory experience.



Before tokenization, information has already been captured and selected. For training, people and software assemble recorded material into a corpus, often cleaning, filtering, deduplicating, and mixing it; at runtime, a prompt or other encoded input is assembled as the active context. The sources and proportions vary by model and may be only partly disclosed. These data pipelines determine what can reach the model, but they sit outside the bare LLM.

For text, a **tokenizer** applies a fixed vocabulary that maps pieces of the input to integer IDs. In one common family of methods, based on byte-pair encoding, vocabulary construction begins with small units such as bytes or characters and repeatedly combines frequent adjacent sequences. The finished tokenizer can then represent recurring patterns with fewer tokens. An embedding lookup converts each token ID into an initial vector that the model can process.

There is a limited information-theory connection: assigning one symbol to a recurring sequence can shorten its encoded description and allow more text to fit within a fixed token budget. Tokenization is not necessarily lossy—many tokenizers can reconstruct the supplied text exactly—and it is not automatically an optimal entropy code. The larger compression occurs during training, when regularities across the corpus are condensed into finite model parameters. Statistical information describes uncertainty and dependence; it does not by itself establish meaning or truth.

The closest human analogue to tokenization is not the sensory receptor but later perceptual or linguistic segmentation into phonemes, syllables, words, and other learned representations. This already reveals a large gap. Human perception does not merely segment signals into symbolic units; it organizes them into a unified, embodied, and affectively weighted experience. Conscious perception also has qualitative character: the redness of red, the timbre of a voice, or the sensation of pain. These qualities are not known to be discrete tokens or an intermediate code analogous to embeddings.

Human perception extracts structure, binds multiple sensory modalities, relates signals to the body and prior experience, and—at least in conscious perception—presents them as something it is like to experience. Current LLMs have no established analogue for this phenomenal dimension.

### Training vs Learning

Training and learning overlap at a broad functional level: information and feedback produce durable internal changes that alter future behavior. Beyond that shared pattern, the analogy separates into several different operations.

During next-token pretraining, the model assigns a probability to every possible next token. A **loss function**, usually cross-entropy, imposes a larger penalty when the model assigns the observed token a lower probability. **Backpropagation** applies the chain rule through the network to calculate each parameter's gradient: how a small change to that parameter would change the loss. An **optimizer**, such as SGD or Adam, turns those gradients into controlled weight updates, generally moving the parameters in a loss-reducing direction.

Repeating this process across many batches makes patterns that predict the training data more likely. It works because the network is differentiable and small parameter changes have measurable effects on its error; gradients from sampled batches provide usable estimates of how to improve the wider training objective. This does not guarantee a globally optimal solution, truth, robustness, or generalization beyond the training distribution.

Human learning has mechanisms that rhyme with each part of this process, but there is no established one-to-one mapping. The brain does not have a known single global loss function. Different neural systems respond to sensory errors, failed expectations, rewards, social correction, novelty, bodily demands, and present goals. Dopamine can carry reward-prediction-error signals in some forms of learning, but it is one family of biological teaching signals rather than a universal measure of error.

The hardest comparison is **credit assignment**: when an action succeeds or fails, which parts of the system should change? Backpropagation solves this mathematically by propagating gradients backward through the network. The brain is not known to implement literal backpropagation; biological credit assignment remains an active research problem. Feedback pathways, dendritic processing, neuromodulation, and local eligibility traces may provide parts of the solution without reproducing the same algorithm.

The analogy to an optimizer is looser still. Human learning is not one rule adjusting one kind of neural “weight.” Experience can strengthen or weaken synapses, change neuronal excitability, alter coordination among neural populations, create or stabilize connections, and trigger slower structural changes. Consolidation can continue after the original experience through replay, sleep, and longer-term reorganization across memory systems.

This creates an important difference in timing. For a standard LLM, durable parameter change is concentrated in explicit training or fine-tuning. During ordinary inference, context can temporarily change the model's behavior without changing its weights. Human perception, action, learning, memory, and consolidation are less cleanly separated: an experience can begin changing the system while a person is still acting within it and can continue to be reorganized afterward.

The correspondence is therefore better decomposed as:

> **loss or objective → biological teaching and evaluative signals**<br>
> **backpropagation → the problem of biological credit assignment**<br>
> **optimizer and weight updates → neural plasticity and consolidation**

Training is one engineered implementation of learning. Human learning is the broader phenomenon: a distributed, selective, and multi-timescale process through which experience changes perception, knowledge, skill, expectation, and future action.

### Model vs Knowledge

A trained LLM pairs a fixed architecture with **learned parameters**: numerical tensors adjusted during training. These include token-embedding tables, matrices and other coefficients used by attention and feed-forward layers, normalization parameters, and the output projection that scores possible next tokens. A weights file serializes this learned state, but using it also requires the matching architecture, configuration, and tokenizer.

**Embeddings** are one subset of those parameters. The tokenizer assigns each token an ID, and an embedding lookup maps that ID to an initial learned vector. Relationships among these vectors can encode distinctions and similarities useful to prediction, but an embedding is not a token's complete or fixed meaning. Transformer layers convert that starting representation into context-dependent activations as they process the surrounding text.

“Knowledge” is useful shorthand, but the closer human analogue of a trained model is **long-term memory**: the durable organization left in a system by learning. Knowledge is some of the content that this organization makes available, alongside skills, expectations, associations, and learned dispositions.

Human memory is not stored in one place or in one format. Episodic memory supports particular events, semantic memory supports facts and concepts, and procedural memory supports practiced skills. These systems can be partly dissociated, but they normally interact. At the neural level, knowledge appears to depend on distributed and overlapping patterns of organization rather than a database of propositions stored at identifiable addresses. Human concepts also inherit structure from perception, action, affect, language, and social experience.

This gives learned parameters their functional analogy to memory: in both biological and artificial networks, past learning changes the organization through which future activity flows.

But a **weight is not a fact**, just as a **synapse is not a belief**. Information is distributed across the organization of the network and becomes observable only when activity passes through it. Retrieval is therefore a computation, not simply reading an item from storage. The same model can produce a fact under one phrasing and fail to produce it under another, distinguishing information that may be represented from information that is reliably accessible in a particular context.

The largest difference is the relationship between memory and ongoing experience. Human learning and memory remain coupled during ordinary life: new events can become durable memories while the person perceives, reasons, and acts. A standard pretrained LLM normally operates with fixed weights during inference. Information supplied in its context can temporarily change its behavior, but without another training step or an external memory system, that encounter does not automatically become part of its learned parameters.

The analogy is therefore not:

> **weights = facts**

It is closer to:

> **trained weights = durable dispositions produced by past training**<br>
> **learned neural organization = durable dispositions produced by past experience**

In humans, we call the durable capacity **memory**; we call some of what that memory makes available **knowledge**.

### Inference vs Reasoning

In machine learning, **inference** means executing a trained model on an active input without ordinarily updating its learned parameters. Token IDs are mapped to embeddings and combined with positional information, then passed through repeated transformer blocks. Within each self-attention head, learned projections produce **query**, **key**, and **value** vectors. Query-key similarities determine how strongly each position draws from the values at allowed prior positions; multiple heads perform this operation through different learned projections in parallel.

Each block's **feed-forward network** then applies learned nonlinear transformations independently at each token position. Residual connections carry information around the attention and feed-forward operations, while normalization helps keep the computation stable across many stacked blocks. The final representation is projected into **logits**, or scores over the vocabulary, which are converted into a probability distribution and decoded into a next token. In an autoregressive LLM, that token is added to the context and the cycle repeats.

This is the least direct analogy in the table because *inference* and *reasoning* describe different levels of a system. Nothing about inference by itself requires reasoning. Recalling a familiar association, completing a sentence, and solving a novel logic problem are all inference-time computations. Reasoning is one possible function of that computation: deriving, relating, evaluating, or revising conclusions from the information available.

The same distinction appears in humans. Human inference includes automatic perceptual and intuitive conclusions that never become deliberate thought. Reasoning more often refers to reflective operations on representations and reasons: maintaining relevant information, integrating relationships, considering alternatives, suppressing an immediate response, and evaluating what follows. These operations draw on working memory, attention, relational processing, and cognitive control rather than a single known reasoning module.

Transformer inference can nevertheless produce functionally similar behavior. Attention creates context-sensitive combinations of information, and autoregression gives the process an additional property: the model's output can become part of its next input. Generated intermediate steps can therefore act as an external scratch space, extending computation across tokens even though the weights remain fixed. This can improve performance on many multi-step tasks, but the visible explanation is not necessarily a faithful record of the computations that produced the answer.

The correspondence is therefore better stated as:

> **Inference is the execution process. Reasoning is a higher-level function that some inference-time computation can realize.**

This does not make transformer inference identical to human reasoning. Human reasoning occurs within a persistent organism shaped by perception, episodic and semantic memory, affect, bodily needs, metacognition, and internally maintained goals. A bare LLM inference call begins with a supplied context and ends when generation stops. The more useful question is therefore not whether one system “really reasons,” but what kinds of organized inference each can sustain, under what constraints, and toward whose goals. Competence within one inference episode does not by itself establish persistent agency—a distinction that becomes central to the Cognitive Light Cone.


## Cognitive Light Cone

Michael Levin’s work treats cognition and agency as graded capacities that can appear across biological and artificial substrates. His **cognitive light cone** describes the spatial and temporal scope of the goals a system can represent, pursue, and restore despite disruption. To apply this framework to AI without mistaking fluent goal language for agency, we use ten operational questions testing persistence, error correction, flexible action, goal hierarchy, memory, and dependence on external infrastructure. These questions are our adaptation of Levin’s framework, not a questionnaire published by Levin.

Does the goal persist beyond one prompt or inference call?
Can the system detect deviation without being explicitly notified?
Does it choose novel means when its normal strategy is blocked?
Can it revise subgoals while preserving a higher-order objective?
Does it retain information because that information remains relevant to the goal?
Can it trade immediate rewards against longer-term outcomes?
What happens when instructions, learned tendencies, and stored goals conflict?
Does the system itself restore the goal after interruption, or does an external scheduler restore it?
Does goal pursuit survive replacement of the model instance?
Which humans, policies, databases, and infrastructure are required to make the apparent continuity possible?

## Strategy
Strategy is the goal-directed coordination of cognitive operations and actions over time. It can combine inference, prediction, planning, valuation, action selection, and revision in response to feedback.

### Creativity
