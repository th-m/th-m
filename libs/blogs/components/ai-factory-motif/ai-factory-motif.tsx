import "./ai-factory-motif.css";
import { useId } from "react";
import { aiFactoryIconLabel, type AiFactoryIconKind } from "./icon-catalog";
export type { AiFactoryIconKind } from "./icon-catalog";

const motifContent = {
  "experience-but-lacking": {
    index: "01",
    eyebrow: "Experience / missing bridges",
    title: "Personal meaning is not yet shared value",
    description:
      "Personal experience carries meaning. Text can lead to shared understanding, and value is situated in the relationship between self and others, but communication and value for others have not yet been established.",
    caption:
      "The experience is meaningful to me. Text can carry that meaning toward shared understanding; value is realized in relationships with others. The outward bridge is still lacking: the meaning has not been communicated, and its value has not been demonstrated. Unsubstantiated value is not the same as no value.",
  },
  "model-priorities-and-goal-fit": {
    index: "01b",
    eyebrow: "Model priorities / missing grounding",
    title: "Fluent output is not value insight",
    description:
      "A possible failure path: subjective, incomplete, and conflicting statements enter a model as token embeddings; training shapes learned priorities and the runtime harness steers generation, but the resulting fluent response may mislead or miss the user's unverified goal.",
    caption:
      "Subjective does not mean false. The risk is treating incomplete or conflicting statements as sufficient grounding. Input tokens are encoded as embeddings; the model generates the response. Training shapes learned behavior, while the harness supplies runtime instructions, tools, and constraints. These influences are not a guaranteed understanding of what matters to the user. Models can clarify or challenge a premise; this figure shows the failure path when missing evidence, context, and success criteria go unresolved. The statements are illustrative, not a measured count or failure rate.",
  },
  "vision-to-morpheme": {
    index: "01",
    eyebrow: "Expression",
    title: "Vision becomes an idea",
    description:
      "A vision gives rise to meaning, which takes shape as a context-sensitive idea with a still-diffuse boundary.",
    caption:
      "Vision exceeds what language can hold. Meaning gives part of it direction; an idea gives that meaning a shape without fixing every possible interpretation.",
  },
  "refinement-and-discipline-to-term-of-art": {
    index: "02",
    eyebrow: "Refinement + discipline",
    title: "Refinement and discipline establish a term of art",
    description:
      "Refinement defines and corrects a concrete idea; discipline sustains continuity, clarification, and specification until it becomes a term of art with a stable domain boundary.",
    caption:
      "Refinement supplies definition, evidence, and correction. Discipline supplies continuity, clarification, and specification. Together they give an idea a stable expression as a term of art.",
  },
  "understanding-in-embedding-space": {
    index: "02b",
    eyebrow: "Embedding space / inference value",
    title: "Short input, useful output—or just more tokens",
    description:
      "Conceptual comparison: a short label used as a grounded term of art can guide inference toward useful expanded text, while an ungrounded label can produce excess tokens without meeting the intended result.",
    caption:
      "A term of art packs shared domain distinctions into a short label. When those distinctions are learned or supplied in context, they can guide model representations and inference toward useful expanded output. Without shared understanding, fluent expansion may miss the goal. This is a conceptual contrast, not a measured gain: embeddings represent input; the model generates text. Token marks are illustrative, and value must be checked against the intended result.",
  },
  "central-queue-to-bounded-loops": {
    index: "03b",
    eyebrow: "Organizational topology / judgment",
    title: "The same teams, a different place for understanding",
    description:
      "Conceptual comparison: three AI-assisted teams first route discoveries and decisions through one central interpretation gate, then own bounded learning flywheels between understanding and implementation, connected by shared intent and explicit interfaces.",
    caption:
      "The teams are unchanged; the topology changes. The first arrangement distributes production but centralizes interpretation, so discoveries and decisions accumulate at one gate. The second gives each team a bounded flywheel from understanding into implementation and back through feedback, while shared intent and explicit interfaces preserve coordination. This is a conceptual operating model, not a measured throughput claim.",
  },
  "token-economics": {
    index: "04a",
    eyebrow: "Economics / useful yield",
    title: "Three measures, three graphs",
    description:
      "Three separate graphs show token input becoming token output, the elapsed time required to prepare model-ready input, and the verified value retained after evaluation.",
    caption:
      "Read the graphs independently. Token volume describes the model boundary. T_INPUT measures preparation time. V_OUTPUT measures the accepted contribution after evaluation. None of the three implies either of the others; this is a proposed diagnostic, not a measured equation.",
  },
  "ontology-of-terms": {
    index: "04",
    eyebrow: "Coordination",
    title: "Ontology coordinates terms of art to make them actionable",
    description:
      "An ontology repeats terms of art as concept labels and coordinates them through typed relationships and constraints.",
    caption:
      "The repeated shape is a term of art. More precisely, an ontology maps the concepts those expressions designate; typed relationships coordinate them into a shared model.",
  },
  "term-of-art-to-implementation": {
    index: "03",
    eyebrow: "Understanding",
    title: "Understanding carries a term into implementation",
    description:
      "A term of art enters a situated working model, where context, evidence, and stakes make its shared constraints actionable in a concrete implementation.",
    caption:
      "Knowing the term is not yet understanding. Understanding preserves its distinctions in a situated model, predicts what should follow, and makes a concrete implementation possible to test and revise.",
  },
  "trigger-opens-hypotheses": {
    index: "05",
    eyebrow: "Hypothesis / bounded uncertainty",
    title: "A trigger opens hypotheses, not a diagnosis",
    description:
      "One typed observation opens several candidate explanations. Inference preserves the alternatives while coherence and correspondence test them; consequence remains a later test after an authorized action.",
    caption:
      "One observation can support several explanations. Coherence asks whether each candidate fits the known system; correspondence asks whether it matches independent evidence. Consequence belongs after an authorized action, not at the initial trigger. The candidates and checks are illustrative, not a diagnosis or confidence score.",
  },
  "consequence-returns-to-context": {
    index: "06",
    eyebrow: "Feedback / retained learning",
    title: "The return edge turns an outcome into learning",
    description:
      "One path runs from context and evaluation through automation to an observed consequence. If the consequence changes nothing, the run ends as activity. If a governed revision returns to context or evaluation, it changes the next cycle and becomes learning.",
    caption:
      "Both cases complete the same forward path. The dotted edge stops at an observed outcome. The gold edge carries a specific, governed revision—such as a test, rule, threshold, or definition—back into the next cycle. Retention alone is not proof that the next result will improve.",
  },
  "path-declares-ownership": {
    index: "05a",
    eyebrow: "Repository ontology / identity",
    title: "A path maps and identifies an owned library",
    description:
      "A repository path composes a library boundary, architectural layer, domain vocabulary, and implementation details into one semantic identity, then points people and agents to the accountable change destination.",
    caption:
      "The path supplies the stable coordinates: library boundary, Edge layer, Audio domain, and a player-state responsibility. The leaf contract completes the map: Zustand is the technology, the player store is the tool, and Playback is the consuming feature. Together these coordinates identify the public owner and show where a change should begin.",
  },
  "layers-guide-implementation": {
    index: "05b",
    eyebrow: "Repository ontology / construction",
    title: "Layers make construction rules executable",
    description:
      "Three repository layers select both what should be built and how it should be verified or instrumented. Edge maps to product integration, integration tests, and PostHog and Sentry wrappers; Schema maps to typed database contracts and generated TypeScript interfaces; Engine maps to deterministic domain logic and unit tests. Skills and tool calls apply each contract automatically.",
    caption:
      "A layer is not only a position in the dependency stack. It selects a build contract: what belongs there, which proof is required, and which tooling is applied. Edge work receives product-facing integration, integration tests, and PostHog and Sentry wrappers. Schema work turns database structure into generated TypeScript interfaces. Engine work pairs deterministic domain logic with unit tests. Skills and tool calls apply these contracts automatically while ownership remains explicit.",
  },
  "contracts-govern-action": {
    index: "05c",
    eyebrow: "Repository ontology / operation",
    title: "Contracts compose context for bounded action",
    description:
      "For each task, the README, AGENTS file, and applicable skill remain distinct sources. Their relevant constraints are dynamically composed into context that fits the agent's available budget, governs action, and can be evaluated.",
    caption:
      "Context is assembled for the task, not copied as a static document bundle. Scope, operating rules, and procedure remain distinct; the relevant parts are selected to fit the agent's context budget. That context bounds action, keeps authority explicit, and preserves outcome evidence that can revise the map.",
  },
+} as const;

export type AiFactoryMotifVariant = keyof typeof motifContent;
export type AiFactoryMotifEmbeddingLane = "comparison" | "grounded" | "ungrounded";

const embeddingLaneContent = {
  grounded: {
    index: "02b",
    eyebrow: "Embedding space / grounded inference",
    title: "A grounded term can guide useful expansion",
    description:
      "A short label used as a grounded term of art guides inference toward expanded text that fits the intended result.",
    caption:
      "A term of art packs shared domain distinctions into a short label. When those distinctions are learned or supplied in context, they can guide model representations and inference toward useful expanded output. This is a conceptual path, not a measured gain: embeddings represent input; the model generates text, and value must be checked against the intended result.",
  },
  ungrounded: {
    index: "02b",
    eyebrow: "Embedding space / understanding bottleneck",
    title: "Fluent inference without understanding",
    description:
      "An ambiguous short label enters embedding space without grounding or shared criteria, producing fluent excess output that may not fit the goal.",
    caption:
      "Without shared understanding, a short label can still prompt fluent expansion while leaving meaning and success criteria unresolved. This is a conceptual failure path, not a measured outcome: embeddings represent input; the model generates text. Token marks are illustrative, and value must be checked against the intended result.",
  },
} as const;

const motifViewBoxes: Record<AiFactoryMotifVariant, string> = {
  "experience-but-lacking": "0 0 800 432",
  "model-priorities-and-goal-fit": "0 0 960 616",
  "vision-to-morpheme": "0 0 720 320",
  "refinement-and-discipline-to-term-of-art": "0 0 720 320",
  "understanding-in-embedding-space": "0 0 960 648",
  "central-queue-to-bounded-loops": "0 0 960 664",
  "term-of-art-to-implementation": "0 0 720 320",
  "token-economics": "0 0 960 520",
  "ontology-of-terms": "0 0 720 432",
  "trigger-opens-hypotheses": "0 0 960 520",
  "consequence-returns-to-context": "0 0 960 420",
  "path-declares-ownership": "0 0 960 488",
  "layers-guide-implementation": "0 0 960 488",
  "contracts-govern-action": "0 0 960 488",
};

function IconMorpheme({ refined = false, x = 80, y = 80, scale = 1, showCenter = true }: { refined?: boolean; x?: number; y?: number; scale?: number; showCenter?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><circle className={refined ? "ai-factory-icon__morpheme ai-factory-icon__morpheme--refined" : "ai-factory-icon__morpheme"} cx="0" cy="0" r="32" />{showCenter ? <path className="ai-factory-icon__morpheme-center-line ai-factory-icon__text-line" d="M-8 0H8" /> : null}</g>;
}

function VisionGlyph() {
  return <><circle className="ai-factory-icon__vision-center" cx="80" cy="80" r="12" /><path className="ai-factory-icon__vision-edge" d="M80 36V56M80 104V124M36 80H56M104 80H124" /></>;
}

function SelfGlyph() {
  return <circle className="ai-factory-icon__self-dot" cx="80" cy="80" r="8" />;
}

function ValueGlyph() {
  return <>
    <SelfGlyph />
    <path className="ai-factory-icon__value-edge" d="M80 24V52" />
    <path className="ai-factory-icon__value-edge" d="M108 80H136" />
    <path className="ai-factory-icon__value-edge" d="M80 108V136" />
    <path className="ai-factory-icon__value-edge" d="M24 80H52" />
    <path className="ai-factory-icon__value-edge" d="M40 40L60 60" />
    <path className="ai-factory-icon__value-edge" d="M100 60L120 40" />
    <path className="ai-factory-icon__value-edge" d="M100 100L120 120" />
    <path className="ai-factory-icon__value-edge" d="M40 120L60 100" />
  </>;
}

/**
 * The isolated primitives used by the AI Factory motif. These stay deliberately
 * small and composable: a page, figure, graph, or workflow can reuse the same
 * semantic marks without importing one of the composed chapter diagrams.
 */
function TruthPracticeGlyph({ kind }: { kind: "truth" | "coherence" | "correspondence" | "consequence" }) {
  // A 96-unit side keeps the truth family equilateral and identically sized.
  const height = 96 * Math.sqrt(3) / 2;
  const left = 80 - height / 2;
  const right = 80 + height / 2;
  const center = left + height / 3;
  const rotation = kind === "truth" || kind === "coherence" ? -90 : kind === "correspondence" ? 90 : 0;

  return (
    <g transform={`rotate(${rotation} 80 80)`}>
      <path className={`ai-factory-icon__truth-triangle${kind === "truth" ? " ai-factory-icon__truth-triangle--dotted" : ""}`} d={`M${left} 32L${right} 80L${left} 128Z`} />
      {kind === "coherence" ? <>
        <path className="ai-factory-icon__coherence-spokes" d={`M${center} 80L${left} 32M${center} 80H${right}M${center} 80L${left} 128`} />
        <circle className="ai-factory-icon__coherence-center" cx={center} cy="80" r="6" />
      </> : kind === "correspondence" ? <>
        <circle className="ai-factory-icon__truth-vertex" cx={left} cy="32" r="7" />
        <circle className="ai-factory-icon__truth-vertex" cx={left} cy="128" r="7" />
        <circle className="ai-factory-icon__truth-vertex" cx={right} cy="80" r="7" />
      </> : kind === "consequence" ? <>
        <path className="ai-factory-icon__consequence-path" d={`M${left} 80H${right}`} />
        <circle className="ai-factory-icon__consequence-outcome" cx={right} cy="80" r="7" />
      </> : null}
    </g>
  );
}

function UnderstandingGlyph({ showEdges = true }: { showEdges?: boolean }) {
  return <>
    {showEdges ? <>
      <path className="ai-factory-icon__understanding-edge ai-factory-icon__understanding-edge--cardinal" d="M80 28V48M80 112V132M28 80H48M112 80H132" />
      <path className="ai-factory-icon__understanding-edge ai-factory-icon__understanding-edge--diagonal" d="M43 43L58 58M102 102L117 117M117 43L102 58M58 102L43 117" />
    </> : null}
    <circle className="ai-factory-icon__understanding-boundary" cx="80" cy="80" r="32" />
    <circle className="ai-factory-icon__understanding-core" cx="80" cy="80" r="5" />
  </>;
}

function SlopGlyph({ kind }: { kind: "slop-fault" | "slop-drift" | "slop-decay" }) {
  if (kind === "slop-drift") {
    return <>
      <path className="ai-factory-icon__slop-line" d="M32 72H80" />
      <path className="ai-factory-icon__slop-fault" d="M80 88H128" />
    </>;
  }

  if (kind === "slop-decay") {
    return <>
      <path className="ai-factory-icon__slop-line" d="M32 80H76" />
      <path className="ai-factory-icon__slop-fault" d="M84 80H104M112 80H124M132 80H136" />
    </>;
  }

  return <>
    <path className="ai-factory-icon__slop-line" d="M32 80H68M92 80H128" />
    <path className="ai-factory-icon__slop-fault" d="M68 80L76 68L84 92L92 80" />
  </>;
}

function AiFactoryIconGlyph({ kind }: { kind: AiFactoryIconKind }) {
  const instanceId = useId();
  const markerId = `ai-factory-icon-arrow-${instanceId.replace(/:/g, "")}`;
  const outlineArrow = kind === "implementation" || kind === "automation";
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX={outlineArrow ? 0 : 7} refY="4" orient="auto" markerUnits={outlineArrow ? "userSpaceOnUse" : "strokeWidth"} overflow="visible">
          <path className={outlineArrow ? "ai-factory-icon__arrowhead--outline" : undefined} d="M0 0L8 4L0 8Z" />
        </marker>
      </defs>
      {kind === "vision" ? <VisionGlyph /> : null}
      {kind === "value" ? <ValueGlyph /> : null}
      {kind === "self" ? <SelfGlyph /> : null}
      {kind === "trigger" ? <path className="ai-factory-icon__trigger-active" d="M60 64L76 80L60 96M84 64L100 80L84 96" /> : null}
      {kind === "contact" ? <>
        <path className="ai-factory-icon__trigger-line" d="M32 80H74M86 60V100" />
        <path className="ai-factory-icon__trigger-active" d="M86 80H128" />
        <circle className="ai-factory-icon__self-dot" cx="80" cy="80" r="6" />
      </> : null}
      {kind === "threshold" ? <>
        <path className="ai-factory-icon__trigger-boundary" d="M80 44V116" />
        <path className="ai-factory-icon__trigger-line" d="M32 96H80" />
        <path className="ai-factory-icon__trigger-active" d="M80 96V64H128" />
      </> : null}
      {kind === "others" ? <>
        <circle className="ai-factory-icon__others-dot" cx="64" cy="80" r="8" />
        <circle className="ai-factory-icon__others-dot" cx="88" cy="66" r="8" />
        <circle className="ai-factory-icon__others-dot" cx="88" cy="94" r="8" />
      </> : null}
      {kind === "agents" ? [[64, 80], [88, 66], [88, 94]].map(([x, y]) => (
        <polygon
          key={`${x}-${y}`}
          className="ai-factory-icon__agent"
          transform={`translate(${x} ${y})`}
          points="0,-9 8.56,-2.78 5.29,7.28 -5.29,7.28 -8.56,-2.78"
        />
      )) : null}
      {kind === "knowledge-factory" ? <>
        <path className="ai-factory-icon__knowledge-factory-edge" d="M29 48H44M29 80H44M29 112H44M116 64H131M116 96H131M44 48L68 74M44 80H68M44 112L68 86M92 80L116 64M92 80L116 96" />
        <rect className="ai-factory-icon__knowledge-factory-boundary" x="44" y="32" width="72" height="96" />
        <circle className="ai-factory-icon__knowledge-factory-input" cx="24" cy="48" r="5" />
        <circle className="ai-factory-icon__knowledge-factory-input" cx="24" cy="80" r="5" />
        <circle className="ai-factory-icon__knowledge-factory-input" cx="24" cy="112" r="5" />
        <path className="ai-factory-icon__knowledge-factory-decision" d="M80 68L92 80L80 92L68 80Z" />
        <circle className="ai-factory-icon__knowledge-factory-output" cx="136" cy="64" r="5" />
        <circle className="ai-factory-icon__knowledge-factory-output" cx="136" cy="96" r="5" />
      </> : null}
      {kind === "factory-worker" ? <>
        <path className="ai-factory-icon__factory-worker-rail" d="M24 80H36M52 80H64M104 80H136" />
        <circle className="ai-factory-icon__factory-worker-participant" cx="44" cy="80" r="8" />
        <rect className="ai-factory-icon__factory-worker-station" x="64" y="56" width="40" height="48" />
        <path className="ai-factory-icon__factory-worker-step" d="M76 80H92" />
      </> : null}
      {kind === "factory-engineer" ? <>
        <path className="ai-factory-icon__factory-engineer-rail" d="M40 88H120" />
        <path className="ai-factory-icon__factory-engineer-loop" d="M32 68V116H128V68" />
        <path className="ai-factory-icon__factory-engineer-link" d="M80 48V68" />
        <circle className="ai-factory-icon__factory-engineer-participant" cx="80" cy="40" r="8" />
        <rect className="ai-factory-icon__factory-engineer-station" x="32" y="80" width="16" height="16" />
        <rect className="ai-factory-icon__factory-engineer-station ai-factory-icon__factory-engineer-station--focal" x="72" y="80" width="16" height="16" />
        <rect className="ai-factory-icon__factory-engineer-station" x="112" y="80" width="16" height="16" />
      </> : null}
      {kind === "shared-capital" ? <>
        <rect className="ai-factory-icon__shared-capital-layer ai-factory-icon__shared-capital-layer--top" x="48" y="40" width="64" height="24" />
        <rect className="ai-factory-icon__shared-capital-layer" x="40" y="68" width="72" height="24" />
        <rect className="ai-factory-icon__shared-capital-layer" x="32" y="96" width="80" height="24" />
        <path className="ai-factory-icon__shared-capital-return" d="M120 108H136V52H120" markerEnd={`url(#${markerId})`} />
      </> : null}
      {kind === "solutioning" ? <>
        <path className="ai-factory-icon__solutioning-loop" d="M52 44H112V112H44V56" markerEnd={`url(#${markerId})`} />
        <circle className="ai-factory-icon__solutioning-stage" cx="52" cy="44" r="6" />
        <circle className="ai-factory-icon__solutioning-stage" cx="112" cy="44" r="6" />
        <circle className="ai-factory-icon__solutioning-stage" cx="112" cy="112" r="6" />
        <circle className="ai-factory-icon__solutioning-stage" cx="44" cy="112" r="6" />
        <path className="ai-factory-icon__solutioning-intervention" d="M78 68L92 82L78 96L64 82Z" />
      </> : null}
      {kind === "graph-context" ? <>
        <path className="ai-factory-icon__graph-context-edge" d="M38 48L80 80L122 44M38 48L36 116M80 80L124 116M122 44L124 116" />
        <path className="ai-factory-icon__graph-context-provenance" d="M36 116L80 80L122 44" />
        <circle className="ai-factory-icon__graph-context-node" cx="38" cy="48" r="7" />
        <circle className="ai-factory-icon__graph-context-node ai-factory-icon__graph-context-node--reference" cx="122" cy="44" r="7" />
        <rect className="ai-factory-icon__graph-context-node ai-factory-icon__graph-context-node--center" x="72" y="72" width="16" height="16" />
        <rect className="ai-factory-icon__graph-context-node ai-factory-icon__graph-context-node--source" x="29" y="109" width="14" height="14" />
        <circle className="ai-factory-icon__graph-context-node" cx="124" cy="116" r="7" />
      </> : null}
      {kind === "goal" ? <><IconMorpheme showCenter={false} /><VisionGlyph /></> : null}
      {kind === "meaning" ? <><circle className="ai-factory-icon__meaning-core" cx="80" cy="80" r="5" /><circle className="ai-factory-icon__meaning-boundary" cx="80" cy="80" r="32" /><path className="ai-factory-icon__meaning-edge ai-factory-icon__meaning-edge--diagonal" d="M43 43L58 58M102 102L117 117M117 43L102 58M58 102L43 117" /></> : null}
      {kind === "inference" ? <>
        <path className="ai-factory-icon__inference-path" d="M36 80H72M72 44V116M72 44H128M72 80H128M72 116H128" />
        <circle className="ai-factory-icon__inference-junction" cx="28" cy="80" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="44" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="80" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="116" r="8" />
      </> : null}
      {kind === "truth" || kind === "coherence" || kind === "correspondence" || kind === "consequence" ? <TruthPracticeGlyph kind={kind} /> : null}
      {kind === "morpheme-diffuse" ? <IconMorpheme /> : null}
      {kind === "morpheme-refined" ? <IconMorpheme refined /> : null}
      {kind === "text" || kind === "label" ? <>
        <path className="ai-factory-icon__text-line" d="M24 52H60M68 52H104M112 52H136M24 80H48M56 80H104M112 80H136M24 108H72M80 108H116M124 108H136" />
        {kind === "label" ? <rect className="ai-factory-icon__text-highlight" x="56" y="72" width="48" height="16" /> : null}
      </> : null}
      {kind === "token" ? (
        <g className="ai-factory-icon__token-sequence">
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--one" x="24" y="64" width="24" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--two" x="48" y="64" width="32" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--three" x="80" y="64" width="20" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--four" x="100" y="64" width="28" height="32" />
        </g>
      ) : null}
      {kind === "embedding" ? (
        <g className="ai-factory-icon__embedding-matrix">
          {[
            ["one", "two", "three", "four"],
            ["four", "one", "two", "three"],
            ["two", "three", "four", "one"],
            ["three", "four", "one", "two"],
          ].flatMap((row, rowIndex) => row.map((shade, columnIndex) => (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              className={`ai-factory-icon__embedding-cell ai-factory-icon__token-segment ai-factory-icon__token-segment--${shade}`}
              x={33 + columnIndex * 24}
              y={33 + rowIndex * 24}
              width="22"
              height="22"
            />
          )))}
        </g>
      ) : null}
      {kind === "slop-fault" || kind === "slop-drift" || kind === "slop-decay" ? <SlopGlyph kind={kind} /> : null}
      {kind === "term-of-art" ? <>
        <path className="ai-factory-icon__term-edge" d="M80 28V48M80 112V132M28 80H48M112 80H132" />
        <IconMorpheme refined />
      </> : null}
      {kind === "understanding" ? <UnderstandingGlyph /> : null}
      {kind === "bottleneck" ? <>
        <path className="ai-factory-icon__bottleneck-flow" d="M36 44H92M36 80H128M36 116H92" />
        <path className="ai-factory-icon__bottleneck-boundary" d="M92 32V56M92 104V128" />
        <path className="ai-factory-icon__bottleneck-throat" d="M92 68V92M100 68V92" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="44" r="8" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="80" r="8" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="116" r="8" />
        <circle className="ai-factory-icon__bottleneck-output" cx="136" cy="80" r="8" />
      </> : null}
      {kind === "implementation" ? <>
        <circle className="ai-factory-icon__implementation-boundary" cx="64" cy="80" r="12" />
        <circle className="ai-factory-icon__implementation-core" cx="64" cy="80" r="4" />
        <path className="ai-factory-icon__action-vector" d="M76 80H124" markerEnd={`url(#${markerId})`} />
      </> : null}
      {kind === "automation" ? <>
        <UnderstandingGlyph showEdges={false} />
        <path className="ai-factory-icon__automation-action" d="M112 80H132" />
        <circle className="ai-factory-icon__automation-node" cx="144" cy="80" r="12" />
        <circle className="ai-factory-icon__automation-node-core" cx="144" cy="80" r="2" />
        <path className="ai-factory-icon__action-vector" d="M156 80H180" markerEnd={`url(#${markerId})`} />
      </> : null}
      {kind === "ontology-node" ? <>
        <path className="ai-factory-icon__ontology-edge" d="M28 80H48M80 112V132" />
        <path className="ai-factory-icon__ontology-edge ai-factory-icon__ontology-edge--connected" d="M80 28V48M112 80H132" />
        <circle className="ai-factory-icon__ontology-root" cx="80" cy="80" r="32" />
        <path className="ai-factory-icon__ontology-root-core ai-factory-icon__text-line" d="M72 80H88" />
        <circle className="ai-factory-icon__ontology-term" cx="80" cy="16" r="12" />
        <circle className="ai-factory-icon__ontology-term" cx="144" cy="80" r="12" />
        <path className="ai-factory-icon__ontology-term-core ai-factory-icon__text-line" d="M77 16H83" />
        <path className="ai-factory-icon__ontology-term-core ai-factory-icon__text-line" d="M141 80H147" />
      </> : null}
      {kind === "typed-relation" ? <>
        <path className="ai-factory-icon__relation-line" d="M24 80H136" markerEnd={`url(#${markerId})`} />
        <ConnectorLabel x={80} y={80} onEdge />
      </> : null}
      {kind === "disconnected" ? <>
        <path className="ai-factory-icon__disconnected-ends" d="M32 80H56M56 68V92M104 68V92M104 80H128" />
        <path className="ai-factory-icon__disconnected-mark" d="M72 72L88 88M88 72L72 88" />
      </> : null}
      {kind === "operator" ? <><circle className="ai-factory-icon__operator" cx="80" cy="80" r="22" /><path className="ai-factory-icon__operator-mark" d="M68 80H92M80 68V92" /></> : null}
    </>
  );
}

export function AiFactoryIcon({ kind, label = aiFactoryIconLabel(kind) }: { kind: AiFactoryIconKind; label?: string }) {
  return (
    <svg className={`ai-factory-icon ai-factory-icon--${kind}`} viewBox="0 0 160 160" role="img" aria-label={label}>
      <AiFactoryIconGlyph kind={kind} />
    </svg>
  );
}

function MotifGlyph({ kind, x, y, scale = 1, centerX = 80 }: { kind: AiFactoryIconKind; x: number; y: number; scale?: number; centerX?: number }) {
  return (
    <g className={`ai-factory-motif__primitive ai-factory-icon ai-factory-icon--${kind}`} transform={`translate(${x} ${y}) scale(${scale}) translate(-${centerX} -80)`} aria-hidden="true">
      <AiFactoryIconGlyph kind={kind} />
    </g>
  );
}

// Full automation span: the large circle begins at 48 and the arrow tip ends at 188.
const automationVisualCenterX = (48 + 188) / 2;

export const aiFactorySeriesSlugs = [
  "vision-and-values",
  "truth-and-inference",
  "understanding-and-bottlenecks",
  "the-knowledge-factory",
  "the-ontology-factory",
  "the-cognitive-factory",
] as const;

export type AiFactorySeriesSlug = (typeof aiFactorySeriesSlugs)[number];

interface AiFactorySeriesArticle {
  slug: AiFactorySeriesSlug;
  index: string;
  stage: string;
  title: string;
  href: string;
  sourceIcon: AiFactoryIconKind;
  targetIcon: AiFactoryIconKind;
  sourceLabel: string;
  targetLabel: string;
  relationship: string;
  flywheel?: boolean;
  summary: string;
}

const seriesMapArticles: AiFactorySeriesArticle[] = [
  {
    slug: "vision-and-values",
    index: "01",
    stage: "Direction",
    title: "Vision and Values",
    href: "/writing/vision-and-values",
    sourceIcon: "vision",
    targetIcon: "value",
    sourceLabel: "Vision",
    targetLabel: "Values",
    relationship: "GOVERNS",
    summary: "Human experience and values choose the goals, authority, and corrections that guide AI.",
  },
  {
    slug: "truth-and-inference",
    index: "02",
    stage: "Prediction",
    title: "Truth and Coherence",
    href: "/writing/truth-and-inference",
    sourceIcon: "truth",
    targetIcon: "inference",
    sourceLabel: "Truth",
    targetLabel: "Inference",
    relationship: "CONSTRAINS",
    summary: "Language patterns become conditional predictions whose value depends on truth-bearing constraint.",
  },
  {
    slug: "understanding-and-bottlenecks",
    index: "03",
    stage: "Understanding",
    title: "Understanding and Bottlenecks",
    href: "/writing/understanding-and-bottlenecks",
    sourceIcon: "understanding",
    targetIcon: "bottleneck",
    sourceLabel: "Understanding",
    targetLabel: "Bottlenecks",
    relationship: "REVEALS",
    summary: "Bounded teams distribute complete learning loops while shared intent and explicit interfaces preserve coordination.",
  },
  {
    slug: "the-knowledge-factory",
    index: "04",
    stage: "Production",
    title: "The Knowledge Factory",
    href: "/writing/the-knowledge-factory",
    sourceIcon: "ontology-node",
    targetIcon: "automation",
    sourceLabel: "Ontology",
    targetLabel: "Automation",
    relationship: "SYSTEMATIZES",
    flywheel: true,
    summary: "Ontology and automation can form a flywheel, so long as they remain grounded in understanding.",
  },
  {
    slug: "the-ontology-factory",
    index: "05",
    stage: "Coherence",
    title: "Ontology Factory",
    href: "/writing/the-ontology-factory",
    sourceIcon: "understanding",
    targetIcon: "ontology-node",
    sourceLabel: "Understanding",
    targetLabel: "Ontology",
    relationship: "FORMALIZES",
    summary: "Ownership, concepts, constraints, and typed relationships make the factory navigable and checkable.",
  },
  {
    slug: "the-cognitive-factory",
    index: "06",
    stage: "Cognition",
    title: "Cognitive Factory",
    href: "/writing/the-cognitive-factory",
    sourceIcon: "automation",
    targetIcon: "understanding",
    sourceLabel: "Automation",
    targetLabel: "Understanding",
    relationship: "FEEDS",
    summary: "Typed observations, bounded decisions, and evaluated consequences turn activity into retained learning.",
  },
];

function KnowledgeFlywheel({ compact = false, accessible = true }: { compact?: boolean; accessible?: boolean }) {
  const id = useId();

  return (
    <svg
      className="ai-factory-series-map__flywheel"
      viewBox={compact ? "0 28 320 136" : "0 0 320 192"}
      role={accessible ? "img" : undefined}
      aria-hidden={accessible ? undefined : true}
      aria-labelledby={accessible ? `${id}-title` : undefined}
      aria-describedby={accessible ? `${id}-description` : undefined}
    >
      {accessible ? <>
        <title id={`${id}-title`}>Ontology and automation flywheel</title>
        <desc id={`${id}-description`}>Ontology systematizes automation. Learning from automation informs ontology. They can form a reinforcing flywheel so long as they remain grounded in understanding.</desc>
      </> : null}
        <defs>
          <marker id={`${id}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0L6 3L0 6" />
          </marker>
        </defs>
        <g className="ai-factory-series-map__flywheel-paths" markerEnd={`url(#${id}-arrow)`}>
          <path d="M108 72A64 64 0 0 1 212 72" />
          <path d="M212 108A64 64 0 0 1 108 108" />
        </g>
        <g className="ai-factory-series-map__flywheel-concept">
          <MotifGlyph kind="ontology-node" x={64} y={92} scale={0.6} />
          <text x="64" y="144">Ontology</text>
        </g>
        <g className="ai-factory-series-map__flywheel-concept">
          <MotifGlyph kind="automation" x={244} y={92} scale={0.6} />
          <text x="244" y="144">Automation</text>
        </g>
    </svg>
  );
}

function SeriesMapGraphic({
  article,
  compact = false,
  accessible = false,
  className,
}: {
  article: AiFactorySeriesArticle;
  compact?: boolean;
  accessible?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "ai-factory-series-map__equation",
        article.flywheel ? "ai-factory-series-map__equation--flywheel" : "",
        compact ? "ai-factory-series-map__equation--compact" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
      aria-hidden={accessible ? undefined : true}
    >
      {article.flywheel ? (
        <KnowledgeFlywheel compact={compact} accessible={accessible} />
      ) : (
        <svg
          className="ai-factory-series-map__pair"
          viewBox={compact ? "0 28 320 136" : "0 0 320 192"}
        >
          <g className="ai-factory-series-map__concept">
            <MotifGlyph kind={article.sourceIcon} x={64} y={92} scale={0.6} centerX={article.sourceIcon === "automation" ? automationVisualCenterX : 80} />
            <text x="64" y="144">{article.sourceLabel}</text>
          </g>
          <text className="ai-factory-series-map__relationship" x="154" y="96">{article.relationship}</text>
          <g className="ai-factory-series-map__concept">
            <MotifGlyph kind={article.targetIcon} x={244} y={92} scale={0.6} />
            <text x="244" y="144">{article.targetLabel}</text>
          </g>
        </svg>
      )}
    </div>
  );
}

export function AiFactorySeriesGraphic({
  slug,
  compact = false,
  className,
}: {
  slug: AiFactorySeriesSlug;
  compact?: boolean;
  className?: string;
}) {
  const article = seriesMapArticles.find((candidate) => candidate.slug === slug);
  if (!article) return null;
  return <SeriesMapGraphic article={article} compact={compact} className={className} />;
}

export function AiFactorySeriesMap() {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <figure className="ai-factory-series-map" aria-labelledby={`${titleId} ${descriptionId}`}>
      <header className="ai-factory-series-map__header">
        <p>AI Factory · Series map</p>
        <div>
          <h2 id={titleId}>Six essays describe one operating system.</h2>
          <p id={descriptionId}>
            The series moves from human direction, through prediction and understanding, into the factories that
            produce, coordinate, and learn.
          </p>
        </div>
      </header>
      <p className="ai-factory-series-map__scroll-cue">Scroll the series →</p>
      <div className="ai-factory-series-map__viewport" role="region" tabIndex={0} aria-label="Scrollable AI Factory article map">
        <ol className="ai-factory-series-map__track">
          {seriesMapArticles.map((article, articleIndex) => (
            <li className="ai-factory-series-map__item" key={article.href}>
              <a href={article.href}>
                <div className="ai-factory-series-map__meta">
                  <span>{article.index}</span>
                  <span>{article.stage}</span>
                </div>
                <SeriesMapGraphic article={article} accessible={article.flywheel} />
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </a>
              {articleIndex % 3 !== 2 ? (
                <span className="ai-factory-series-map__connector" aria-hidden="true">→</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        Direction → prediction → understanding → production → coherence → cognition. Each factory preserves the
        human-governed intent established at the beginning of the series.
      </figcaption>
    </figure>
  );
}

function ConnectorLabel({ x, y, children = "", onEdge = false }: { x: number; y: number; children?: string; onEdge?: boolean }) {
  // 8-unit IBM Plex Mono + tracking, 6-unit side padding, snapped to a 4-unit grid.
  // Keep in sync with --ai-factory-type-edge and --ai-factory-tracking-label.
  const width = Math.max(40, Math.ceil((children.length * 5.6 + 12) / 4) * 4);
  const height = 16;

  return (
    <g className={`ai-factory-motif__connector-label${onEdge ? " ai-factory-motif__connector-label--on-edge" : ""}`} aria-hidden="true">
      <rect x={x - width / 2} y={y - (onEdge ? height / 2 : 12)} width={width} height={height} />
      {children ? <text x={x} y={y} textAnchor="middle" dominantBaseline={onEdge ? "middle" : undefined}>
        {children}
      </text> : null}
    </g>
  );
}

function StationFrame({ x, focal = false }: { x: number; focal?: boolean }) {
  return <rect className={focal ? "ai-factory-motif__station ai-factory-motif__station--focal" : "ai-factory-motif__station"} x={x} y="56" width="184" height="184" />;
}

function StationLabel({ x, label, detail }: { x: number; label: string; detail: string }) {
  return (
    <g>
      <text className="ai-factory-motif__label" x={x} y="208" textAnchor="middle">
        {label}
      </text>
      <text className="ai-factory-motif__detail" x={x} y="224" textAnchor="middle">
        {detail}
      </text>
    </g>
  );
}

function ExperienceButLacking({ arrowId }: { arrowId: string }) {
  return (
    <>
      <rect className="ai-factory-motif__station" x="40" y="56" width="300" height="296" />
      <text className="ai-factory-motif__experience-eyebrow" x="64" y="84">PERSONAL EXPERIENCE</text>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path className="ai-factory-motif__connector--focal" d="M156 184H216" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__experience-gap" data-gap="communication" d="M388 124H496" />
        <path className="ai-factory-motif__experience-gap" data-gap="value" d="M388 284H496" />
      </g>
      <MotifGlyph kind="disconnected" x={364} y={124} scale={0.5} />
      <MotifGlyph kind="disconnected" x={364} y={284} scale={0.5} />
      <MotifGlyph kind="vision" x={116} y={184} scale={0.75} />
      <MotifGlyph kind="meaning" x={260} y={184} scale={0.75} />
      <text className="ai-factory-motif__label" x="116" y="252" textAnchor="middle">Experience</text>
      <text className="ai-factory-motif__label" x="260" y="252" textAnchor="middle">Meaning</text>
      <g className="ai-factory-motif__experience-outcome" data-outcome="communication">
        <rect x="496" y="56" width="264" height="136" />
        <text className="ai-factory-motif__label" x="628" y="80" textAnchor="middle">Shared understanding</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path data-relationship="text-to-understanding" d="M556 112H652" markerEnd={`url(#${arrowId})`} />
          <ConnectorLabel x={600} y={112} onEdge>LEADS TO</ConnectorLabel>
        </g>
        <MotifGlyph kind="text" x={532} y={112} scale={0.32} />
        <MotifGlyph kind="understanding" x={684} y={112} scale={0.4} />
        <text className="ai-factory-motif__detail" x="628" y="176" textAnchor="middle">not yet communicated</text>
      </g>
      <g className="ai-factory-motif__experience-outcome" data-outcome="value">
        <rect x="496" y="216" width="264" height="136" />
        <text className="ai-factory-motif__label" x="628" y="240" textAnchor="middle">Value lies within relationships</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path className="ai-factory-motif__connector--focal" data-relationship="value-between-people" d="M550 284H602M654 284H694" />
        </g>
        <MotifGlyph kind="self" x={544} y={284} scale={0.75} />
        <MotifGlyph kind="value" x={628} y={284} scale={0.4} />
        <MotifGlyph kind="others" x={712} y={284} scale={0.75} />
        <text className="ai-factory-motif__label" x="544" y="320" textAnchor="middle">Self</text>
        <text className="ai-factory-motif__label" x="712" y="320" textAnchor="middle">Others</text>
        <text className="ai-factory-motif__detail" x="628" y="340" textAnchor="middle">not yet substantiated</text>
      </g>
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 384H760" />
        <text x="40" y="408">MEANING FOR ME</text>
        <text x="760" y="408" textAnchor="end">MISSING BRIDGES TO OTHERS</text>
      </g>
    </>
  );
}

function ModelPrioritiesAndGoalFit({ arrowId }: { arrowId: string }) {
  const statements = [
    { label: "Subjective claim", example: "“It feels right to me.”", y: 212 },
    { label: "Incomplete context", example: "“Make it better.”", y: 276 },
    { label: "Conflicting requests", example: "“Be brief. Include everything.”", y: 340 },
  ];

  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path data-influence="training" d="M400 136V200" markerEnd={`url(#${arrowId})`} />
        <path data-influence="harness" d="M592 136V200" markerEnd={`url(#${arrowId})`} />
        {statements.map(({ y, label }) => <path key={label} data-relationship="statement-to-model" d={`M232 ${y + 24}H312`} markerEnd={`url(#${arrowId})`} />)}
        <path data-relationship="model-to-response" d="M672 300H744" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__experience-gap" data-relationship="unverified-goal-fit" d="M836 408V416M836 448V468" />
        <ConnectorLabel x={400} y={168} onEdge>SHAPES</ConnectorLabel>
        <ConnectorLabel x={592} y={168} onEdge>STEERS</ConnectorLabel>
      </g>

      <g data-influence-source="training">
        <rect className="ai-factory-motif__station" x="320" y="40" width="160" height="96" />
        <text className="ai-factory-motif__label" x="400" y="68" textAnchor="middle">Training priorities</text>
        <text className="ai-factory-motif__detail" x="400" y="92" textAnchor="middle">data · rewards · feedback</text>
        <text className="ai-factory-motif__detail" x="400" y="116" textAnchor="middle">learned behavior</text>
      </g>
      <g data-influence-source="harness">
        <rect className="ai-factory-motif__station" x="512" y="40" width="160" height="96" />
        <text className="ai-factory-motif__label" x="592" y="68" textAnchor="middle">Runtime harness</text>
        <text className="ai-factory-motif__detail" x="592" y="92" textAnchor="middle">instructions · tools · policy</text>
        <text className="ai-factory-motif__detail" x="592" y="116" textAnchor="middle">configured behavior</text>
      </g>

      <text className="ai-factory-motif__embedding-eyebrow" x="40" y="188">MANY STATEMENTS · NO SHARED CRITERIA</text>
      {statements.map(({ label, example, y }) => (
        <g key={label} data-input-statement={label}>
          <rect className="ai-factory-motif__station" x="40" y={y} width="192" height="52" />
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="56" y={y + 20}>{label}</text>
          <text className="ai-factory-motif__detail" x="56" y={y + 40}>{example}</text>
        </g>
      ))}

      <g data-stage="conditioned-model">
        <rect className="ai-factory-motif__station" x="320" y="208" width="352" height="200" />
        <text className="ai-factory-motif__embedding-eyebrow" x="340" y="236">REPRESENTATION → GENERATION</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path data-relationship="embedding-to-inference" d="M448 300H532" markerEnd={`url(#${arrowId})`} />
        </g>
        <MotifGlyph kind="embedding" x={404} y={300} scale={0.64} />
        <MotifGlyph kind="inference" x={584} y={300} scale={0.6} />
        <text className="ai-factory-motif__label" x="404" y="356" textAnchor="middle">Embedding space</text>
        <text className="ai-factory-motif__label" x="584" y="356" textAnchor="middle">Inference</text>
        <text className="ai-factory-motif__detail" x="404" y="380" textAnchor="middle">encodes supplied tokens</text>
        <text className="ai-factory-motif__detail" x="584" y="380" textAnchor="middle">generates a continuation</text>
      </g>

      <g data-stage="unverified-response">
        <rect className="ai-factory-motif__station" x="752" y="208" width="168" height="200" />
        <text className="ai-factory-motif__label" x="836" y="236" textAnchor="middle">Fluent response</text>
        <MotifGlyph kind="text" x={836} y={296} scale={0.76} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="836" y="356" textAnchor="middle">May mislead</text>
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="836" y="380" textAnchor="middle">or miss the goal</text>
      </g>
      <g transform="rotate(90 836 432)">
        <MotifGlyph kind="disconnected" x={836} y={432} scale={0.32} />
      </g>
      <g data-stage="user-goal">
        <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="752" y="468" width="168" height="80" />
        <MotifGlyph kind="goal" x={780} y={504} scale={0.32} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="808" y="500">Your actual goal</text>
        <text className="ai-factory-motif__detail" x="808" y="524">fit not established</text>
      </g>
      <text className="ai-factory-motif__label" x="40" y="480">Behavioral priorities ≠ insight into your values</text>
      <text className="ai-factory-motif__priorities-note" x="40" y="508">Without evidence, context, and success criteria,</text>
      <text className="ai-factory-motif__priorities-note" x="40" y="528">more statements can leave the same ambiguity unresolved.</text>
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 580H920" />
        <text x="40" y="604">POSSIBLE FAILURE PATH · NOT AN INEVITABLE OUTCOME</text>
        <text x="920" y="604" textAnchor="end">FLUENCY ≠ GOAL FIT</text>
      </g>
    </>
  );
}

function VisionToMorpheme({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M224 136H264" markerEnd={`url(#${arrowId})`} />
        <path d="M456 136H488" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={244} y={116}>BECOMES</ConnectorLabel>
        <ConnectorLabel x={472} y={116}>EXPRESSED AS</ConnectorLabel>
      </g>
      <StationFrame x={40} />
      <StationFrame x={272} />
      <StationFrame x={496} focal />
      <MotifGlyph kind="vision" x={132} y={136} />
      <MotifGlyph kind="meaning" x={364} y={136} />
      <MotifGlyph kind="morpheme-diffuse" x={588} y={136} />
      <StationLabel x={132} label="Vision" detail="felt possibility" />
      <StationLabel x={364} label="Meaning" detail="directed significance" />
      <StationLabel x={588} label="Idea" detail="meaning taking shape" />
      <Axis left="VISION" middle="MEANING" right="EXPRESSION" />
    </>
  );
}

function RefinementAndDisciplineToTermOfArt({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M228 152H324" />
        <path className="ai-factory-motif__practice-input" data-practice="discipline" d="M360 104V120" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__practice-input" data-practice="refinement" d="M360 200V184" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M384 152H484" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={432} y={152} onEdge>ESTABLISHES</ConnectorLabel>
      </g>
      <rect className="ai-factory-motif__station" x="44" y="64" width="184" height="184" />
      <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="492" y="64" width="184" height="184" />
      <MotifGlyph kind="morpheme-refined" x={136} y={136} />
      <MotifGlyph kind="term-of-art" x={584} y={136} />
      <MotifGlyph kind="operator" x={360} y={152} scale={0.72} />
      <g className="ai-factory-motif__practice" data-practice="discipline">
        <rect x="272" y="24" width="176" height="80" />
        <text className="ai-factory-motif__label" x="360" y="48" textAnchor="middle">Discipline</text>
        <text className="ai-factory-motif__detail" x="360" y="68" textAnchor="middle">continuity · clarification</text>
        <text className="ai-factory-motif__detail" x="360" y="82" textAnchor="middle">specification</text>
      </g>
      <g className="ai-factory-motif__practice" data-practice="refinement">
        <rect x="272" y="200" width="176" height="56" />
        <text className="ai-factory-motif__label" x="360" y="224" textAnchor="middle">Refinement</text>
        <text className="ai-factory-motif__detail" x="360" y="244" textAnchor="middle">definition · evidence · correction</text>
      </g>
      <StationLabel x={136} label="Idea" detail="shared meaning" />
      <StationLabel x={584} label="Term of art" detail="consistent within a domain" />
      <Axis left="MEANING POTENTIAL" middle="REFINEMENT + DISCIPLINE" right="STABLE TERM" />
    </>
  );
}

function EmbeddingTokenStrip({ x, y, rows = 1, columns = 8 }: { x: number; y: number; rows?: number; columns?: number }) {
  const shades = ["one", "two", "three", "four"];
  return (
    <g className="ai-factory-motif__embedding-tokens" aria-hidden="true">
      {Array.from({ length: rows * columns }, (_, index) => (
        <rect key={index} className={`ai-factory-icon__token-segment ai-factory-icon__token-segment--${shades[index % shades.length]}`} x={x + (index % columns) * 18} y={y + Math.floor(index / columns) * 12} width="16" height="8" />
      ))}
    </g>
  );
}

function EmbeddingContrastLane({ grounded, arrowId, offset = grounded ? 0 : 288 }: { grounded: boolean; arrowId: string; offset?: number }) {
  return (
    <g data-lane={grounded ? "grounded" : "ungrounded"} transform={offset === 0 ? undefined : `translate(0 ${offset})`}>
      <text className={`ai-factory-motif__embedding-eyebrow${grounded ? " ai-factory-motif__embedding-eyebrow--focal" : ""}`} x="40" y="76">{grounded ? "01 / WITH UNDERSTANDING" : "02 / WITHOUT UNDERSTANDING"}</text>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path data-relationship="label-to-embedding" d="M160 168H232" markerEnd={`url(#${arrowId})`} />
        <path data-relationship="embedding-to-inference" d="M492 168H544" markerEnd={`url(#${arrowId})`} />
        <path className={grounded ? "ai-factory-motif__connector--focal" : undefined} data-relationship="inference-to-output" d="M632 168H708" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={668} y={168} onEdge>YIELDS</ConnectorLabel>
      </g>
      <g data-stage="input">
        <MotifGlyph kind="label" x={112} y={168} scale={0.65} />
        <EmbeddingTokenStrip x={86} y={200} columns={3} />
        <text className="ai-factory-motif__label" x="112" y="236" textAnchor="middle">Short label</text>
        <text className="ai-factory-motif__detail" x="112" y="256" textAnchor="middle">{grounded ? "shared term of art" : "unshared or ambiguous"}</text>
      </g>
      <g data-stage="representation">
        <rect className={`ai-factory-motif__station${grounded ? "" : " ai-factory-motif__embedding-unanchored"}`} x="248" y="104" width="244" height="176" />
        <MotifGlyph kind="embedding" x={268} y={124} scale={0.18} />
        <text className="ai-factory-motif__label" x="376" y="128" textAnchor="middle">Embedding space</text>
        <g className={grounded ? undefined : "ai-factory-motif__embedding-missing"}>
          <MotifGlyph kind="understanding" x={316} y={176} scale={0.52} />
        </g>
        <MotifGlyph kind={grounded ? "operator" : "disconnected"} x={368} y={176} scale={0.32} />
        <MotifGlyph kind={grounded ? "term-of-art" : "morpheme-diffuse"} x={420} y={176} scale={0.52} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="316" y="216" textAnchor="middle">{grounded ? "Understanding" : "No grounding"}</text>
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="420" y="216" textAnchor="middle">{grounded ? "Term of art" : "Loose meaning"}</text>
        <text className="ai-factory-motif__detail" x="370" y="256" textAnchor="middle">{grounded ? "shared domain distinctions" : "context and criteria absent"}</text>
      </g>
      <g data-stage="inference">
        <MotifGlyph kind="inference" x={588} y={168} scale={0.56} />
        <text className="ai-factory-motif__label" x="588" y="236" textAnchor="middle">Inference</text>
        <text className="ai-factory-motif__detail" x="588" y="256" textAnchor="middle">{grounded ? "guided by meaning" : "fluent, not grounded"}</text>
      </g>
      <g data-stage="output">
        <rect className={`ai-factory-motif__station${grounded ? " ai-factory-motif__station--focal" : ""}`} x="720" y="104" width="208" height="176" />
        <g className="ai-factory-motif__output-heading">
          <text className="ai-factory-motif__label" x={grounded ? 812 : 824} y="128" textAnchor="middle">{grounded ? "Useful expansion" : "Excess output"}</text>
          {grounded && <MotifGlyph kind="value" x={888} y={123} scale={0.2} />}
        </g>
        <g className="ai-factory-motif__generated-text" aria-hidden="true">
          {(grounded ? [148, 160, 172, 184] : [144, 154, 164, 174, 184, 194]).map((y, index) => (
            <path key={y} className="ai-factory-icon__text-line" d={`M736 ${y}H776M784 ${y}H${index % 2 ? 832 : 844}M${index % 2 ? 840 : 852} ${y}H876`} />
          ))}
        </g>
        <EmbeddingTokenStrip x={736} y={204} rows={grounded ? 2 : 3} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="824" y="252" textAnchor="middle">{grounded ? "Fits the intended result" : "Does not fit the goal"}</text>
        <text className="ai-factory-motif__detail" x="824" y="272" textAnchor="middle">{grounded ? "more text · useful tokens" : "excess tokens · no added value"}</text>
      </g>
    </g>
  );
}

function UnderstandingInEmbeddingSpace({ arrowId, lane }: { arrowId: string; lane: AiFactoryMotifEmbeddingLane }) {
  const comparison = lane === "comparison";
  const axisY = comparison ? 600 : 312;

  return (
    <>
      <g className="ai-factory-motif__embedding-columns" aria-hidden="true">
        <text x="112" y="32" textAnchor="middle">SHORT INPUT</text>
        <text x="370" y="32" textAnchor="middle">REPRESENTATION</text>
        <text x="588" y="32" textAnchor="middle">GENERATION</text>
        <text x="824" y="32" textAnchor="middle">EXPANDED OUTPUT</text>
        <path d={comparison ? "M40 48H928M40 312H928" : "M40 48H928"} />
      </g>
      {lane !== "ungrounded" ? <EmbeddingContrastLane grounded arrowId={arrowId} /> : null}
      {lane !== "grounded" ? <EmbeddingContrastLane grounded={false} arrowId={arrowId} offset={comparison ? 288 : 0} /> : null}
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d={`M40 ${axisY}H928`} />
        <text x="40" y={axisY + 24}>{comparison ? "CONCEPTUAL CONTRAST · TOKEN MARKS ARE NOT COUNTS" : "CONCEPTUAL PATH · TOKEN MARKS ARE NOT COUNTS"}</text>
        <text x="928" y={axisY + 24} textAnchor="end">VALUE ≠ VOLUME</text>
      </g>
    </>
  );
}

const topologyTeams = [
  { id: "A", topY: 112, panelX: 40 },
  { id: "B", topY: 188, panelX: 360 },
  { id: "C", topY: 264, panelX: 680 },
] as const;

function TopologyTeamMarker({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g className="ai-factory-motif__topology-team-marker">
      <MotifGlyph kind="others" x={x} y={y} scale={0.26} />
      <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x={x + 36} y={y + 4}>Team {id}</text>
    </g>
  );
}

function BoundedLearningLoop({ id, panelX, arrowId }: { id: string; panelX: number; arrowId: string }) {
  const understandingX = panelX + 76;
  const implementationX = panelX + 166;

  return (
    <g className="ai-factory-motif__bounded-team" data-team={id} data-loop="bounded-learning-loop" data-flywheel="understanding-implementation">
      <rect className="ai-factory-motif__team-boundary" x={panelX} y="444" width="240" height="164" />
      <TopologyTeamMarker id={id} x={panelX + 32} y={462} />
      <g className="ai-factory-motif__connectors ai-factory-motif__learning-loop" aria-hidden="true">
        <path className="ai-factory-motif__connector--focal" data-relationship="understanding-to-implementation" d={`M${understandingX + 18} 518C${understandingX + 34} 484 ${implementationX - 34} 484 ${implementationX - 8} 518`} markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--feedback" data-relationship="implementation-to-understanding" d={`M${implementationX - 8} 534C${implementationX - 34} 568 ${understandingX + 34} 568 ${understandingX + 18} 534`} markerEnd={`url(#${arrowId})`} />
      </g>
      <MotifGlyph kind="understanding" x={understandingX} y={526} scale={0.42} />
      <g className="ai-factory-motif__learning-action" data-relationship="implementation-output">
        <MotifGlyph kind="implementation" x={implementationX} y={526} scale={0.42} centerX={64} />
      </g>
      <text className="ai-factory-motif__detail ai-factory-motif__learning-stage" x={understandingX} y="594" textAnchor="middle">UNDERSTANDING</text>
      <text className="ai-factory-motif__detail ai-factory-motif__learning-stage" x={implementationX + 10} y="594" textAnchor="middle">IMPLEMENTATION</text>
    </g>
  );
}

function CentralQueueToBoundedLoops({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g data-topology="centralized-judgment">
        <text className="ai-factory-motif__embedding-eyebrow" x="40" y="40">01 / PRODUCTION DISTRIBUTED · JUDGMENT CENTRALIZED</text>
        {topologyTeams.map(team => <g data-team={team.id} key={team.id}><TopologyTeamMarker id={team.id} x={72} y={team.topY} /></g>)}
        <g className="ai-factory-motif__topology-queue" aria-label="Pending discoveries and decisions">
          {topologyTeams.map((team, index) => (
            <g className="ai-factory-motif__queue-item" data-queue-item={team.id} key={team.id}>
              <rect x="240" y={team.topY - 20} width="168" height="40" />
              <text className="ai-factory-motif__detail" x="324" y={team.topY + 3} textAnchor="middle">{["discovery", "decision", "exception"][index]}</text>
            </g>
          ))}
        </g>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          {topologyTeams.map(team => <path data-relationship="team-to-central-queue" key={team.id} d={`M132 ${team.topY}H228`} markerEnd={`url(#${arrowId})`} />)}
          <path data-relationship="queue-to-central-gate" d="M408 112H448V188H476" />
          <path data-relationship="queue-to-central-gate" d="M408 188H476" />
          <path data-relationship="queue-to-central-gate" d="M408 264H448V188H476" />
          <path className="ai-factory-motif__connector--focal" data-relationship="central-gate-to-action" d="M604 188H756" markerEnd={`url(#${arrowId})`} />
          <ConnectorLabel x={680} y={188} onEdge>APPROVES</ConnectorLabel>
        </g>
        <MotifGlyph kind="bottleneck" x={540} y={188} scale={0.72} />
        <text className="ai-factory-motif__label" x="540" y="266" textAnchor="middle">One interpretation gate</text>
        <text className="ai-factory-motif__detail" x="540" y="286" textAnchor="middle">absorb · interpret · integrate</text>
        <MotifGlyph kind="implementation" x={820} y={188} scale={0.5} centerX={automationVisualCenterX} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="820" y="266" textAnchor="middle">System change</text>
        <text className="ai-factory-motif__detail" x="820" y="286" textAnchor="middle">capacity set by one gate</text>
      </g>

      <g className="ai-factory-motif__embedding-columns" aria-hidden="true">
        <path d="M40 320H920" />
      </g>

      <g data-topology="bounded-learning-loops">
        <text className="ai-factory-motif__embedding-eyebrow ai-factory-motif__embedding-eyebrow--focal" x="40" y="360">02 / COMPLETE LEARNING LOOPS · EXPLICIT INTERFACES</text>
        <g className="ai-factory-motif__shared-intent">
          <MotifGlyph kind="goal" x={480} y={398} scale={0.3} />
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="520" y="402">Shared intent</text>
        </g>
        <g className="ai-factory-motif__connectors ai-factory-motif__shared-intent-paths" aria-hidden="true">
          <path className="ai-factory-motif__connector--focal" d="M480 420H160V444M480 420V444M480 420H800V444" />
        </g>
        {topologyTeams.map(team => <BoundedLearningLoop key={team.id} id={team.id} panelX={team.panelX} arrowId={arrowId} />)}
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path data-relationship="cross-team-interface" d="M280 512H360" markerEnd={`url(#${arrowId})`} />
          <ConnectorLabel x={320} y={512} onEdge>INTERFACE</ConnectorLabel>
          <path data-relationship="cross-team-interface" d="M600 512H680" markerEnd={`url(#${arrowId})`} />
          <ConnectorLabel x={640} y={512} onEdge>INTERFACE</ConnectorLabel>
        </g>
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 628H920" />
        <text x="40" y="652">SAME TEAMS · DIFFERENT TOPOLOGY</text>
        <text x="920" y="652" textAnchor="end">LOCAL JUDGMENT · SYSTEM COORDINATION</text>
      </g>
    </>
  );
}

function TokenEconomics({ arrowId, titleId }: { arrowId: string; titleId: string }) {
  return (
    <div className="ai-factory-motif__economics-grid">
      <section className="ai-factory-motif__economics-graph" data-variable="token-volume">
        <p><span>01</span> Token expansion ratio</p>
        <svg viewBox="0 0 320 176" role="img" aria-labelledby={`${titleId}-tokens-title`} aria-describedby={`${titleId}-tokens-description`}>
          <title id={`${titleId}-tokens-title`}>Token output is larger than token input</title>
          <desc id={`${titleId}-tokens-description`}>A small input token set becomes a larger output token set. The token expansion ratio is output tokens divided by input tokens; the icon counts are illustrative.</desc>
          <defs>
            <marker id={`${arrowId}-tokens`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" />
            </marker>
          </defs>
          <g data-stage="input-tokens"><EmbeddingTokenStrip x={32} y={48} columns={3} /></g>
          <g className="ai-factory-motif__connectors" aria-hidden="true">
            <path className="ai-factory-motif__connector--focal" d="M96 52H172" markerEnd={`url(#${arrowId}-tokens)`} />
          </g>
          <text className="ai-factory-motif__economics-variable" x="58" y="78" textAnchor="middle">N_INPUT</text>
          <g data-stage="output-tokens"><EmbeddingTokenStrip x={190} y={36} rows={3} columns={5} /></g>
          <text className="ai-factory-motif__economics-variable" x="226" y="88" textAnchor="middle">N_OUTPUT</text>
          <g className="ai-factory-motif__economics-ratio" aria-label="R token equals N output divided by N input">
            <text x="72" y="132">R_TOKEN</text>
            <text x="130" y="132">=</text>
            <text x="214" y="118" textAnchor="middle">N_OUTPUT</text>
            <path d="M168 127H260" />
            <text x="214" y="146" textAnchor="middle">N_INPUT</text>
          </g>
          <text className="ai-factory-motif__detail" x="286" y="136" textAnchor="end">output &gt; input</text>
        </svg>
      </section>

      <section className="ai-factory-motif__economics-graph" data-variable="time-to-token-in">
        <p><span>02</span> Time for token input</p>
        <svg viewBox="0 0 320 176" role="img" aria-labelledby={`${titleId}-time-title`} aria-describedby={`${titleId}-time-description`}>
          <title id={`${titleId}-time-title`}>Time required to prepare token input</title>
          <desc id={`${titleId}-time-description`}>A stopwatch and ticked timeline show T input as elapsed time from recognizing a need to having model-ready input.</desc>
          <g className="ai-factory-motif__economics-timer" aria-hidden="true">
            <path className="ai-factory-motif__economics-timer-button" d="M153 18H167M160 18V24" />
            <circle cx="160" cy="48" r="22" />
            <path className="ai-factory-motif__economics-timer-hand" d="M160 48V34M160 48L171 54" />
            <circle className="ai-factory-motif__economics-timer-center" cx="160" cy="48" r="2.5" />
          </g>
          <text className="ai-factory-motif__economics-variable" x="160" y="82" textAnchor="middle">T_INPUT</text>
          <g className="ai-factory-motif__economics-timeline" aria-hidden="true">
            <path className="ai-factory-motif__economics-timeline-line" d="M48 102H272" />
            <path className="ai-factory-motif__economics-timeline-ticks" d="M48 94V110M104 98V106M160 94V110M216 98V106M272 94V110" />
          </g>
          <circle className="ai-factory-motif__economics-point" cx="48" cy="102" r="5" />
          <circle className="ai-factory-motif__economics-point ai-factory-motif__economics-point--focal" cx="272" cy="102" r="5" />
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="48" y="134" textAnchor="start">Need recognized</text>
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="272" y="134" textAnchor="end">Model-ready input</text>
          <text className="ai-factory-motif__detail" x="160" y="160" textAnchor="middle">framing · evidence · constraints</text>
        </svg>
      </section>

      <section className="ai-factory-motif__economics-graph" data-variable="verified-value-out">
        <p><span>03</span> Verified value output</p>
        <svg viewBox="0 0 320 176" role="img" aria-labelledby={`${titleId}-value-title`} aria-describedby={`${titleId}-value-description`}>
          <title id={`${titleId}-value-title`}>Output tokens become verified value after evaluation</title>
          <desc id={`${titleId}-value-description`}>Candidate output tokens pass through evaluation before an accepted contribution counts as verified value.</desc>
          <defs>
            <marker id={`${arrowId}-value`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" />
            </marker>
          </defs>
          <g data-stage="candidate-output"><EmbeddingTokenStrip x={28} y={68} columns={4} /></g>
          <g className="ai-factory-motif__connectors" aria-hidden="true">
            <path d="M106 72H136" markerEnd={`url(#${arrowId}-value)`} />
            <path className="ai-factory-motif__connector--focal" d="M184 72H226" markerEnd={`url(#${arrowId}-value)`} />
          </g>
          <rect className="ai-factory-motif__economics-gate" x="136" y="54" width="48" height="36" />
          <text className="ai-factory-motif__economics-model-label" x="160" y="75" textAnchor="middle">CHECK</text>
          <g data-stage="verified-value"><MotifGlyph kind="value" x={258} y={72} scale={0.44} /></g>
          <text className="ai-factory-motif__detail" x="58" y="122" textAnchor="middle">candidate output</text>
          <text className="ai-factory-motif__economics-variable" x="258" y="122" textAnchor="middle">V_OUTPUT</text>
          <text className="ai-factory-motif__detail" x="160" y="150" textAnchor="middle">accepted contribution</text>
        </svg>
      </section>
    </div>
  );
}

function TermOfArtToImplementation({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M196 136H296" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M424 136H548" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={244} y={136} onEdge>APPLIED IN</ConnectorLabel>
        <ConnectorLabel x={484} y={136} onEdge>AFFORDS</ConnectorLabel>
      </g>
      <MotifGlyph kind="term-of-art" x={132} y={136} />
      <MotifGlyph kind="understanding" x={360} y={136} />
      <MotifGlyph kind="implementation" x={588} y={136} />
      <StationLabel x={132} label="Term of art" detail="shared domain constraint" />
      <StationLabel x={360} label="Understanding" detail="context · evidence · stakes" />
      <StationLabel x={588} label="Implementation" detail="decision · test · artifact" />
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 260H680" />
        <text x="132" y="280" textAnchor="middle">SHARED TERM</text>
        <text x="360" y="280" textAnchor="middle">SITUATED MODEL</text>
        <text x="588" y="280" textAnchor="middle">CONCRETE ACTION</text>
      </g>
    </>
  );
}

function OntologyNode({ x, y, label, kind = "term-of-art", focal = false, labelBeside = false }: { x: number; y: number; label: string; kind?: AiFactoryIconKind; focal?: boolean; labelBeside?: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__ontology-node ai-factory-motif__ontology-node--focal" : "ai-factory-motif__ontology-node"}>
      <MotifGlyph kind={kind} x={x} y={y} scale={0.7} />
      <text className="ai-factory-motif__label" x={labelBeside ? x - 52 : focal ? x - 16 : x} y={labelBeside ? y : focal ? y + 36 : y + 52} textAnchor={labelBeside || focal ? "end" : "middle"}>{label}</text>
    </g>
  );
}

function OntologyOfTerms({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M148 200H320" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M396 200H568" markerEnd={`url(#${arrowId})`} />
        <path d="M360 108V160" markerEnd={`url(#${arrowId})`} />
        <path d="M360 292V240" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={236} y={200} onEdge>PURSUES</ConnectorLabel>
        <ConnectorLabel x={484} y={200} onEdge>DIRECTS</ConnectorLabel>
        <ConnectorLabel x={360} y={136} onEdge>SUPPORTS</ConnectorLabel>
        <ConnectorLabel x={360} y={268} onEdge>BOUNDS</ConnectorLabel>
      </g>
      <OntologyNode x={112} y={200} label="Actor" />
      <OntologyNode x={360} y={200} label="Goal" kind="goal" focal />
      <OntologyNode x={608} y={200} label="Action" kind="automation" />
      <OntologyNode x={360} y={72} label="Evidence" labelBeside />
      <OntologyNode x={360} y={328} label="Constraint" labelBeside />
      <g className="ai-factory-motif__ontology-legend" aria-hidden="true">
        <path d="M40 384H680" />
        <text x="40" y="408">SHARED TERMS</text>
        <text x="360" y="408" textAnchor="middle">TYPED RELATIONSHIPS</text>
        <text x="680" y="408" textAnchor="end">ONE NAVIGABLE MODEL</text>
      </g>
    </>
  );
}

const hypothesisCandidates = [
  { id: "regression", label: "Code regression", detail: "release changed behavior", y: 116 },
  { id: "tradeoff", label: "Expected tradeoff", detail: "goal changed the journey", y: 242 },
  { id: "noise", label: "Coincidental noise", detail: "timing without cause", y: 368 },
] as const;

function TriggerOpensHypotheses({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__cognitive-panel" data-stage="typed-observation">
        <rect x="40" y="72" width="192" height="340" />
        <text className="ai-factory-motif__cognitive-eyebrow" x="60" y="100">TRIGGER / OBSERVED</text>
        <MotifGlyph kind="trigger" x={136} y={224} scale={0.82} />
        <text className="ai-factory-motif__label" x="136" y="306" textAnchor="middle">Typed observation</text>
        <text className="ai-factory-motif__detail" x="136" y="328" textAnchor="middle">funnel changed after release</text>
        <text className="ai-factory-motif__detail" x="136" y="348" textAnchor="middle">source · window · provenance</text>
      </g>

      <g data-stage="inference">
        <MotifGlyph kind="inference" x={340} y={242} scale={0.7} />
        <text className="ai-factory-motif__label" x="340" y="330" textAnchor="middle">Inference</text>
        <text className="ai-factory-motif__detail" x="340" y="350" textAnchor="middle">preserves alternatives</text>
      </g>

      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path className="ai-factory-motif__connector--focal" data-relationship="observation-opens-inference" d="M232 242H292" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={260} y={242} onEdge>OPENS</ConnectorLabel>
        <path data-relationship="inference-to-regression" d="M396 216C438 216 450 116 492 116" markerEnd={`url(#${arrowId})`} />
        <path data-relationship="inference-to-tradeoff" d="M396 242H492" markerEnd={`url(#${arrowId})`} />
        <path data-relationship="inference-to-noise" d="M396 268C438 268 450 368 492 368" markerEnd={`url(#${arrowId})`} />
        <path d="M720 242H748" markerEnd={`url(#${arrowId})`} />
      </g>

      <g data-stage="candidate-hypotheses">
        {hypothesisCandidates.map(candidate => (
          <g className="ai-factory-motif__hypothesis-card" data-hypothesis={candidate.id} key={candidate.id}>
            <rect x="500" y={candidate.y - 44} width="220" height="88" />
            <MotifGlyph kind="morpheme-diffuse" x={540} y={candidate.y} scale={0.3} />
            <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="580" y={candidate.y - 4}>{candidate.label}</text>
            <text className="ai-factory-motif__detail" x="580" y={candidate.y + 18}>{candidate.detail}</text>
          </g>
        ))}
      </g>

      <g className="ai-factory-motif__cognitive-panel ai-factory-motif__cognitive-panel--focal" data-stage="truth-practice-gates">
        <rect x="756" y="72" width="164" height="340" />
        <text className="ai-factory-motif__cognitive-eyebrow" x="776" y="100">CHECK EACH CANDIDATE</text>
        <MotifGlyph kind="coherence" x={800} y={164} scale={0.4} />
        <MotifGlyph kind="correspondence" x={876} y={164} scale={0.4} />
        <text className="ai-factory-motif__detail" x="800" y="208" textAnchor="middle">fits?</text>
        <text className="ai-factory-motif__detail" x="876" y="208" textAnchor="middle">matches?</text>
        <path className="ai-factory-motif__cognitive-rule" d="M776 232H900" />
        <g className="ai-factory-motif__cognitive-deferred">
          <MotifGlyph kind="consequence" x={838} y={296} scale={0.42} />
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="838" y="342" textAnchor="middle">Consequence</text>
          <text className="ai-factory-motif__detail" x="838" y="362" textAnchor="middle">after authorized action</text>
        </g>
        <text className="ai-factory-motif__cognitive-eyebrow" x="838" y="392" textAnchor="middle">NOT AT THE TRIGGER</text>
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 464H920" />
        <text x="40" y="488">ONE OBSERVATION</text>
        <text x="480" y="488" textAnchor="middle">MULTIPLE LIVE EXPLANATIONS</text>
        <text x="920" y="488" textAnchor="end">NO ACTION AUTHORIZED YET</text>
      </g>
    </>
  );
}

function ConsequenceReturnsToContext({ arrowId }: { arrowId: string }) {
  return (
    <>
      <rect className="ai-factory-motif__cognitive-panel" x="40" y="48" width="880" height="324" />
      <text className="ai-factory-motif__cognitive-eyebrow" x="64" y="78">ONE FORWARD PATH</text>
      <text className="ai-factory-motif__detail" x="896" y="78" textAnchor="end">the difference is what happens after the outcome</text>

      <g data-stage="context">
        <MotifGlyph kind="ontology-node" x={156} y={158} scale={0.48} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="156" y="218" textAnchor="middle">Context + evaluation</text>
      </g>
      <g data-stage="automation">
        <MotifGlyph kind="automation" x={456} y={158} scale={0.44} centerX={automationVisualCenterX} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="456" y="218" textAnchor="middle">Automation</text>
      </g>
      <g data-stage="consequence">
        <MotifGlyph kind="consequence" x={730} y={158} scale={0.46} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="730" y="218" textAnchor="middle">Observed outcome</text>
      </g>

      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path data-relationship="context-to-automation" d="M202 158H402" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={302} y={158} onEdge>GUIDES</ConnectorLabel>
        <path data-relationship="automation-to-consequence" d="M506 158H684" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={594} y={158} onEdge>PRODUCES</ConnectorLabel>

        <path className="ai-factory-motif__connector--inactive" data-relationship="consequence-to-end" d="M776 158H868" />
        <path className="ai-factory-motif__connector--inactive" d="M868 146V170" />

        <path className="ai-factory-motif__connector--focal" data-relationship="consequence-to-context" d="M752 158V172Q752 180 760 180H896Q904 180 904 188V336Q904 344 896 344H64Q56 344 56 336V166Q56 158 64 158H124" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={480} y={328}>REVISES THE NEXT CYCLE</ConnectorLabel>
      </g>

      <g data-outcome="activity">
        <text className="ai-factory-motif__cognitive-eyebrow" x="868" y="250" textAnchor="end">ACTIVITY ONLY</text>
        <text className="ai-factory-motif__detail" x="868" y="270" textAnchor="end">observed, then forgotten</text>
      </g>
      <g data-outcome="learning">
        <text className="ai-factory-motif__cognitive-eyebrow" x="64" y="302">LEARNING</text>
        <text className="ai-factory-motif__detail" x="64" y="322">a test, rule, threshold, or definition changes</text>
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 392H920" />
        <text x="40" y="412">OUTCOME OBSERVED</text>
        <text x="480" y="412" textAnchor="middle">SPECIFIC REVISION RETAINED</text>
        <text x="920" y="412" textAnchor="end">NEXT CYCLE CHANGED</text>
      </g>
    </>
  );
}

function PathDeclaresOwnership({ arrowId }: { arrowId: string }) {
  const segments = [
    { role: "BOUNDARY", value: "libs", x: 40, width: 104 },
    { role: "LAYER", value: "edge", x: 156, width: 104 },
    { role: "DOMAIN", value: "audio", x: 272, width: 104 },
    { role: "DETAIL", value: "state-zustand-player", x: 388, width: 372 },
  ] as const;

  return (
    <>
      <text className="ai-factory-motif__embedding-eyebrow" x="40" y="28">PATH IDENTIFIER · FOUR COORDINATES</text>
      <g data-stage="repository-path">
        {segments.map(({ role, value, x, width }, index) => (
          <g data-path-segment={role.toLowerCase().replaceAll(" ", "-")} key={role}>
            <rect className="ai-factory-motif__station" x={x} y="40" width={width} height="72" />
            <text className="ai-factory-motif__path-role" x={x + 12} y="64">{role}</text>
            <text className="ai-factory-motif__path-value" x={x + 12} y="92">{value}</text>
            {index < segments.length - 1 ? <text className="ai-factory-motif__path-slash" x={x + width + 4} y="88">/</text> : null}
          </g>
        ))}
      </g>

      <g data-stage="composed-identity">
        <rect className="ai-factory-motif__path-boundary" x="40" y="136" width="720" height="256" />
        <text className="ai-factory-motif__path-role" x="56" y="160">BOUNDARY · REUSABLE LIBRARY</text>

        <g data-coordinate="layer">
          <rect className="ai-factory-motif__path-layer" x="64" y="176" width="672" height="48" />
          <text className="ai-factory-motif__path-role" x="80" y="196">LAYER · EDGE</text>
          <text className="ai-factory-motif__detail" x="80" y="216">cross-cutting product-facing position in the dependency stack</text>
        </g>

        <g data-coordinate="domain">
          <rect className="ai-factory-motif__path-domain" x="64" y="240" width="408" height="120" />
          <text className="ai-factory-motif__path-role" x="80" y="264">DOMAIN · AUDIO</text>
          <text className="ai-factory-motif__label" x="80" y="292">Terms of art shape the user experience</text>
          <g className="ai-factory-motif__path-terms">
            <rect x="80" y="312" width="88" height="28" />
            <rect x="180" y="312" width="88" height="28" />
            <rect x="280" y="312" width="104" height="28" />
            <text x="124" y="330" textAnchor="middle">PLAYER</text>
            <text x="224" y="330" textAnchor="middle">SOURCE</text>
            <text x="332" y="330" textAnchor="middle">CHROME</text>
          </g>
        </g>

        <g data-coordinate="implementation-details">
          <rect className="ai-factory-motif__path-details" x="488" y="240" width="248" height="120" />
          <text className="ai-factory-motif__path-role" x="504" y="264">LEAF + OWNER CONTRACT</text>
          <text className="ai-factory-motif__path-detail-key" x="504" y="292">TECH · HOW</text>
          <text className="ai-factory-motif__path-detail-value" x="584" y="292">Zustand</text>
          <text className="ai-factory-motif__path-detail-key" x="504" y="316">TOOL · WHAT</text>
          <text className="ai-factory-motif__path-detail-value" x="584" y="316">player store</text>
          <text className="ai-factory-motif__path-detail-key" x="504" y="340">FEATURE · WHY</text>
          <text className="ai-factory-motif__path-detail-value" x="584" y="340">playback</text>
        </g>
      </g>

      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path className="ai-factory-motif__connector--focal" d="M760 264H812" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={784} y={264} onEdge>IDENTIFIES</ConnectorLabel>
      </g>

      <g data-stage="change-destination">
        <circle className="ai-factory-motif__path-target-ring" cx="848" cy="264" r="28" />
        <circle className="ai-factory-motif__path-target-core" cx="848" cy="264" r="5" />
        <path className="ai-factory-motif__path-target-ticks" d="M848 224V236M848 292V304M808 264H820M876 264H888" />
        <text className="ai-factory-motif__label" x="848" y="328" textAnchor="middle">Owned library</text>
        <text className="ai-factory-motif__detail" x="848" y="348" textAnchor="middle">change destination</text>
        <text className="ai-factory-motif__detail" x="848" y="368" textAnchor="middle">public API + contract</text>
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 440H920" />
        <text x="40" y="464">FILESYSTEM ADDRESS</text>
        <text x="480" y="464" textAnchor="middle">COMPOSED SEMANTIC MAP</text>
        <text x="920" y="464" textAnchor="end">IDENTITY · DESTINATION</text>
      </g>
    </>
  );
}

function LayersGuideImplementation() {
  const layers = [
    {
      index: "01",
      layer: "Edge",
      position: "product-facing",
      artifact: "Integration boundary",
      artifactDetail: "public API + adapter",
      method: "Integration test",
      methodDetail: "PostHog + Sentry wrappers",
    },
    {
      index: "02",
      layer: "Schema",
      position: "data authority",
      artifact: "Typed DB contract",
      artifactDetail: "canonical schema + types",
      method: "Generated TS interface",
      methodDetail: "derived from the database",
    },
    {
      index: "03",
      layer: "Engine",
      position: "deterministic logic",
      artifact: "Domain engine",
      artifactDetail: "rules + transformations",
      method: "Unit tests",
      methodDetail: "fast behavioral proof",
    },
  ] as const;

  return (
    <>
      <text className="ai-factory-motif__embedding-eyebrow" x="40" y="36">LAYER CONTRACTS · SELECTED EXAMPLES</text>
      <g className="ai-factory-motif__layer-contract-headings" aria-hidden="true">
        <text x="56" y="68">LAYER SIGNAL</text>
        <text x="208" y="68">WHAT GETS BUILT</text>
        <text x="480" y="68">HOW IT IS BUILT + PROVED</text>
        <text x="784" y="68">AUTOMATIC APPLICATION</text>
      </g>

      <g data-stage="layer-contracts">
        {layers.map(({ index, layer, position, artifact, artifactDetail, method, methodDetail }, rowIndex) => {
          const y = 80 + rowIndex * 112;
          return (
            <g data-layer-contract={layer.toLowerCase()} key={layer}>
              <rect className="ai-factory-motif__layer-contract-row" x="40" y={y} width="880" height="96" />
              <path className="ai-factory-motif__layer-contract-divider" d={`M184 ${y}V${y + 96}M456 ${y}V${y + 96}M760 ${y}V${y + 96}`} />

              <text className="ai-factory-motif__path-role" x="56" y={y + 24}>{`LAYER ${index}`}</text>
              <text className="ai-factory-motif__layer-contract-name" x="56" y={y + 52}>{layer}</text>
              <text className="ai-factory-motif__detail" x="56" y={y + 76}>{position}</text>

              <text className="ai-factory-motif__path-role" x="208" y={y + 24}>WHAT</text>
              <text className="ai-factory-motif__layer-contract-value" x="208" y={y + 52}>{artifact}</text>
              <text className="ai-factory-motif__detail" x="208" y={y + 76}>{artifactDetail}</text>

              <text className="ai-factory-motif__path-role" x="480" y={y + 24}>HOW</text>
              <text className="ai-factory-motif__layer-contract-value" x="480" y={y + 52}>{method}</text>
              <text className="ai-factory-motif__detail" x="480" y={y + 76}>{methodDetail}</text>

              <g data-automation="skill-tool-calls">
                <text className="ai-factory-motif__layer-contract-auto" x="840" y={y + 44} textAnchor="middle">Skill + tool calls</text>
                <text className="ai-factory-motif__detail" x="840" y={y + 68} textAnchor="middle">apply the contract</text>
              </g>
            </g>
          );
        })}
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 432H920" />
        <text x="40" y="456">SEMANTIC POSITION</text>
        <text x="480" y="456" textAnchor="middle">WHAT + HOW</text>
        <text x="920" y="456" textAnchor="end">EXECUTABLE BY DEFAULT</text>
      </g>
    </>
  );
}

function ContractsGovernAction({ arrowId }: { arrowId: string }) {
  const contracts = [
    { artifact: "README", question: "What is this scope?", detail: "purpose · boundaries · ontology", kind: "text", x: 40 },
    { artifact: "AGENTS", question: "How may work proceed?", detail: "workflow · verification · invariants", kind: "text", x: 328 },
    { artifact: "Skill", question: "Which procedure applies?", detail: "specialized · reusable · situated", kind: "text", x: 616 },
  ] as const satisfies ReadonlyArray<{ artifact: string; question: string; detail: string; kind: AiFactoryIconKind; x: number }>;

  return (
    <>
      <text className="ai-factory-motif__embedding-eyebrow" x="40" y="36">THREE CONTRACTS · THREE DISTINCT JOBS</text>
      {contracts.map(({ artifact, question, detail, kind, x }) => (
        <g data-contract={artifact.toLowerCase()} key={artifact}>
          <rect className="ai-factory-motif__station" x={x} y="56" width="264" height="152" />
          <MotifGlyph kind={kind} x={x + 48} y={112} scale={0.4} />
          <text className="ai-factory-motif__label" x={x + 88} y="96">{artifact}</text>
          <text className="ai-factory-motif__contract-question" x={x + 88} y="120">{question}</text>
          <text className="ai-factory-motif__detail" x={x + 20} y="176">{detail}</text>
        </g>
      ))}

      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M164 228H748" />
        <path d="M172 208V228" />
        <path d="M460 208V228" />
        <path d="M748 208V228" />
        <path d="M164 228V244" />
        <path className="ai-factory-motif__connector--focal" d="M288 292H432" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={360} y={292} onEdge>GOVERNS</ConnectorLabel>
        <path d="M536 292H752" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={644} y={292} onEdge>EVALUATED BY</ConnectorLabel>
      </g>

      <g data-stage="dynamic-context">
        <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="40" y="244" width="248" height="164" />
        <g data-stage="contract-composition">
          <MotifGlyph kind="operator" x={88} y={292} scale={0.32} />
        </g>
        <MotifGlyph kind="token" x={164} y={292} scale={0.5} centerX={76} />
        <text className="ai-factory-motif__label" x="164" y="346" textAnchor="middle">Dynamic context</text>
        <text className="ai-factory-motif__detail" x="164" y="368" textAnchor="middle">selected for the task</text>
        <text className="ai-factory-motif__detail" x="164" y="386" textAnchor="middle">fits the agent's context budget</text>
        <text className="ai-factory-motif__detail" x="164" y="402" textAnchor="middle">scope + rules + procedure</text>
      </g>
      <g data-stage="agent-action">
        <MotifGlyph kind="automation" x={488} y={292} scale={0.48} centerX={automationVisualCenterX} />
        <text className="ai-factory-motif__label" x="488" y="370" textAnchor="middle">Agent action</text>
        <text className="ai-factory-motif__detail" x="488" y="390" textAnchor="middle">authority remains explicit</text>
      </g>
      <g data-stage="evaluated-outcome">
        <MotifGlyph kind="consequence" x={816} y={292} scale={0.48} />
        <text className="ai-factory-motif__label" x="816" y="370" textAnchor="middle">Observed outcome</text>
        <text className="ai-factory-motif__detail" x="816" y="390" textAnchor="middle">evidence can revise the map</text>
      </g>

      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 440H920" />
        <text x="40" y="464">CONTRACT SOURCES</text>
        <text x="488" y="464" textAnchor="middle">DYNAMIC CONTEXT · BUDGETED</text>
        <text x="920" y="464" textAnchor="end">ACTION · EVIDENCE</text>
      </g>
    </>
  );
}

+function Axis({ left, middle, right }: { left: string; middle: string; right: string }) {
  return (
    <g className="ai-factory-motif__axis" aria-hidden="true">
      <path d="M40 276H680" />
      <text x="40" y="296">{left}</text>
      <text x="360" y="296" textAnchor="middle">{middle}</text>
      <text x="680" y="296" textAnchor="end">{right}</text>
    </g>
  );
}

export function AiFactoryMotif({ variant, embeddingLane = "comparison" }: { variant: AiFactoryMotifVariant; embeddingLane?: AiFactoryMotifEmbeddingLane }) {
  const isEmbeddingMotif = variant === "understanding-in-embedding-space";
  const content = isEmbeddingMotif && embeddingLane !== "comparison"
    ? embeddingLaneContent[embeddingLane]
    : motifContent[variant];
  const instanceSuffix = isEmbeddingMotif ? `${variant}-${embeddingLane}` : variant;
  const titleId = `ai-factory-motif-${instanceSuffix}-title`;
  const descriptionId = `ai-factory-motif-${instanceSuffix}-description`;
  const arrowId = `ai-factory-motif-${instanceSuffix}-arrow`;

  return (
    <figure className="ai-factory-motif" data-variant={variant} data-embedding-lane={isEmbeddingMotif ? embeddingLane : undefined}>
      <header className="ai-factory-motif__header">
        <p>{`AI Factory · ${content.index} · ${content.eyebrow}`}</p>
        <h3>{content.title}</h3>
      </header>
      <p className="ai-factory-motif__scroll-cue">Scroll the path →</p>
      {variant === "token-economics" ? <TokenEconomics arrowId={arrowId} titleId={titleId} /> : <div className="ai-factory-motif__viewport" role="region" tabIndex={0} aria-label="Scrollable AI Factory motif">
        <svg viewBox={variant === "understanding-in-embedding-space" && embeddingLane !== "comparison" ? "0 0 960 360" : motifViewBoxes[variant]} role="img" aria-labelledby={`${titleId} ${descriptionId}`} preserveAspectRatio="xMidYMid meet">
          <title id={titleId}>{content.title}</title>
          <desc id={descriptionId}>{content.description}</desc>
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" />
            </marker>
          </defs>
          {variant === "experience-but-lacking" ? <ExperienceButLacking arrowId={arrowId} /> : null}
          {variant === "model-priorities-and-goal-fit" ? <ModelPrioritiesAndGoalFit arrowId={arrowId} /> : null}
          {variant === "vision-to-morpheme" ? <VisionToMorpheme arrowId={arrowId} /> : null}
          {variant === "refinement-and-discipline-to-term-of-art" ? <RefinementAndDisciplineToTermOfArt arrowId={arrowId} /> : null}
          {variant === "understanding-in-embedding-space" ? <UnderstandingInEmbeddingSpace arrowId={arrowId} lane={embeddingLane} /> : null}
          {variant === "central-queue-to-bounded-loops" ? <CentralQueueToBoundedLoops arrowId={arrowId} /> : null}
          {variant === "term-of-art-to-implementation" ? <TermOfArtToImplementation arrowId={arrowId} /> : null}
          {variant === "ontology-of-terms" ? <OntologyOfTerms arrowId={arrowId} /> : null}
          {variant === "trigger-opens-hypotheses" ? <TriggerOpensHypotheses arrowId={arrowId} /> : null}
          {variant === "consequence-returns-to-context" ? <ConsequenceReturnsToContext arrowId={arrowId} /> : null}
          {variant === "path-declares-ownership" ? <PathDeclaresOwnership arrowId={arrowId} /> : null}
          {variant === "layers-guide-implementation" ? <LayersGuideImplementation /> : null}
          {variant === "contracts-govern-action" ? <ContractsGovernAction arrowId={arrowId} /> : null}
        </svg>
      </div>}
      <figcaption>
        {content.caption}
        {variant === "model-priorities-and-goal-fit" ? <span className="ai-factory-motif__evidence-note">
          Diogo Almeida, TypeSafe founder and GPT-4 coauthor, argues that “the end game for all … RLHF models is optimizing for engagement” in <a href="https://ai.engineer/talks/cJ0EOzey--o-jev-ceo-made-chatgpt-building-whats-next">his AI Engineer talk (7:38–7:56)</a>. This is his interpretation of preference-training incentives, not a universal objective of every model. The narrower risk is documented: <a href="https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models">preference training can favor agreement over truth</a>, and <a href="https://openai.com/index/sycophancy-in-gpt-4o/">OpenAI’s April 2025 account</a> links excessive reliance on short-term feedback to overly agreeable responses.
        </span> : null}
      </figcaption>
    </figure>
  );
}
