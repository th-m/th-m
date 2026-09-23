import { AiFactoryIcon, AiFactoryMotif, AiFactorySeriesMap, aiFactoryIconCatalog, aiFactoryIconKinds, type AiFactoryIconKind, type AiFactoryMotifVariant } from "@th-m/blogs/components";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ai-factory-motif")({
  head: () => ({
    meta: [
      { title: "AI Factory Motif — THOM" },
      {
        name: "description",
        content: "A review sheet for the AI Factory iconography language.",
      },
    ],
  }),
  component: AiFactoryMotifPage,
});

const motifs: Array<{
  index: string;
  variant: AiFactoryMotifVariant;
  note: string;
  context?: string;
  followUp?: AiFactoryMotifVariant;
}> = [
  {
    index: "01",
    variant: "experience-but-lacking",
    note: "Experience, but lacking.",
    followUp: "model-priorities-and-goal-fit",
  },
  {
    index: "02",
    variant: "refinement-and-discipline-to-term-of-art",
    note: "The stabilizing state: practice gives a boundary enough continuity to be shared.",
    followUp: "understanding-in-embedding-space",
  },
  {
    index: "03",
    variant: "term-of-art-to-implementation",
    note: "Understanding used to be a prerequisite. Now we can implement without it.",
    context: "Understanding used to be a practical prerequisite to implementation. AI can now produce an implementation before we understand the problem. When we accept that output without context, judgment, or verification, we get “slop”: output that looks finished without being understood.",
  },
  {
    index: "04",
    variant: "token-economics",
    note: "The production question: how much time goes in, and how much verified value comes out?",
    context: "Treat token transformation, input-preparation time, and verified output value as three separate views. Combining them into one production line hides the question each measure answers.",
    followUp: "ontology-of-terms",
  },
];

const languageUnits = ["morpheme-diffuse", "text", "token"] as const;
const legendKinds = ["morpheme-diffuse", "morpheme-refined", "understanding", "typed-relation"] as const satisfies readonly AiFactoryIconKind[];
const knowledgeFactoryTermKinds = [
  "knowledge-factory",
  "factory-worker",
  "factory-engineer",
  "shared-capital",
  "solutioning",
  "graph-context",
] as const satisfies readonly AiFactoryIconKind[];

function IconographyLegend() {
  return (
    <aside className="motif-review__legend" aria-labelledby="motif-legend-title">
      <p className="eyebrow">The grammar / reusable marks</p>
      <h2 id="motif-legend-title">A small vocabulary carries the whole language.</h2>
      <div className="motif-review__legend-grid">
        {legendKinds.map(kind => (
          <div className="motif-review__legend-item" key={kind}>
            <AiFactoryIcon kind={kind} />
            <div><strong>{aiFactoryIconCatalog[kind].title}</strong><p>{aiFactoryIconCatalog[kind].definition}</p></div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function LanguageUnitSequence() {
  return (
    <section className="motif-review__language" aria-labelledby="language-unit-title">
      <div className="motif-review__language-heading">
        <p className="eyebrow">New sequence / language units</p>
        <h2 id="language-unit-title">Idea → text → token.</h2>
        <p>Keep these separate. They represent different boundaries in the path from meaning to model input, and they should be composable in later illustrations about output efficiency.</p>
      </div>
      <div className="motif-review__language-track">
        {languageUnits.map((kind, index) => (
          <div className="motif-review__language-item" key={kind}>
            <div className="motif-review__icon-stage"><AiFactoryIcon kind={kind} /></div>
            <div className="motif-review__icon-copy"><span className="motif-review__icon-index">{String(index + 1).padStart(2, "0")}</span><h3>{kind === "morpheme-diffuse" ? "Idea" : aiFactoryIconCatalog[kind].title}</h3><p>{aiFactoryIconCatalog[kind].definition}</p></div>
            {index < languageUnits.length - 1 ? <span className="motif-review__language-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function IconSpecCard({ kind, idPrefix = "icon" }: { kind: AiFactoryIconKind; idPrefix?: string }) {
  const { semanticRole, iconId, title, subheading, definition, visualGrammar } = aiFactoryIconCatalog[kind];

  return <article className="motif-review__part" id={`${idPrefix}-${kind}`}>
    {idPrefix === "icon" && iconId !== kind ? <span id={`icon-${iconId}`} aria-hidden="true" /> : null}
    <div className="motif-review__part-meta"><span title="Semantic role">{semanticRole}</span></div>
    <div className="motif-review__part-icon"><AiFactoryIcon kind={kind} /></div>
    <h3>{title}</h3>
    {subheading ? <p className="motif-review__part-subheading">{subheading}</p> : null}
    <p className="motif-review__part-definition">{definition}</p>
    <dl className="motif-review__part-grammar"><dt>Visual grammar</dt><dd>{visualGrammar}</dd></dl>
  </article>;
}

function KnowledgeFactoryTerms() {
  return (
    <section className="motif-review__terms" id="knowledge-factory-terms" aria-labelledby="knowledge-factory-terms-title">
      <div className="motif-review__terms-heading">
        <p className="eyebrow">Knowledge Factory / working icon set</p>
        <h2 id="knowledge-factory-terms-title">Six terms, six distinct marks.</h2>
        <p>These icons are isolated here for refinement. Each card keeps the article definition beside the visual grammar so changes to the mark stay accountable to its meaning.</p>
      </div>
      <div className="motif-review__terms-grid">
        {knowledgeFactoryTermKinds.map(kind => <IconSpecCard kind={kind} idPrefix="knowledge-term" key={kind} />)}
      </div>
    </section>
  );
}

function ComposableParts() {
  return (
    <section className="motif-review__parts" aria-labelledby="composable-parts-title">
      <div className="motif-review__parts-heading">
        <p className="eyebrow">Composable parts / isolated inventory</p>
        <h2 id="composable-parts-title">Every mark has one job.</h2>
        <p>Each card separates a concept’s meaning from its depiction. The semantic role classifies the concept, the title names it, an optional subheading refines its intent and meaning, the definition explains it, and the visual grammar note describes the drawing.</p>
      </div>
      <div className="motif-review__parts-grid">
        {aiFactoryIconKinds.map(kind => <IconSpecCard kind={kind} key={kind} />)}
      </div>
    </section>
  );
}

function AiFactoryMotifPage() {
  return (
    <div className="motif-review-page ai-factory-visual-language">
      <header className="motif-review__hero">
        <div>
          <p className="eyebrow">AI Factory / iconography language / review sheet</p>
          <h1>Meaning needs a shape before it can travel.</h1>
          <p className="motif-review__lede">
            Four chapters, one visual grammar. This page keeps the motif parts together so we can review whether the marks remain coherent as the idea moves from vision to ontology.
          </p>
        </div>
        <nav className="motif-review__nav" aria-label="Motif variants">
          <a href="#series-map">00 / series map</a>
          <a href="#knowledge-factory-terms">Glossary / six terms</a>
          {motifs.map(({ index, variant }) => <a key={variant} href={`#motif-${index}`}>{index} / {variant.replaceAll("-", " ")}</a>)}
        </nav>
      </header>

      <IconographyLegend />
      <section className="motif-review__series" id="series-map" aria-label="AI Factory article series map">
        <AiFactorySeriesMap />
      </section>
      <LanguageUnitSequence />
      <KnowledgeFactoryTerms />
      <ComposableParts />

      <main className="motif-review__gallery">
        {motifs.map(({ index, variant, note, context, followUp }) => (
          <section className="motif-review__entry" id={`motif-${index}`} key={variant} aria-labelledby={`motif-${index}-title`}>
            <div className="motif-review__entry-index"><span>{index}</span><span className="motif-review__entry-line" aria-hidden="true" /></div>
            <div>
              <p className="eyebrow">Variant {index} / continuity check</p>
              <h2 id={`motif-${index}-title`}>{note}</h2>
              {context ? <p className="motif-review__entry-context">{context}</p> : null}
              <AiFactoryMotif variant={variant} />
              {followUp ? <AiFactoryMotif variant={followUp} /> : null}
            </div>
          </section>
        ))}
      </main>

      <footer className="motif-review__footer">
        <p className="eyebrow">Next question</p>
        <div><h2>What should stay invariant as the subject changes?</h2><p>Review the boundary, focal state, connector language, and axis in each panel. The goal is a family of marks that can describe new concepts without becoming a new visual system every time.</p></div>
        <Link to="/writing">Return to writing <span aria-hidden="true">↗</span></Link>
      </footer>
    </div>
  );
}
