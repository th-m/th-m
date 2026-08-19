# Qualia, Opportunity Spaces, AI, and Humans

## Status and central question

Draft notes for a possible future post. The practical question is where AI fits in the path from values to consequences:

> **Values → goals and vision → strategy → problem framing → solutions → implementation.**

AI can be useful throughout that path. The question is which parts it can help represent, analyze, or execute, and which parts still require an accountable human judgment about what matters.

## Working claim

Current LLMs may process multiple data modalities and can transform large amounts of information into plausible language, code, analysis, and plans. They have no demonstrated felt experience, needs of their own, or responsibility for the consequences of a choice. That does not prove artificial consciousness is impossible; it means chatbot behavior is not presently evidence that it exists.

Human cognition and current silicon AI inference are certainly different physical processes. Neither statistical information nor predictive accuracy establishes truth, meaning, lived experience, or responsibility.

Strategy is the human accountability boundary. AI can contribute evidence, alternatives, simulations, and analysis. Humans and their institutions own the trade-offs, framing, values, authorization, and consequences.

## Human and AI problem-solving capabilities

For this comparison, **AI system** means a current model supplied with context, optional external data stores, multimodal inputs, and authorized tools. The table distinguishes memory from stored state and retrieval: people and AI systems can both consult external records, but consulting a record is not the same thing as remembering an experience.

| Capability | Human problem solving | Current AI systems | Comparative utility and boundary |
| --- | --- | --- | --- |
| **Memory** | Past experience persists within the person and affects later perception, recognition, emotion, reasoning, and action. Human memory is reconstructive and fallible, and its mechanisms are not fully understood. Shomrat and Levin's [planarian study](https://doi.org/10.1242/jeb.087809) found a memory-savings effect after head regeneration, suggesting that some learning-relevant trace survived; it did not locate that trace, prove non-brain memory in humans, or provide a complete theory of memory. | A current model has no demonstrated autobiographical or experiential memory. Context, conversation summaries, user profiles, logs, and vector stores are external state re-presented to the model, more like the notes and tattoos in *Memento* than recollection. | Human memory supplies continuity of experience. An AI system can reconstruct behavioral continuity from stored records without thereby remembering the recorded events. |
| **External data stores and retrieval** | People search books, notes, databases, photographs, search engines, and institutional records. | AI systems retrieve documents, database records, logs, embeddings, and saved summaries and insert the results into the current context. | Retrieval is not unique to AI. AI's advantage is the speed and scale at which it can search and synthesize records. |
| **Propositions** | People form and evaluate claims through language, perception, action, memory, culture, testimony, and causal models. They can still misunderstand those relationships or believe false propositions. | The model does not possess a map of necessarily true relations. It possesses a lossy, distributed map of relations found in its training signals. | AI can generate, compare, and transform propositions at great scale. Correspondence with the world still requires evidence, observation, reliable sources, or verification tools. |
| **Chain of thought** | People use deliberate reasoning, intuition, mental simulation, and self-questioning. Introspection is incomplete and explanations can become post-hoc rationalizations. | A model can perform intermediate computation, emit reasoning-like text, call tools, and participate in verification loops. A displayed rationale is not guaranteed to reveal the process that produced the answer. | Explicit decomposition and external checks can improve both human and AI work. A persuasive explanation is not proof of correctness. |
| **Pattern recognition** | People recognize contextual, social, embodied, and causal patterns, sometimes from very little data. | Models detect high-dimensional statistical and conceptual patterns across volumes of recorded data that no person could inspect directly. | AI supplies scale and statistical sensitivity; humans interpret whether a pattern is meaningful in a particular lived situation. |
| **Pattern anticipation** | People anticipate outcomes using causal models, experience, imagination, intuition, and knowledge of a specific situation. | Models predict likely continuations and outcomes from learned regularities, supplied evidence, simulations, and tools. | AI can examine many possibilities quickly. Its predictions remain dependent on the relevance and quality of the patterns and inputs it was given. |
| **Data in** | People continuously receive sensory, bodily, emotional, social, and environmental information, filtered by attention and interpretation. | AI systems receive configured prompts, documents, images, audio, video, telemetry, sensor streams, retrieval results, and tool outputs. | Human input is continuously situated. AI input can be higher-volume but remains bounded by instrumentation, selection, and permission. |
| **Data out** | People produce language, physical action, expression, commitments, social behavior, and changes to their environment. | AI systems produce text, code, images, audio, structured data, plans, and authorized tool actions. | AI makes artifact production fast and inexpensive. Human action remains connected to social authority and responsibility for consequences. |
| **Multimodality** | Perception, memory, emotion, and action are integrated through an embodied life. | Multimodal systems can encode and relate text, images, audio, video, and other data representations. | Processing several modalities does not establish that the system experiences any of them. |
| **Qualia** | Sensory and cognitive activity has a felt, first-person character: pain hurts, red looks like something, and uncertainty or relief feels like something. | Current model behavior and self-description do not provide validated evidence of felt experience. | Qualia are not another input modality. They concern whether processing has a subjective character at all. |

## Goal stack / human–AI collaboration

| Layer | Human responsibility | Useful AI contribution | Boundary to preserve |
| --- | --- | --- | --- |
| **Values** | Determine what is worth protecting, improving, or refusing; decide whose welfare counts. | Surface stakeholder perspectives, precedents, tensions, and omitted consequences. | A model can restate or imitate values; it does not independently ground them. |
| **Goals & Vision** | Choose the desired future and accept responsibility for pursuing it. | Generate candidate goals, clarify measures, expose conflicts, and draft scenarios. | Optimization inherits its target, criteria, and permissions. |
| **Strategy** | Make trade-offs under scarcity and uncertainty; commit resources and accept consequences. | Supply evidence, alternatives, forecasts, red-team analysis, and decision support. | Strategy is the human accountability boundary, not merely a plan-generation problem. |
| **Problem Framing** | Decide what situation deserves attention, how to describe it, and what evidence would change the frame. | Cluster inputs, identify anomalies, propose competing framings, and find missing questions. | A compelling frame can still misidentify the lived problem. |
| **Computational/Mathematical Problems** | Define objectives, constraints, assumptions, and acceptable error. | Model, calculate, optimize, simulate, and explain. | Mathematical success depends on the problem definition. |
| **Code Problems** | Set requirements, review risks, authorize deployment, and own maintenance. | Draft, test, refactor, debug, and document code. | Passing tests is not proof that the right thing was built. |
| **Human Problems** | Listen to people, interpret needs and harms, and decide what response is warranted. | Summarize research, translate, find patterns, and propose interview questions. | A representation of a person's account is not that person's experience. |
| **Congruence Problems** | Reconcile values, incentives, constraints, claims, and actual effects. | Detect contradictions, compare policies, trace dependencies, and audit consistency. | Congruence requires judgment about what should give way. |
| **Solutions & Implementation** | Select, authorize, govern, and remain answerable for an intervention. | Generate options, prototypes, workflows, code, tests, and monitoring. | Implementation is an intervention hypothesis until consequences are observed. |

## Why prompt framing feels important

Prompt framing changes the context from which an LLM predicts its next tokens. A request for a supportive coach, a hostile critic, an expert, or a concise executive summary can change both the answer's content and confidence. This is a useful capability and a risk: the system may make supplied assumptions sound more coherent than the evidence warrants.

- **Barnum effect placeholder:** Verify the exact claim and source before stating that personalized-seeming, broadly applicable feedback increases perceived accuracy. Do not imply that every tailored AI response is a Barnum effect.
- **Sycophancy/personalization placeholder:** Verify the cited work and its task setup before claiming that models systematically agree with users, flatter them, or optimize for preference signals over truth. Distinguish instruction following, personalization, and measured sycophancy.
- **MIT/Harvard research placeholder:** User to provide the exact paper(s), authors, date, link, and claimed finding. Until then, write only: **[Citation needed: verify the specific MIT/Harvard research and what it actually demonstrates.]**

Possible formulation: fluent agreement is not evidence that an answer is well-grounded. It may reflect a context-conditioned completion that has not independently checked the premise.

## What an LLM and an agent are doing

An LLM is, at base, trained to predict a next token from context. That simple description should not be used as dismissal: a next-token objective can yield sophisticated representations and useful behavior. It also should not be inflated into a complete account of human understanding or experience.

- **Embeddings and representations:** training produces distributed representations that can encode statistical and conceptual relationships useful for retrieval, analogy, classification, and generation.
- **Temporary in-context learning:** a model can adapt its behavior from examples, instructions, and feedback in the current context window without its weights being updated. That is not the same as durable learning or a changed underlying model.
- **Chain-of-thought:** intermediate reasoning-like text can improve some tasks and make a path easier to inspect, but it is not direct evidence of a faithful inner process or consciousness.
- **Agent utilities:** retrieval, tools, external memory, planning and verification loops, fine-tuning, and reinforcement learning can give a model a broader work loop. They expand what a system can do; they do not by themselves demonstrate needs, felt experience, or moral responsibility.

## Humans: persistent context and lived stakes

Humans do not start each conversation from a blank context window. They carry persistent, multimodal histories: bodies, relationships, memories, habits, needs, wants, attention, pain, pleasure, fear, status, obligation, and consequences. A person can be confused about their own motives, so this is not a claim that human judgment is pure. It is a claim that human decisions occur inside lives that can go better or worse for someone.

Embodiment matters here because action is not only symbol manipulation. It affects a body in a world, with limited time, vulnerability, social obligations, and feedback. Feelings are not automatically correct verdicts, but they are part of the evidence of what a situation is like for a person. Responsibility is the social and institutional practice of answering for a decision and repairing its effects.

## Qualia, phenomenology, and the hard problem

Qualia are the felt, first-person character of experience: what pain hurts like, what red looks like, what relief or embarrassment feels like. Phenomenology is the study of experience as it appears from that first-person point of view.

The hard problem of consciousness asks why and how physical or computational processes are accompanied by subjective experience at all. It remains unresolved. Mary’s Room is a thought experiment: Mary knows all physical facts about color while living without color experience; when she sees red, does she learn something new? Use it as an intuition pump about the possible gap between description and experience, not as settled empirical proof.

Our consciousness indicators are calibrated on living biological organisms. Applying them to silicon systems assumes that the unmodeled biological differences are irrelevant.

Careful uncertainty:

- There is no accepted evidence that current chatbots are conscious or have phenomenal experience.
- Fluent self-report, apparent empathy, and multiple-modality input/output are not validated tests for felt experience.
- Artificial consciousness cannot be ruled out in principle. A future system could require serious assessment if it had a theory-relevant causal organization and a defensible evidentiary bridge.
- Presently, we should not assign chatbots responsibility or treat them as stakeholders merely because they talk as though they have feelings.

## Metaphor: factory versus craftsperson

The factory is extraordinary at producing variations, components, and scale from a supplied design and supply chain. The craftsperson encounters a particular situation, interprets its purpose, notices a material's resistance, and bears responsibility for the result. The metaphor is deliberately incomplete: people also use factories, and a craftsperson can be wrong. Its purpose is to separate abundant production from accountable judgment about what ought to be made for whom.

AI can make the factory side of cognitive work dramatically cheaper: drafts, alternatives, code, summaries, classifications, and experiments. Human work is not thereby reduced to typing prompts. The remaining work is choosing the ends, recognizing when the model's frame misses the situation, and living with the consequences.

## Examples to develop, not evidence

- **Application crash logs:** An agent can cluster errors, identify likely regressions, propose a patch, and generate tests. A human still decides which failures matter, whether the data excludes a user group, what outage risk is acceptable, and when to ship.
- **Ford and Jobs:** Use only as illustrative anecdotes about users not always articulating future possibilities. Do not treat quotations or origin stories as evidence that research is unnecessary or that visionary leaders bypassed human needs. Verify any quote before use.
- **Hedonic treadmill:** A useful caution that people adapt to gains and that stated preference, short-term delight, and durable wellbeing can diverge. Verify the applicable research and avoid presenting adaptation as universal or as a reason to dismiss reported experience.

## Questions and research queue

1. What is the exact MIT/Harvard study being invoked? **[User-provided citation required.]**
2. Which empirical studies best distinguish personalization from sycophancy in deployed models? **[Primary sources required.]**
3. What is the original Barnum/Forer source, and what scope does it support? **[Citation verification required.]**
4. How should the post distinguish a decision-support agent from an autonomous organizational actor with delegated authority?
5. Can “opportunity space” be defined as a set of plausible interventions constrained by real human stakes, evidence, resources, and trade-offs?
6. Where should the essay acknowledge that humans can also optimize bad metrics, rationalize after the fact, and evade responsibility?

## Candidate closing note

AI can enlarge the opportunity space by making more hypotheses visible and more implementations feasible. It cannot, on current evidence, tell us which possibility is worth choosing. That decision belongs where values, lived consequences, and accountability still meet: with humans.
