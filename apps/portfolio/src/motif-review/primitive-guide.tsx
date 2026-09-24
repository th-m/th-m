import { useState, type ReactNode } from "react";
import { AiFactoryIcon, type AiFactoryIconKind } from "@th-m/blogs/components";
import "./primitive-guide.css";

const primitives = [
  { kind: "dot", name: "Dot", role: "Individual / instance", copy: "A participant, event, or particular instance. A gold dot anchors Self; equal gray dots form Others." },
  { kind: "circle", name: "Circle", role: "Meaning / possibility", copy: "A whole concept or field of meaning. A center, boundary, and surrounding marks distinguish meaning, value, and understanding." },
  { kind: "triangle", name: "Triangle", role: "Information / evaluation", copy: "An informational object or a way to evaluate it. Blue highlights information; the gray dotted Truthy form is the shared interface." },
  { kind: "diamond", name: "Diamond", role: "Intervention / choice", copy: "A proposed change along a path. Gold identifies the intended intervention, without implying that it has succeeded." },
  { kind: "pentagon", name: "Pentagon", role: "Artificial agent", copy: "An angular counterpart to the participant dot. Match its visual weight to a person; shape distinguishes the kind of participant." },
  { kind: "frame", name: "Frame", role: "Scope / artifact", copy: "A boundary around a system, artifact, or working space. Containment establishes scope; a label names what is inside." },
  { kind: "line", name: "Line", role: "Connection / movement", copy: "Connects things or describes passage between them. Stroke treatment describes the connection; an arrow adds direction." },
  { kind: "text", name: "Text strokes", role: "Expression", copy: "Short solid strokes grouped in rows represent language. Spaces separate expressions; they are not a dotted path." },
  { kind: "blocks", name: "Blocks", role: "Encoded units", copy: "A sequence of blocks represents tokens. An array suggests numerical dimensions. Arrangement carries the distinction." },
] as const;
type Primitive = typeof primitives[number]["kind"];

function Specimen({ kind }: { kind: Primitive }) {
  const shapes: Record<Primitive, ReactNode> = {
    dot: <circle cx="80" cy="60" r="8" fill="currentColor" stroke="none" />,
    circle: <circle cx="80" cy="60" r="32" />,
    triangle: <path d="M80 27L118 93H42Z" />,
    diamond: <path d="M80 28L112 60L80 92L48 60Z" />,
    pentagon: <path d="M80 50L89.5 57L86 68H74L70.5 57Z" fill="currentColor" stroke="none" />,
    frame: <rect x="43" y="30" width="74" height="60" />,
    line: <path d="M30 60H130" />,
    text: <path d="M30 42H59M67 42H99M107 42H130M30 60H48M56 60H102M110 60H130M30 78H70M78 78H115" />,
    blocks: <>{[0, 1, 2, 3].map(i => <rect key={i} x={30 + i * 26} y="44" width="23" height="32" fill="currentColor" fillOpacity={.12 + i * .13} />)}</>,
  };
  return <svg className={`primitive-guide__specimen primitive-guide__specimen--${kind}`} viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{shapes[kind]}</svg>;
}

const compositions: Array<{ kind: AiFactoryIconKind; title: string; description: string; rules: [string, string][] }> = [
  { kind: "opportunity", title: "Opportunity", description: "Possible paths toward meaning or value.", rules: [["Shape", "Equal circles identify possibilities in the same family."], ["Stroke", "Dotted branches invite exploration and movement."], ["Color", "Gray keeps one possibility neutral; gold emphasizes meaning or intended value."]] },
  { kind: "experiment", title: "Experiment", description: "A path toward information.", rules: [["Shape", "Equal triangles identify informational outcomes."], ["Stroke", "Dotted branches express testing and movement toward observations."], ["Color", "Gray and blue distinguish neutral and highlighted information, not failure and success."]] },
  { kind: "goal", title: "Goal", description: "A desired outcome that incentivizes movement.", rules: [["Shape", "The center and targeting marks give the movement a focus."], ["Stroke", "The dotted outer circle invites movement toward the goal; it does not make the goal vague."], ["Color", "Gold identifies purpose and intent."]] },
  { kind: "implementation", title: "Implementation", description: "Moving from intention into action or an artifact.", rules: [["Shape", "A bounded source extends into a directional arrow."], ["Stroke", "The dotted path emphasizes the transition being undertaken."], ["Color", "Neutral geometry leaves the specific action to its label."]] },
  { kind: "automation", title: "Automation", description: "An established connection from input to execution.", rules: [["Shape", "A source, an execution node, and an arrow form a connected mechanism."], ["Stroke", "A solid path expresses a connection already in place, even while activity moves through it."], ["Color", "Gold emphasizes the active course; gray identifies the execution node."]] },
  { kind: "truth", title: "Truthy", description: "The shared interface for the three truth evaluations.", rules: [["Shape", "The triangle belongs to the information and evaluation family."], ["Stroke", "A dotted boundary is open to Coherence, Correspondence, and Consequence."], ["Color", "Gray keeps the interface neutral. Blue appears in the specific evaluations."]] },
];

export function PrimitiveGuide() {
  const [selected, setSelected] = useState(0);
  const composition = compositions[selected];
  return <section className="primitive-guide" id="primitives" aria-labelledby="motif-legend-title">
    <header className="primitive-guide__heading">
      <p className="eyebrow">The grammar / shared visual language</p>
      <h2 id="motif-legend-title">A small vocabulary carries the whole language.</h2>
      <p>Shape names the thing. Stroke describes its state. Color gives it a role. Composition makes the relationship visible.</p>
      <nav aria-label="Visual grammar sections"><a href="#grammar-shapes">01 / Primitives</a><a href="#grammar-lines">Lines & color</a><a href="#grammar-treatments">02 / Boundaries & scale</a><a href="#grammar-composition">03 / Composition</a></nav>
    </header>

    <div className="primitive-guide__section" id="grammar-shapes">
      <div className="primitive-guide__section-title"><span>01 / Primitives</span><h3>Start with the smallest meaningful mark.</h3></div>
      <div className="primitive-guide__grid">{primitives.map(item => <article className="primitive-guide__primitive" key={item.kind}>
        <Specimen kind={item.kind} /><div><p className="primitive-guide__meta">{item.role}</p><h4>{item.name}</h4><p>{item.copy}</p></div>
      </article>)}</div>
      <div className="primitive-guide__lines" id="grammar-lines" aria-labelledby="grammar-lines-title">
        <div className="primitive-guide__section-title"><span>Primitive / line</span><h3 id="grammar-lines-title">Lines connect, move, and express.</h3></div>
        <div className="primitive-guide__line-grid">
          <article><svg viewBox="0 0 300 64" aria-hidden="true"><path d="M32 32H268" /></svg><h4>Solid line</h4><p>An established connection, continuity, or wholeness. Automation uses a solid path because the connection is already in place.</p></article>
          <article><svg viewBox="0 0 300 64" aria-hidden="true"><path className="primitive-guide__dotted" d="M32 32H268" /></svg><h4>Dotted line</h4><p>Movement, flexibility, or possibility. Opportunity, Experiment, and Implementation use dotted paths toward something.</p></article>
          <article><svg viewBox="0 0 300 64" aria-hidden="true"><path d="M32 22H268M260 16L268 22L260 28" /><path className="primitive-guide__dotted" d="M32 46H268" /><path d="M260 40L268 46L260 52" /></svg><h4>Directed line</h4><p>An arrow adds direction to either stroke. A label names the action. Short strokes grouped into rows instead read as text.</p></article>
        </div>
        <p className="primitive-guide__color-intro">Color gives the line a role. Solid or dotted describes its connection or movement.</p>
        <div className="primitive-guide__colors">{[
          ["neutral", "Gray", "Neutral structure or another possibility. Never a synonym for false."],
          ["gold", "Gold", "Purpose, agency, meaning, and intended value."],
          ["blue", "Blue", "Information, evidence, and evaluation. Not a guarantee of truth."],
          ["red", "Red", "An identified fault, contradiction, or departure from intent. Regular dots alone do not indicate damage."],
        ].map(([tone, title, copy]) => <article key={tone}><svg className={`primitive-guide__swatch primitive-guide__swatch--${tone}`} viewBox="0 0 120 32" aria-hidden="true"><path d="M0 7H120" /><path className="primitive-guide__dotted" d="M0 25H120" /></svg><h4>{title}</h4><p>{copy}</p></article>)}</div>
      </div>
    </div>

    <div className="primitive-guide__section" id="grammar-treatments">
      <div className="primitive-guide__section-title"><span>02 / Boundaries & scale</span><h3>The same shape can carry a different state.</h3></div>
      <div className="primitive-guide__strokes">
        <article><svg viewBox="0 0 360 100" aria-hidden="true"><circle cx="180" cy="50" r="28" /></svg><h4>Solid boundary</h4><p>A cohesive whole or a defined identity. Solidity does not certify truth or completion.</p></article>
        <article><svg viewBox="0 0 360 100" aria-hidden="true"><circle cx="180" cy="50" r="28" className="primitive-guide__dotted" /></svg><h4>Dotted boundary</h4><p>Flexibility, possibility, or an invitation to move. Goal motivates movement; Truthy offers an open interface for the truth evaluations.</p></article>
      </div>
      <div className="primitive-guide__scale">
        <div><p className="primitive-guide__meta">Size / relative roles</p><h4>A point is not a field.</h4><p>Useful references in a 160-unit drawing frame: 16 for an instance, 32 for an endpoint, 64 for a field. Adjust for the composition while matching the visual weight of alternatives; size does not express worth or certainty.</p></div>
        <svg viewBox="0 0 360 132" role="img" aria-label="A filled 16-unit dot, a 32-unit outlined circle, and a 64-unit outlined field"><circle cx="55" cy="48" r="8" fill="currentColor" /><circle cx="165" cy="48" r="16" /><circle cx="290" cy="48" r="32" /><text x="55" y="111">16 / instance</text><text x="165" y="111">32 / endpoint</text><text x="290" y="111">64 / field</text></svg>
      </div>
    </div>

    <div className="primitive-guide__section" id="grammar-composition">
      <div className="primitive-guide__section-title"><span>03 / Composition</span><h3>Read the parts. Then read them together.</h3></div>
      <div className="primitive-guide__choices" role="group" aria-label="Choose a composition">{compositions.map((item, index) => <button type="button" key={item.kind} aria-pressed={selected === index} aria-controls="grammar-example" onClick={() => setSelected(index)}>{item.title}</button>)}</div>
      <div className="primitive-guide__composition" id="grammar-example" aria-live="polite" aria-atomic="true">
        <div className="primitive-guide__composed-icon"><AiFactoryIcon kind={composition.kind} /></div>
        <div className="primitive-guide__explanation"><p className="primitive-guide__meta">Composed from the same primitives</p><h4>{composition.title}</h4><p>{composition.description}</p><dl>{composition.rules.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl></div>
      </div>
      <div className="primitive-guide__rules">{[
        ["Keep alternatives equal", "Use equal endpoints for peer possibilities. A highlight gives one a role; it does not make it larger."],
        ["Give direction a verb", "An arrow establishes direction. A label explains whether the path informs, produces, constrains, or returns."],
        ["Let marks breathe", "Leave air between an edge and a glyph. Attach directly only where a deliberate port establishes the connection."],
        ["Distinguish openness from damage", "Evenly spaced dots express flexibility. Irregular red breaks express faults. A centered X marks a missing connection."],
      ].map(([title, copy], index) => <article key={title}><span className="primitive-guide__meta">Rule 0{index + 1}</span><h4>{title}</h4><p>{copy}</p></article>)}</div>
    </div>
  </section>;
}
