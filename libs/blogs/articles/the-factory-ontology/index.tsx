import { Fragment } from "react";
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

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote><p>{children}</p></blockquote>;
}

function Flow({ children }: { children: React.ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

function Terms({ items }: { items: Array<[string, string]> }) {
  return (
    <dl>
      {items.map(([term, definition]) => (
        <Fragment key={term}>
          <dt>{term}</dt>
          <dd>{definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <div className="article-outline">
      <header className="article-outline__header">
        <p className="eyebrow">Essay outline</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <p className="article-outline__status"><strong>Editorial status —</strong> This article evolves the former "Next Abstraction Layer" essay into the first deep dive on knowledge-factory infrastructure. Existing Mango, SoundSculpt, abstraction, and ontology research remains relevant. The argument now centers on human responsibility for mapping a domain and on ontology as durable context for people and models.</p>
      </header>

      <Section index="01" title="Overview">
        <p>Humans are responsible for mapping the world the factory acts upon. AI can extract candidate concepts, compare examples, propose relationships, and expose inconsistencies, but a model cannot independently decide which distinctions a product should recognize, whose perspective should govern, what evidence is sufficient, or which errors are acceptable.</p>
        <p>A domain ontology makes those commitments inspectable. It defines the entities, relationships, states, invariants, evidence rules, and permitted actions that a bounded system treats as real. That structure gives teams a shared language and gives AI higher-quality in-context material than an isolated prompt or a pile of loosely related documents.</p>
        <p>The article will acknowledge the strength of controlled writing systems such as ASD-STE100: constraining vocabulary and grammar can make model output clearer and more machine-checkable. It will then extend the solution. Controlled language improves the form of expression; a domain-specific ontology clarifies what the expression is about and how its claims can be checked.</p>
      </Section>

      <Section index="02" title="Working Subtitle">
        <Quote><strong>Controlled language can reduce slop. Domain ontology gives the language something precise to mean.</strong></Quote>
      </Section>

      <Section index="03" title="Core Thesis">
        <p>The knowledge factory needs more than fluent instructions. It needs explicit, maintained maps of the domains in which people and AI act.</p>
        <p>Within a bounded context, an ontology should tell the factory:</p>
        <ul>
          <li>what kinds of things it may claim exist;</li>
          <li>how those things relate and change;</li>
          <li>which distinctions alter behavior;</li>
          <li>what evidence warrants each state or assertion;</li>
          <li>which actions are allowed, forbidden, or escalated;</li>
          <li>which examples and counterexamples define the boundary; and</li>
          <li>who remains accountable for revising the map.</li>
        </ul>
        <p>Ontology design does not replace human judgment. It is how human judgment becomes shareable, testable, and available in context.</p>
      </Section>

      <Section index="04" title="Relationship to the Series">
        <p>This is the fifth essay and the first implementation-oriented factory deep dive. <strong>The Knowledge Factory</strong> introduces the operating system; this article defines its semantic infrastructure. <strong>The Factory — Strategy</strong> follows with the human discipline that chooses direction and updates the factory's goals.</p>
      </Section>

      <Section index="05" title="Intended Reader">
        <p>Software builders, product and platform leaders, domain experts, knowledge architects, and teams designing context systems or agent workflows.</p>
      </Section>

      <Section index="06" title="Terms and Guardrails">
        <Terms items={[
          ["Ontology", "an explicit commitment about the entities, relationships, properties, states, constraints, and evidence a bounded system recognizes."],
          ["Domain language", "the vocabulary tied to that model and used consistently within its bounded context."],
          ["In-context learning", "adaptation of model behavior from instructions, examples, and other context supplied at inference time, without assuming a durable update to model weights."],
        ]} />
        <ul>
          <li>Do not present an ontology as objective reality. It is a maintained, purpose-bound map with omissions and social consequences.</li>
          <li>Do not treat ontology as a synonym for glossary, taxonomy, database schema, or prompt. Each can express part of the model.</li>
          <li>Do not imply that longer context is automatically better. Context must be relevant, structured, current, and evaluated.</li>
          <li>Do not claim controlled English alone makes technical content correct.</li>
        </ul>
      </Section>

      <Section index="07" title="Section Notes">
        <Sub title="1. Humans Map the World">
          <p>Open with a deceptively simple product term such as <code>conversation</code>, <code>customer</code>, <code>song</code>, or <code>risk</code>. A model can produce definitions for each. The factory still needs a person or accountable institution to decide which definition controls a particular decision.</p>
          <p>Mapping requires judgment:</p>
          <ul>
            <li>which perspective is represented;</li>
            <li>which distinctions matter to an outcome;</li>
            <li>which exceptions deserve first-class status;</li>
            <li>which observations count as evidence;</li>
            <li>what uncertainty is tolerable; and</li>
            <li>who bears the cost when the map is wrong.</li>
          </ul>
          <p>AI can assist the cartography. Humans remain responsible for adopting and governing the map.</p>
        </Sub>

        <Sub title="2. A Map Is a Commitment, Not a Mirror">
          <p>An ontology does not merely list what a team discovered in the world. It commits the system to recognizing some distinctions and ignoring or combining others.</p>
          <p>Use the working definition:</p>
          <Quote>A product ontology is an explicit commitment about which distinctions the system will recognize, how those distinctions relate, and what evidence is sufficient to make claims about them.</Quote>
          <p>This makes classification an architectural and institutional act. A model can be useful and still require revision as customers, regulations, technology, or evidence change.</p>
        </Sub>

        <Sub title="3. In-Context Learning Needs Designed Context">
          <p>Explain why a large context window is not a knowledge architecture.</p>
          <p>Models can adapt their response from definitions, demonstrations, counterexamples, tool descriptions, and task history supplied in context. But raw retrieval can mix incompatible meanings, stale decisions, and documents written for different purposes.</p>
          <p>An ontology helps assemble context by providing:</p>
          <ul>
            <li>stable identifiers for important concepts;</li>
            <li>relationships that make relevant material traversable;</li>
            <li>bounded contexts that prevent silent semantic blending;</li>
            <li>examples associated with the right concept and state;</li>
            <li>provenance and recency; and</li>
            <li>evaluation criteria tied to the modeled behavior.</li>
          </ul>
          <p>The point is not to put the whole ontology in every prompt. It is to use the map to select the smallest context that preserves the necessary distinctions.</p>
        </Sub>

        <Sub title="4. What the “Cure for AI Slop” Gets Right">
          <p>Reference <a href="https://www.youtube.com/watch?v=uJblcC4lKYw" target="_blank" rel="noreferrer">Ege Chelebi's video, "The cure for AI slop is a 1986 aircraft manual"</a> and its <a href="https://www.chele.bi/videos/the-cure-for-ai-slop" target="_blank" rel="noreferrer">companion analysis</a>.</p>
          <p>The piece's strongest idea is that a banned-word list is not a writing system. ASD-STE100 supplies constrained vocabulary, one-meaning discipline, procedural rules, and machine-checkable guidance. In the author's small experiment — six writing tasks, four conditions, and two models — the STE-derived skill reduced measured writing-rule violations substantially relative to baseline. The author also states the necessary caveats: results varied by model, the sample was small, and the system improves the form of writing rather than whether the writer has anything worth saying.</p>
          <p>Use the reference as a demonstration that <strong>designed linguistic constraints can change generated output</strong>. Do not treat the reported experiment as universal evidence or as proof of technical correctness.</p>
        </Sub>

        <Sub title="5. Amend the Solution: From Controlled Language to Domain Ontology">
          <p>Controlled language can tell a model:</p>
          <ul>
            <li>prefer one approved term;</li>
            <li>keep a sentence procedural and unambiguous;</li>
            <li>avoid synonym rotation;</li>
            <li>state one instruction at a time; and</li>
            <li>produce prose that a linter can inspect.</li>
          </ul>
          <p>It cannot by itself decide:</p>
          <ul>
            <li>whether a protocol answer means a human conversation occurred;</li>
            <li>whether <code>song</code> names a composition, recording, performance, or rights object;</li>
            <li>which customer outcome makes a capability valuable;</li>
            <li>which evidence justifies a state transition; or</li>
            <li>what action is permitted when the evidence is incomplete.</li>
          </ul>
          <p>That is the domain-ontology layer. The amended solution is not merely "give the model a better style guide." It is <strong>clarify the domain-specific ontology, then use controlled language to express and operate within it.</strong></p>
        </Sub>

        <Sub title="6. The Ontology Packet for a Knowledge Factory">
          <p>Define a practical, composable artifact:</p>
          <ol>
            <li><strong>Vocabulary:</strong> preferred terms, aliases, and prohibited conflations.</li>
            <li><strong>Entities and categories:</strong> what the system can refer to.</li>
            <li><strong>Relationships and cardinalities:</strong> how entities participate together.</li>
            <li><strong>States and transitions:</strong> what can change and under which conditions.</li>
            <li><strong>Invariants:</strong> conditions that must remain true.</li>
            <li><strong>Evidence rules:</strong> what warrants a claim and how uncertainty is represented.</li>
            <li><strong>Examples and counterexamples:</strong> ordinary cases, boundaries, and failure cases.</li>
            <li><strong>Actions and permissions:</strong> allowed side effects, owners, and escalation.</li>
            <li><strong>Evaluations:</strong> tests or rubrics that determine whether output respects the model.</li>
            <li><strong>Provenance and versioning:</strong> why the commitment exists and when it changed.</li>
          </ol>
          <p>Different implementations may express these through prose, schemas, types, graphs, policies, tests, or code. The packet is a conceptual contract, not a required file format.</p>
        </Sub>

        <Sub title="7. Mango: Technical Success Is Not Human Conversation">
          <p>Reuse the communications example:</p>
          <ul>
            <li><code>Call</code> is the product-level communication attempt.</li>
            <li><code>Dialog</code>, <code>session</code>, endpoint, and routed segments describe technical state.</li>
            <li><code>Protocol answer</code> records a network or provider observation.</li>
            <li><code>Human answer</code> requires stronger evidence.</li>
            <li><code>Conversation</code> is a semantically stronger human outcome.</li>
          </ul>
          <p>A vague instruction such as "follow up on unanswered calls" cannot be safely implemented until the ontology clarifies which observation counts as answered for the product's purpose.</p>
        </Sub>

        <Sub title="8. SoundSculpt: Preserve Creative Distinctions">
          <p>Reuse the creative-domain example:</p>
          <ul>
            <li>composition, performance, production, rendering, and rights are distinct;</li>
            <li>timbre belongs to evaluated rendered sound in this product model;</li>
            <li>mood distinguishes creator intent, observable characteristics, and listener interpretation; and</li>
            <li>scorecards create shared comparison language without turning aesthetic judgment into objective ground truth.</li>
          </ul>
          <p>The case demonstrates that ontology does not have to flatten meaning. A good model formalizes what must coordinate and preserves a place for what remains relational or emergent.</p>
        </Sub>

        <Sub title="9. Ontology as a Living Factory System">
          <p>Implementation and use reveal gaps in the map. The maintenance loop is:</p>
          <Flow>Domain observation → ontology commitment → context and implementation → evaluation → counterexample or consequence → ontology revision.</Flow>
          <p>Factory engineers need ownership, review, versioning, migration, and conflict resolution for semantic changes just as they do for APIs and schemas.</p>
        </Sub>

        <Sub title="10. Semantic Slop">
          <p>End by naming the deeper failure mode. Stylistic slop is recognizable prose: generic cadence, synonym rotation, empty hedging, and familiar transitions.</p>
          <p>Semantic slop is more dangerous. It is clean output built on collapsed concepts, unstated evidence, incompatible contexts, and confident claims about states the system cannot actually know.</p>
          <p>Controlled language helps with the first. Ontology, evaluation, and accountable domain judgment are required for the second.</p>
        </Sub>
      </Section>

      <Section index="08" title="Visual Notes">
        <ol>
          <li><strong>Style guide versus ontology:</strong> expression constraints on one side; domain entities, relationships, evidence, and actions on the other.</li>
          <li><strong>Context assembly:</strong> ontology-guided traversal selecting definitions, examples, evidence, tools, and evaluations for one task.</li>
          <li><strong>Mango map:</strong> protocol observations separated from human outcomes.</li>
          <li><strong>Ontology packet:</strong> the ten-part factory artifact.</li>
        </ol>
      </Section>

      <Section index="09" title="Research and Source Notes">
        <ul>
          <li>Preserve the existing research audit on ontology, bounded contexts, ambiguity, Mango, SoundSculpt, and AI productivity.</li>
          <li>Use the official ASD-STE100 source for claims about the standard itself.</li>
          <li>Treat Chelebi's experiment as a documented small author-run test, not a peer-reviewed general result.</li>
          <li>Add primary sources on in-context learning and retrieval/context selection before publication.</li>
        </ul>
      </Section>

      <div className="article-outline__closing">
        <blockquote>A writing system can make the factory speak clearly. An ontology gives it a world clear enough to speak about.</blockquote>
        <p>Candidate closing line</p>
      </div>
    </div>
  );
}
