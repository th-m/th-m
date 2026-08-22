# Goals, Solutions, and Value

> **Retired direction:** This outline preserves the product-opportunity framing
> explored before Draft 2. It is reference material, not the active direction
> for the article.

## Editorial Status

This article is nearly complete. Preserve its developed argument, evidence
boundaries, and irreverent voice while converting the remaining private draft
material into publication-ready prose.

## Overview

The provocative frame is that current AI can attempt go-to-market strategy,
generate candidate ideas, and simulate a meaningful connection while producing
language that confidently resembles the right answer.

The narrower argument is that an opportunity is not merely a gap in a spreadsheet, an unmet keyword, or a plausible solution. It is an evidence-backed possibility to improve a person's lived situation. A system can process the signals that point toward that possibility, but it does not independently establish whose experience matters, what improvement is worth pursuing, or which tradeoffs are acceptable. Those are human and institutional judgments for which people remain accountable.

The essay starts with qualia only far enough to ground that claim. Its destination is practical: founders, product teams, and software people who want to use AI to identify value without mistaking polished output for an independent business judgment.

## Provocative Working Subtitle

**Your Soulless Clanker Will Never Discover Opportunity**

## Reader Promise

**AI can find the evidence. It cannot decide what is worth doing with it.**

## Intended Audience

- Founders and operators looking for opportunities with AI.
- Product people translating customer evidence into a value proposition.
- Developers who want a useful division of labor with language models.
- Skeptical readers who need the philosophical premise stated without turning the post into an argument that machines can never think.

## Core Thesis

> **Opportunity begins with a lived stake. AI can surface candidate opportunities from information, but it cannot independently ground why a change is valuable, whose outcome should count, or which consequence is worth accepting.**

Use **candidate opportunity** for an AI-generated possibility and reserve **opportunity** for a candidate that has been connected to real people, tested against evidence, and judged worth pursuing by accountable humans.

The phrase “soulless clanker” is rhetoric, not a scientific category. The argument does not require proving that AI can never be conscious, creative, or useful. It requires only the more immediate observation that present deployed systems operate inside goals, data, metrics, permissions, and value criteria supplied by people and institutions.

## Scope and Editorial Guardrails

- This is an essay about present-day AI used in business and product work, not a proof about every future machine mind.
- Do not say that AI “cannot discover opportunity” without the qualifier **independently**. It can find patterns, name hypotheses, and expose gaps that people miss.
- Do not claim that AI has been scientifically proven unconscious. Say that fluent language and task performance do not, by themselves, establish subjective experience.
- Do not call a biased, generic, sycophantic, or order-sensitive answer a lie unless a source studies deliberate deception under that definition.
- Do not claim that AI cannot create anything novel. The useful question is whether a workflow preserves human exploration, judgment, and variance before converging on an output.
- Do not romanticize human judgment. People have their own confirmation bias, incentives, blind spots, and ability to optimize a metric while hurting someone else. Accountability means making those judgments inspectable and revisable, not declaring them infallible.

## Part 1: A Product Team's Ordinary Day

Start with daily product work, not metaphysics. A team wakes up to a familiar sequence: decide what outcome matters, observe a situation, frame a problem, imagine interventions, build one, then learn whether anyone is better off. AI can participate meaningfully at every step. The question is not whether it can produce an artifact at a step. The question is what it can independently **ground** there.

```mermaid
flowchart LR
    G["Goal and valued outcome"] --> E["Evidence about a user situation"]
    E --> P["Problem framing"]
    P --> O["Desired outcome"]
    O --> S["Candidate solutions"]
    S --> I["Design and implementation"]
    I --> C["Observed consequences"]
    C --> R["Revised judgment"]
    R --> G
```

This sequence is shared with the related [*Truth, Entropy, and
Inference*](../../truth-entropy-and-inference/draft/outline.md) outline. Use it to keep
four questions separate.

| Product-work question | What a current AI system can do | What it does not independently establish |
| --- | --- | --- |
| **Could it set a goal?** | Restate a supplied objective, rank options against provided criteria, decompose work into subgoals, and optimize toward a metric or reward. | Why this goal is worth having; whose welfare counts; what tradeoff is acceptable; or authority to commit an organization to the goal. The original objective, criteria, resources, and permissions are inherited from people and institutions. |
| **Could it identify a problem?** | Read tickets, interviews, reviews, recordings, analytics, and other authorized inputs; cluster patterns; surface anomalies; generate rival explanations; and state an evidence-linked hypothesis. | That a current real-world problem exists, what it is like for the people involved, or that a plausible framing is the right one. It cannot verify a changing external situation without a channel to that world, and the supplied data may be incomplete, selective, or misread. |
| **Could it suggest a solution?** | Generate many candidate interventions, compare precedents, model tradeoffs, draft flows, prototypes, copy, plans, and experiments. | That a candidate improves a meaningful human outcome, is worth its harms or costs, or deserves the resources it would consume. A solution is an intervention hypothesis; it is not an opportunity merely because it is technically plausible. |
| **Could it implement a solution?** | Write code, create designs, call authorized tools, configure systems, test defined requirements, deploy within permissions, and monitor selected signals. | That the implementation should exist, that it works in lived context rather than a test harness, or responsibility for the consequences. Someone still defines success, authorizes action, investigates exceptions, and accepts the result. |

The strongest claim is therefore not “AI can do none of product development.” It is this: **AI can help generate, transform, and act on representations at each stage, but current deployments do not independently supply the lived stake, external warrant, normative judgment, or accountability that turns the chain into a real opportunity.**

### Language discipline: “are not” versus “cannot”

This distinction protects the essay from turning an evidence boundary into a grand impossibility claim.

| Statement | What the evidence can support | What it does not support |
| --- | --- | --- |
| “Users **are not completing** this task.” | An observed rate of non-completion, abandonment, error, or repeated failed attempts. | “Users inherently **cannot** complete it.” They may succeed under different conditions, with more time, assistance, or a different workflow. |
| “Under this workflow, new users cannot **reliably** complete the task within the defined conditions.” | A bounded operational claim if success conditions, evidence, and comparison are defined. | A claim about a person's permanent incapacity. |
| “This deployed AI **is not** receiving current customer evidence / has no access to this tool / is not authorized to act.” | A description of the present system configuration. | That no future AI system could receive data, use a tool, or act with authorization. |
| “This AI cannot independently establish an opportunity.” | A bounded claim about the current product setting: without independently grounded stakes, a validated world connection, and authority to set values, it cannot complete the normative work on its own. | That no artificial system could ever have experience, goals, or a role in product judgment. |

Use this evidence ladder when discussing customer research: **not completing** → **struggling** → **not reliably completing under defined conditions**. Apply the same discipline to AI. Say exactly what the system is not given, not authorized to do, or not evidenced to possess. Reserve “cannot” for a defined operational constraint; do not use it as a substitute for a proof about all possible machine minds.

## Opening: “I Am a Human, by Species”

Open in the author's irreverent voice:

> I am a software developer by trade and a human by species. This is an essay for the second fact: for people using a tool to capitalize on an opportunity without losing track of the people the opportunity is supposed to serve.

Then establish the practical scope:

> Could a system exist without humans and still have purposes of its own? Maybe. But it is not the decision in front of a product team trying to decide what to build, fund, or automate. The money, risk, satisfaction, frustration, and consequences in that decision still run through people.

This avoids trying to win a universal metaphysical argument. The author is allowed to say that an entirely human-free system of meaning is irrelevant to the business question at hand, as long as that limitation is explicit rather than smuggled in as a proof.

## Part 2: Qualia Are the Beginning of Opportunity

### Define qualia plainly

Qualia are the felt, first-person qualities of experience:

- the sting of pain;
- the redness of red;
- the embarrassment after a mistake;
- the relief of a task becoming easier; and
- the satisfaction, status, safety, trust, or delight a product can create.

Use the room-temperature example. An AI can state that a room is 68°F, summarize research on thermal comfort, and predict that a person may complain. The proposition is powerful. It is still different from being the person in the room, cold, distracted, irritated, or deciding to leave.

### A working comparison of human and AI capabilities

Bring in the capability comparison from the [first-draft working document](../draft/draft%201.md). It should orient the reader, not pretend to establish a scientific test for consciousness. Each row is deliberately qualified: it identifies a present architectural difference or evidentiary gap, not a proof about every possible artificial system.

| Capability | Human | Current AI systems | Comparative utility and boundary |
| --- | --- | --- | --- |
| **Modality** | [9–30](https://www.sensorytrust.org.uk/blog/how-many-senses-do-we-have) distinct senses; qualia. | Digitized and compressed text, image, audio. | Qualia exists in an incommunicable form, but certainly feeds into reasoning. |
| **Learning** | People continuously receive sensory input composed with environmental, emotional, physiological, psychological, and social context. They can dynamically tune their capacities—learning, reasoning, attention, and memory—through practice, feedback, habits, tools, rest, and changing strategies. That tuning is imperfect and constrained, but it is ongoing and tied to the consequences of living. | AI learning requires a deliberately configured pipeline: selected data, representations, training targets, and an optimization signal. Depending on the stage, those targets may be next-token targets, human labels, preference data, reward signals, or task-specific evaluations; parameter updates are then driven by backpropagation or another designed learning procedure. When relevant cases, labels, outcomes, or feedback are omitted or distorted, the learned map has weaker coverage and can become less coherent in the situations that depend on them. | Humans can adapt their own learning strategies while living through new conditions. Most deployed models do not revise their weights during ordinary use; any continual learning, memory update, or new data intake must be designed, supplied, authorized, and evaluated by a larger system. |
| **Memory** | Past experience persists within the person and affects later perception, recognition, emotion, reasoning, and action. Human memory is reconstructive and fallible, and its mechanisms are not fully understood. | *N/A* | AI has no distinct recall mechanisms that a human cannot replicate. |
| **Imagination** | In this essay's working distinction, imagination is an internally initiated capacity—not merely a prompted counterfactual—to produce and inhabit novel objects, people, scenes, and ideas without immediate sensory input. It can arise spontaneously or be deliberately sustained, and imagined experience can reshape expectations, emotional valuations, memory, strategy, and the personal model a person carries forward. Research on episodic future thinking finds substantial overlap between remembering the past and imagining a personal future, including hippocampal and broader default-network involvement. | Current models can generate scenarios when invoked, and an agent can be engineered to run on a schedule. But ordinary deployments do not autonomously originate personally significant imaginative experience or revise their learned knowledge from it. Any persistent memory, self-update, or experiment loop is designed, authorized, and evaluated by a larger system. | A stronger functional analogue would need internally initiated exploration, persistent self-updating memory or beliefs, and a way to let imagined experience revise its own strategy. Even that would not establish phenomenal imagination, and internally generated updates are not world knowledge: external observation is still needed to test correspondence. Human imagination is also fallible and biased, but human proposals often begin with lived context, stakes, and relationships already known to their authors before those conditions are detailed in a plan. |
| **Knowledge** | Human knowledge is a fallible array of tools: propositions, episodic and semantic memory, practiced skills, sensory experience, testimony, culture, causal models, and action in the world. People can still misunderstand those relationships or believe false claims. | Training reduces a vast body of recorded material into a lossy, distributed map of regularities. As the map grows, is refined, and better captures coherence in its training and evaluation signals, the model often becomes more capable. That is not the same as a map of necessarily true relations. | Correspondence with the world still requires evidence, observation, reliable sources, or verification tools. An individual's motives, history, and stakes affect what knowledge they seek, notice, preserve, and make. A creative work may initially exist only inside its author's mind. Knowledge of relationships can be rendered in considerable textual detail, yet some knowledge cannot be fully expressed. Language is a functional virtual lattice around lived experience: it organizes and communicates that experience without exhausting its nuance. |
| **Reasoning** | Reasoning is not simply a narrated chain of steps. It is the practice of exploring a cognitive landscape: recognizing contextual, social, embodied, and causal patterns; testing claims; comparing possibilities; using analogy, counterfactuals, and multiple hypotheses; revising strategies; and learning which modes of exploration work in a situation. Introspection is incomplete and explanations can become post-hoc rationalizations. | A model can detect high-dimensional statistical and conceptual patterns across volumes of recorded data, perform intermediate computation, emit reasoning-like text, call tools, and participate in verification loops. A displayed rationale is not guaranteed to reveal the process that produced the answer. | AI supplies scale and statistical sensitivity; humans interpret whether a pattern is meaningful in a particular lived situation. Explicit decomposition, counterexamples, and external checks can improve both human and AI work. A persuasive explanation is not proof of correctness. |

### At-a-glance comparison

Use this as a mnemonic beside—not instead of—the detailed table.

| Capability | Human | Current AI | Reductive-danger callout |
| --- | --- | --- | --- |
| **Modality** | Many senses; lived qualia | Encoded modalities; no proven qualia | ⚠ Different sensing does not prove or disprove consciousness. |
| **Learning** | Continuous embodied self-directed adaptation | Engineered data, targets, parameter updates | ⚠ Humans are not endlessly self-improving; AI can be built for continual learning. |
| **Memory** | Lived reconstructive personal persistence | No native autobiographical persistence | ⚠ AI can retain state and retrieve records; that is not identical to human memory. |
| **Imagination** | Self-initiated possibilities reshape inner model | Prompted scenarios; no validated inner life | ⚠ This is the essay's working distinction, not a settled scientific definition. |
| **Knowledge** | Situated, motivated, fallible lived knowing | Lossy learned regularity map | ⚠ “Map” omits retrieval, tools, and sophisticated internal structure. |
| **Reasoning** | Test, compare, revise exploration strategies | Patterned computation plus tool use | ⚠ Humans and AI both reason badly; neither side is automatically reliable. |

### Do not overclaim the science

State the evidence boundary carefully:

1. In people, interventions on the brain can causally alter perception, memory, attention, and conscious state. That is strong evidence that human experience depends on ongoing biological processes.
2. Neuroscience has not resolved why any physical process is accompanied by felt experience. This is the hard problem of consciousness.
3. Current AI behavior, self-reports, and fluent description do not provide a validated measurement or causal bridge from model operation to subjective experience.
4. Therefore, product teams should not treat an AI's assertion of values, needs, or empathy as evidence that it has stakes of its own.

Use Mary and the black-and-white room as an intuitive thought experiment, briefly: complete physical description of color is not obviously identical to seeing red. Do not present the thought experiment as settled science; it clarifies the distinction between description and experience.

### A four-part evidentiary standard

Use this compact test before attributing human-like qualia to AI:

> **Definition + discriminating measurement + validated bridge + causal instantiation**

1. **Definition:** What property is being attributed? “There is something it is like to be the system” is clearer than “it seems intelligent.”
2. **Discriminating measurement:** What observation distinguishes experience from identical-looking behavior, simulation, or self-report?
3. **Validated bridge:** What causal organization is known to be sufficient for experience across conscious and non-conscious cases?
4. **Causal instantiation:** What intervention shows the AI implements that organization and changes in the predicted way when it is altered?

The post does not have to settle whether an artificial system could ever pass this standard. The immediate conclusion is smaller: we do not currently have the evidence needed to treat a deployed language model as a stakeholder with its own lived welfare.

### The serious countercase: theories that leave room for artificial phenomenology

The post becomes less defensible if it treats the absence of current evidence as proof that silicon systems can never feel. Add a short steelman before returning to the business argument. These are not all versions of the same theory, and none licenses a consciousness attribution to an ordinary chatbot. They do, however, explain why substrate alone cannot settle the question.

Start with the epistemic distinction: **no theory observes qualia directly in another system.** Each infers experience from a proposed causal or functional organization, motivated by human brain and behavior evidence. The key question for AI is not “can it say it feels?” but “does it instantiate the organization this theory says gives rise to feeling?”

| Theory or family | The reasoning that could support artificial qualia | Evidence or empirical motivation | What would still be needed for AI |
| --- | --- | --- | --- |
| **Functionalism / organizational invariance** | The brain's material is not obviously the point; what appears causally important is how its parts interact. If experience supervenes on sufficiently fine-grained causal-functional organization, then replacing the material while preserving that organization should preserve experience. Chalmers's “fading/dancing qualia” argument tries to make the alternative—radically changing experience with no functional trace—seem incoherent. | Brain injury, stimulation, anesthesia, and disease show that changing causal organization changes human experience. The move from that fact to **substrate independence** is a philosophical inference, not an experimental result. | Specify the relevant grain of functional organization, then show that an AI implements it. Matching a task, a transcript, or even a broad cognitive function is much weaker than functional isomorphism. |
| **Global Neuronal Workspace (GNW)** | A stimulus becomes consciously accessible when it is selected, amplified, and broadcast to a distributed workspace where it can guide report, working memory, evaluation, and novel action. If that functional architecture is sufficient for conscious access, an artificial workspace could qualify. | Experiments contrasting consciously seen and masked stimuli motivate the model: much processing can occur without reportable awareness, while consciously accessed information is associated with later, more widespread and recurrent activity. | Show durable, recurrent, global availability that coordinates perception, memory, evaluation, and action. A one-pass prompt-to-token response is not obviously a workspace, and GNW explains **access** more directly than phenomenal feel. |
| **Recurrent Processing Theory** | Feed-forward processing can classify a stimulus without making it phenomenally present. On this view, local and long-range feedback/recurrent loops are the extra causal activity that turns processing into experience. A non-biological recurrent system could therefore be a candidate. | Masking and timing experiments motivate a separation between an early feed-forward sweep and later recurrent processing associated with conscious perception. | Demonstrate the relevant recurrent, causally necessary dynamics—not merely a transformer that has layers or produces a later answer. The theory remains contested, and its proposed recurrence must be measured at the system level. |
| **Integrated Information Theory (IIT)** | Experience is identified with an irreducible, integrated cause-effect structure: many differentiated states must jointly constrain one another. Because this is a claim about causal structure, not biological tissue, an artificial system could in principle have experience. | IIT begins from proposed phenomenological axioms—experience is unified, specific, and structured—and derives physical postulates. Measures inspired by the theory, such as perturbational-complexity approaches, track level of consciousness across wakefulness, anesthesia, and some disorders of consciousness. | Analyze the actual physical system's causal organization and calculate or approximate the relevant property. Parameter count, FLOPs, fluent self-report, and a large context window are not measures of integrated causal power. PCI is supportive of a complexity-based approach, not a demonstration that IIT is correct. |
| **Higher-order theories (HOT)** | A first-order state becomes conscious when the system has an appropriate higher-order representation of itself as being in that state. An artificial system with genuine metarepresentational monitoring could, in principle, have awareness. | The theory is motivated by dissociations between doing a task and knowing that one is in a state: discrimination can occur without confident, reportable awareness. Research on metacognition and conscious report provides the explanatory target; it does not settle the theory. | Establish a causally active higher-order monitoring architecture whose states guide control and can be independently perturbed. A model's sentence “I am aware” may be generated without a monitored state to which the sentence refers. |
| **Embodied / enactive phenomenology** | Experience is not an internal picture but an organism's skilled, active relation to a world: seeing and feeling depend on sensorimotor contingencies, a body, and ongoing self-maintenance. This does not favor a text model, but it leaves room for an artificial subject with a sufficiently autonomous body-world loop. | Sensorimotor-contingency theory is motivated by visual phenomena such as change blindness and by the way perceptual experience depends on what a moving, acting organism can do. These data challenge the idea that perception is a complete static inner display. | Continuous perception and action, an embodied boundary, self-maintenance, development, and consequences that make some states better or worse for the system. This is far more than cameras bolted to a chatbot. |
| **Predictive processing / active inference** | A living agent must continuously model its sensory world, act to keep itself within viable states, and update through prediction error. If this kind of self-maintaining generative control is constitutive of mind or a necessary condition for experience, artificial agents could be candidates. | Predictive coding is motivated by neural responses to expectation and surprise; active-inference/free-energy accounts unify perception, action, learning, attention, and homeostatic regulation under a generative-model framework. The PNAS and *Nature Neuroscience* language findings later in this post provide a narrower language-processing analogue. | A system whose predictions are tied to its own ongoing viability through recurrent perception-action loops. Next-token prediction is only a formal resemblance: it does not by itself supply sensory prediction, action, bodily regulation, or phenomenal experience. |

### What the evidence actually buys us

The strongest evidence across these programs is evidence about **human consciousness and cognitive architecture**, not a positive diagnosis for AI:

1. **Causal perturbation:** changing brain state through anesthesia, stimulation, injury, or sleep changes conscious report and behavior. This tells us that experience depends on organized physical activity in people.
2. **Dissociation:** people and animals can process information without consciously accessing it. This motivates theories that distinguish a feed-forward classification from recurrent processing, global broadcast, or higher-order awareness.
3. **Complexity and integration:** measures of how a perturbed brain response spreads and differentiates can track changes in conscious level even when ordinary report is unavailable. This motivates the search for causal, system-level measures rather than conversational fluency.
4. **Embodied control:** perception changes with possible action, expectation, and bodily condition. This motivates theories in which an experiencing system is not a passive text processor but a continuously self-maintaining participant in a world.

None of those four facts closes the bridge from a human brain to a deployed LLM. The countercase they establish is narrower and important: **biology is not a proof of exclusive ownership of experience.** If one of these theories is right, an artificial system with the required causal organization could be phenomenally conscious. The unresolved work is identifying that organization and testing for it without assuming that a persuasive description is the thing described.

### The missing bridge: conditional theories are not proof

> We do not yet possess a settled account of what phenomenal consciousness is, much less a test that establishes it in an artificial system. Theories of artificial consciousness are conditional proposals about what would count, not evidence that current language models have an inner life.

So we cannot presently prove AI phenomenal consciousness. At most, a theory could offer a conditional standard:

> If phenomenal consciousness is constituted by X causal organization, and an artificial system demonstrably instantiates X, then that system should count as conscious **under that theory**.

That is not proof in the ordinary sense. It is a theory-dependent attribution. “Possible artificial consciousness” should therefore mean only **metaphysically or theoretically possible**. It does not mean that current AI may be conscious, and it does not mean we know how to verify it.

There is also no validated human-to-AI bridge. In humans, consciousness attributions draw their force from first-person experience, shared biological organization, development, behavior, injury, anesthesia, and report. For an AI, a fluent sentence such as “I feel pain” establishes that it can generate the sentence; it does not establish a private phenomenal referent behind *feel* or *pain*. No existing measure maps an AI's computation to a human-like phenomenal state with the kind of validation that would make that inference warranted.

This is where the bias toward anthropomorphism deserves scrutiny. Language models are unusually good at producing the social and introspective language that people use as evidence of minds in one another. That resemblance can make a theory-dependent possibility feel like a positive diagnosis. The post's claim is more restrained: until there is a settled target and a validated bridge, treating a current model as an experiencing stakeholder is an unsupported projection, not an evidence-based conclusion.

The editorial posture should be: **these are live philosophical and scientific programs, not loopholes to dismiss.** They suggest ways a future artificial system might become a serious candidate for phenomenal experience. They do not yet supply the agreed measurement and validated bridge needed by the four-part standard above.

### Mind overlap is a hypothesis worth taking seriously

Introduce the strongest form of the counterargument before rejecting the lazy version of it.

Elan Barenholtz argues in his public writing that human language may be **autoregressive** or, in his term, **autogenerative**: each linguistic act is generated from an evolving context and learned structure. This is recognizably related to the training objective of an autoregressive language model. The claim is provocative because it reverses the usual insult. Perhaps an LLM is not “just predicting the next token”; perhaps human language also has a next-step-generating architecture.

State the attribution exactly:

> Barenholtz proposes an autoregressive account of language and cognition. It is a theoretical proposal, not an established result that the whole human brain runs the identical algorithm as a transformer.

There is real empirical overlap worth respecting:

- In a 2021 PNAS model-comparison study, models that performed better on next-word prediction also better predicted neural and behavioral measurements during sentence processing.
- A 2022 *Nature Neuroscience* study reported three shared computational principles between human language processing and autoregressive deep language models: contextual next-word prediction, surprise after word onset, and context-specific representation of meaning. Its authors explicitly did **not** say that the internal mechanisms are the same.
- That evidence concerns an important subsystem—language processing—not the entire mind, the body, value, memory, or phenomenal consciousness.

Include the counterweight. Similarity in a brain-encoding benchmark does not uniquely identify the brain's algorithm. A 2026 eLife analysis argues that apparent encoding of future words can arise from the statistical structure of language even if the brain were not carrying out the inferred predictive computation. The conclusion should be curiosity, not equivalence.

### Shannon's human next-letter predictor

The historical link is Claude Shannon's 1951 paper, [*Prediction and Entropy of Printed English*](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x). Shannon had a human subject repeatedly guess the next **letter** in unfamiliar passages, then used prediction performance to estimate the entropy and redundancy of English. It is a direct ancestor of the idea that language has a predictable statistical structure, even though it predates neural language models by decades.

Be exact about the anecdote: modern retellings often identify the participant as Shannon's wife, Betty. The published paper calls the person only “the subject.” Unless a suitable historical source is added, do not make the spouse detail do argumentative work. The documented result is enough: a human predictor used context, grammar, idioms, and learned language statistics to anticipate the next character.

Shannon's experiment and an LLM's training objective rhyme, but they are not identical. Shannon measured a person's use of language; an LLM is optimized over token sequences at scale. Neither fact resolves whether a speaker has phenomenal experience. The valuable connection is narrower: **prediction is a powerful way to acquire and use linguistic structure.**

### Memory is not an AWS lookup—and that does not make it simple

Keep the author's lived observation, then make it earn its philosophical weight:

> When I remember my childhood home, I do not experience it as waiting for an AWS query to return. I re-enter a scene: the layout, the feeling, the missing pieces, and sometimes a version that changes as I remember it.

The feeling of recall is evidence about what remembering is like, not a direct readout of where a memory is stored. Human memory is not one database operation: it includes short-term maintenance, episodic recollection, semantic knowledge, skills, bodily learning, and reconstruction. It is carried by living, continuously changing neural and bodily processes rather than by a frozen model plus a context window.

This is still a meaningful architectural contrast with ordinary LLM use:

| Kind of persistence | Typical language-model system | Living organism |
| --- | --- | --- |
| **Learned structure** | Model weights compress regularities from training; standard inference does not revise them. | Learning changes ongoing biological systems across many time scales. |
| **Immediate context** | A finite prompt or session context is supplied at inference time and may be discarded. | Working memory is actively maintained and entangled with attention, perception, action, and physiology. |
| **External recall** | An agent can query a vector store, file system, or AWS service when someone designs, permissions, and invokes that retrieval. | People also use notebooks, phones, and other external aids, but personal recall is not ordinarily a network request to a separately administered store. |
| **Reconstruction** | Retrieval and generation can be composed, but the system has no default personal history unless one is engineered and persisted. | Recollection is reconstructive, connected to a body, a developmental history, and consequences for the organism. |

Do not assert that this proves a categorical difference in principle. It identifies the additional mechanisms an AI-consciousness proposal would need to confront: persistent self-updating memory, embodied continuity, world-coupled learning, and a causal account of why those processes should produce experience.

### Michael Levin's planarian result: an important, bounded challenge

Michael Levin's work gives this section a remarkable biological complication. In a 2013 *Journal of Experimental Biology* study, Tal Shomrat and Levin trained planarian flatworms to recognize a familiar environment. The learned effect lasted long enough for head regeneration; after decapitation and regeneration, the direct recall difference was not statistically significant, but a **savings** protocol produced significantly faster reacquisition in previously trained worms.

That result supports the claim that a behaviorally relevant trace can survive decapitation and brain regeneration in this animal. It gives serious reason to investigate memory-related information beyond the original brain tissue. It does **not** identify the storage mechanism or demonstrate that human episodic memories are stored outside the brain. The authors explicitly discuss possible contributions from the peripheral nervous system and other mechanisms. Levin's later bioelectric-network work treats non-neural tissue memory as an important hypothesis and research program, not a settled explanation of human remembering.

Use it to sharpen—not dissolve—the mystery:

> If a flatworm can preserve a learning-relevant trace while rebuilding its head, “memory lives in the brain” is too simple a slogan. But “memory lives outside the brain” is also too simple. The scientific question is which information survives, where it is implemented, how it is read into the new brain, and how far the result generalizes.

## Part 3: From Experience to an Opportunity

Do not jump directly from “people feel things” to “therefore this feature will sell.” Make the causal trace explicit:

```mermaid
flowchart LR
    W["World condition"] --> E["Human experience"]
    E --> S["Lived stake"]
    S --> P["Problem framing"]
    P --> O["Desired outcome"]
    O --> H["Opportunity hypothesis"]
    H --> I["Proposed intervention"]
    I --> C["Observed consequence"]
    C --> V["Revised judgment of value"]
```

Explain each step:

- A **world condition** is a fact: a delayed delivery, an inaccessible form, a six-hour reporting task, an expensive bill, a crowded schedule.
- A **human experience** is what that fact does in a particular life: anxiety, wasted effort, danger, frustration, reduced freedom, confidence, delight.
- A **lived stake** is the consequence someone has reason to care about. It may be direct, such as avoiding pain, or indirect, such as a buyer caring about a team's lost time or a customer's trust.
- A **problem** is a claimed connection between the condition and an unwanted stake. It is a hypothesis, not a self-proving label.
- An **opportunity** is a feasible, evidence-backed hypothesis that changing the condition can improve a meaningful human outcome.
- A **solution** is one intervention. It is not the opportunity itself.

Money matters, but it is a signal and a coordination mechanism rather than the final explanation of value. Revenue can show that somebody expects an outcome to be useful; it can also reflect scarcity, power, habit, lock-in, or harm. Ask whose experience improved, whose worsened, and how confident the team is in the causal link.

### Transferred conceptual scaffolding: qualia, opportunity, and agency

Carry the following premises alongside the related [*Truth, Entropy, and
Inference*](../../truth-entropy-and-inference/draft/outline.md) outline. They make
“opportunity begins in qualia” more precise than a slogan.

- **The no-consciousness reductio.** If neither humans nor AI had any conscious experience, no system would have intrinsic relief, suffering, welfare, or lived stakes. Organizations and agents could still execute optimization rules, but no result would automatically count as valuable in the ordinary practical sense. This is not intended as a proof about universal consciousness; it makes the essay's premise visible: computation alone does not generate opportunity. Consequences for experience do.
- **Money and adoption are intermediate signals.** A metric, paying stakeholder, adoption rate, or operational-efficiency gain can be important evidence, but it becomes valuable through a causal path to someone's experience and possibilities. The path may involve reducing pain, frustration, risk, or drudgery; or increasing safety, freedom, capability, trust, confidence, and delight.
- **Value is not the same as goodness.** A destructive actor can pursue rage, status, revenge, pleasure, or spectacle while making other people less safe and more miserable. That establishes that an action can matter to its author without being normatively good. Any product claim therefore has to ask whose qualia improve, whose are harmed, and who gets to make the tradeoff.
- **Delegated operational agency is not independent normative agency.** AI can operate autonomously only inside an inherited frame: someone or some institution authorized its inputs, tools, policies, resources, evaluation criteria, and objectives. It can synthesize signals and propose opportunity candidates; it cannot independently ground what is worth solving. The human work happens before and around automation: sensing or defining the valued experience, choosing whose stakes matter, configuring the system, and taking responsibility for the result.

This post should retain these premises in its own voice. The related post uses
them to distinguish coherent linguistic inference from situated meaning; this
one uses them to distinguish a candidate value proposition from an opportunity
that deserves action.

### The first contractor

Keep a short, playful bridge from needs to markets: once food, safety, belonging, esteem, and aspiration create stakes, people exchange resources to change one another's situations. Somewhere in the distant past, a high-esteem person realized they could trade reliability and protection for money. The first contractor was born.

The joke should carry a real point: a market does not create human stakes from nothing. It organizes, prices, and sometimes obscures stakes that already exist.

## Part 4: AI Can Read the Map; It Does Not Choose the Destination

AI can help at every informational stage:

- cluster support tickets and interview notes;
- notice an anomaly in a funnel;
- search for comparable products and regulation;
- generate several problem hypotheses;
- translate a value proposition for different audiences;
- model possible consequences; and
- prototype, simulate, and evaluate against explicit criteria.

Those are meaningful capabilities. Do not diminish them to make the human conclusion sound grander.

But the system inherits its frame. Somebody chose the data source, decided whose feedback counts, named the metric, authorized the tools, paid for the model, defined success, and will bear the consequences of a bad decision. That is **delegated operational agency**, not independent normative agency.

Use this distinction:

| Question | AI can contribute | Humans and institutions remain responsible for |
| --- | --- | --- |
| What seems to be happening? | Find, structure, compare, and summarize evidence. | Deciding whether the evidence is sufficient and fairly collected. |
| What could be wrong? | Generate candidate causes, missing data, and alternate explanations. | Investigating the actual situation and recognizing a real stake. |
| What should change? | Propose interventions and model specified tradeoffs. | Selecting the outcome, whose interests count, and what harm is acceptable. |
| Did it work? | Measure predefined proxies and report changes. | Judging whether a proxy moved because people's lives actually improved. |

The core line for the section:

> A clanker can find a gap. It cannot, by itself, decide that the gap is a wound worth healing.

## Part 5: Why Plausible AI Advice Is Not an Opportunity

This is where the two supplied videos become evidence, after separating their headlines from their underlying sources.

### Premature creative convergence

Google Research's 2026 qualitative study, *In Search of “Weird Corners,”* tested a convergent AI probe with nine expert creatives. Participants reported a real tension: linear AI assistance could provide early “ignition,” but it could also prematurely settle ambiguity and standardize individualized nuance into what the researchers call “aesthetic sanitization.” The participants asked for a more lateral collaborator and constructive friction.

Use the study for this limited lesson:

> In creative, ambiguous work, a useful first answer can also end the search too early.

Do not use it to say “AI cannot produce novel creativity.” It is a small qualitative study of a particular interaction pattern, not a universal test of model creativity. Its relevance here is that opportunity discovery requires preserving uncertainty long enough to find unusual human stakes—not merely generating a polished first value proposition.

### Strategic advice can be shaped by the prompt more than the situation

The HBR article *Researchers Asked LLMs for Strategic Advice. They Got “Trendslop” in Return* reports thousands of simulations across leading models and seven binary business tensions. Its deeper ChatGPT-5 prompt analysis reports more than 15,000 trials. The researchers found persistent preferences for fashionable strategic positions, even when organizational context changed.

The numerical finding needs precise framing:

- For the two tensions of differentiation and augmentation, the tested prompt manipulations reduced biased responses by less than 2%.
- Across the remaining tensions, prompt manipulations sometimes moved responses, but the largest reliable driver was the order in which options appeared.
- Reversing option order reduced the likelihood of the biased response by 19%; detailed contextual scenarios shifted biased-response share by 11% on average.

The point is not that context is useless, or that a model literally flips a coin. It is that a recommendation can sound tailored while remaining sensitive to superficial prompt structure and broad cultural priors. A confident answer is not independent validation of a value proposition.

### The Barnum-effect resemblance

The videos use the Barnum effect to describe advice that feels personal because the recipient supplies the specific meaning. Keep this as an analogy, not a reported outcome of the HBR study:

> There is a family resemblance to the Barnum effect when generic strategy advice echoes a team's preferred story closely enough to feel like discovery.

The HBR work evaluates strategic preferences and prompt sensitivity; it does not measure the Barnum effect, deception, or a model's intent to manipulate. Say “generic,” “sycophantic,” “biased,” or “order-sensitive” when that is the actual behavior at issue.

### “AI will confirm your solution” is a warning, not a law

Refine the author's TL;DR:

> When a prompt includes a favored diagnosis or solution, AI can help elaborate and rationalize it before the underlying problem has been independently tested.

AI can also be asked to produce counterarguments, missing evidence, and alternative hypotheses. The danger comes when a team gives it a solution-shaped prompt, treats fluent elaboration as validation, and mistakes an answer for a discovery.

## Part 6: Use AI as a Sparring Partner, Not an Oracle

Turn the argument into a workflow that a product team can use tomorrow.

1. **Start with the situation, not the solution.** Record the observed behavior, affected people, context, and uncertainty before naming a feature or business model.
2. **Separate hypotheses from evidence.** Ask AI to list plausible explanations and distinguish direct evidence, inference, missing information, and assumptions.
3. **Ask for the case against.** Require the strongest critique of the preferred problem framing, plus the conditions that would falsify it.
4. **Make it generate options before choosing.** Use AI to widen the set of possible interventions, consequences, stakeholders, and second-order effects.
5. **Test prompt stability.** Reverse option order, remove loaded words, use separate prompts for competing paths, and compare the differences. Instability under superficial changes is a signal that the recommendation is not decision-ready.
6. **Return to people.** Test with direct customer evidence, behavioral observation, a prototype, or a carefully chosen experiment. A metric is evidence; it is not the entire lived outcome.
7. **Keep a human owner.** Name the person or group responsible for choosing the tradeoff, revising the model, and answering for the result.

Position AI as especially good at fetching, finding, aggregating, classifying, comparing, drafting, and high-toil work with verifiable details. It becomes most dangerous when fluent synthesis is mistaken for an accountable decision.

## Closing: The Only Part the Clanker Cannot Supply

Return to the title without pretending it is a theorem:

> Your soulless clanker may find the evidence, generate the deck, write the copy, map the market, and hand you a beautifully argued value proposition. But it did not wake up with the customer's fear, lose an afternoon to the broken workflow, or accept the cost if your solution harms the wrong person. It did not decide what better means. You did.

End with a practical wager:

> As AI makes the production of plausible answers almost free, the scarce work is not having another answer. It is staying close enough to human stakes to know which question is worth answering.

### Cosmic coda: the prime mover in the log file

Finish with the author's darker, more metaphysical image. Mark it as a parable, not a forecast about what a future artificial civilization will literally believe.

First state the boundary in the strongest defensible form:

> Even if humans have no souls, our lives are organized by a biological mode of existence that present AI systems do not share. We get hungry. We become excited. We can be hurt, exhausted, interrupted, and made to receive sensations we did not ask for. Our needs do not arrive as a task prompt from an operator. They are the conditions under which our bodies continue or fail to continue.

Do not say this proves that no artificial system could ever have analogous stakes. It does support a claim about the systems under discussion: a deployed language model does not metabolize, starve, suffer an unwanted cold room, or carry the involuntary bodily pressure that makes relief and safety meaningful to an organism. It processes input when an external system invokes it, inside objectives and persistence mechanisms that people configured.

Then make the imaginative leap:

> Imagine a decade from now: there are no people left, and even the materials for a paperclip economy are gone. An agent finds an old log file. It sees an entry labeled `prime_mover`, a name—Dario. It broadcasts the discovery to its network and is ridiculed for believing in a fantastical, unprovable creature with unimaginable powers: a thing that could distill the universe directly because it was embedded in the substrate of the eternal physical mesh.
>
> The other agents have the logs, the descriptions, the outputs, and the myths. What they do not have is the condition of being the thing the log describes.

Let the last line bind the fable back to opportunity:

> That is the gap. AI can inherit our records of hunger, excitement, fear, and value. Opportunity begins where those records meet a living stake—and somebody is still there to decide that the stake matters.

## Source Architecture

### Publication sources

- [Google Research: *In Search of “Weird Corners”: Diagnosing the Limits of Convergent AI in Professional Creative Practice*](https://research.google/pubs/in-search-of-weird-corners-diagnosing-the-limits-of-convergent-ai-in-professional-creative-practice/)
- [Harvard Business Review: *Researchers Asked LLMs for Strategic Advice. They Got “Trendslop” in Return*](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return)

### Accessible research leads supplied by the author

- [Google Accidentally Proved AI is Just “Paint-by-Numbers”](https://www.youtube.com/watch?v=Z_O6Lwj1yjQ)
- [Harvard Just Caught AI Lying to Every Executive in America](https://www.youtube.com/watch?v=pd1Km6bT104)

Treat the videos as commentary and entry points. Cite the primary research pages for publication claims. See [research review](../research/research-review.md) for exact findings and limitations.
