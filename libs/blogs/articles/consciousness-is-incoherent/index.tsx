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

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
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

function Claim({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="article-claim">
      <CardHeader><p className="eyebrow">{label}</p></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Term({ children, definition }: { children: ReactNode; definition: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">{definition}</TooltipContent>
    </Tooltip>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="article-outline">
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
            <p>Is an AI conscious?</p>
            <p>It depends on the definition.</p>
            <p>
              That answer exposes the problem. The word moves between responsiveness,
              self-report, information access, intelligence, self-monitoring, wakefulness, and
              phenomenal experience. Evidence for one is quietly treated as evidence for another.
            </p>
          </div>
        </header>

        <Section index="01" title="The question collapses too soon">
          <p>
            This essay uses <strong>consciousness</strong> in the phenomenal sense: whether there
            is anything it is like to be the system. The redness of red. The sourness of
            sourdough. Paralyzing fear. The sting of a burn before it becomes a sentence about
            damaged tissue.
          </p>
          <p>
            Ned Block distinguished <Term definition="The felt, first-person character of an experience.">phenomenal consciousness</Term> from <Term definition="Information being available for reasoning, report, and control.">access consciousness</Term>. A system may process, route, and report information without that settling whether the processing feels like anything.
          </p>
          <p>
            The distinction is influential and disputed. It is used here to expose an omitted
            premise, not to claim that inaccessible phenomenal experience has been experimentally
            established.
          </p>
          <p>
            A language model can say, “I am afraid.” That output demonstrates an ability to
            generate an appropriate self-description. It may also reveal useful internal
            representations or monitoring. It does not, by itself, establish a private phenomenal
            referent behind <em>I</em> or <em>afraid</em>.
          </p>
          <Claim label="The first boundary">
            The behavior is observable. The proposed experience is not.
          </Claim>
        </Section>

        <Section index="02" title="Human evidence is strong—and local">
          <p>
            Human consciousness is tied to biology in the most direct evidentiary sense we have.
            Changes in organized neural activity covary with changes in reported experience.
            Sleep, anesthesia, brain injury, stimulation, and disorders of consciousness alter
            what people can experience or report. Neural and clinical measures can help
            distinguish levels and contents of consciousness in human patients.
          </p>
          <p>
            That establishes a dependence between human experience and human neurobiology. It
            does not establish that biology is necessary for every possible form of experience.
            Nor does a brain correlate become a substrate-neutral meter that can be pointed at a
            transformer running on silicon.
          </p>
          <p>
            The <ExternalLink href="https://doi.org/10.1126/scitranslmed.3006294">Perturbational Complexity Index study</ExternalLink> is a useful example. Researchers perturbed the human cortex and measured the complexity of its response, producing an index that tracked conscious level across wakefulness, sleep, anesthesia, and some disorders of consciousness. This is objective evidence about a measure validated on human brains. It is not a direct reading of qualia, a proof of one theory, or a ready-made test for an AI.
          </p>
          <Claim label="The defensible claim">
            There is no accepted, theory-independent objective measure that establishes
            phenomenal consciousness across biological and artificial substrates.
          </Claim>
        </Section>

        <Section index="03" title="Two theories, two predicates">
          <p>
            Biological accounts and computational functionalism do not merely propose different
            mechanisms. They disagree about what would be sufficient for the word
            <em> conscious</em> to apply.
          </p>
          <table tabIndex={0}>
            <thead>
              <tr>
                <th>Account</th>
                <th>What it treats as decisive</th>
                <th>Consequence for AI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Biological naturalism</td>
                <td>The relevant causal powers realized by biological brains.</td>
                <td>Equivalent input, output, or software organization is not sufficient evidence.</td>
              </tr>
              <tr>
                <td>Functionalism / organizational invariance</td>
                <td>The right fine-grained causal and functional organization.</td>
                <td>A different substrate could qualify if it genuinely preserved that organization.</td>
              </tr>
            </tbody>
          </table>
          <p>
            Consider a hypothetical silicon system that reproduces the functional organization
            of a human brain. Functionalism supplies a route to calling it conscious. Biological
            naturalism denies that functional equivalence alone settles the question. The
            evidence did not change between those verdicts. The predicate did.
          </p>
          <p>
            “Conscious” appears to be one category while the theories supply incompatible
            membership rules.
          </p>
        </Section>

        <Section index="04" title="The argument in one line">
          <p>Let:</p>
          <ul>
            <li><code>A</code> be an artificial system;</li>
            <li><code>E(A)</code> be the observable evidence about it;</li>
            <li><code>Access(A)</code> mean information is available for report, reasoning, and action;</li>
            <li><code>F(A)</code> mean it has the organization a functional theory requires;</li>
            <li><code>N(A)</code> mean it has the organization a substrate-sensitive theory requires; and</li>
            <li><code>P(A)</code> mean it has phenomenal consciousness.</li>
          </ul>
          <Claim label="Theory-dependent inference">
            <p><code>E(A) ⇒ Access(A)</code></p>
            <p><code>Tꜰ: F(A) ⇒ P(A)</code></p>
            <p><code>Tɴ: N(A) ⇒ P(A)</code></p>
            <p><code>E(A) ⇏ P(A)</code></p>
          </Claim>
          <p>
            The competing theories supply different bridge principles. The claim also depends on
            showing that the machine actually instantiates the proposed condition—not merely that
            it produces similar answers.
          </p>
          <p>
            If two live theories select different conditions, then the bare expression
            <code> P(A)</code> has no stable, theory-independent criterion of truth. At best:
            <em> if theory Tᵢ is right, and if this system implements condition Cᵢ, then it is
            conscious under Tᵢ.</em>
          </p>
          <p>That is a conditional attribution, not an observation of machine experience.</p>
        </Section>

        <Section index="05" title="“Play with fire and get burned”">
          <p>
            Human reasoning is not sealed away from qualia. Pain, fear, relief, hunger, and
            pleasure shape attention, memory, learning, and choice. “Play with fire and get
            burned” is both a proposition and a compressed record of what consequences can feel
            like.
          </p>
          <p>
            But the functional lesson can be reproduced without evidence of the feeling. An
            artificial agent can learn to avoid a high-temperature state through a penalty
            signal. It can predict burns, explain pain behavior, and protect a person from a
            stove. Successful avoidance does not tell us whether the penalty hurt.
          </p>
          <ul>
            <li>Human reasoning is often shaped by felt consequences.</li>
            <li>A system can reproduce part of the resulting behavior without sharing those consequences.</li>
          </ul>
          <p>Similar behavior does not establish similar experience.</p>
        </Section>

        <Section index="06" title="The problem is in the language">
          <p>
            The word <em>consciousness</em> carries several histories at once: clinical
            wakefulness, reportable access, self-awareness, intelligence, moral standing, and
            phenomenal feel. A language model is trained on all of those usages. Its fluency can
            make the cluster appear more unified than the underlying theories are.
          </p>
          <p>
            Self-report is one of the signals humans use to infer minds in one another. Among
            humans, that inference is supported by shared biology, development, behavior,
            vulnerability, injury, anesthesia, and our own first-person case. An AI can reproduce
            the report while lacking that shared evidentiary bridge.
          </p>
          <p>
            Saying “humans and AI are both conscious” is a little like saying “humans and AI are
            both deterministic.” The sentence may group both systems under a sufficiently broad
            description, but it tells us almost nothing about whether their relevant mechanisms,
            experiences, or moral situations are alike. The category is too coarse to do the
            explanatory work being asked of it.
          </p>
        </Section>

        <Section index="07" title="What evidence would be enough?">
          <ol>
            <li><strong>Definition.</strong> What property is being attributed?</li>
            <li><strong>Discriminating measurement.</strong> What distinguishes experience from identical-looking behavior, information access, or self-report?</li>
            <li><strong>Validated bridge.</strong> What shows that the measured property is sufficient for experience across the relevant conscious and non-conscious cases?</li>
            <li><strong>Causal instantiation.</strong> What intervention shows that the AI implements that property and changes in the predicted way when it is altered?</li>
          </ol>
          <p>
            No current machine-consciousness attribution passes this standard as a generally
            accepted, theory-neutral proof. Every attribution depends on hypotheses about which
            theory is right, which mechanism matters, whether that mechanism is substrate-independent,
            and whether a particular machine instantiates it.
          </p>
          <Claim label="What follows">
            This does not prove that artificial consciousness is impossible. It identifies what a
            coherent claim would have to supply.
          </Claim>
        </Section>

        <Section index="08" title="Ask questions that can fail">
          <p>
            “Is it conscious?” invites a yes or no before the predicate and test exist. A better
            research program asks narrower questions:
          </p>
          <ul>
            <li>Which internal states are globally available for report and control?</li>
            <li>Which monitoring processes causally alter the system&apos;s behavior?</li>
            <li>Does a proposed measure distinguish conscious from non-conscious processing in the cases where it has already been validated?</li>
            <li>What perturbation would cause the theory to predict a change in experience?</li>
            <li>Which result would falsify the attribution rather than merely produce a less persuasive performance?</li>
          </ul>
          <p>
            Perhaps novel probes will eventually establish a bridge between a nonbiological
            mechanism and phenomenal experience. Until then, the honest conclusion is not that an
            AI definitely lacks consciousness. It is that the unqualified comparison between
            machine and human consciousness has no agreed referent and no theory-independent test.
          </p>
          <blockquote>
            <p>
              The possibility is philosophical. The attribution is hypothetical. The shared word
              is doing more work than the evidence.
            </p>
          </blockquote>
        </Section>

        <Section index="09" title="Original brief">
          <p>
            This essay began with a question about whether human and machine consciousness can be
            meaningfully compared.
          </p>
          <blockquote>
            <p><strong>Is an AI conscious?</strong><br />It depends on the definition.</p>
          </blockquote>

          <h3>Questions to investigate</h3>
          <ul>
            <li>What do we mean by consciousness—the redness of red, the taste of sourdough, paralyzing fear, or another form of phenomenal experience?</li>
            <li>How strongly is human consciousness tied to biology and measurable neural activity?</li>
            <li>Do qualia shape reasoning and learning? “Play with fire and get burned” suggests that some lessons are inseparable from felt consequences.</li>
            <li>Could consciousness emerge from neural mechanisms realized in another material substrate?</li>
            <li>If so, what evidence would show that it functions like human consciousness?</li>
          </ul>

          <h3>Argument to develop</h3>
          <p>
            An unqualified comparison—<em>humans and AI are both conscious</em>—may tell us as
            little as saying that both are deterministic. The problem lies in the language, the
            properties it references, and the evidence needed to connect them.
          </p>
          <p>The article should:</p>
          <ol>
            <li>Explain why current machine-consciousness claims remain hypothetical without an accepted, theory-independent cross-substrate measure.</li>
            <li>Bring forward the earlier notes showing how competing theories of mind propose incompatible conditions for consciousness.</li>
            <li>Express that incongruency as a concise logical argument and identify the novel probes a coherent attribution would require.</li>
          </ol>
        </Section>

        <Section index="10" title="Sources">
          <ul>
            <li>Ned Block, <ExternalLink href="https://doi.org/10.1017/S0140525X00038188">“On a Confusion about a Function of Consciousness”</ExternalLink> (1995).</li>
            <li>John Searle, <ExternalLink href="https://doi.org/10.1146/annurev.neuro.23.1.557">“Consciousness”</ExternalLink> (2000).</li>
            <li>David Chalmers, <ExternalLink href="https://consc.net/papers/qualia.html">“Absent Qualia, Fading Qualia, Dancing Qualia”</ExternalLink> (1995).</li>
            <li>Adenauer Casali and colleagues, <ExternalLink href="https://doi.org/10.1126/scitranslmed.3006294">“A Theoretically Based Index of Consciousness Independent of Sensory Processing and Behavior”</ExternalLink> (2013).</li>
            <li>Stanislas Dehaene and Jean-Pierre Changeux, <ExternalLink href="https://doi.org/10.1016/j.neuron.2011.03.018">“Experimental and Theoretical Approaches to Conscious Processing”</ExternalLink> (2011).</li>
            <li>Patrick Butlin and colleagues, <ExternalLink href="https://doi.org/10.1016/j.tics.2025.10.011">“Identifying Indicators of Consciousness in AI Systems”</ExternalLink> (2026).</li>
          </ul>
        </Section>
      </div>
    </TooltipProvider>
  );
}
