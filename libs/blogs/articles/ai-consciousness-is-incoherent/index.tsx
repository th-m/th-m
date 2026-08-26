import type { ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import "./ai-consciousness-article.css";

function formatDate(value: string): string {
  return new Date(value + "T00:00:00.000Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
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

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}

function Claim({
  label,
  children,
  emphasis = false,
}: {
  label: string;
  children: ReactNode;
  emphasis?: boolean;
}) {
  const className = emphasis ? "article-claim article-claim--emphasis" : "article-claim";
  return (
    <Card className={className}>
      <CardHeader><p className="eyebrow">{label}</p></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

function Term({ children, gloss }: { children: ReactNode; gloss: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">{gloss}</TooltipContent>
    </Tooltip>
  );
}

function AccessManeuverFigure() {
  return (
    <figure className="ai-consciousness-figure access-maneuver-figure">
      <div
        className="access-maneuver"
        role="img"
        aria-label="Phenomenal consciousness is replaced with measurable information access, access is measured, and the word consciousness is restored to the result"
      >
        <div className="access-maneuver__node access-maneuver__node--target">
          <span>Original target</span>
          <strong>Phenomenal consciousness</strong>
          <small>felt experience</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node">
          <span>Substitution</span>
          <strong>Information access</strong>
          <small>report, memory, control</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node">
          <span>Measurement</span>
          <strong>Access detected</strong>
          <small>observable function</small>
        </div>
        <span className="access-maneuver__arrow" aria-hidden="true">→</span>
        <div className="access-maneuver__node access-maneuver__node--warning">
          <span>Unsupported return</span>
          <strong>“Consciousness”</strong>
          <small>phenomenality implied</small>
        </div>
      </div>
      <figcaption>
        The measurable target changes, but the original word is restored after measurement.
      </figcaption>
    </figure>
  );
}

function EvidenceBridgeFigure() {
  return (
    <figure className="ai-consciousness-figure evidence-bridge-figure">
      <div className="evidence-bridge">
        <section className="evidence-bridge__lane evidence-bridge__lane--human">
          <header><span>Validated domain</span><strong>Human attribution</strong></header>
          <div className="evidence-bridge__chain" aria-label="Human phenomenal attribution evidence chain">
            <span>First-person report</span>
            <span aria-hidden="true">+</span>
            <span>Shared biology</span>
            <span aria-hidden="true">+</span>
            <span>Neural and behavioral intervention</span>
          </div>
          <p>Convergent phenomenal attribution</p>
        </section>
        <section className="evidence-bridge__lane evidence-bridge__lane--ai">
          <header><span>Unvalidated domain</span><strong>AI attribution</strong></header>
          <div className="evidence-bridge__chain" aria-label="AI phenomenal attribution evidence chain">
            <span>Behavior or architecture</span>
            <span aria-hidden="true">+</span>
            <span>Disputed theory</span>
            <span aria-hidden="true">→</span>
            <span className="evidence-bridge__missing">No phenomenal bridge</span>
          </div>
          <p>Hypothesis, not empirical counterpart</p>
        </section>
      </div>
      <figcaption>
        Similar reports do not carry similar evidence when one report has a validated biological
        bridge and the other does not.
      </figcaption>
    </figure>
  );
}

function TheoryDilemmaFigure() {
  return (
    <figure className="ai-consciousness-figure theory-dilemma-figure">
      <div
        className="theory-dilemma"
        role="img"
        aria-label="The functionalist causal-organization claim either includes biological causal processes that current AI does not reproduce or excludes them and assumes they are irrelevant"
      >
        <div className="theory-dilemma__root">
          <span>Functionalist condition</span>
          <strong>“Sufficiently fine-grained causal organization”</strong>
        </div>
        <div className="theory-dilemma__branches">
          <section>
            <span>Include biological causal powers</span>
            <strong>Current AI does not reproduce the condition.</strong>
          </section>
          <section>
            <span>Exclude biological causal powers</span>
            <strong>The theory assumes they are irrelevant.</strong>
          </section>
        </div>
      </div>
      <figcaption>
        One branch defeats the present AI comparison. The other assumes the disputed conclusion.
      </figcaption>
    </figure>
  );
}

function LogicPlate() {
  return (
    <div className="ai-consciousness-logic" role="region" aria-label="Logical form of the argument">
      <div><span>Observed in humans</span><code>E(H) ⇒ N(H) is associated with P(H)</code></div>
      <div><span>Observed in AI</span><code>E(AI) ⇒ selected capacities A(AI)</code></div>
      <div className="ai-consciousness-logic__blocked">
        <span>Does not follow</span><code>E(AI) ⇏ P(AI)</code>
      </div>
    </div>
  );
}

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="article-outline ai-consciousness-article">
        <header className="article-outline__header">
          <p className="eyebrow">Essay</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <time dateTime={post.publishedAt}>Published {formatDate(post.publishedAt)}</time>
            {post.updatedAt ? (
              <span>Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span>
            ) : null}
          </div>
          {post.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
          <div className="article-outline__lede">
            <p>Ask whether an AI is conscious and the question slips before anyone answers it.</p>
            <p>
              One person means awake. Another means responsive. Another means capable of
              reporting an internal state. Then, without warning, the conversation moves to
              whether there is anything it feels like to be the system.
            </p>
            <p>Those are different claims.</p>
          </div>
        </header>

        <Section index="01" title="One Word, Incompatible Claims">
          <p>
            Of course an AI can produce the sentence, “I am afraid.” It can classify fear,
            describe fear, predict fearful behavior, and use a representation labeled <code>fear</code>{" "}
            while selecting an action. None of those observations contains the private fact the
            sentence appears to report: that fear is being felt by someone.
          </p>
          <Claim label="Core thesis" emphasis>
            <p>
              The unqualified claim that an AI is conscious in the same sense as a human is
              empirically incoherent. Phenomenal consciousness has no settled cross-substrate
              definition, every validated positive measure in the comparison is grounded in
              living brains, and no validated evidence establishes qualia, phenomenal selfhood,
              or subjective temporal awareness in a non-biological AI architecture.
            </p>
          </Claim>
          <p>
            This is not an argument that artificial consciousness is metaphysically impossible.
            It is a rejection of a positive empirical claim that has no stable predicate, no
            discriminating cross-substrate observation, and no validated bridge from the
            observation to experience.
          </p>
          <table tabIndex={0}>
            <thead><tr><th>Use of the word</th><th>Observable target</th></tr></thead>
            <tbody>
              <tr><td>Wakefulness</td><td>Whether a biological organism is awake rather than asleep or anesthetized</td></tr>
              <tr><td>Responsiveness</td><td>Whether a system reacts to an input</td></tr>
              <tr><td>Information access</td><td>Whether information is available for report, reasoning, memory, or control</td></tr>
              <tr><td>Self-monitoring</td><td>Whether a system represents or reports aspects of its own state</td></tr>
              <tr><td>Intelligence</td><td>Whether a system performs cognitive tasks successfully</td></tr>
              <tr><td>Phenomenal consciousness</td><td>Whether there is anything it feels like to be the system</td></tr>
            </tbody>
          </table>
          <p>
            A thermostat is responsive. A database makes information available. A model can
            monitor activations and generate self-descriptions. None of those facts establishes
            the redness of red, pain as it hurts, fear as it is experienced, or the first-person
            character of existing through time.
          </p>
          <p>
            This article uses <strong>consciousness</strong> only in that phenomenal sense.{" "}
            <Term gloss="The particular felt qualities within phenomenal experience.">Qualia</Term>{" "}
            are the sting of pain, the taste of sourdough, the bodily force of panic, and the
            visual presence of red.
          </p>
          <p>Competing theories supply incompatible membership rules:</p>
          <ul className="ai-consciousness-article__bullets">
            <li><strong>Substrate-sensitive accounts</strong> treat biological causal powers or neural dynamics as constitutive.</li>
            <li><strong>Computational functionalism</strong> treats sufficiently fine-grained causal-functional organization as sufficient regardless of material.</li>
            <li><strong>Access-oriented accounts</strong> give explanatory weight to availability, recurrence, monitoring, or reportability.</li>
          </ul>
          <p>
            The sentence “humans and AI are both conscious” looks like a comparison. Until the
            predicate and membership rule are fixed and validated, it is only one word being used
            for incompatible claims.
          </p>
        </Section>

        <Section index="02" title="The Hard Problem Is the Entire Problem">
          <p>
            The <Ext href="https://consc.net/papers/facing.html">hard problem of consciousness</Ext>{" "}
            asks why any physical or computational processing is accompanied by felt experience
            at all.
          </p>
          <p>
            It is not the problem of explaining how a system discriminates inputs, integrates
            information, reports an internal state, remembers a result, learns a policy, or
            controls behavior. Those are difficult functional problems. But even a complete
            account of those operations does not explain why any operation should feel like
            something from the inside.
          </p>
          <p>
            A system can classify wavelengths without red looking like anything. It can avoid
            damage without pain hurting. It can produce “I am afraid” without a private subject
            experiencing fear.
          </p>
          <Sub title="The access-consciousness maneuver">
            <p>
              <Ext href="https://doi.org/10.1017/S0140525X00038188">Ned Block&apos;s distinction</Ext>{" "}
              labels information available for reasoning, report, and control <strong>access
              consciousness</strong>, while reserving <strong>phenomenal consciousness</strong> for
              felt experience.
            </p>
            <p>
              The distinction can expose an omitted premise, but the name can also conceal one.
              Access is an analytical designation for informational availability. Whether it is
              consciousness, a prerequisite for consciousness, a consequence of consciousness,
              or merely correlated with consciousness remains theory-dependent.
            </p>
            <AccessManeuverFigure />
            <p>
              Attaching the word <em>consciousness</em> does not demonstrate that access feels like
              anything. If a theory defines access as sufficient for phenomenality, it assumes the
              bridge it claims to establish. If access is only related to phenomenality, observing
              access cannot establish phenomenality.
            </p>
            <Claim label="The first boundary">
              <p><strong>The behavior is observable. The proposed experience is not.</strong></p>
            </Claim>
          </Sub>
        </Section>

        <Section index="03" title="Where the Evidence Actually Exists">
          <p>
            For humans, evidence about consciousness is convergent and biological. We do not
            simply ask a person a question and accept the sentence in isolation. We connect
            first-person reports and conscious capacities to shared anatomy, development, sleep,
            anesthesia, injury, stimulation, behavior, and measured neural activity.
          </p>
          <p>Controlled interventions make the relationship more than a loose correlation:</p>
          <ul className="ai-consciousness-article__evidence">
            <li>
              A <Ext href="https://doi.org/10.1126/scitranslmed.3006294">Perturbational Complexity Index</Ext>{" "}
              discriminated wakefulness, dreaming, non-REM sleep, anesthesia, and clinical states
              following coma by perturbing human cortex and measuring its response.
            </li>
            <li>
              Under different anesthetics, complex cortical responses tracked later reports of
              experience even when subjects were behaviorally unresponsive (
              <Ext href="https://doi.org/10.1016/j.cub.2015.10.014">Sarasso et al.</Ext>).
            </li>
            <li>
              With retinal input held constant during binocular rivalry, face- and place-selective
              cortical activity tracked what subjects reported seeing (
              <Ext href="https://doi.org/10.1016/S0896-6273%2800%2980592-9">Tong et al.</Ext>).
            </li>
            <li>
              Direct stimulation of human fusiform cortex produced face-specific perceptual
              distortions (
              <Ext href="https://doi.org/10.1523/JNEUROSCI.2609-12.2012">Parvizi et al.</Ext>).
            </li>
            <li>
              Stimulation of orbitofrontal, cingulate, and insular sites elicited reported bodily,
              sensory, and affective experiences whose intensity increased with stimulation
              magnitude (<Ext href="https://doi.org/10.1093/scan/nsz015">Yih et al.</Ext>).
            </li>
            <li>
              Angular-gyrus stimulation altered reported body location and ownership (
              <Ext href="https://doi.org/10.1038/419269a">Blanke et al.</Ext>), while
              medial-temporal resection reduced autobiographical reliving and its sensory,
              affective, and spatiotemporal detail (
              <Ext href="https://pubmed.ncbi.nlm.nih.gov/18413911/">Noulhiane et al.</Ext>).
            </li>
            <li>
              Disruption of human V1 produced transient unawareness of visual targets while some
              discrimination remained above chance (
              <Ext href="https://doi.org/10.1073/pnas.0505332102">Boyer, Harrison, and Ro</Ext>).
            </li>
          </ul>
          <p>
            These measurements do not display a quale on an instrument. They measure neural
            activity, behavior, capacities, and first-person report. Together they support a
            strong empirical proposition:
          </p>
          <Claim label="The biological proposition" emphasis>
            <p>
              In humans, conscious state, reported qualia, bodily self-location, and
              autobiographical reliving are systematically associated with organized biological
              brain activity; controlled changes to that activity can alter or abolish the
              corresponding reports and capacities.
            </p>
          </Claim>
          <p>
            That does not prove that only biology could ever support experience. It establishes
            the empirical base we possess. Human phenomenal evidence is grounded in living neural
            systems. Substrate independence is not another observation produced by these studies.
            It is an extrapolation supplied by a theory.
          </p>
        </Section>

        <Section index="04" title="The Empirical Asymmetry">
          <p>
            No non-biological AI has an independently validated phenomenal state against which
            its behavior, self-reports, memory, monitoring, or internal activations can be
            calibrated.
          </p>
          <p>There is no demonstrated artificial analogue of:</p>
          <ul className="ai-consciousness-article__bullets">
            <li>felt qualia;</li>
            <li>a first-person subject to whom states appear;</li>
            <li>autobiographical recollection as experienced recollection rather than retrieved records;</li>
            <li>subjective temporal continuity rather than tokens, timestamps, context, recurrence, or stored state; or</li>
            <li>a phenomenal referent behind sentences such as “I feel pain.”</li>
          </ul>
          <p>
            Current systems can implement functional analogues of self-modeling, memory, temporal
            ordering, introspective language, multimodal processing, and goal-directed control.
            Those observations establish capabilities. They do not establish that any capability
            is experienced.
          </p>
          <EvidenceBridgeFigure />
          <p>
            Human self-report is not infallible. But it is embedded in the same biological
            organization whose alteration changes reported experience, wakefulness, perception,
            bodily self-location, and autobiographical reliving. AI self-report is generated
            behavior from a materially different system trained on human language about
            experience. Treating the reports as equivalent discards the evidentiary structure
            surrounding the human one.
          </p>
        </Section>

        <Section index="05" title="A Theory Is Not Evidence of Its Conclusion">
          <p>
            Computational functionalism offers the strongest counterargument. State it in its
            strongest form: if a system reproduced the sufficiently fine-grained causal
            organization constitutive of human experience, then changing the material alone
            should not change the experience.
          </p>
          <p>
            The phrase <em>changing the material alone</em> assumes the disputed conclusion.
            Material supplies causal powers. In humans, sensory, interoceptive, affective,
            homeostatic, mnemonic, and neural processes are realized in living biology and are
            causally associated with reported experience, motivation, and selfhood.
          </p>
          <TheoryDilemmaFigure />
          <p>
            No experiment has preserved the complete organization alleged to constitute
            experience, replaced its material substrate, and then demonstrated preserved qualia.
            Organizational invariance remains a philosophical bridge principle, not an observed
            cross-substrate instance of experience.
          </p>
          <p>
            The same limitation applies to theory-first machine assessments. A leading{" "}
            <Ext href="https://doi.org/10.1016/j.tics.2025.10.011">
              AI-consciousness indicator framework
            </Ext>{" "}
            derives indicators from selected theories and uses them to update credence. It does
            not empirically observe machine phenomenality.
          </p>
          <p>
            Defining a computational property as sufficient for consciousness and then detecting
            that property proves that the property is present. It does not independently prove
            that the property is sufficient for experience.
          </p>
          <p>
            The theories are not settled even within their biological home. A preregistered{" "}
            <Ext href="https://doi.org/10.1038/s41586-025-08888-1">
              adversarial test of Global Neuronal Workspace Theory and Integrated Information Theory
            </Ext>{" "}
            substantially challenged central predictions of both. Implementing one disputed
            theory&apos;s favored abstraction in software cannot count as a theory-neutral
            observation of consciousness.
          </p>
          <Claim label="The circularity">
            <p>
              Redefinition can make a machine conscious under the definition. It does not
              automatically entail reasonable or useful association to preexisting syntific
              enquery.
            </p>
          </Claim>
        </Section>

        <Section index="06" title="Similar Operations Do Not Rescue the Claim">
          <p>
            Humans and AI can share abstract functions: prediction, classification,
            error-sensitive adaptation, information integration, memory-like retrieval,
            planning, and premise-to-conclusion inference.
          </p>
          <div className="ai-consciousness-inference" aria-label="Valid and invalid functional inferences">
            <section>
              <span>Valid</span>
              <code>shared measured function</code>
              <strong>therefore</strong>
              <code>shared measured function</code>
            </section>
            <section>
              <span>Invalid</span>
              <code>shared measured function</code>
              <strong>therefore</strong>
              <code>shared felt experience</code>
            </section>
          </div>
          <p>
            Backpropagation must also be kept distinct from inference. In an artificial neural
            network, <Ext href="https://doi.org/10.1038/323533a0">backpropagation</Ext>{" "}
            is a training algorithm for assigning error and updating parameters. Inference is
            execution using the trained parameters.
          </p>
          <p>
            Biological learning includes error signals, plasticity, recurrence, and distributed
            neural processing. Brains have not been shown to implement ordinary machine-learning
            backpropagation as a general learning rule. Biologically motivated models can{" "}
            <Ext href="https://proceedings.neurips.cc/paper/2018/hash/1dc3a89d0d440ba31729b0ba74b93a33-Abstract.html">
              approximate backpropagation through local dendritic signals
            </Ext>
            . That is a proposed solution to a related credit-assignment problem, not a
            demonstration of literal brain-wide backpropagation.
          </p>
          <p>
            Functional overlap does not establish physical identity. Physical identity would
            not, by itself, solve the hard problem. Neither kind of similarity establishes
            phenomenal consciousness.
          </p>
        </Section>

        <Section index="07" title="The Argument Without the Rhetoric">
          <p>Let:</p>
          <ul className="ai-consciousness-article__bullets">
            <li><code>P(x)</code> mean that system <code>x</code> has phenomenal consciousness;</li>
            <li><code>A(x)</code> mean that information is available for report, reasoning, and control;</li>
            <li><code>N(x)</code> mean that <code>x</code> has the biological neural dynamics associated with human consciousness;</li>
            <li><code>F(x)</code> mean that <code>x</code> has the organization required by a functional theory; and</li>
            <li><code>E(x)</code> mean the observable evidence about <code>x</code>.</li>
          </ul>
          <LogicPlate />
          <p>Competing theories add incompatible premises:</p>
          <div className="ai-consciousness-conditionals">
            <code>Tₙ: N(x) ⇒ P(x)</code>
            <code>Tꜰ: F(x) ⇒ P(x)</code>
          </div>
          <p>Functionalism can therefore produce a valid conditional:</p>
          <Claim label="Theory-dependent conditional">
            <p><code>if Tꜰ is true</code></p>
            <p><code>and if F(AI) has actually been established</code></p>
            <p><code>then P(AI)</code></p>
          </Claim>
          <p>
            Neither antecedent is a validated cross-substrate empirical bridge for current AI.
            Detecting access-like behavior does not establish <code>F(AI)</code>, and defining{" "}
            <code>F(x)</code> as sufficient does not establish that the definition is true.
          </p>
          <p><strong>Therefore <code>P(AI)</code> does not follow.</strong></p>
        </Section>

        <Section index="08" title="Conclusion">
          <p>
            The problem is not that AI lacks impressive cognitive functions. It predicts,
            classifies, retrieves, plans, represents, monitors, and controls. The problem is the
            attempt to convert evidence of those operations into evidence of a first-person life.
            Furthermore, the problem is the carelessness with which particular terms are
            overextended, thereby causing easy misinterpretation and ambiguity in scientific
            literature and turning science into meaningless, sensationalized headlines.
          </p>
          <p>
            Human consciousness and AI computation have no validated empirical correspondence in
            qualia, phenomenal selfhood, or subjective temporal awareness. Human consciousness is
            measured through relations among first-person experience, behavior, and organized
            biological brain activity. AI operates through a different material architecture for
            which no phenomenal measure has been validated.
          </p>
          <p>
            Theories that redefine consciousness around computational properties supply
            hypotheses, not evidence. “Access consciousness” can rename measurable information
            access, but the name does not create experience. Functional similarity can establish
            shared function, but not shared feeling. A substrate-independence postulate can
            describe what would follow if the theory were true, but it cannot prove its own
            premise.
          </p>
          <Claim label="Conclusion" emphasis>
            <p>
              Calling humans and AI conscious in the same phenomenal sense is not a supported
              comparison. It is an empirically incoherent use of a shared word.
            </p>
          </Claim>
        </Section>

        <Section index="09" title="Addendum">
          <ul>
            <li>
              <a href="/writing/consciousness-is-incoherent">AI's Consciousness explanation</a>
              {" — "}the earlier essay and its restored original prompt.
            </li>
          </ul>
        </Section>

        <Section index="10" title="Sources">
          <p>
            The argument above is my synthesis. These primary sources support its definitions,
            biological evidence, theory comparison, and technical boundaries.
          </p>
          <ol className="ai-consciousness-article__sources">
            <li>
              Ned Block.{" "}
              <Ext href="https://doi.org/10.1017/S0140525X00038188">
                “On a Confusion about a Function of Consciousness.”
              </Ext>{" "}
              <em>Behavioral and Brain Sciences</em> (1995).
            </li>
            <li>
              David Chalmers.{" "}
              <Ext href="https://consc.net/papers/facing.html">
                “Facing Up to the Problem of Consciousness.”
              </Ext>{" "}
              (1995).
            </li>
            <li>
              John Searle.{" "}
              <Ext href="https://doi.org/10.1146/annurev.neuro.23.1.557">
                “Consciousness.”
              </Ext>{" "}
              <em>Annual Review of Neuroscience</em> (2000).
            </li>
            <li>
              David Chalmers.{" "}
              <Ext href="https://consc.net/papers/qualia.html">
                “Absent Qualia, Fading Qualia, Dancing Qualia.”
              </Ext>{" "}
              (1995).
            </li>
            <li>
              Adenauer Casali et al.{" "}
              <Ext href="https://doi.org/10.1126/scitranslmed.3006294">
                “A Theoretically Based Index of Consciousness Independent of Sensory Processing and Behavior.”
              </Ext>{" "}
              <em>Science Translational Medicine</em> (2013).
            </li>
            <li>
              Simone Sarasso et al.{" "}
              <Ext href="https://doi.org/10.1016/j.cub.2015.10.014">
                “Consciousness and Complexity during Unresponsiveness Induced by Propofol, Xenon, and Ketamine.”
              </Ext>{" "}
              <em>Current Biology</em> (2015).
            </li>
            <li>
              Frank Tong et al.{" "}
              <Ext href="https://doi.org/10.1016/S0896-6273%2800%2980592-9">
                “Binocular Rivalry and Visual Awareness in Human Extrastriate Cortex.”
              </Ext>{" "}
              <em>Neuron</em> (1998).
            </li>
            <li>
              Josef Parvizi et al.{" "}
              <Ext href="https://doi.org/10.1523/JNEUROSCI.2609-12.2012">
                “Electrical Stimulation of Human Fusiform Face-Selective Regions Distorts Face Perception.”
              </Ext>{" "}
              <em>Journal of Neuroscience</em> (2012).
            </li>
            <li>
              Jennifer Yih et al.{" "}
              <Ext href="https://doi.org/10.1093/scan/nsz015">
                “Intensity of Affective Experience Is Modulated by Magnitude of Intracranial Electrical Stimulation in Human Orbitofrontal, Cingulate and Insular Cortices.”
              </Ext>{" "}
              <em>Social Cognitive and Affective Neuroscience</em> (2019).
            </li>
            <li>
              Olaf Blanke et al.{" "}
              <Ext href="https://doi.org/10.1038/419269a">
                “Stimulating Illusory Own-Body Perceptions.”
              </Ext>{" "}
              <em>Nature</em> (2002).
            </li>
            <li>
              Cyril Boyer, Stephen Harrison, and Tony Ro.{" "}
              <Ext href="https://doi.org/10.1073/pnas.0505332102">
                “Unconscious Processing of Orientation and Color without Primary Visual Cortex.”
              </Ext>{" "}
              <em>Proceedings of the National Academy of Sciences</em> (2005).
            </li>
            <li>
              Marion Noulhiane et al.{" "}
              <Ext href="https://pubmed.ncbi.nlm.nih.gov/18413911/">
                “Autonoetic Consciousness in Autobiographical Memories after Medial Temporal Lobe Resection.”
              </Ext>{" "}
              (2008).
            </li>
            <li>
              COGITATE Consortium et al.{" "}
              <Ext href="https://doi.org/10.1038/s41586-025-08888-1">
                “Adversarial Testing of Global Neuronal Workspace and Integrated Information Theories of Consciousness.”
              </Ext>{" "}
              <em>Nature</em> (2025).
            </li>
            <li>
              Patrick Butlin et al.{" "}
              <Ext href="https://doi.org/10.1016/j.tics.2025.10.011">
                “Identifying Indicators of Consciousness in AI Systems.”
              </Ext>{" "}
              <em>Trends in Cognitive Sciences</em> (2026).
            </li>
            <li>
              David Rumelhart, Geoffrey Hinton, and Ronald Williams.{" "}
              <Ext href="https://doi.org/10.1038/323533a0">
                “Learning Representations by Back-Propagating Errors.”
              </Ext>{" "}
              <em>Nature</em> (1986).
            </li>
            <li>
              João Sacramento et al.{" "}
              <Ext href="https://proceedings.neurips.cc/paper/2018/hash/1dc3a89d0d440ba31729b0ba74b93a33-Abstract.html">
                “Dendritic Cortical Microcircuits Approximate the Backpropagation Algorithm.”
              </Ext>{" "}
              (2018).
            </li>
          </ol>
        </Section>
      </div>
    </TooltipProvider>
  );
}
