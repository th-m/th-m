import { useId } from "react";
import { aiFactoryIconLabel, type AiFactoryIconKind } from "./icon-catalog";
export function ConnectorLabel({ x, y, children = "", onEdge = false }: { x: number; y: number; children?: string; onEdge?: boolean }) {
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

export function AiFactoryIconGlyph({ kind }: { kind: AiFactoryIconKind }) {
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
      {kind === "opportunity" ? <>
        <path className="ai-factory-icon__opportunity-branches" d="M80 136V112C80 86 44 84 44 56M80 112C80 86 116 84 116 56" />
        <circle className="ai-factory-icon__opportunity-possibility ai-factory-icon__opportunity-possibility--focus" cx="44" cy="34" r="16" />
        <circle className="ai-factory-icon__opportunity-possibility" cx="116" cy="34" r="16" />
      </> : null}
      {kind === "solution" ? <>
        <path className="ai-factory-icon__solution-path" d="M30 80H58M102 80H130" />
        <circle className="ai-factory-icon__solution-endpoint" cx="20" cy="80" r="5" />
        <path className="ai-factory-icon__solution-intervention" d="M80 62L98 80L80 98L62 80Z" />
        <circle className="ai-factory-icon__solution-endpoint" cx="140" cy="80" r="5" />
      </> : null}
      {kind === "experiment" ? <>
        <path className="ai-factory-icon__experiment-path" d="M80 136V112C80 86 44 84 44 56M80 112C80 86 116 84 116 56" />
        <path className="ai-factory-icon__experiment-observation" d="M44 22L60 50H28Z" />
        <path className="ai-factory-icon__experiment-observation ai-factory-icon__experiment-observation--highlight" d="M116 22L132 50H100Z" />
      </> : null}
      {kind === "meaning" ? <><circle className="ai-factory-icon__meaning-core" cx="80" cy="80" r="5" /><circle className="ai-factory-icon__meaning-boundary" cx="80" cy="80" r="32" /><path className="ai-factory-icon__meaning-edge ai-factory-icon__meaning-edge--diagonal" d="M43 43L58 58M102 102L117 117M117 43L102 58M58 102L43 117" /></> : null}
      {kind === "inference" ? <>
        <path className="ai-factory-icon__inference-path" d="M44 80H58M58 50V110M58 50H80M58 110H80" />
        <circle className="ai-factory-icon__inference-junction" cx="28" cy="80" r="8" />
        <circle className="ai-factory-icon__inference-candidate" cx="92" cy="50" r="9" />
        <circle className="ai-factory-icon__inference-candidate" cx="92" cy="110" r="9" />
        {[38, 62, 98, 122].map((y, index) => (
          <g key={y} className="ai-factory-icon__inference-output">
            <path d={`M110 ${y}H120`} />
            <path className={index === 0 ? "ai-factory-icon__inference-continuation--focus" : undefined} d={`M128 ${y}H148`} />
          </g>
        ))}
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
