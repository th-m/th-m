import { AiFactoryIcon, AiFactoryMotif, type AiFactoryIconKind, type AiFactoryMotifVariant } from "@th-m/blogs/components";
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
}> = [
  {
    index: "01",
    variant: "vision-to-morpheme",
    note: "The origin state: diffuse possibility becomes a first expressed unit.",
  },
  {
    index: "02",
    variant: "refinement-and-discipline-to-term-of-art",
    note: "The stabilizing state: practice gives a boundary enough continuity to be shared.",
  },
  {
    index: "03",
    variant: "term-of-art-to-implementation",
    note: "The situated state: a shared term becomes actionable through context and stakes.",
  },
  {
    index: "04",
    variant: "ontology-of-terms",
    note: "The coordinating state: repeated terms become a typed, navigable model.",
  },
];

const languageUnits: Array<{ kind: AiFactoryIconKind; label: string; represents: string }> = [
  { kind: "morpheme-diffuse", label: "Morpheme", represents: "A context-sensitive unit of meaning before its boundary is stable." },
  { kind: "text", label: "Text", represents: "A sequence of expressed morphemes arranged in a readable field." },
  { kind: "token", label: "Token", represents: "A bounded unit presented to a model for processing and output." },
];

const composableParts: Array<{ kind: AiFactoryIconKind; label: string; represents: string; category: string }> = [
  { kind: "vision", label: "Vision", represents: "Felt possibility; the direction before language fixes it.", category: "semantic atom" },
  { kind: "meaning", label: "Meaning", represents: "Directed significance; vision with a path through it.", category: "semantic atom" },
  { kind: "morpheme-refined", label: "Refined morpheme", represents: "A meaning unit with a boundary that can be shared.", category: "semantic atom" },
  { kind: "term-of-art", label: "Term of art", represents: "A stable domain boundary that stays consistent in context.", category: "semantic atom" },
  { kind: "understanding", label: "Understanding", represents: "A situated model that preserves context, evidence, and stakes.", category: "situated state" },
  { kind: "implementation", label: "Implementation", represents: "A concrete decision, test, or artifact that can be revised.", category: "situated state" },
  { kind: "ontology-node", label: "Ontology node", represents: "A term placed inside a shared model of concepts and constraints.", category: "coordination" },
  { kind: "typed-relation", label: "Typed relation", represents: "A labeled connection that says how two terms are related.", category: "coordination" },
  { kind: "operator", label: "Operator", represents: "A practice that combines or transforms meaning.", category: "coordination" },
];

function IconographyLegend() {
  return (
    <aside className="motif-review__legend" aria-labelledby="motif-legend-title">
      <p className="eyebrow">The grammar / reusable marks</p>
      <h2 id="motif-legend-title">A small vocabulary carries the whole language.</h2>
      <div className="motif-review__legend-grid">
        <div className="motif-review__legend-item">
          <span className="motif-review__sample motif-review__sample--diffuse" aria-hidden="true" />
          <div><strong>Diffuse boundary</strong><p>Meaning with possibility still around it.</p></div>
        </div>
        <div className="motif-review__legend-item">
          <span className="motif-review__sample motif-review__sample--refined" aria-hidden="true" />
          <div><strong>Refined boundary</strong><p>A term stable enough to coordinate.</p></div>
        </div>
        <div className="motif-review__legend-item">
          <span className="motif-review__sample motif-review__sample--focal" aria-hidden="true" />
          <div><strong>Focal state</strong><p>The current subject or destination.</p></div>
        </div>
        <div className="motif-review__legend-item">
          <span className="motif-review__sample motif-review__sample--connector" aria-hidden="true">→</span>
          <div><strong>Typed connector</strong><p>The relationship says what changes.</p></div>
        </div>
      </div>
    </aside>
  );
}

function LanguageUnitSequence() {
  return (
    <section className="motif-review__language" aria-labelledby="language-unit-title">
      <div className="motif-review__language-heading">
        <p className="eyebrow">New sequence / language units</p>
        <h2 id="language-unit-title">Morpheme → text → token.</h2>
        <p>Keep these separate. They represent different boundaries in the path from meaning to model input, and they should be composable in later illustrations about output efficiency.</p>
      </div>
      <div className="motif-review__language-track">
        {languageUnits.map(({ kind, label, represents }, index) => (
          <div className="motif-review__language-item" key={kind}>
            <div className="motif-review__icon-stage"><AiFactoryIcon kind={kind} /></div>
            <div className="motif-review__icon-copy"><span className="motif-review__icon-index">{String(index + 1).padStart(2, "0")}</span><h3>{label}</h3><p>{represents}</p></div>
            {index < languageUnits.length - 1 ? <span className="motif-review__language-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
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
        <p>These are the pieces to combine when a future illustration needs to show a new relationship. The icon is the noun; the connector or operator explains what happens between nouns.</p>
      </div>
      <div className="motif-review__parts-grid">
        {composableParts.map(({ kind, label, represents, category }) => (
          <article className="motif-review__part" key={kind}>
            <div className="motif-review__part-meta"><span>{category}</span><span>{kind}</span></div>
            <div className="motif-review__part-icon"><AiFactoryIcon kind={kind} /></div>
            <h3>{label}</h3>
            <p>{represents}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AiFactoryMotifPage() {
  return (
    <div className="motif-review-page">
      <header className="motif-review__hero">
        <div>
          <p className="eyebrow">AI Factory / iconography language / review sheet</p>
          <h1>Meaning needs a shape before it can travel.</h1>
          <p className="motif-review__lede">
            Four transformations, one visual grammar. This page keeps the motif parts together so we can review whether the marks remain coherent as the idea moves from vision to ontology.
          </p>
        </div>
        <nav className="motif-review__nav" aria-label="Motif variants">
          {motifs.map(({ index, variant }) => <a key={variant} href={`#motif-${index}`}>{index} / {variant.replaceAll("-", " ")}</a>)}
        </nav>
      </header>

      <IconographyLegend />
      <LanguageUnitSequence />
      <ComposableParts />

      <main className="motif-review__gallery">
        {motifs.map(({ index, variant, note }) => (
          <section className="motif-review__entry" id={`motif-${index}`} key={variant} aria-labelledby={`motif-${index}-title`}>
            <div className="motif-review__entry-index"><span>{index}</span><span className="motif-review__entry-line" aria-hidden="true" /></div>
            <div>
              <p className="eyebrow">Variant {index} / continuity check</p>
              <h2 id={`motif-${index}-title`}>{note}</h2>
              <AiFactoryMotif variant={variant} />
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
