# Problem
I wrote a bad prompt, agent spent 9 hours crafting the most ludicrous plan. It pages of markdown checkmarks that were completely unusable. I prompted something clever like "make this plan as optimal as possible"

In this study [researchers evaluated leading LLMs on seven strategic tradeoffs](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return), 
The surprising part is that **the order of the choices affected the answer more than useful information about the company did**.
- **Less than 2%:** Changing the wording or telling the robot to think harder barely helped. Out of 100 answers, fewer than 2 changed.
- **11%:** Giving the robot more information about the company helped somewhat. Roughly 11 out of 100 answers changed.
- **19%:** Simply putting the choices in a different order changed the robot’s answer even more. Roughly 19 out of 100 answers moved away from the trendy choice.

Is the LLM fundementally disconnected from understanding meaning? Or is this a problem of large datasets generating generic average? Can we gain an intuition for questions that AI will do bad at?


# Breaking it down

Let's just do rough functional map to tie an aspect of an LLM to a human analog.  Let's see what this helps us deduce.

| Aspect        | AI component                                                  | Human analogue                                                           | Human term     |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| **Input**     | Data, **Tokenizer**                                           | Sensory receptors, perceptual segmentation and  encoding                 | **Experience** |
| **Training**  | **Loss function, backpropagation, optimizer**                 | Teaching signals, credit assignment, neural plasticity and consolidation | **Learning**   |
| **Model**     | **Learned parameters (weights), including embeddings**        | Neural circuit organization shaped by experience                         | **Knowledge**  |
| **Inference** | **Transformer blocks (self-attention + feed-forward layers)** | Attention, working memory, and cognitive control                         | **Reasoning**  |

## Input
AI suggested:
>A human listener interprets continuous speech through learned units such as phonemes, syllables, and words. A tokenizer similarly divides text into tokens—sometimes whole words, but often subwords, punctuation, or byte sequences.

That is interesting, but the meaningful distinction is completely off. The process of tokenization comes from a compression tool called [BPE](https://www.derczynski.com/papers/archive/BPE_Gage.pdf).

The more interesting insight  happens in the reverse. Morphemes are essentially just our way of compressing meaning into discrete symbols. So what happens to the things that cannot be measured objectively, things like qualia and all those those feelings that make consciousness such a hard problem.

```
- **Grapheme:** The smallest meaningful contrast in a writing system—a letter or letter group, such as `a`, `t`, or `sh`.
- **Phoneme:** The smallest sound distinction that can change meaning, such as `/p/` versus `/b/` in _pat_ and _bat_.
- **Morpheme:** The smallest unit carrying meaning or grammatical function, such as `cat` and plural `-s` in _cats_.

- **Qualia:** The subjective qualities of experience—what something feels like, such as pain or the redness of red.
- **Phenomenon:** A single occurrence, condition, or experience that can be observed or studied.
- **Phenomena:** The plural of _phenomenon_; multiple observable or experienced occurrences.

The **hard problem of consciousness** asks why physical information processing is accompanied by subjective experience at all.
```

- the site of redness
- feeling of pain
- taste of chocalate
- the experience of love

Phenomena map back morphemes. However there is still a gap: the subjective to objective, and we cannot know if any two people actually do taste chocolate the same way.

Likewise the unknown qualities of phenomena are not transmitted in the compressed input.


### Training
In LLM pretraining, error is measured by how much probability the model assigns to the actual next token in the training text. Humans  select the training data and define the objective.
- Loss function: measure the model’s error,
- Backpropagation: determines which parameters contributed to it
- Optimizer: updates them to improve future predictions

The literature on human learning is far more complex than LLM training.
- There is no known global human loss function. We have conflicting signals personal goals, social commitments, physical needs etc.
- Humans help select their own training data. The significance here meaning we can seek and discover new information about the world.
- Human learning operates on multiple timescales. We include our memory and imagination allowing us to combine rapid adaptation with long-term continuity
- Our learning experiences are inseparably tied to phenomena, meaning the subjective cannot be extracted and compressed.

### Model
- **Learned parameters (weights), including embeddings:** Encode statistical regularities acquired during training, allowing the model to transform an input into context-sensitive predictions.

Calling these parameters the model's "knowledge" is useful but incomplete. Human knowledge is intertwined with autobiographical memory, a sense of self, goals, and semantic control—the ability to retrieve and apply what we know to the situation at hand.

```
- **Semantic knowledge:** What concepts, facts, properties, and relationships you know.
- **Semantic control:** How you select, combine, and apply that knowledge for the present task.
```

### Inference and Reasoning
LLM:
Self-attention: tokens communicate with one another.
Feed-forward:  each token processes what it learned.
Transformer:   repeats this cycle across many blocks.


- **Deduction:** What must follow?
- **Induction:** What probably follows from repeated observations?
- **Abduction:** What explanation best accounts for the evidence?
- **Relational inference:** What unobserved relationship follows from known relationships?

If you see smoke and expect fire, you have made an inference. You may not have deliberately reasoned through it.

Reasoning is the more organized use and evaluation of inference. It requires keeping information active, comparing alternatives, integrating relationships, suppressing irrelevant responses, and checking whether a conclusion follows. [Johnson-Laird](https://pmc.ncbi.nlm.nih.gov/articles/PMC2972923/)


## Problem Spaces
Something becomes a problem only relative to a valued outcome. A candidate becomes a solution only if its consequences move the world toward that outcome.

```mermaid
flowchart TD
    DO["Goal"]

    O1["Opportunity"]
    O2["Opportunity"]
    O3["Opportunity"]

    S1["Solution"]
    S2["Solution"]
    S3["Solution"]
    S4["Solution"]
    S5["Solution"]
    S6["Solution"]

    E1["Experiment"]
    E2["Experiment"]
    E3["Experiment"]
    E4["Experiment"]
    E5["Experiment"]

    DO --> O1
    DO --> O2
    DO --> O3

    O1 --> S1
    O1 --> S2
    O2 --> S3
    O3 --> S4
    O3 --> S5
    O3 --> S6

    S1 --> E1
    S1 --> E2
    S1 --> E3
    S4 --> E4
    S4 --> E5

    classDef desired fill:#0877e7,stroke:#0877e7,color:#ffffff
    classDef opportunity fill:#ffe6e8,stroke:#ffe6e8,color:#111827
    classDef solution fill:#c8fbd8,stroke:#c8fbd8,color:#111827
    classDef experiment fill:#fff3a8,stroke:#fff3a8,color:#111827

    class DO desired
    class O1,O2,O3 opportunity
    class S1,S2,S3,S4,S5,S6 solution
    class E1,E2,E3,E4,E5 experiment

    linkStyle 0,1,2 stroke:#ff2f3d,stroke-width:2px
    linkStyle 3,4,5,6,7,8 stroke:#22c86b,stroke-width:2px
    linkStyle 9,10,11,12,13 stroke:#f4bf00,stroke-width:2px
```


A strategy serves a governing goal by creating and coordinating subordinate
goals. It also operates in a field of goals held by other people and
institutions. Depending on the relationship, a viable strategy may need to
align with, coordinate with, negotiate around, or compete against those goals.

```mermaid
flowchart LR
    G["Governing Goal"] -->|"gives direction"| S["Strategy"]

    S -->|"creates and coordinates"| SG1["Subgoal"]
    S -->|"creates and coordinates"| SG2["Subgoal"]
    S -->|"creates and coordinates"| SG3["Subgoal"]

    S -. "aligns with" .-> C["Customer Goals"]
    S -. "coordinates with" .-> P["Partner Goals"]
    S -. "anticipates or counters" .-> R["Competitor Goals"]
    I["Institutional Goals"] -. "constrain or authorize" .-> S

    classDef governing fill:#0877e7,stroke:#0877e7,color:#ffffff
    classDef strategy fill:#7656d6,stroke:#7656d6,color:#ffffff
    classDef subgoal fill:#c8fbd8,stroke:#c8fbd8,color:#111827
    classDef external fill:#ffe6e8,stroke:#ffe6e8,color:#111827

    class G governing
    class S strategy
    class SG1,SG2,SG3 subgoal
    class C,P,R,I external
```

Reasoning can occur inside one execution. Strategy requires a continuing loop:

- a governing goal;
- selection and revision of subgoals;
- memory of prior actions and consequences;
- environmental feedback;
- comparison between actual and desired state;
- willingness or authorization to change course; and
- some answer to which tradeoffs are legitimate.

## Cognitive Light Cone


Michael Levin’s work treats cognition and agency as graded capacities that can appear across biological and artificial substrates. His **cognitive light cone** describes the spatial and temporal scope of the goals a system can represent, pursue, and restore despite disruption. To apply this framework to AI without mistaking fluent goal language for agency, we use ten operational questions 

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

These questions don't put LLMs in a good light. At least not by themselves. 

## LLM Solution Spaces
An LLM within a single prompt has a very small light cone.
It also does not have a way of it's own to error correct.
And since it lacks values or a value hierarchy asking for a "goal" from AI, is like asking what tastes good. 
There is a fundemental gap with regard to value and meaning. Those must be supplied by a subjective individual.
### Developing a Goal-Pursuing System

So since AI hasn't yet breathed the spirit of life into it's lungs, we still need humans who are capable of making value judgements. 

The gap between value and meaning, also requires that humans have the technical fluence to translate to operational and verified tasks. This will require creativity and enginuity.

A language model can reason about a goal within one execution. That is not yet the same as pursuing the goal. Goal pursuit requires a continuing control loop: the system must preserve a desired state, observe current conditions, detect the difference between them, choose an action, observe the consequences, and revise its strategy.

Persistent memory, tools, environmental feedback, controllers, permissions, and schedulers can assemble this loop around a model. The resulting service may exhibit genuine functional agency across many executions, even if no individual model instance maintains the goal by itself.

This creates an attribution problem. If a scheduler restores the objective, a database preserves the memory, people supply the funding, and an institution decides whether the goal remains valuable, then the service can operationally pursue the goal without the model independently originating, valuing, or experiencing it.

