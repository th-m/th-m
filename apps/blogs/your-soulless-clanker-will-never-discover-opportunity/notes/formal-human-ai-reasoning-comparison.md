# Formal Comparison of Human and AI Problem Solving

## Status and scope

Working note for comparing established human cognition with ordinary, current,
silicon-based language-model inference. The purpose is to separate conclusions
that follow deductively from empirical premises from broader claims that remain
open.

The central distinction is:

> Human reasoning and current AI inference are not the same physical process.
> This does not prove that they cannot share algorithms, functions, or
> behavioral capabilities.

## Notation

| Symbol | Meaning |
| --- | --- |
| $H$ | A human reasoning process. |
| $A$ | An inference process in a conventional silicon AI. |
| $x,y$ | Arbitrary processes being compared. |
| $B(x)$ | $x$ is constitutively biologically instantiated. |
| $\neg$ | Not. |
| $\land$ | And. |
| $=$ / $\neq$ | Identical to / not identical to. |
| $\Rightarrow$ | Implies: if the left side holds, the right side follows. |
| $\nRightarrow$ | Does not imply. |
| $\leftrightarrow$ | If and only if; both expressions have the same truth value. |
| $\equiv$ / $\not\equiv$ | Equivalent / not equivalent in a specified respect. |
| $H(Y)$ | Information entropy: uncertainty about $Y$. |
| $I(X;Y)$ | Mutual information: how much knowing $X$ reduces uncertainty about $Y$. |
| $\theta$ | A model's learned parameters. |

## Physical non-identity

Every established instance of human reasoning is at least partly realized by a
living biological system:

$$
B(H)
$$

Ordinary silicon AI inference is not biologically instantiated:

$$
\neg B(A)
$$

Identical processes must share the same constitutive properties:

$$
x=y \Rightarrow \bigl(B(x)\leftrightarrow B(y)\bigr)
$$

Therefore:

$$
H\neq A
$$

More precisely:

$$
H\not\equiv_{\text{physical}}A
$$

This does not entail:

$$
H\not\equiv_{\text{functional}}A
$$

Physically different mechanisms can implement the same abstract operation. A
mechanical calculator and an electronic calculator can both add. Human
language processing and inner speech may also contain predictive or sequential
dynamics that admit an autoregressive description. Such overlap would not make
a biological nervous system algorithmically identical to a transformer.

## Matched causal components

Motivation should be compared with goal source, while metabolism should be
compared with electricity. Mixing those categories makes the comparison appear
stronger than it is.

| Dimension | Human reasoning | Current LLM inference |
| --- | --- | --- |
| **Physical substrate** | A living nervous system and body. | Nonbiological electronic computation. |
| **Energy** | Metabolic energy. | Electrical energy and computational hardware; not necessarily a GPU. |
| **Information source** | Perception, interoception, memory, language, culture, and prior embodied experience. A particular reasoning episode does not require fresh sensory input. | Digitized input, learned parameters, context-sensitive numerical representations, and optional tool results. Embeddings are one component rather than the whole process. |
| **Goal source** | Endogenous needs, affect, habits, curiosity, obligations, and externally assigned tasks. Not all human reasoning requires conscious motivation. | Initial objectives, execution conditions, permissions, and evaluation criteria are externally designed or delegated. A running system may derive instrumental subgoals. |
| **Processing dynamics** | Biological electrical and chemical activity whose relation to reasoning and consciousness is incompletely understood. | Mathematically specified transformations followed, in an autoregressive LLM, by repeated calculation and decoding of token probabilities. |

## Inference is a component of reasoning

*Inference* and *reasoning* are used inconsistently across philosophy,
psychology, and computer science. For this comparison, define inference
minimally as a transition from premises or evidence to a conclusion.

Let:

- $P$ = the information treated as premises or evidence;
- $c$ = a candidate conclusion;
- $G$ = the goal or evaluative criterion governing a task;
- $P\leadsto_x c$ = process $x$ produces $c$ from $P$; and
- $P\models c$ = $c$ is a logical consequence of $P$.

Both a human and an AI can perform an observable inferential transition:

$$
P\leadsto_H c
$$

$$
P\leadsto_A c
$$

Producing a conclusion does not by itself establish that the conclusion is
entailed, true, understood, or consciously experienced:

$$
(P\leadsto_x c)\nRightarrow(P\models c)
$$

$$
(P\leadsto_x c)\nRightarrow c
$$

The first expression separates an actual transition from a *valid* inference;
the second separates production from the *truth* of the conclusion. Humans and
AI can each make valid or invalid inferences.

For an autoregressive language model, a simplified inference pass is:

$$
Z=\operatorname{Encode}(P,K)
$$

$$
t_i\sim p_\theta(t_i\mid Z,t_{<i})
$$

$$
c=\operatorname{Decode}(t_1,\ldots,t_n)
$$

where $K$ is the supplied context and $t_i$ is the next generated token. This
describes how an output is produced, not whether its propositions correspond
to reality. Decoding can also be deterministic, so sampling is not essential
to the distinction. A written chain of thought is generated output and need
not be a complete or faithful record of the internal computation that caused
the answer. Turpin et al. demonstrated instances of this mismatch in
[chain-of-thought explanations](https://arxiv.org/abs/2305.04388); this is a
warning against assuming universal faithfulness, not proof that every such
trace is unfaithful.

Reasoning is the broader, goal-conditioned organization of inference. One
operational definition is:

$$
R_x(P,G,c):=F_x(P,G)\land
\bigwedge_{i=1}^{n}(P_i\leadsto_x c_i)\land
E_x(c_1,\ldots,c_n;G)\land S_x(c)
$$

where:

- $F_x$ frames the problem and selects premises;
- the middle term represents one or more inferential steps;
- $E_x$ evaluates candidate conclusions against $G$; and
- $S_x$ selects the resulting conclusion $c$.

Under this functional definition, humans and suitably configured AI systems
can both exhibit reasoning behavior. The definition does not establish that
their physical processes, understanding, experience, goal sources, or
responsibility are equivalent.

| Dimension | Human reasoning | Current LLM or AI-system reasoning |
| --- | --- | --- |
| **Inferential transition** | Produces conclusions from perceived, remembered, imagined, or communicated information. | Produces conclusions from encoded inputs, learned parameters, supplied context, and optional tools. |
| **Validity** | May be deductively valid, inductively strong, abductively useful, biased, or mistaken. | May be deductively valid, inductively useful, statistically plausible, hallucinated, or mistaken. |
| **Framing** | Can select and revise a frame using embodied history, social learning, affect, and reflection. | Can compare and revise frames represented in its inputs or generated state, subject to its architecture, training, context, and permissions. |
| **Goal source** | May reason from endogenous needs and chosen commitments as well as externally assigned goals. | Receives its governing objective and evaluation conditions from training and deployment; it may derive instrumental subgoals within them. |
| **Meaning and experience** | Words and conclusions can connect to lived, perceptual, affective, and social experience. | Representations encode learned statistical relations; present behavior does not establish lived or conscious understanding. |
| **Revision** | An episode can alter durable beliefs, skills, commitments, and future behavior, although human self-correction is fallible. | Context can be revised during a run; durable base-model change requires an additional storage, learning, or training mechanism. |
| **Responsibility** | A human can be asked to justify premises, values, and actions and can bear epistemic or moral responsibility. | The system can supply evidence and analysis, but responsibility for objectives, reliance, and action remains with the humans and institutions deploying it. |

The strategy boundary follows from the distinction between facts and values.
Let $D$ be descriptive evidence and $N$ a normative premise. Descriptive data
alone do not logically determine a goal:

$$
D\nmodels G
$$

A recommendation can follow only after some normative criterion is supplied:

$$
D\cup N\models G
$$

An AI can estimate consequences, test consistency, retrieve evidence, expose
tradeoffs, and condition recommendations on an adopted goal. It cannot turn
patterns in $D$ into authoritative values merely by making the inference more
fluent or probable. Humans remain responsible for the goal stack: deciding
which ends matter, which constraints are legitimate, and which risks are
acceptable.

## Memory is not record retrieval

Let:

- $H_M$ = human remembering;
- $A_R$ = AI record retrieval;
- $M(x)$ = $x$ retains and recalls its own past experience; and
- $R(x)$ = $x$ accesses stored information.

Under this definition of memory:

$$
M(H_M)
$$

$$
\neg M(A_R)
$$

Therefore:

$$
H_M\neq A_R
$$

Humans and AI systems can both retrieve stored information:

$$
R(H_M)\land R(A_R)
$$

But retrieval does not imply memory:

$$
R(A_R)\nRightarrow M(A_R)
$$

People consult books, notes, photographs, databases, and search engines. AI
systems receive context windows, conversation summaries, vector-search
results, logs, and user profiles. These records can reconstruct behavioral
continuity without establishing recollection by the system. They are analogous
to the notes, photographs, and tattoos in *Memento*: external instructions for
reconstructing continuity that the subject cannot supply through recall.

Human memory is reconstructive and fallible, and its mechanisms are not fully
understood. Shomrat and Michael Levin's
[planarian study](https://doi.org/10.1242/jeb.087809) found a memory-savings
effect after head regeneration. The finding suggests that some learning-relevant
trace survived the process; it did not locate the trace, prove non-brain memory
in humans, or supply a complete theory of memory.

## Imagination, generation, and learning

Let:

- $H_I$ = human imagination;
- $A_G$ = standard AI content generation;
- $C(x)$ = $x$ generates counterfactual representations;
- $U(x)$ = $x$ can durably update its own base knowledge through that episode;
  and
- $D(x)$ = awareness of the generated content is empirically demonstrated.

Both can generate possible states:

$$
C(H_I)\land C(A_G)
$$

Human imagination can sometimes revise the reasoner's durable beliefs,
knowledge, skills, or reasoning:

$$
U(H_I)
$$

An ordinary model-generation episode changes the current computational state
but does not update the model's base weights:

$$
\neg U(A_G)
$$

An external system can save a record, write agent memory, or retrain the model
later. Those are separate update mechanisms rather than learning performed by
the generation episode itself.

Awareness is established for human imagination but not for current AI
generation:

$$
D(H_I)
$$

$$
\neg D(A_G)
$$

Consequently:

$$
H_I\not\equiv_{\text{learning}}A_G
$$

while task-bounded generative overlap may still hold:

$$
H_I\equiv_{\text{generative}}A_G
$$

The sleep-talker analogy is useful only in a limited rhetorical sense:

> AI generation resembles the speech of a sleep-talker insofar as content is
> produced without evidence that the producer consciously experiences or
> understands it.

The analogy does not show that AI output is random, incoherent, or useless. It
also does not prove the absence of artificial experience. Absence of evidence
does not imply evidence of absence:

$$
\neg D(A_G)\nRightarrow\neg Q(A_G)
$$

where $Q(x)$ means that $x$ actually has subjective experience.

## Data input as an information channel

Let:

- $W$ = a state of the world;
- $X_H$ = human sensory input;
- $X_A$ = recorded data supplied to AI;
- $T$ = tokenized data;
- $Z_H$ = a human neural representation;
- $Z_A$ = an AI contextual numerical representation;
- $Y$ = the outcome being predicted; and
- $\hat{Y}$ = a prediction of that outcome.

The input pipelines can be abstracted as:

$$
W\rightarrow X_H\rightarrow Z_H\rightarrow\hat{Y}_H
$$

$$
W\rightarrow X_A\rightarrow T\rightarrow Z_A
\xrightarrow{\theta}\hat{Y}_A
$$

Neither system receives the world in its entirety. Each operates on encoded,
limited signals. Human sensory organs transduce and filter physical signals;
attention further selects among them. AI receives measurements, recordings,
documents, sensor feeds, and other deliberately configured data channels.

### Data-processing constraint

For a processing chain

$$
W\rightarrow X\rightarrow Z
$$

the data-processing inequality gives:

$$
I(W;Z)\leq I(W;X)
$$

For AI, conditional on its existing parameters:

$$
I(W;Z_A\mid\theta)\leq I(W;X_A\mid\theta)
$$

Encoding cannot create new evidence about the current world that was absent
from the input channel. Learned parameters can supply prior expectations, but
a prior supports an inference rather than verifying a new fact.

### Predictive information

The information a representation contains about a target is:

$$
I(Z;Y)=H(Y)-H(Y\mid Z)
$$

Therefore, for fixed $H(Y)$:

$$
\uparrow I(Z;Y)\Rightarrow\downarrow H(Y\mid Z)
$$

The more target-relevant information the representation preserves, the less
uncertainty remains about the prediction.

### Useful and harmful compression

A useful compressed representation retains little information about the full
input while preserving sufficient information about the target:

$$
\min I(X;Z)
$$

subject to:

$$
I(Z;Y)\geq\kappa
$$

where $\kappa$ is the minimum predictive information to preserve. This is the
central intuition of the
[information bottleneck](https://arxiv.org/abs/physics/0004057): discard
variation irrelevant to the target while retaining what predicts it.

Compression also creates blindness. If an encoding $f$ maps two inputs to the
same representation,

$$
f(x_1)=f(x_2)
$$

while their target distributions differ,

$$
P(Y\mid x_1)\neq P(Y\mid x_2)
$$

then the encoder has erased a predictively relevant distinction. Later
reasoning cannot recover that distinction from $Z$ alone.

Tokenization should not automatically be called lossy compression. Many
tokenizers reversibly encode the supplied text. The larger compression occurs
when training condenses corpus regularities into finite parameters and when
the model forms selective contextual representations for prediction.

Human and AI representations are physically different:

$$
Z_H\not\equiv_{\text{physical}}Z_A
$$

They may nevertheless preserve equivalent predictive information for a
particular task:

$$
Z_H\equiv_{\text{predictive}}Z_A
$$

## Information is not truth

[Shannon information](https://ieeexplore.ieee.org/document/6773024) measures
statistical uncertainty and dependence, not truth, reference, or meaning. A
representation can predict a systematically false corpus extremely well.

This distinction applies directly to language models:

> A model does not possess a map of necessarily true relations. It possesses a
> lossy, distributed map of relations found in its training signals.

The model's representation may reflect genuine structure because language and
recorded data contain traces of the world. The same representation can also
preserve convention, fiction, bias, contradiction, error, and mere
correlation. Predictability is therefore not identical to correspondence with
reality.

## Condensed conclusions

1. Human cognition and current silicon AI inference are certainly different
   physical processes.
2. Physical difference does not prove that they share no functions or
   algorithms.
3. Inference is a premise-to-conclusion transition; reasoning additionally
   frames, sequences, evaluates, and selects inferences relative to a goal.
4. Humans and AI can both exhibit inferential and functional reasoning
   behavior without thereby sharing physical mechanisms, lived understanding,
   goal sources, or responsibility.
5. Descriptive evidence alone cannot determine normative goals; AI can inform
   strategy, but human agents remain responsible for the goal stack.
6. Human memory is not equivalent to AI retrieval from stored records.
7. Human imagination and AI generation can both produce possibilities, while
   differing in demonstrated awareness and in whether the episode durably
   updates the reasoner itself.
8. Both human and AI prediction depend on encoded, incomplete information.
9. Predictive compression is useful only when it preserves distinctions
   relevant to the target.
10. Neither statistical information nor predictive accuracy establishes truth,
   meaning, lived experience, or responsibility.
