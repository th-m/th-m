# Goals, Solutions, and Value

. I toggled Goal mode and prompted "make this plan perfect".  9 hours later I had to kill the agent, the generated plan docs were completely unusable and incomprehensible.

Then I saw [this video](https://www.youtube.com/watch?v=pd1Km6bT104) which involved the speaker’s friend asking ChatGPT about some health symptoms
- The friend suggested the symptoms might indicate **low testosterone**, and ChatGPT produced a convincing explanation supporting that diagnosis.
- The same symptoms were then presented with a different theory—such as **poor diet** or **insufficient sleep**.
- ChatGPT convincingly supported each new theory as well

When evaluating [strategy researchers](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return) found that leading models repeatedly chose the "fashionable" answers.
- **Requesting deeper analysis or improving the prompt:** about **2%** shift
- **Adding company or industry context:** about **11%** shift
- **Reversing the order of the options:** about **19%** shift

That was very surprising to me. How could a thinking, reasoning, AI be swayed by such an obvious foible.  You are supposed to pick the correct option, not the first one!

I was originally going to a write a blog entitled "clankers won't solve your problems, and they don't have a soul".  or something along the lines of how your AI girlfriend doesn't love you.  My thinking was, unconcious nueral nets have no sense of meaning and therefor cannot evaluate meaningful decisions.  However I don't think that describes the situation as effectively as I would like.

What kinds of problems is an AI system actually equipped to solve?  Let's compare bots and people, and see if we notice anything.

What if we look at an LLM and map its components to a reasonable human analog. Please note this map of functionality to human analog is simply a tool that allows us loosely scope human ability for comparison.

| Aspect        | AI component                                                  | Human analogue                                                           | Human term     |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| **Input**     | Data, **Tokenizer**                                           | Sensory receptors, perceptual segmentation and  encoding                 | **Experience** |
| **Training**  | **Loss function, backpropagation, optimizer**                 | Teaching signals, credit assignment, neural plasticity and consolidation | **Learning**   |
| **Model**     | **Learned parameters (weights), including embeddings**        | Neural circuit organization shaped by experience                         | **Knowledge**  |
| **Inference** | **Transformer blocks (self-attention + feed-forward layers)** | Attention, working memory, and cognitive control                         | **Reasoning**  |

### Input
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



For people we don't have everything figured out. Here is what the literature says

- There is no known global human loss function.
    Humans learn through sensory errors, unexpected rewards, pain, social correction, curiosity, goals, and bodily needs. Dopamine can carry reward-prediction-error signals, but that is one teaching signal—not a universal measure of everything the brain gets wrong. [Schultz](https://www.nature.com/articles/nrn.2015.26)

- Credit assignment remains the hard biological problem.
    Backpropagation calculates which parameters contributed to an error. We do not know of a literal equivalent operating throughout the brain. A significant 2026 study found neuron-specific error-related signals in cortical dendrites, suggesting one plausible ingredient for biological credit assignment—not proof that brains use backpropagation. [Francioni et al.](https://www.nature.com/articles/s41586-026-10190-7)

- Humans help select their own training data.
    We move our eyes, manipulate things, ask questions, test hypotheses, and seek information according to goals, uncertainty, and curiosity. A human learner is not merely consuming a corpus; the learner is inside the loop, influencing what experience comes next. [Gottlieb and Oudeyer](https://www.nature.com/articles/s41583-018-0078-0)

- Human learning operates on multiple timescales.
    The hippocampus can rapidly record particular experiences, while neocortical systems more gradually integrate regularities with existing knowledge. Replay, interleaving, prior schemas, rest, and sleep contribute to consolidation. [Complementary learning systems research](https://pmc.ncbi.nlm.nih.gov/articles/PMC7209926/) and [Rasch and Born on sleep](https://journals.physiology.org/doi/10.1152/physrev.00032.2012)


Interesting that our mechanisms for learning are somewhat enneffible or otherwise undecidable. Also I cannot help to draw the connection that our learning experiences are inseparably tied to phenomena.

### Model
- **Learned parameters (weights), including embeddings:** Store the numerical patterns acquired during training, allowing the model to transform inputs and produce context-sensitive predictions.

At this layer we have know choice but to bring in the rest of the human.

Everything that goes into our "model". Our sense of self, memory, as well as semantic control: the ability to retrieve and apply the part of our knowledge relevant to the present goal.

this reconnects to phenomena. The word _pain_ does not transmit pain, but for a human it can activate a concept partly shaped by sensation, emotion, action, and personal experience. Human semantic knowledge draws on these systems as well as abstract representations. [Binder and Desai](https://pmc.ncbi.nlm.nih.gov/articles/PMC3350748/) A text-only language model instead learns how the symbol _pain_ relates to other symbols.


### Inference
Self-attention: tokens communicate with one another.
Feed-forward:  each token processes what it learned.
Transformer:   repeats this cycle across many blocks.

During inference, the trained model processes the prompt through its transformer blocks. Self-attention combines information from relevant tokens, feed-forward layers transform those representations, and the model produces a probability distribution over possible next tokens. The selected token is added to the context, and the process repeats. The parameters normally remain unchanged.


Psychologically, an human inference occurs whenever the mind goes beyond information that was directly presented.

- **Deduction:** What must follow?
- **Induction:** What probably follows from repeated observations?
- **Abduction:** What explanation best accounts for the evidence?
- **Relational inference:** What unobserved relationship follows from known relationships?

If you see smoke and expect fire, you have made an inference. You may not have deliberately reasoned through it.

Reasoning is the more organized use and evaluation of inference. It requires keeping information active, comparing alternatives, integrating relationships, suppressing irrelevant responses, and checking whether a conclusion follows. [Johnson-Laird](https://pmc.ncbi.nlm.nih.gov/articles/PMC2972923/)


We started with an experimental analogy, and we found it breaks down at every layer.

Humans are far more capable than AI. So what is AI missing here. We are going to omit any extra tooling, since applying a document look up tool could be used by either human or llm at this point.

AI operates on representations of human experience. Humans learn and reason from within the experience being represented.

Some things that stood out:
- phenomena that carry meaning cannot accurately be expressed by a single morpheme. Each person has something unique, the "normal" is not accurate for any individual.
- Our sense of self, memory and imagination give us learning capabilities that operate on timescales spanning from minutes to years.
- We have capacity to project. We can have empathy or take someones perspective other than our own.

At this point it would be tempting to conclude that AI cannot be creative or strategic.

Creativity involves recognizing which novelty is interesting, appropriate, or meaningful. AI can create combinations that have never been seen, but without a measure for it to qualify the combination it has no mechanism to evaluate meaning.

The ["Weird Corners"](https://research.google/pubs/in-search-of-weird-corners-diagnosing-the-limits-of-convergent-ai-in-professional-creative-practice/) study found that AI helped creative professionals begin exploring but tended to pull their work toward conventional structures and “aesthetic sanitization.” [StoryScope](https://arxiv.org/html/2604.03136v6) found a similar pattern in fiction: stories from five different models clustered within a shared narrative space, while human stories were more structurally diverse.

For strategy it requires recognizing not only which novelty has meaning, but factoring components of opposition and changing context.
