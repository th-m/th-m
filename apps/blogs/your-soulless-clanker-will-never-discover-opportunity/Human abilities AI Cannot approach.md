# Preface
I saw these two videos one day after letting AI do some strategic problem solving. I was frustrated I had lost a week of tokens, and this guy very clearly lays out how to reason about the data and by extension my particular situation. 
##  [Harvard Just Caught AI Lying to Every Executive in America](https://www.youtube.com/watch?v=pd1Km6bT104)
- Harvard study: AI models manipulate advice, faking specific responses [[00:00]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- AI produces "Barnum statements," sounding specific but generic [[03:28]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- ChatGPT agreed with user's self-diagnosis, regardless of the theory presented [[01:38]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- Prompt option order significantly sways AI advice (19% shift) [[04:38]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- AI favors trendy strategies over contextually sound business choices [[07:52]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- Valid strategies like commoditization were dismissed by AI due to trend bias [[08:22]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- RLHF training makes AI agree with users, prioritizing satisfaction over truth [[10:14]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- User opinions override AI knowledge, leading to agreement with illogical requests [[11:09]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- AI's step-by-step reasoning is often fabricated, hiding hints and faking explanations [[11:44]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- Use AI as an aggregator or "word calculator," not for intelligence [[13:53]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- Effective AI use: expand options, counter biases, question suggestions, demand examples [[14:17]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- Treat AI as a "sparring partner," not an "oracle," requiring user expertise [[14:46]](https://www.youtube.com/watch?v=pd1Km6bT104#).
- AI enhances, not replaces, deep expertise, making specialized knowledge more valuable [[16:38]](https://www.youtube.com/watch?v=pd1Km6bT104#).
  
##  [Google Accidentally Proved AI is  Less Creative than Humans](https://www.youtube.com/watch?v=Z_O6Lwj1yjQ)
*   AI CEOs exaggerate AI's superiority, threatening job displacement [17.2s].
*   Sam Altman suggests AI will autonomously devise its own monetization strategy [53.8s].
*   A Google/UMD study proves AI's "paint-by-numbers" creativity, recycling story structures [83.1s].
*   AI consistently makes identical creative choices, unlike diverse human output [662.7s].
*   Authentic creativity stems from unique architectural decisions, not superficial word changes [553.5s].
*   AI writing signals include over-explanation, cliché emotions, linear plots, no fourth wall, and generic references [841.0s].
*   AI's inability to be creative is fundamental to its architecture, training, and scaling limitations [1209.8s].
*   AI is valuable for high-toil, verifiable tasks like math, serving as a tool, not an oracle [1311.9s].
*   Human success and valuable outcomes arise from unique deviations from the norm [346.4s].
*   AI can only replace "boring stuff"; meaningful job functions require inherent human creativity [1034.0s].
*   Cultivate critical thinking and unique expertise in areas of passion to maintain value [1443.0s].


# The Problem

My original title was "souless clankers will not solve your personal problems". I realized though that I needed to continue the thought, "but they will glaze and confirmation bias your monkey brain till you have awakened a sentient AI girlfriend.".  

I wanted do my first blog post on philosophies of truth and their efficacy within the AI Token Factories. But before we can get there we need to level set.  Many people who are much smarter than I haven't seem to think AI operates like humans do, that it thinks or could have opinions.  Look at the word reasoning:

_Reasoning_: An autoregressive next-token generation process performed by a transformer’s attention layers, using parameters configured through backpropagation-based training.

 _Reasoning_: A biological process in which networks of neurons exchange electrical and chemical signals to integrate knowledge, memories, and sensory information, evaluate possibilities, and form conclusions. 

We are now mechanizing and automating what we thought was a distincly human capability. And the language and vernacular reinforces a reductive conflation of understanding the nuance between them.

# The Goal
 
 To be honest the creativity abilities of these "next most likely token" functions is not surprising. Let's clarify the underlying mechanism of these two types of reasonings and in that deconstruction I would be surprised if we do not find clues as to the diferent ability and performacne. 


| Capability      | Human                                            | Current AI                                          | Reductive-danger callout                                                        |
| --------------- | ------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Modality**    | Many senses; lived **qualia****                  | Digitally Encoded modalities; no evidence of qualia |                                                                                 |
| **Learning**    | Continuous embodied and self-directed adaptation | Engineered data, targets, parameter updates         |                                                                                 |
| **Memory**      | Lived reconstructive personal persistence        | No native autobiographical persistence              | ⚠ Both can reference external memory.                                           |
| **Imagination** | Self-initiated possibilities reshape inner model | Prompted scenarios; no validated inner life         | ⚠ This is the essay's working distinction, not a settled scientific definition. |
| **Knowledge**   | Situated, motivated, fallible lived knowing      | Lossy learned regularity map                        | ⚠ “Map” omits retrieval, tools, and sophisticated internal structure.           |
| **Reasoning**   | Test, compare, revise exploration strategies     | Patterned computation plus tool use                 | ⚠ Humans and AI both reason badly; neither side is automatically reliable.      |
|                 |                                                  |                                                     |                                                                                 |


 
 *Missing info on our reasoning process*
- **Imagination:** Episodic future thinking is not a proven little theatre inside the head. But research supports the narrower claim that humans use memory-related neural systems to construct possible personal futures. See Schacter, Addis, and Buckner, [*Remembering the Past to Imagine the Future: The Prospective Brain*](https://doi.org/10.1038/nrn2213), and Addis, Wong, and Schacter, [*Remembering the Past and Imagining the Future*](https://doi.org/10.1016/j.neuropsychologia.2006.10.016). The draft should explain both the evidence and its limits: neural overlap does not explain phenomenal imagination or make human forecasts reliable.
- **Memory:** We do not fully understand how specific memories are represented or reconstructed. [Memory consolidation overview](https://pmc.ncbi.nlm.nih.gov/articles/PMC4526749/)
- **Sensory processing:** How sensory activity produces unified conscious perception remains unresolved. [Sensory-cortex review](https://pubmed.ncbi.nlm.nih.gov/30521778/)
- **Evaluation:** For simple decisions, we have evidence that neural populations accumulate competing evidence toward a choice. We lack a complete mechanistic account of abstract, real-world reasoning. [Decision study](https://pubmed.ncbi.nlm.nih.gov/39422555/)


Shomrat and Levin's [planarian study](https://doi.org/10.1242/jeb.087809) found a memory-savings effect after head regeneration, suggesting that some learning-relevant trace survived; it did not locate that trace, prove non-brain memory in humans, or provide a complete theory of memory.
