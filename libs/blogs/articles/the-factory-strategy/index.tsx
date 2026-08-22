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
        <p className="article-outline__status"><strong>Editorial status —</strong> This article evolves the former "Moats in the AI Era" outline into the second factory deep dive. The useful moat material remains as a consequence of strong strategy and compounding feedback rather than the article's organizing subject.</p>
      </header>

      <Section index="01" title="Overview">
        <p>Strategy is a human art. It chooses a direction before the evidence can fully determine the answer. It creates a narrative about the world, develops deep empathy for a customer, competes for scarce opportunities, coordinates allies, and accepts tradeoffs for which people remain accountable.</p>
        <p>AI can accelerate research, generate options, simulate reactions, and expose inconsistencies. It cannot independently decide which future an organization should attempt to create or whose outcome should count. A knowledge factory therefore needs a strategy discipline that keeps human judgment central while making its evidence and feedback substantially more systematic.</p>
        <p>The central tool is an organizational <strong>second brain</strong>: not a warehouse of notes, but a living memory linking narratives, assumptions, customer evidence, decisions, experiments, relationships, and outcomes. Its purpose is to make strategy more learnable without pretending to automate the art.</p>
      </Section>

      <Section index="02" title="Working Subtitle">
        <Quote><strong>Systematize the feedback. Do not automate away the judgment.</strong></Quote>
      </Section>

      <Section index="03" title="Core Thesis">
        <p>The factory's ontology describes the world it can recognize. Strategy chooses where in that world to act, which change to pursue, how to earn the cooperation required, and which risks to accept.</p>
        <p>Organizations can improve and accelerate strategy by building feedback systems that preserve customer empathy, adversarial awareness, diplomatic relationships, decision provenance, and learning over time. These systems should make human strategists better informed and more corrigible — not replace them with a stream of plausible recommendations.</p>
      </Section>

      <Section index="04" title="Relationship to the Series">
        <p>This is the sixth essay and the strategic companion to <strong>The Factory — Ontology</strong>:</p>
        <ul>
          <li>Ontology asks: <strong>What exists here, how does it relate, and what can we know?</strong></li>
          <li>Strategy asks: <strong>What future should we pursue, with whom, against what resistance, and at what cost?</strong></li>
        </ul>
        <p>Together they supply semantic coherence and purposeful direction to <strong>The Knowledge Factory</strong>.</p>
      </Section>

      <Section index="05" title="Intended Reader">
        <p>Founders, executives, product and engineering leaders, strategists, and senior individual contributors responsible for choosing direction under uncertainty.</p>
      </Section>

      <Section index="06" title="Key Terms">
        <Terms items={[
          ["Strategy", "a coherent set of choices about a desired future, the obstacles and opportunities between here and there, and the coordinated actions used to change the situation."],
          ["Narrative", "a causal interpretation connecting present conditions, actors, stakes, possible change, and a believable path forward."],
          ["Adversarial opportunism", "recognizing competition, incentives, conflict, timing, and ways other actors may resist or exploit a move."],
          ["Diplomatic opportunism", "creating value through trust, coalition, negotiation, distribution, partnership, and aligned incentives."],
          ["Second brain", "a maintained organizational memory that connects strategic beliefs and decisions to evidence, owners, experiments, and outcomes."],
        ]} />
      </Section>

      <Section index="07" title="Editorial Guardrails">
        <ul>
          <li>Do not equate strategy with a plan, backlog, goal, prediction, or generated market analysis.</li>
          <li>Do not romanticize human strategists. They are vulnerable to narrative bias, status, incentives, selective memory, and confirmation.</li>
          <li>"Adversarial" does not mean reckless aggression. It means taking competing interests, countermoves, and power seriously.</li>
          <li>"Diplomatic" does not mean avoiding conflict. It means understanding that many opportunities require cooperation, legitimacy, and durable relationships.</li>
          <li>Do not call a document repository a second brain unless it supports retrieval, relationships, revision, and feedback.</li>
          <li>Preserve uncertainty and minority views instead of rewriting strategic history after an outcome is known.</li>
        </ul>
      </Section>

      <Section index="08" title="Section Notes">
        <Sub title="1. Strategy Begins Where the Answer Stops Being Deducible">
          <p>Open with a well-instrumented company facing several plausible directions. It has market data, customer interviews, competitive analysis, prototypes, and AI-generated recommendations. None of them can deductively choose the future.</p>
          <p>Strategy begins when evidence constrains but does not determine action. Someone must interpret the situation, imagine a change, choose a wager, and accept responsibility for the consequences.</p>
        </Sub>

        <Sub title="2. Narrative Is a Causal Tool">
          <p>A strategy needs a narrative because coordinated action depends on an account of:</p>
          <ul>
            <li>what is changing;</li>
            <li>why the current situation persists;</li>
            <li>who experiences the problem and why it matters;</li>
            <li>which actors can enable or resist change;</li>
            <li>what intervention could alter the system; and</li>
            <li>why this organization can credibly pursue it.</li>
          </ul>
          <p>The narrative is not branding varnish. It is a causal model expressed in a form people can remember, challenge, and use to coordinate.</p>
          <p>AI can generate many narratives. Human strategists must test which one explains the evidence, preserves inconvenient details, and motivates an ethically and economically viable direction.</p>
        </Sub>

        <Sub title="3. Deep Customer Empathy Defines the Stakes">
          <p>Strategy must remain close to customers because a market category or metric cannot fully specify value. Deep empathy means understanding the customer's workflow, identity, incentives, fears, compromises, relationships, and cost of change.</p>
          <p>It also means understanding non-consumption, exclusion, and the people who bear costs without becoming the buyer.</p>
          <p>Systematize this contact through longitudinal research, support and sales loops, field observation, customer councils, win/loss review, and post-release follow-up. The purpose is not to outsource the decision to customers; it is to keep the strategic narrative accountable to lived conditions.</p>
        </Sub>

        <Sub title="4. Adversarial Opportunism">
          <p>Every strategic move changes another actor's options. Examine:</p>
          <ul>
            <li>competitors and substitutes;</li>
            <li>suppliers, platforms, and regulators;</li>
            <li>internal incentives and political constraints;</li>
            <li>likely countermoves;</li>
            <li>scarce timing windows;</li>
            <li>asymmetries the organization can exploit; and</li>
            <li>ways success could attract imitation or dependency.</li>
          </ul>
          <p>AI can enumerate games and scenarios, but adversarial judgment depends on local knowledge, credibility, risk tolerance, and an understanding of what other people actually value.</p>
        </Sub>

        <Sub title="5. Diplomatic Opportunism">
          <p>Many advantages are earned through relationships rather than defeated rivals:</p>
          <ul>
            <li>partnerships and distribution;</li>
            <li>standards and ecosystems;</li>
            <li>customer trust;</li>
            <li>community legitimacy;</li>
            <li>internal coalitions;</li>
            <li>negotiated access and permissions; and</li>
            <li>incentives that let several parties benefit from the same move.</li>
          </ul>
          <p>Diplomatic strategy asks not only "How do we win?" but "What arrangement makes others willing to help this future exist?"</p>
        </Sub>

        <Sub title="6. Systematize the Feedback System">
          <p>Strategy improves when the factory records the loop rather than only the final plan:</p>
          <Flow>Evidence → interpretation → assumption → choice → action → response → outcome → revised interpretation.</Flow>
          <p>For each consequential choice, retain:</p>
          <ul>
            <li>the narrative and expected causal mechanism;</li>
            <li>supporting and contradictory evidence;</li>
            <li>assumptions and confidence;</li>
            <li>alternatives considered and rejected;</li>
            <li>owners and decision rights;</li>
            <li>leading indicators and disconfirming signals;</li>
            <li>observed customer, competitor, partner, and system responses; and</li>
            <li>the revision made after learning.</li>
          </ul>
          <p>This turns strategy from periodic theater into an ongoing learning discipline.</p>
        </Sub>

        <Sub title="7. The Organizational Second Brain">
          <p>Define the second brain by capability rather than software category. It should let a strategist ask:</p>
          <ul>
            <li>Why did we believe this market was changing?</li>
            <li>Which customer observations support that belief?</li>
            <li>Which decisions depend on it?</li>
            <li>What did we predict competitors would do?</li>
            <li>Which partnerships or relationships are material?</li>
            <li>What evidence would cause us to stop?</li>
            <li>Where did an earlier strategy fail, and what did we learn?</li>
          </ul>
          <p>The system should connect notes, research, domain concepts, people, decisions, experiments, metrics, and outcomes through graph context. Search retrieves documents; a second brain reconstructs the reasoning and relationships needed for a decision.</p>
        </Sub>

        <Sub title="8. AI as Strategic Staff, Not Sovereign">
          <p>Use AI to:</p>
          <ul>
            <li>synthesize evidence with provenance;</li>
            <li>generate competing interpretations;</li>
            <li>red-team assumptions and narratives;</li>
            <li>model scenarios and countermoves;</li>
            <li>identify missing stakeholders;</li>
            <li>compare a current choice with prior decisions;</li>
            <li>monitor signals tied to explicit hypotheses; and</li>
            <li>prepare decision reviews.</li>
          </ul>
          <p>Do not ask AI for "the strategy" and mistake a coherent genre performance for an independent choice. Require alternatives, uncertainty, source separation, and explicit tests of the prompt's preferred framing.</p>
        </Sub>

        <Sub title="9. Defensibility Is the Residue of a Learning System">
          <p>Carry forward the strongest material from the moats outline. Durable advantage can emerge from:</p>
          <ul>
            <li>scarce domain knowledge;</li>
            <li>proprietary or permissioned data;</li>
            <li>ontology and proprietary logic;</li>
            <li>rights and privileged access;</li>
            <li>brand, relationships, distribution, and trust;</li>
            <li>infrastructure and capital;</li>
            <li>network effects; and</li>
            <li>feedback loops that improve the system through use.</li>
          </ul>
          <p>These are not a checklist of possessions. They become moats when strategy links them into a system that repeatedly creates customer value and becomes difficult to reproduce.</p>
        </Sub>

        <Sub title="10. Strategic Cadence for the Factory">
          <p>Offer a practical rhythm:</p>
          <ol>
            <li>Maintain a small set of explicit strategic hypotheses.</li>
            <li>Link work and evidence to those hypotheses.</li>
            <li>Review leading signals without erasing qualitative customer evidence.</li>
            <li>Run adversarial and diplomatic reviews before major commitments.</li>
            <li>Record predictions and stop conditions before outcomes are known.</li>
            <li>Revisit the narrative when evidence changes.</li>
            <li>Promote validated learning into ontology, evaluation, workflow, or resource allocation.</li>
          </ol>
          <p>The cadence accelerates learning while leaving final choices with accountable humans.</p>
        </Sub>
      </Section>

      <Section index="09" title="Visual Notes">
        <ol>
          <li><strong>Ontology and strategy:</strong> ontology maps the possible world; strategy draws a path through it; outcomes revise both.</li>
          <li><strong>Strategic feedback loop:</strong> evidence → narrative → choice → response → learning.</li>
          <li><strong>Second-brain context graph:</strong> hypothesis linked to customers, evidence, decisions, actors, experiments, metrics, and outcomes.</li>
          <li><strong>Adversarial and diplomatic opportunity:</strong> competition and coalition as two complementary views of the same landscape.</li>
        </ol>
      </Section>

      <Section index="10" title="Research Queue">
        <ul>
          <li>Strategy as choice under uncertainty and as a coherent system of activities.</li>
          <li>Sensemaking, narrative, and organizational decision-making.</li>
          <li>Adversarial reasoning, game theory, negotiation, coalition, and ecosystem strategy.</li>
          <li>Customer empathy and longitudinal discovery practices.</li>
          <li>Decision journals, forecasting, after-action review, and organizational memory.</li>
          <li>Evidence on AI-supported strategic work, sycophancy, order effects, and scenario generation.</li>
        </ul>
      </Section>

      <div className="article-outline__closing">
        <blockquote>The factory can remember more, simulate more, and learn faster. Strategy still begins when a person decides which future is worth making real.</blockquote>
        <p>Candidate closing line</p>
      </div>
    </div>
  );
}
