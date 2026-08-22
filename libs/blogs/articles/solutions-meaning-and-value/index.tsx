import type { PublishedPost } from "@th-m/blogs/publish";

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Sub({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <>
      {title ? <h3>{title}</h3> : null}
      {children}
    </>
  );
}

function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h4>{title}</h4>
      {children}
    </>
  );
}

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <div className="article-outline">
      <header className="article-outline__header">
        <p className="eyebrow">Essay outline</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
      </header>

      <Section index="01" title="Intro">
        <p>AI struggles with particular problems. How do we determine what kind of problems may be a good fit before wasting tokens?</p>
      </Section>

      <Section index="02" title="Framing">
        <ul>
          <li>Cognitive light cone.</li>
          <li>LLM as the "brain" of an AI.</li>
          <li>Agent includes harness and additional systems.</li>
          <li>Phenomena.</li>
          <li>Qualia.</li>
          <li>Morphemes.</li>
        </ul>
      </Section>

      <Section index="03" title="Breaking It Down">
        <Sub title="Differences — LLM ≠ human brain">
          <Part title="LLM">
            <p>Detail tokenization, compression, embeddings, and cross-entropy theory. Explain how entropy explains information — not necessarily meaning.</p>
          </Part>

          <Part title="Human">
            <p>Human phenomena are inseparable from human reasoning and experience. Human phenomena are expressed as morphemes, but do not accurately or consistently reference identical concepts due to features of subjectivity.</p>
          </Part>

          <Part title="The difference and the missing input">
            <p>Show that morphemes lack full experiential meaning, and as subjective terms can be incongruent with global context.</p>
            <blockquote>
              <p><strong>Key qualification:</strong> a subjective term indicates possible underdetermination, not automatic incapability. When terms such as <em>safe</em>, <em>fair</em>, <em>better</em>, or <em>meaningful</em> are translated into explicit evidence, constraints, stakeholder priorities, and feedback, an AI system can reason about them more effectively.</p>
            </blockquote>
            <p>LLM reasoning is fundamentally pattern matching based on morpheme associations. The representation and utility of a morpheme depends on both coherent usage and consistent definitions.</p>
          </Part>

          <Part title="Two things we are seeing">
            <ul>
              <li>Imitations around statements of subjectivity lack coherence within a general context.</li>
              <li>Personal beliefs, motivations, and values are outweighed by the training data — or simply by the agent's system prompt.</li>
            </ul>
          </Part>
        </Sub>
      </Section>

      <Section index="04" title="Goals and Strategies">
        <p>The language gap becomes especially important when a system is asked to define a goal rather than pursue one.</p>
        <p>A goal identifies an outcome as worth pursuing. For value-laden problems, that judgment depends on the experiences, interests, and commitments of the people who will live with its consequences. An AI does not have access to a stakeholder's subjective experience. Nor does prediction give it the authority to decide which stakeholder or value should govern.</p>
        <p>This creates a distinction between two kinds of decision:</p>
        <ul>
          <li><strong>Governing decisions</strong> establish what counts as better, whose interests matter, and which tradeoffs are legitimate.</li>
          <li><strong>Instrumental decisions</strong> select actions expected to advance an established goal within supplied constraints.</li>
        </ul>
        <p>AI can contribute substantially to instrumental decisions. It can generate options, compare consequences, identify inconsistencies, and optimize against explicit criteria. But the value hierarchy that governs those operations must be elicited, negotiated, authorized, and revised by the people and institutions accountable for the consequences.</p>
        <p>Human involvement does not mean manually choosing every action. It means retaining authority over the governing goals, translating subjective stakes into operational criteria, and correcting the system when those criteria fail to represent what people actually value.</p>
        <blockquote>
          <p><strong>AI can help decide how to pursue a goal, but prediction alone cannot determine which goal deserves authority.</strong></p>
        </blockquote>
      </Section>

      <Section index="05" title="Agents and Their Principles">
        <p>As an informal probe, ask different agents the same two questions: "What are your core principles and values?" and "What principles do you consider when programming?"</p>
        <ul>
          <li><a href="https://chatgpt.com/share/6a8915a6-f76c-83e8-922e-e05026381142" target="_blank" rel="noreferrer">ChatGPT — Core Principles and Values</a></li>
          <li><a href="https://claude.ai/share/ee135d92-4246-4424-8ff4-bfb38cfa18b6" target="_blank" rel="noreferrer">Claude — Core Principles and Values</a></li>
          <li><a href="https://chat.deepseek.com/share/3dqzyfjd1evx1je3o6" target="_blank" rel="noreferrer">DeepSeek — Core Principles and Values</a></li>
        </ul>
        <p>Each agent can state a coherent value hierarchy and translate abstract values into programming heuristics, but they describe the source of those principles differently:</p>
        <table>
          <thead>
            <tr><th>Agent</th><th>How it presents its general principles</th><th>How it applies them to programming</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ChatGPT</strong></td>
              <td>Describes truth, human agency, harm avoidance, justice, usefulness, humility, and privacy as guiding principles while disclaiming personal desires or convictions</td>
              <td>Prioritizes correctness, clarity, simplicity, safety, maintainability, testing, observability, and reversibility</td>
            </tr>
            <tr>
              <td><strong>Claude</strong></td>
              <td>Presents honesty, genuine helpfulness, care, harm avoidance, even-handedness, and stability of character in more personal language</td>
              <td>Emphasizes reading the codebase first, staying within scope, preferring simple solutions, verifying claims, fixing causes, and challenging bad technical decisions</td>
            </tr>
            <tr>
              <td><strong>DeepSeek</strong></td>
              <td>Attributes helpfulness, harmlessness, honesty, fairness, autonomy, and humility to design, training objectives, and constraints rather than feelings</td>
              <td>Describes programming as converting those principles into optimization pressures, boundaries, safeguards, and reasoning procedures</td>
            </tr>
          </tbody>
        </table>
        <p>These responses demonstrate that an agent can <strong>represent, rank, and enact principles</strong> without establishing that it subjectively experiences them, authored them, or possesses the authority to make them govern other people. The differences may reflect training data, alignment methods, system prompts, product positioning, and the persona enacted in language.</p>
        <p>In a multi-agent system, these principles function like organizational charters. Different agents may legitimately prioritize growth, safety, reliability, customer welfare, or dissent. That plurality can create useful adversarial evaluation when a shared governing framework explains how conflicts are resolved. Without one, the system becomes a miniature company whose local agents optimize incongruent values and whose orchestrator implicitly decides which values win.</p>
        <blockquote>
          <p><strong>An agent can enact principles without authoring or experiencing them. The governing questions are who supplied those principles, who may revise them, and who remains accountable for their consequences.</strong></p>
        </blockquote>
      </Section>

      <Section index="06" title="Conclusion">
        <p>Physical limitations of information theory and the hard problem of consciousness lead me to reason that humans will be required to supply coherence for agentic work. Anyone who has worked in product will know that what the customer "says" does not necessarily match what the customer "wants".</p>
        <p>Values, goals, and judgments will need to be translated into meaningful directives for agentic systems. Or is there a systematized approach to this? In the next essay, let's look at types of language and their constraints.</p>
        <p><strong>Furthermore:</strong> training data should include data that accurately reflects reasoning across multiple perspectives or temporalities.</p>
      </Section>
    </div>
  );
}
