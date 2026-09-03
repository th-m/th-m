# Vision and Values
## The Problem

[Harvard Just Caught AI Lying to Every Executive in America](https://www.youtube.com/watch?v=pd1Km6bT104)
[Google Accidentally Proved AI Is Less Creative than Humans](https://www.youtube.com/watch?v=Z_O6Lwj1yjQ)

These videos show objective limitations in our frontier models. I saw these after recently wasting week of tokens on some tasks that the model wasn't cut out for. I was frustrated and this guy very clearly lays out the research and evidence that would have prevented my naive and wastful token spend.  But how could I have reasoned about this before seeing the data? Would that even be possible?

Originally when thinking about this essay I considered the title "souless clankers will not solve your personal problems" or maybe something about AI psychosis leading to AI girlfriends.  I realized though while writing, the situation is more nuanced than that.

Popular atheists often argue for determinism—the idea that humans do not truly have free will. If that’s true, then being “loved by an AI” would be essentially equivalent to being loved by any other object without agency: neither can actually choose you.

To be fair, AI systems may solve your problems.  But, it depends on what type of problem you are dealing with and more specifically the statistical probability that the average semantic next token aligns with what you value as a solution.

The words we use to describe AI are all comingled with competing ideas, are overloaded, and smuggle unwanted baggage. In the worst case we have definitions for a term that intentionally contradict each other.

Let's look at a couple words for example:

**_Consiousness_:**

- Neural dynamics of subjectivity defines consciousness as having a **biological component**.
- Computational functionalism explicitly postulates that consciousness can be separated from biological substrate.

**_Reasoning_:**

 - In AI it is autoregressive next-token generation process performed by a transformer’s attention layers, using parameters configured through backpropagation-based training.

 -  In Humans it is a biological process in which networks of neurons exchange electrical and chemical signals to integrate knowledge, memories, and sensory information, evaluate possibilities, and form conclusions.

I wonder what effect these competing definitions have within the token prediction machines... What if there was a correlation between a given term's semantic definition, the term's recorded usage, and the corresponding probability that semantic patterns cohere? []

Let's not get carried away with speculation now. Here is what we know and can agree on:
- We have not concretely proved that biological entails functionality beyond the mechanical.
- Terms lack consistent concrete formalizations and are intermingled with belief systems.

So how do we evaluate a systems ability to "problem solve", and what aspects of the AI system would explain the lack of  creativity or the inability to strategize in competitive space?

## The Goal

Define operational boundaries for reasoning in the abstract, use humans as a basis.

Associate analogous capabilities, highlight the gaps and overlap as well as explore as many technical details where possible.

Then apply pragmatic theories of cognition to see if we can distill some meaningful insights.

## Operational Boundaries

Here, **LLM** means only the trained model operating on its active input
context. It excludes tool calls, retrieval systems, saved memory, agent
controllers, and other external scaffolding. The LLM does not have a separate
module for each capability below. Most arise from the same transformer
mechanism: encoded input passes through attention and feed-forward layers,
producing a probability distribution from which tokens are decoded. The model's
parameter and activation tensors are executed on processors such as GPUs or
TPUs.

| Capability      | What it represents                                                    | Human forms and mechanisms                                                                                                                 | LLM mechanism                                                                                                                                                                                 | Important boundary                                                                                                                     |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Modality**    | Different modes of input                                              | Biological senses and bodily signals: visual, auditory, tactile, olfactory, gustatory, vestibular, proprioceptive, and interoceptive input | Tokenizers or modality encoders convert text, images, audio, or video into numerical embeddings; projection layers place them in the transformer's token space                                | Input modality does not establish subjective experience. Humans report qualia; there is no validated evidence of LLM qualia.           |
| **Learning**    | Information taken in and incorporated so it can affect later behavior | Episodic, statistical, reinforcement, procedural, perceptual, and social learning through neural plasticity and consolidation              | A training objective produces a loss; backpropagation calculates gradients; an optimizer updates parameter tensors across transformer layers on accelerator hardware                          | A base LLM does not durably learn during ordinary inference. Contextual adaptation lasts only while the relevant context is available. |
| **Memory**      | Information retained and made available later                         | Working, episodic, semantic, and procedural memory through encoding, consolidation, retrieval, and reconstruction                          | Long-term statistical structure is encoded in parameter tensors; temporary sequence state is held in context tokens, activations, and the attention key-value cache in accelerator memory     | A base LLM has no episodic or autobiographical memory between independent calls. Parameterized information is not recollection.        |
| **Imagination** | Possibilities generated without immediate observation                 | Mental imagery, counterfactual thought, episodic simulation, and memory recombination                                                      | Transformer forward passes produce next-token probabilities; a decoding algorithm samples or selects successive tokens, recombining patterns represented in the parameters and context        | LLMs have substantial generative capacity; generation does not establish an experienced inner world.                                   |
| **Knowledge**   | Information organized so it can be used                               | Semantic, episodic, procedural, relational, causal, and social knowledge, retrieved according to context and goals                         | Training distributes statistical and relational structure across embeddings, attention components, feed-forward layers, and other parameter tensors stored and executed on computing hardware | A representation can be useful without being true. Fluency does not guarantee knowledge or understanding.                              |
| **Reasoning**   | Conclusions formed, tested, or revised                                | Deduction, induction, abduction, analogy, and causal reasoning supported by working memory and cognitive control                           | Repeated transformer forward passes apply self-attention, feed-forward transformations, residual connections, and autoregressive decoding across the token sequence                           | Similar functions do not require identical mechanisms. Humans and LLMs can both reason incorrectly.                                    |

### Modality:
- Phenomenal experience cannot be directly observed or conclusively verified.
### Qualia Are the Beginning of Opportunity

Qualia are the felt, first-person qualities of experience:

- the sting of pain;
- the redness of red;
- the embarrassment after a mistake;
- the relief of a task becoming easier; and
- the satisfaction, status, safety, trust, or delight a product can create.

Use the room-temperature example. An AI can state that a room is 68°F, summarize research on thermal comfort, and predict that a person may complain. The proposition is powerful. It is still different from being the person in the room, cold, distracted, irritated, or deciding to leave.

Learning
- Information does not entail meaning. Generally humans associate meaning to learned subjects. Ai is simply creating weights for better probalistic coherence.
- Humans cannot turn off their inputs.

Memory & Imagination

## Knowledge
Humans do not usually preserve raw data. They transform experience into compressed, relational, and goal-sensitive models of the world.

A simplified process is:

```text
sensory input
→ attention and selection
→ features and patterns
→ episodes and categories
→ concepts, schemas, and causal models
→ context-sensitive retrieval and action
→ revision through feedback
```

The main organizing processes are:

- **Selection:** Attention prioritizes information that is novel, emotionally significant, goal-relevant, or surprising. Most sensory input is discarded.
- **Chunking:** Working memory groups separate elements into meaningful units—a sequence of digits becomes a date, word, or familiar pattern.
- **Association:** New information becomes linked to places, times, emotions, actions, people, and existing concepts.
- **Categorization:** Similar experiences are grouped into concepts such as “dog,” “tool,” or “danger,” despite differences between individual examples.
- **Abstraction:** Repeated experiences are compressed into general rules and regularities. Particular encounters with dogs contribute to general knowledge about dogs.
- **Relational organization:** Humans represent how things are connected: category membership, spatial relations, sequences, analogies, social roles, and cause-and-effect relationships.
- **Schema formation:** Related knowledge becomes organized into expectations about familiar situations, such as restaurants, arguments, or job interviews.
- **Narrative organization:** Events are often arranged around agents, motives, causes, conflicts, and consequences rather than retained as neutral records.
- **Goal-sensitive retrieval:** Context and current goals determine which aspects of knowledge become accessible.
- **Social organization:** Language, testimony, teaching, institutions, and external records allow knowledge to be classified and maintained across people and generations.

Different memory systems contribute different structures. The hippocampus helps bind experiences into episodes and relationships. Distributed cortical systems gradually extract concepts and regularities. Procedural systems organize practiced perception–action sequences into skills. Executive-control systems select whichever knowledge is relevant to the current situation.

This organization is powerful but inherently lossy. Categories omit differences, schemas impose expectations, narratives simplify causation, and memories change during retrieval. Human knowledge is therefore not a faithful database of experience; it is a continually revised model optimized for interpretation, prediction, and action.

For the draft:

> Humans organize experience by selecting what matters, connecting it to prior knowledge, and compressing repeated patterns into concepts, categories, schemas, skills, and causal models. This organization makes flexible prediction and action possible, but it is reconstructive and fallible: the same structures that produce meaning can also introduce expectation, omission, and bias.

Reasoning

| Form | Principal cognitive demand | Commonly associated regions |
|---|---|---|
| Deduction | Maintaining premises, applying constraints, checking validity | Predominantly left frontoparietal cortex, IFG, MFG, IPL, caudate |
| Induction | Detecting regularities and estimating uncertain conclusions | Frontoparietal multiple-demand network, IPL, basal ganglia |
| Analogy | Retrieving relations and integrating them across domains | Rostrolateral PFC, inferior/middle frontal cortex, wider frontoparietal network |
| Causal reasoning | Constructing and updating cause–effect models | Depends strongly on task: frontal-parietal for logical problems, frontotemporal for discourse, insular-striatal for causal learning |


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
