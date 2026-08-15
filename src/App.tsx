import { useState } from "react";
import { motion } from "motion/react";
import { ThomGlyphStage, ThomLogo } from "./brand/thom/ThomLogo";
import type { ThomGlyph } from "./brand/thom/threeScene";
import { artifacts, books, referenceGroups, type ReferenceItem } from "./content/profile";

const glyphs: Array<{
  glyph: ThomGlyph;
  symbol: string;
  title: string;
  principle: string;
  formula: string;
  description: string;
}> = [
  {
    glyph: "t",
    symbol: "T",
    title: "Foundations",
    principle: "constant",
    formula: "π = C / d",
    description: "Begin with principles, invariants, and things that remain true while scale and context change.",
  },
  {
    glyph: "h",
    symbol: "H",
    title: "Equilibrium",
    principle: "proportion",
    formula: "φ = (a+b)/a = a/b",
    description: "Good systems balance competing constraints rather than pretending those constraints can be removed.",
  },
  {
    glyph: "o",
    symbol: "O",
    title: "Emergence",
    principle: "relationship",
    formula: "pᵢ = (cₓ + r cos θᵢ, cᵧ + r sin θᵢ)",
    description: "Relationships between simple elements reveal structures that are not visible in the elements alone.",
  },
  {
    glyph: "m",
    symbol: "M",
    title: "Superposition",
    principle: "composition",
    formula: "Sₙ(x) = a₀/2 + Σ(aₙ cos 2πnx + bₙ sin 2πnx)",
    description: "Simple ideas, technologies, and disciplines compose into something more expressive than any individual part.",
  },
];

const ExternalArrow = () => <span aria-hidden="true">↗</span>;

function ExternalLink({ item, className = "" }: { item: ReferenceItem; className?: string }) {
  return (
    <a className={className} href={item.href} target="_blank" rel="noreferrer">
      <span>{item.title}</span>
      <ExternalArrow />
    </a>
  );
}

function SectionIntro({ index, eyebrow, title, copy }: { index: string; eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="section-intro">
      <p className="section-index">{index}</p>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy ? <p className="section-copy">{copy}</p> : null}
      </div>
    </div>
  );
}

function Reveal({ children, className = "", as = "section", id }: { children: React.ReactNode; className?: string; as?: "section" | "div"; id?: string }) {
  const Component = motion[as];
  return (
    <Component
      id={id}
      className={className}
      initial={false}
      whileInView={{ opacity: [0.68, 1], y: [14, 0] }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="header-brand" href="#top" aria-label="THOM — return to top">
        <ThomLogo variant="header" motion="compact" />
        <span className="header-domain">th-m.codes</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#mark">Mark</a>
        <a href="#thinking">Thinking</a>
        <a href="#library">Library</a>
        <a href="#focus">Focus</a>
        <a href="#work">Work</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-meta">
        <p className="eyebrow">Thomas Valadez</p>
        <p className="sequence">constant <span>→</span> equilibrium <span>→</span> emergence <span>→</span> superposition</p>
      </div>
      <h1 id="hero-title" className="sr-only">THOM — Thomas Valadez</h1>
      <div className="hero-mark">
        <ThomLogo variant="hero" motion="full" interactive />
      </div>
      <div className="hero-bottom">
        <p className="hero-statement">Start with what remains true. Balance constraints. Let relationships create structure. Compose the result.</p>
        <a className="scroll-cue" href="#mark">About the mark <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}

function MarkSection() {
  const [activeGlyph, setActiveGlyph] = useState<ThomGlyph>("t");
  const [replayToken, setReplayToken] = useState(0);
  const active = glyphs.find((item) => item.glyph === activeGlyph) ?? glyphs[0];
  const activate = (glyph: ThomGlyph) => {
    setActiveGlyph(glyph);
    setReplayToken((token) => token + 1);
  };

  return (
    <Reveal className="mark-section page-section" id="mark">
      <SectionIntro
        index="01"
        eyebrow="About the mark"
        title="Four ideas, held in one name."
        copy="The letterforms use different construction techniques. Cap height, baseline, color, spacing, optical weight, and motion make them one system."
      />
      <div className="mark-experience">
        <div className="glyph-visual-wrap">
          <p className="glyph-principle">{active.principle}</p>
          <ThomGlyphStage glyph={activeGlyph} replayToken={replayToken} ariaLabel={`${active.symbol} — ${active.title}`} />
          <p className="glyph-formula">{active.formula}</p>
        </div>
        <div className="glyph-list" aria-label="THOM construction principles">
          {glyphs.map((item, index) => (
            <button
              type="button"
              className={item.glyph === activeGlyph ? "is-active" : ""}
              key={item.glyph}
              aria-pressed={item.glyph === activeGlyph}
              onClick={() => activate(item.glyph)}
              onPointerEnter={() => activate(item.glyph)}
              onFocus={() => activate(item.glyph)}
            >
              <span className="glyph-number">0{index + 1}</span>
              <span className="glyph-symbol">{item.symbol}</span>
              <span className="glyph-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <span className="glyph-replay" aria-hidden="true">↻</span>
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function IntroSection() {
  return (
    <Reveal className="intro-section page-section">
      <p className="section-index">02</p>
      <div className="intro-copy">
        <p className="eyebrow">A working position</p>
        <h2>I am interested in how software systems become understandable enough to change.</h2>
        <div className="intro-columns">
          <p>Most of the engineering questions I return to live between product intent and system design: What is the real shape of the domain? Which boundaries are durable, and which ones are just artifacts of the current implementation?</p>
          <p>Where is complexity collecting? What would make the next change easier without over-designing for an imagined future?</p>
        </div>
      </div>
    </Reveal>
  );
}

function ThinkingSection() {
  return (
    <Reveal className="thinking-section page-section" id="thinking">
      <SectionIntro index="03" eyebrow="Concepts worth knowing" title="A field guide to systems that can change." copy="References that sharpen how I reason about software design, delivery, product experience, and semantics." />
      <div className="reference-groups">
        {referenceGroups.map((group, groupIndex) => (
          <article className="reference-group" key={group.title}>
            <header>
              <span>0{groupIndex + 1}</span>
              <h3>{group.title}</h3>
            </header>
            <ul>
              {group.items.map((item) => (
                <li key={item.title}>
                  <ExternalLink item={item} />
                  <p>{item.description}{item.extra ? <> <a href={item.extra.href} target="_blank" rel="noreferrer">[{item.extra.label}]</a></> : null}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

function LibrarySection() {
  return (
    <Reveal className="library-section page-section" id="library">
      <SectionIntro index="04" eyebrow="Books and operating models" title="Ideas become useful when they change the work." />
      <ol className="book-grid">
        {books.map((book, index) => (
          <li key={book.title}>
            <span className="book-index">{String(index + 1).padStart(2, "0")}</span>
            <ExternalLink item={book} className="book-title" />
            <p>{book.description}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function FocusSection() {
  return (
    <Reveal className="focus-section page-section" id="focus">
      <div className="focus-orbit" aria-hidden="true" />
      <SectionIntro index="05" eyebrow="Current focus" title="Making sound visible enough to shape." />
      <div className="focus-content">
        <p>Most current side-project energy is going into Soundsculpt: exploring AI-assisted audio generation, creative tooling, and product workflows around prompt-driven media.</p>
        <a href="https://soundsculpt.app" target="_blank" rel="noreferrer" className="focus-link">
          <span>soundsculpt.app</span>
          <ExternalArrow />
        </a>
      </div>
    </Reveal>
  );
}

function WorkSection() {
  return (
    <Reveal className="work-section page-section" id="work">
      <SectionIntro index="06" eyebrow="Public artifacts" title="Running systems, in various states of becoming." copy="Some are old, some are unfinished. Most moonlight work goes to Soundsculpt, and my day job gets my daylight work." />
      <div className="artifact-list">
        {artifacts.map((artifact, index) => (
          <article key={artifact.title}>
            <span className="artifact-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <ExternalLink item={artifact} className="artifact-title" />
              <p>{artifact.description}</p>
            </div>
            <span className="artifact-type">PUBLIC REPOSITORY</span>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

const assets = [
  { label: "Master mark", file: "thom-master.svg", className: "asset-master" },
  { label: "Compact mark", file: "thom-compact.svg", className: "asset-compact" },
  { label: "Social avatar", file: "avatar.svg", className: "asset-avatar" },
  { label: "Favicon", file: "favicon.svg", className: "asset-icon" },
  { label: "Light mark", file: "thom-light.svg", className: "asset-light" },
];

function AssetsSection() {
  return (
    <Reveal className="assets-section page-section">
      <SectionIntro index="07" eyebrow="Identity assets" title="One geometry, every application." copy="Each asset is generated from the same golden-ratio division, chord network, and Fourier coefficients as the live mark." />
      <div className="asset-grid">
        {assets.map((asset) => (
          <a key={asset.file} className={`asset-card ${asset.className}`} href={`/brand/${asset.file}`} download>
            <span className="asset-preview"><img src={`/brand/${asset.file}`} alt={`${asset.label} for THOM`} /></span>
            <span className="asset-meta"><span>{asset.label}</span><span>SVG ↓</span></span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <ThomLogo variant="static" motion="none" ariaLabel="THOM" />
      <div>
        <p>Thomas Valadez</p>
        <a href="#top">Return to top ↑</a>
      </div>
      <p className="footer-domain">th-m.codes</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <MarkSection />
        <IntroSection />
        <ThinkingSection />
        <LibrarySection />
        <FocusSection />
        <WorkSection />
        <AssetsSection />
      </main>
      <Footer />
    </>
  );
}
