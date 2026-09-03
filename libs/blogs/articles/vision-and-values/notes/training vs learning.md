# Training vs Learning

## Research synthesis

The cleanest scientific distinction is that **training is an engineered mechanism, whereas learning is a functional phenomenon implemented by many biological mechanisms**. In psychology, learning is commonly treated functionally: experience produces changes in later behavior or behavioral potential; that definition does not commit to a particular neural algorithm. citeturn18search0turn18search1

By contrast, neural-network training specifies the machinery explicitly. A loss measures error, backpropagation computes how parameters contributed to that error, and an optimizer uses those gradients to update parameters. The original backpropagation paper describes repeatedly changing connection weights to reduce the discrepancy between actual and desired outputs; optimizers such as Adam then provide a particular rule for turning gradients into parameter updates. citeturn17search0turn16search1

The human side is much less reducible. Learning can involve changes in synaptic efficacy, spike-timing-dependent plasticity, homeostatic regulation, dendritic structure, intrinsic neuronal excitability, neuromodulatory teaching signals, and later systems-level consolidation. citeturn15search1turn13search0turn13search1turn14search0turn17search3

## Paste-ready replacement

### Training VS Learning

In an artificial neural network, training is unusually explicit. A **loss function** defines what counts as error, **backpropagation** computes how the model's parameters contributed to that error, and an **optimizer** changes those parameters so that future outputs tend to reduce the loss. citeturn17search0turn16search1

Biological learning has mechanisms that rhyme with each of these, but there is no established one-to-one mapping. The brain does not have a known single global loss function. Instead, different circuits receive different kinds of teaching and modulatory signals. Dopamine activity, for example, can carry reward-prediction-error information, and dopamine can gate structural synaptic plasticity within narrow temporal windows. It is therefore better thought of as **one family of biological teaching signals**, not as the brain's universal loss function. citeturn13search3turn14search1

The hardest correspondence is **credit assignment**: if an action succeeds or fails, how does a particular synapse know whether and how much it contributed? Backpropagation solves this mathematically by propagating gradients backward through the computational graph. The brain is not known to implement literal backpropagation. Classical backprop creates biological difficulties including the need to communicate appropriately structured error information through a multilayer network, and neuroscience has not established that cortical circuits implement that algorithm. Computational work has shown that more biologically plausible mechanisms—random feedback pathways, dendritic compartments and bursts, or local eligibility traces combined with learning signals—can solve parts of the same credit-assignment problem without reproducing standard backprop exactly. citeturn12search2turn12search1turn12search3

Recent evidence makes this comparison more interesting. In a 2026 *Nature* study, Francioni and colleagues trained mice in a neurofeedback task in which individual cortical neurons had experimenter-defined positive or negative effects on reward. They found **neuron-specific error-related signals in apical dendrites whose sign depended on each neuron's causal role in the task**. Interfering with dendritic processing impaired learning. This is evidence that the cortex can distribute distinct instructive signals to different neurons—a plausible ingredient of biological credit assignment. But it is **not evidence that the brain literally runs backpropagation**: the observed signals differed from classical backprop gradients, their source and routing remain unresolved, and whether they directly instruct synaptic weight changes is still an open question. citeturn12search0

The analogy to an **optimizer** is looser still. Biological learning is not a single rule adjusting a single kind of “weight.” Synapses can strengthen or weaken for long periods; the direction of plasticity can depend on millisecond-scale spike timing; neurons can globally rescale their synapses to stabilize activity; learning can create and selectively preserve dendritic spines; and learning can change a neuron's intrinsic excitability as well as its synaptic connections. citeturn15search1turn13search0turn13search1turn14search0turn17search3

Then there is **consolidation**. Biological learning does not necessarily finish when the experience ends. Neural activity associated with waking experience can be reactivated during subsequent sleep, experimentally cueing memories during slow-wave sleep can improve later hippocampus-dependent recall, and animal studies show memories becoming reorganized across hippocampal and cortical engram circuits over time. citeturn17search1turn17search2turn14search2

This exposes a major difference between the simplified base-LLM picture and a brain. For a conventionally pretrained model, persistent parameter change is concentrated in explicit training or fine-tuning; ordinary inference can adapt behavior to the current context without changing those weights. GPT-3's original few-shot experiments, for example, explicitly performed task adaptation through text context **without gradient updates or fine-tuning**. Biological brains do not have such a clean training/inference boundary: perception, action, plasticity, and subsequent consolidation can all be stages of one continuous history of experience. citeturn16search2turn17search1turn14search2

So **Training → Learning** is directionally right, but “learning” is the much broader term. AI training is an engineered optimization procedure with an explicit objective and explicit mechanism for assigning credit. Biological learning is a distributed, multi-timescale process in which local plasticity, modulatory and instructive signals, structural and excitability changes, homeostatic regulation, and consolidation jointly alter how future experience affects behavior. citeturn13search0turn13search1turn12search0turn17search3turn14search2

## Mapping the components

A slightly more precise decomposition makes clear why the analogy is useful but imperfect:

| AI mechanism | Closest biological analogue | Important qualification |
|---|---|---|
| **Loss function** | Evaluative, reward, error, and other teaching signals | No single universal biological loss function is established. Dopaminergic reward-prediction errors are one important example, not a complete account of learning. citeturn13search3turn14search1 |
| **Backpropagation** | **Credit assignment**: determining which neurons/synapses should change | Literal backprop has not been demonstrated in the brain. Dendrites, feedback pathways, bursts, neuromodulators, and eligibility traces are candidate ingredients. citeturn12search2turn12search1turn12search3 |
| **Optimizer** | Plasticity rules and regulatory mechanisms | There is no obvious biological object corresponding to Adam or SGD. Multiple local and global mechanisms determine whether and how neural tissue changes. citeturn13search0turn13search1 |
| **Weight update** | Synaptic, structural, and intrinsic plasticity | Biological storage is not confined to a scalar synaptic strength: learning can affect synapses, dendritic spines, and neuronal excitability. citeturn14search0turn17search3 |
| **Later training passes** | Replay and consolidation, only approximately | Sleep and post-learning activity can reactivate and reorganize memory traces, but this is not simply another epoch over a stored dataset. citeturn17search1turn17search2turn14search2 |

The particularly useful conceptual move is therefore to map **backpropagation not to plasticity itself, but to biological credit assignment**. Plasticity is closer to the physical update; credit assignment is the problem of deciding *which* updates should occur. citeturn12search2turn12search0

## Where the analogy breaks

The largest gap is **objective specification**. Artificial training starts with an objective chosen by an external designer. A biological organism has many interacting regulatory and behavioral demands, and the literature supports multiple kinds of learning signals rather than one known scalar objective broadcast to every plastic synapse. Treating dopamine as “the loss function” would therefore overstate the correspondence. citeturn13search3turn14search1turn12search0

A second gap is **locality**. Standard backprop uses knowledge of how a perturbation of each parameter would change the final objective. Biological synapses have direct access mainly to local electrical and biochemical events, although feedback, neuromodulation, dendritic computation, and longer-lived eligibility traces may convey additional information. The central theoretical problem is how those locally available quantities become sufficiently informative about distant behavioral outcomes. citeturn12search2turn12search1turn12search3

A third gap is **what changes**. Calling synaptic efficacy a biological “weight” is useful, but incomplete. Classic work established long-lasting changes in synaptic transmission; later studies demonstrated timing-dependent potentiation and depression, homeostatic scaling of many inputs together, rapid formation and stabilization of new dendritic spines during motor learning, and learning-related changes in the intrinsic excitability of memory-associated neurons. citeturn15search1turn13search0turn13search1turn14search0turn17search3

Finally, there is a gap in **when learning occurs**. The training/inference distinction is architecturally convenient for AI, but much less natural biologically. Memory traces can continue to change after behavior has stopped through reactivation and systems consolidation. Conversely, what ML researchers call “in-context learning” illustrates why a behavioral definition of learning and a parameter-update definition should not be conflated: a model can exhibit changed task behavior from contextual examples while its learned parameters remain fixed. citeturn17search1turn17search2turn14search2turn16search2

## Recommended table wording

I would make one small change to your table. **“Neural plasticity and consolidation” is correct but misses the biological analogue of backpropagation itself.**

A stronger row would be:

| Aspect | AI component | Human analogue | Human term |
|---|---|---|---|
| **Training** | **Loss/objective, credit assignment via backpropagation, optimizer** | **Teaching signals, biological credit assignment, neural plasticity and consolidation** | **Learning** |

That wording separates three distinct questions: **what counts as success**, **which components deserve credit or blame**, and **how the substrate physically changes**. Neuroscience has empirical candidates for each, but no established mechanism that collapses neatly onto the engineered loss → backprop → optimizer pipeline. citeturn13search3turn12search0turn13search0turn14search2

I would also retain your existing sentence, but update it to reflect the 2026 evidence:

> **The brain is not known to implement literal backpropagation; biological credit assignment remains an active research problem, although recent evidence suggests that cortical dendrites can carry neuron-specific instructive signals that may solve part of that problem.** citeturn12search0turn12search2

## Key literature

The core empirical picture comes from several layers of evidence. Bliss and Lømo's classic hippocampal work established durable activity-dependent potentiation; Bi and Poo showed that millisecond-scale pre/post spike timing can determine whether synapses strengthen or weaken; Turrigiano and colleagues demonstrated homeostatic synaptic scaling; Xu and colleagues showed learning-related formation and selective stabilization of dendritic spines; and recent work extends plasticity beyond synapses to the intrinsic excitability of engram neurons. citeturn15search1turn13search0turn13search1turn14search0turn17search3

For teaching signals, Schultz, Dayan and Montague's dopamine work connected midbrain activity with reward-prediction errors, while Yagishita and colleagues demonstrated a narrow dopamine-dependent window for structural synaptic plasticity. These results give reinforcement-learning analogies real biological substance, while still falling far short of establishing one universal loss signal. citeturn13search3turn14search1

For the backpropagation comparison, Rumelhart, Hinton and Williams provide the artificial benchmark; Lillicrap et al., Payeur et al., and Bellec et al. demonstrate computationally viable alternatives or approximations using mechanisms more compatible with neural biology. Most importantly for the current state of the question, Francioni et al.'s 2026 experiments provide direct evidence for cell-specific dendritic instructive signals during learning while explicitly leaving major parts of the biological credit-assignment mechanism unresolved. citeturn17search0turn12search2turn12search1turn12search3turn12search0

Finally, Wilson and McNaughton's sleep-reactivation experiments, Rasch and colleagues' human targeted-memory-reactivation study, and Kitamura and colleagues' engram experiments show why **consolidation belongs in your human analogue**: biological learning includes post-experience processing and circuit reorganization, not merely an immediate update at the moment an error is observed. citeturn17search1turn17search2turn14search2