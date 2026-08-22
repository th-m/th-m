# Model vs Knowledge: What the Scientific Literature Supports

## The terminology

The most important correction is that **“knowledge” is probably not the best human term for the Model row. “Long-term memory” is more precise.**

In cognitive neuroscience, learning is the process by which experience changes the system; memory is the persistence of those changes; and knowledge is one class of content those memory systems can support. Human memory is not unitary. Classic neuropsychological dissociations show that people can lose the ability to form new declarative memories while retaining learned skills, and that severe episodic-memory impairment can coexist with substantial acquisition of semantic knowledge. citeturn1search0turn3search0turn3search1

That matters for the analogy because an LLM's parameters do not contain only facts. They also encode linguistic regularities, associations, task-relevant dispositions, and learned behaviors. Empirical work finds both factual associations and more general linguistic patterns represented in transformer parameters. citeturn4search0turn4search1turn4search2

I would therefore change the row to:

| Aspect | AI component | Human analogue | Human term |
|---|---|---|---|
| **Model** | **Learned parameters (weights), including embeddings** | Durable learned neural representations distributed across memory systems | **Long-term memory** |

If the Experience → Learning → Knowledge → Reasoning vocabulary is important rhetorically, **Knowledge** remains defensible as a higher-level shorthand. But biologically, *memory* is the cleaner counterpart to a trained model. “Semantic memory” would be too narrow because it excludes procedural skills and episodic memories. citeturn3search0turn3search1

## What human knowledge appears to be

The neuroscience strongly argues against imagining human knowledge as a database of propositions stored at identifiable addresses. Semantic representations appear to be **distributed, overlapping, and structured across neural populations**. Huth and colleagues mapped semantic selectivity while people listened to natural speech and found broad cortical maps in which related meanings occupy distributed regions rather than a single semantic store. citeturn8search0

At the same time, there are important convergence points. Temporarily disrupting the anterior temporal lobe with repetitive transcranial magnetic stimulation selectively impaired semantic tasks, supporting a causal role for this region in integrating conceptual information. citeturn8search2 Human intracranial recordings have also identified medial-temporal-lobe neurons that respond invariantly to very different representations of the same person or concept—for example, different photographs and the written name—showing that some neural representations can become remarkably abstract. citeturn0search2

These findings are not really contradictory. Human knowledge appears to exist at **multiple scales simultaneously**: individual neurons can be highly concept-selective while the larger representation depends on distributed populations and interacting cortical regions. Recent intracranial work further shows that learning can reorganize population geometry so that abstract task variables become explicitly represented in the hippocampus. citeturn0search2turn2search24

Nor is semantic knowledge purely linguistic. Neural representations of concepts carry information about sensory, motor, and affective properties, and retrieving action concepts can recruit corresponding motor systems. citeturn8search1turn6search0 This is an important difference from a text-only model: much human conceptual structure is ultimately learned through interactions among perception, action, affect, and language, rather than language alone. citeturn6search0turn8search1

At a still lower biological level, memory is associated with lasting changes to neural circuits rather than with a symbolic record deposited somewhere in the brain. Causal engram experiments in animals provide particularly strong evidence: researchers have labelled neurons active during learning and subsequently elicited behavioral memory recall by optogenetically reactivating that population. citeturn0search3 The safe analogy is therefore **learned parameters ↔ learned neural organization**, not **individual weight ↔ individual memory**.

## Where the model analogy works

There is a surprisingly strong functional correspondence.

Training changes an artificial neural network's parameters so that subsequent inputs produce different responses. After training, those parameters embody durable information about regularities encountered during training. Experiments probing pretrained language models showed that many factual relations can be recovered directly from the model without consulting an external knowledge base. citeturn4search0

Mechanistic work makes the analogy stronger. Geva and colleagues found that transformer feed-forward layers can behave somewhat like key-value memories, with learned directions corresponding to textual patterns and influencing output distributions. citeturn4search1 Meng and colleagues used causal interventions to identify computations in middle-layer feed-forward modules that were important for recalling particular factual associations, and showed that modifying those computations could alter the model's factual predictions. citeturn4search2 Related work has identified parameter-associated “knowledge neurons” whose activation correlates with the expression of particular facts. citeturn4search3

So there is a legitimate common abstraction:

> **Experience changes a network; those changes persist; later activity through the changed network reconstructs behavior appropriate to what was learned.**

That description fits both biological long-term memory and parametric memory in neural networks, while remaining agnostic about whether their internal mechanisms are actually equivalent. Human evidence supports distributed and selectively abstract neural representations; transformer studies similarly find learned information distributed through parameters while some computations have unusually strong causal roles for particular associations. citeturn8search0turn0search2turn4search1turn4search2

## Where the analogy breaks

The first break is that **neither a human memory nor an LLM fact is simply an item sitting in storage**. Retrieval is a computation.

In humans, semantic information is distributed across interacting cortical systems and is reconstructed according to the task and context. citeturn8search0turn8search1 In language models, apparently “known” facts can likewise be surprisingly sensitive to how a question is phrased. Jiang and colleagues showed that alternative prompts can substantially change how much factual information can be extracted from the same frozen model; subsequent experiments using paraphrases found significant inconsistency in factual predictions across meaning-preserving formulations. citeturn9search0turn9search1

This suggests an important distinction between **storage and accessibility**. A parameter configuration can make a response possible without guaranteeing that every context will successfully recover it. That is true enough in humans to motivate separate study of memory storage and retrieval, and it is conspicuous in LLM probing because unchanged parameters can give different apparent answers to semantically similar queries. citeturn9search0turn9search1

The larger difference is **plasticity during ordinary use**. Human memory systems continuously interact with new experience; the hippocampal system is crucial for rapidly acquiring new event memories, while longer-term semantic structure involves broader cortical systems. Classical amnesia cases and developmental hippocampal injuries demonstrate that these acquisition and retention mechanisms can be dissociated. citeturn1search0turn3search1

A standard pretrained transformer behaves differently. During ordinary inference its learned parameters remain fixed: it can adapt behavior to information inside the current context without updating those parameters. This is exactly why the machine-learning literature distinguishes **in-context learning** from parameter learning. citeturn7search1 Unless some additional mechanism writes information to parameters, a database, a memory store, or another persistent state, what the model encountered during one inference does not automatically become part of its long-term parametric memory. citeturn7search1

That may be the most consequential gap for your larger framework: **the human boundary between learning, memory, and reasoning is permeable; the standard LLM engineering boundary between training and inference is comparatively hard.**

## Blog-ready section

### Model VS Knowledge

“Knowledge” is slightly misleading here. The closer human analogue of a trained model is **long-term memory**: the durable changes left in a cognitive system by learning.

Human knowledge is not stored in a single place or in a single format. Cognitive neuroscience distinguishes episodic memory for particular events, semantic memory for facts and concepts, and procedural forms of memory expressed through skills. These systems can dissociate: amnesic patients may retain skill learning despite profound declarative-memory impairment, while people with early hippocampal damage can develop substantial semantic knowledge despite severe episodic-memory deficits. citeturn3search0turn3search1

At the neural level, there does not appear to be anything like a file containing *Paris → France*. Semantic information is represented across distributed and overlapping cortical populations. Some neurons can nevertheless become highly selective for abstract concepts, responding to different images or even the written name of the same person, while causal disruption of anterior temporal regions can selectively impair semantic processing. citeturn8search0turn0search2turn8search2 Conceptual representations also contain sensory, motor, and affective structure inherited from experience. citeturn8search1turn6search0

This makes learned model parameters a surprisingly useful—but limited—analogue. Training changes the weights of an artificial neural network; afterward, those weights encode statistical regularities that can support the reconstruction of linguistic patterns, factual associations, and learned behaviors. Researchers can recover factual relationships directly from pretrained language models, and causal interventions have identified transformer computations that play important roles in particular factual predictions. citeturn4search0turn4search1turn4search2

But a **weight is not a fact**, just as a **synapse is not a belief**. In both systems, information is encoded by the organization of a network and becomes observable only when activity passes through that network. The same LLM can answer a fact correctly under one wording and fail under a paraphrase, showing that possessing a parameter configuration capable of producing information is not the same thing as reliably retrieving it. citeturn9search0turn9search1

The largest difference is that human memory remains coupled to experience. We can form new long-term memories while operating in the world. A standard pretrained LLM normally cannot: during inference its weights remain fixed. Information in the prompt can temporarily change its behavior—what machine learning calls in-context learning—but the underlying parameters are unchanged. citeturn7search1 Without an additional memory system or another training step, the encounter does not automatically become part of the model.

So the analogy is not:

**weights = facts**

It is closer to:

**trained weights = durable dispositions created by past learning**<br>
**learned neural organization = durable dispositions created by past experience**

In humans we call the resulting capacity **memory**, and some of what that memory makes available to cognition we call **knowledge**.
