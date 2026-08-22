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

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <div className="article-outline">
      <header className="article-outline__header">
        <p className="eyebrow">Essay outline</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <p className="article-outline__status"><strong>Editorial status —</strong> A newly coordinated outline derived from the earlier "AI Knows Propositions; Humans Navigate Relationships" material. The existing research review and proposition/relationship visuals remain useful, but the article now needs additional primary-source work on information theory, language-model training objectives, programming-language constraints, and algorithm naming.</p>
      </header>

      <Section index="01" title="Overview">
        <p>Language models generate coherent continuations by learning patterns in language. Those patterns are not arbitrary. Different truth-seeking practices produce different forms of discourse: a proof, an experimental report, a program, a legal argument, and a product narrative each carry different constraints, conventions, and signals of validity.</p>
        <p>This article connects three ideas. First, communities encode meaningful distinctions into recurring language. Second, information theory gives us a way to reason about uncertainty, surprise, and prediction, which later machine-learning systems operationalize through conditional token prediction. Third, some domains — especially code — produce unusually dense and reliable patterns because syntax, compilers, types, tests, runtimes, and physical consequences continually reject invalid expressions.</p>
        <p>The practical destination is an intuition for working with AI: recognize when a domain has enough linguistic and operational structure for a model to be fluent, choose language that activates the relevant structure, and distinguish a coherent continuation from a correct or meaningful answer.</p>
      </Section>

      <Section index="02" title="Working Subtitle">
        <Quote><strong>Why some language reliably predicts useful answers — and some only predicts what a useful answer sounds like.</strong></Quote>
      </Section>

      <Section index="03" title="Intended Reader">
        <ul>
          <li>Software developers learning why models often appear unusually capable with code.</li>
          <li>Knowledge workers trying to write prompts and context that generate coherent, testable work.</li>
          <li>Product and technical leaders deciding where AI fluency can be trusted and where expert interpretation remains scarce.</li>
        </ul>
      </Section>

      <Section index="04" title="Core Thesis">
        <p>Language becomes predictively useful when a domain repeatedly encodes stable distinctions, constraints, relationships, and consequences into its patterns of expression. A language model can learn those patterns and infer plausible continuations, but the reliability of that inference depends on the structure that produced the language.</p>
        <p>Code is a strong case because incorrect expressions encounter layers of mechanical rejection. Loosely specified strategy, taste, or human meaning often lacks comparable enforcement. The difference is not that one domain contains truth and the other does not; it is that their language has been shaped by different feedback systems.</p>
      </Section>

      <Section index="05" title="Relationship to the Series">
        <p>This is the second essay in the coordinated sequence:</p>
        <ol>
          <li><strong>Solutions, Meaning, and Value</strong> establishes that valuable opportunities are grounded in human stakes.</li>
          <li><strong>Truth, Entropy, and Inference</strong> explains why learned language patterns are powerful, when those patterns carry constraints, and where fluency breaks.</li>
          <li><strong>Understanding Is the Bottleneck</strong> asks how leaders and teams turn abundant output into better problem solving.</li>
          <li><strong>The Knowledge Factory</strong> introduces the organizational system that makes that understanding reusable.</li>
        </ol>
      </Section>

      <Section index="06" title="Terms and Editorial Guardrails">
        <ul>
          <li>Treat the article's forms of truth as an editorial framework, not a universal philosophical taxonomy.</li>
          <li>Distinguish <strong>coherence</strong> (parts fit a pattern), <strong>correctness</strong> (an answer satisfies relevant constraints), and <strong>meaning</strong> (the answer matters within a human situation).</li>
          <li>Define Shannon entropy as uncertainty in a probability distribution. Do not equate entropy with disorder in every colloquial sense.</li>
          <li>Do not imply that Shannon invented language models or that next-token prediction follows automatically from his work. Establish an intellectual lineage, not a single causal invention story.</li>
          <li>Do not say code is fully objective. Requirements, architecture, naming, product behavior, and acceptable tradeoffs remain human judgments.</li>
          <li>Treat model fluency as domain- and task-specific rather than as one global measure of intelligence.</li>
        </ul>
      </Section>

      <Section index="07" title="Section Notes">
        <Sub title="1. The Mystery of the Plausible Continuation">
          <p>Open with two prompts that are grammatically similar but structurally very different:</p>
          <Quote>Implement hash-based sorting for these bounded integer keys.</Quote>
          <Quote>Organize this list really fast.</Quote>
          <p>Both ask for organization and speed. The first activates a technical region of language containing named assumptions, known implementation patterns, and recognizable tradeoffs. The second leaves the ordering rule, data type, size, stability, memory budget, and meaning of "fast" unspecified. A model can answer both fluently; only one prompt gives it much of a correctness surface.</p>
          <p>The governing question is: <strong>what happened in the world that made one pattern of language more informative than the other?</strong></p>
        </Sub>

        <Sub title="2. Forms of Truth Produce Forms of Language">
          <p>Use four overlapping truth practices:</p>
          <ol>
            <li><strong>Formal truth:</strong> validity relative to definitions, axioms, and inference rules. Its language favors explicit premises, symbolic relationships, and proof obligations.</li>
            <li><strong>Empirical truth:</strong> correspondence with observations. Its language favors measurement, method, uncertainty, replication, and counterevidence.</li>
            <li><strong>Operational or pragmatic truth:</strong> reliability in action. Its language favors procedures, preconditions, failure modes, tolerances, and observed outcomes.</li>
            <li><strong>Relational or narrative truth:</strong> significance within human purposes, identities, histories, and relationships. Its language favors perspective, motive, consequence, interpretation, and accountability.</li>
          </ol>
          <p>The same claim may participate in several practices. A temperature reading can be empirically calibrated, operationally relevant to a machine, and relationally experienced as uncomfortable. The categories describe different constraint and meaning systems, not sealed kinds of sentence.</p>
        </Sub>

        <Sub title="3. Entropy, Surprise, and Conditional Prediction">
          <p>Introduce information theory in plain language:</p>
          <ul>
            <li>A probability distribution represents uncertainty among possible messages or symbols.</li>
            <li>A less probable observation carries more surprise under that distribution.</li>
            <li>Entropy summarizes expected uncertainty.</li>
            <li>Conditional prediction asks how the distribution changes when prior context is known.</li>
          </ul>
          <p>Then connect this carefully to language modeling. A next-token model estimates a distribution over possible continuations given preceding context. Training penalizes probability assigned away from observed continuations, commonly through a cross-entropy objective. The result is not a database of sentences; it is a learned structure of conditional regularities.</p>
          <p>Use Shannon's human letter-prediction experiments as historical intuition, not as proof that human language or thought is only next-token prediction.</p>
        </Sub>

        <Sub title="4. Language Patterns Carry the History of Constraint">
          <p>Patterns become meaningful when practices repeatedly reward some distinctions and reject others. Technical terms survive because they compress a history of use:</p>
          <ul>
            <li>a term names a distinction practitioners repeatedly needed;</li>
            <li>surrounding syntax records typical relationships;</li>
            <li>examples teach ordinary cases;</li>
            <li>failures and counterexamples define boundaries; and</li>
            <li>institutions, tools, and consequences reinforce the usage.</li>
          </ul>
          <p>This is why language can contain more knowledge than a glossary reveals. A term of art can point into a network of assumptions and operations. But it also explains stale or harmful fluency: language faithfully records fashionable habits, institutional blind spots, and repeated mistakes too.</p>
        </Sub>

        <Sub title="5. Why Code Is So Pattern-Dense">
          <p>Examine the practical constraints that enforce programming-language patterns:</p>
          <ul>
            <li>parsers reject invalid syntax;</li>
            <li>compilers and type systems reject some invalid relationships;</li>
            <li>tests reject specified behavioral failures;</li>
            <li>runtimes expose crashes, latency, and resource use;</li>
            <li>version control and review preserve examples and corrections; and</li>
            <li>deployed systems encounter users and physical or economic consequences.</li>
          </ul>
          <p>These filters produce large corpora in which many patterns map to executable behavior. That makes code unusually compatible with predictive generation. It does not guarantee that the requested behavior was the right behavior.</p>
          <p>Formal mathematics intensifies the same pattern density. Definitions restrict meaning; proof rules constrain inference; counterexamples eliminate false generalizations; and proof assistants can mechanically reject invalid derivations. Models can therefore search a dense field of candidate steps and receive sharper feedback than most natural-language domains provide. Even so, a verified derivation does not decide whether the formal statement captures the intended problem or whether the result matters. That consequence becomes a case study in <strong>Understanding Is the Bottleneck</strong>.</p>
        </Sub>

        <Sub title="6. “Hash Sort” Versus “Organize This List Really Fast”">
          <p>Use the contrast to teach semantic compression.</p>
          <p>An algorithm name can activate expectations about input shape, complexity, memory, stability, and implementation. But <strong>hash sort is not one universally standard optimal algorithm</strong>, so the article must state the intended variant and assumptions — such as bounded integer keys and hash- or bucket-based partitioning — before treating the name as precise.</p>
          <p>"Organize this list really fast" predicts a generic response because the prompt contains almost no domain constraints. The model must guess what organization means and will often converge on a familiar default. The lesson is not "use jargon." It is: <strong>use the most specific valid concept available, then state the conditions that make it valid.</strong></p>
        </Sub>

        <Sub title="7. A Map of Domain Fluency">
          <p>Teach readers to look for evidence that a domain's language is well grounded:</p>
          <ul>
            <li>stable vocabulary inside a bounded context;</li>
            <li>repeated relationships among named concepts;</li>
            <li>examples and counterexamples;</li>
            <li>external checks or observable consequences;</li>
            <li>explicit uncertainty and disagreement;</li>
            <li>maintained standards, tests, or professional practices; and</li>
            <li>enough representative source material to expose variation.</li>
          </ul>
          <p>Warning signs for weak fluency include overloaded terms, fashionable but untested narratives, hidden value conflicts, sparse evidence, no corrective feedback, and evaluation that depends entirely on whether an answer sounds right.</p>
        </Sub>

        <Sub title="8. Prompting as Constraint Selection">
          <p>Open with a first-person anecdote. While vibe designing a web logo, I realized I needed to eat my own dog food. My early prompts described the result I wanted in broad visual language, but they left too many consequential choices ambiguous. The model could produce plausible variations without reliably producing the typography I had in mind.</p>
          <p>I then pulled in visual references, established guidelines, and principles of typography. I also began prompting with the specific language used in bona fide typography work. The model performed much more accurately — not because the terminology was a magic incantation, but because the prompt now selected a more structured domain and supplied distinctions against which the result could be judged.</p>
          <p>Use the anecdote to make the section's practical point: the original failure was not simply a lack of prompt cleverness. I had supplied an underspecified problem. References narrowed the visual possibility space; typography principles supplied constraints; and professional vocabulary activated patterns connected to established relationships and practices. The model still required human evaluation, but it no longer had to guess what kind of work I meant.</p>
          <p>Offer a practical sequence:</p>
          <ol>
            <li>Name the domain and bounded context.</li>
            <li>Use established terms of art only when their assumptions apply.</li>
            <li>State invariants, inputs, outputs, and unacceptable failure modes.</li>
            <li>Provide representative examples and counterexamples.</li>
            <li>Define what evidence or test would count as success.</li>
            <li>Ask the model to identify missing distinctions before generating the answer.</li>
            <li>Route the result to an evaluator capable of checking the relevant truth practice.</li>
          </ol>
          <p>Prompt quality is not ornamental phrasing. It is the selection and compression of the context that should govern inference.</p>
        </Sub>

        <Sub title="9. Coherence Is Evidence About a Pattern, Not the World">
          <p>Close the argument by separating three judgments:</p>
          <ul>
            <li>Does the response fit the language patterns of the requested domain?</li>
            <li>Does it survive that domain's tests and evidence?</li>
            <li>Does it solve a problem that matters to the people who bear the consequences?</li>
          </ul>
          <p>AI can help with all three, but success at the first can simulate success at the other two. Recognizing that gap is the intuition the article should leave with the reader.</p>
        </Sub>
      </Section>

      <Section index="08" title="Visual Notes">
        <ol>
          <li><strong>Truth practices and their feedback:</strong> four overlapping forms of truth, each connected to the institutions or consequences that constrain language.</li>
          <li><strong>Prediction under constraint:</strong> ambiguous request → broad distribution; precise domain language plus assumptions → narrower, more testable output.</li>
          <li><strong>The code constraint stack:</strong> corpus → syntax → types → tests → runtime → user consequences.</li>
          <li>Reuse the proposition/relationship visual only if its caption is revised to support linguistic constraint and situated meaning rather than the old title.</li>
        </ol>
      </Section>

      <Section index="09" title="Research Queue">
        <ul>
          <li>Claude Shannon, "A Mathematical Theory of Communication" and his work on prediction and printed English.</li>
          <li>Primary descriptions of autoregressive language-model objectives, tokens, cross-entropy loss, and inference.</li>
          <li>Programming-language sources on syntax, type systems, semantics, and testing as distinct correctness filters.</li>
          <li>Algorithm references that clarify the family of techniques sometimes called hash sorting and the assumptions under which they outperform comparison sort.</li>
          <li>Counterexamples in which code-generation fluency produces semantically wrong or insecure systems despite compiling and passing inadequate tests.</li>
        </ul>
      </Section>

      <div className="article-outline__closing">
        <blockquote>A model is fluent where language has learned to carry the constraints. Our work is to know when those patterns are evidence — and when they are only the shape of an answer.</blockquote>
        <p>Candidate closing line</p>
      </div>
    </div>
  );
}
