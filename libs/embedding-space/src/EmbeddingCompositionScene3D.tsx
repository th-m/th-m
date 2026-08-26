import { Canvas, useThree } from "@react-three/fiber";
import { thomDesignTokens } from "@th-m/design-theme";
import { useEffect, useMemo } from "react";
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  COMPOSITION_OUTPUT_ONLY_TERMS,
  resolveTermComposition,
  type CompositionResultWord,
  type CompositionTerm,
  type PairRecipe,
  type SemanticWord,
} from "./compositionModel";
import {
  SEMANTIC_NETWORK_NODES,
  projectComposition3d,
  semanticEdgesForHighlights,
  type CompositionProjection,
  type SemanticNetworkEdge,
  type SemanticNetworkNode,
  type SemanticNetworkRelation,
  type SemanticNetworkWord,
} from "./semanticNetwork3d";

const COLORS = {
  accent: thomDesignTokens.color.brand,
  ink: thomDesignTokens.color.foregroundStrong,
  muted: thomDesignTokens.color.foregroundMuted,
  subtle: thomDesignTokens.color.foregroundSubtle,
  line: thomDesignTokens.color.borderStrong,
  background: thomDesignTokens.color.surface,
};

const COORDINATE_AXES = [
  { axis: "x", start: [-3, 0, 0], end: [2.75, 0, 0], labelPosition: [2.88, 0.18, 0] },
  { axis: "y", start: [0, -2.1, 0], end: [0, 2, 0], labelPosition: [0.16, 2.1, 0] },
  { axis: "z", start: [0, 0, -2], end: [0, 0, 2], labelPosition: [0, 0.17, 2.1] },
] as const;

const SEMANTIC_AXIS_LABELS = [
  { label: "ordinary", position: [-2.75, -0.17, 0] },
  { label: "royal", position: [2.5, -0.17, 0] },
  { label: "young", position: [-0.23, -1.98, 0] },
  { label: "adult", position: [-0.23, 1.88, 0] },
  { label: "masculine-coded", position: [0, -0.17, -1.8] },
  { label: "feminine-coded", position: [0, -0.17, 1.8] },
] as const;

function labelTexture(label: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "500 38px IBM Plex Mono, ui-monospace, monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(label, canvas.width / 2, canvas.height / 2);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function LabelSprite({ label, position, color = COLORS.muted, scale = 1 }: {
  label: string;
  position: readonly [number, number, number];
  color?: string;
  scale?: number;
}) {
  const texture = useMemo(() => labelTexture(label, color), [color, label]);
  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;
  return (
    <sprite position={position} scale={[1.6 * scale, 0.4 * scale, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} />
    </sprite>
  );
}

function CoordinateAxis({
  start,
  end,
}: {
  start: readonly [number, number, number];
  end: readonly [number, number, number];
}) {
  const startVector = useMemo(() => new Vector3(...start), [start]);
  const endVector = useMemo(() => new Vector3(...end), [end]);
  const direction = useMemo(() => endVector.clone().sub(startVector).normalize(), [endVector, startVector]);
  const midpoint = useMemo(() => startVector.clone().add(endVector).multiplyScalar(0.5), [endVector, startVector]);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
    [direction],
  );
  const arrowPosition = useMemo(() => endVector.clone().addScaledVector(direction, -0.06), [direction, endVector]);

  return (
    <group>
      <mesh position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[0.012, 0.012, startVector.distanceTo(endVector), 8]} />
        <meshBasicMaterial color={COLORS.muted} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={arrowPosition} quaternion={quaternion}>
        <coneGeometry args={[0.06, 0.16, 10]} />
        <meshBasicMaterial color={COLORS.accent} transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CoordinateAxes() {
  return (
    <group>
      {COORDINATE_AXES.map(({ axis, start, end, labelPosition }) => (
        <group key={axis}>
          <CoordinateAxis start={start} end={end} />
          <LabelSprite label={axis} position={labelPosition} color={COLORS.accent} scale={0.72} />
        </group>
      ))}
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={COLORS.line} />
      </mesh>
    </group>
  );
}

const NETWORK_POSITIONS = new Map(
  SEMANTIC_NETWORK_NODES.map(({ word, position }) => [word, position]),
);
const OUTPUT_ONLY_WORDS = new Set<SemanticNetworkWord>(COMPOSITION_OUTPUT_ONLY_TERMS);

const NETWORK_EDGE_STYLES: Record<SemanticNetworkRelation, { color: string; opacity: number }> = {
  status: { color: COLORS.accent, opacity: 0.44 },
  age: { color: COLORS.ink, opacity: 0.28 },
  category: { color: COLORS.muted, opacity: 0.42 },
  counterpart: { color: COLORS.line, opacity: 0.5 },
  blend: { color: COLORS.accent, opacity: 0.26 },
};

function NetworkEdges({
  edges,
  relation,
}: {
  edges: readonly SemanticNetworkEdge[];
  relation: SemanticNetworkRelation;
}) {
  const line = useMemo(() => {
    const positions = edges
      .filter((edge) => edge.relation === relation)
      .flatMap(({ from, to }) => [
        ...(NETWORK_POSITIONS.get(from) ?? []),
        ...(NETWORK_POSITIONS.get(to) ?? []),
      ]);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const style = NETWORK_EDGE_STYLES[relation];
    return new LineSegments(
      geometry,
      new LineBasicMaterial({ color: new Color(style.color), transparent: true, opacity: style.opacity }),
    );
  }, [edges, relation]);
  useEffect(() => () => {
    line.geometry.dispose();
    (line.material as LineBasicMaterial).dispose();
  }, [line]);
  return <primitive object={line} />;
}

function WordMarker({ node, isPath, isSource, isResult }: {
  node: SemanticNetworkNode;
  isPath: boolean;
  isSource: boolean;
  isResult: boolean;
}) {
  const { word, position, kind, labelOffset } = node;
  const isSupportingNode = kind === "context" || kind === "category";
  const color = isResult
    ? COLORS.accent
    : isSource
      ? COLORS.ink
      : isPath
        ? COLORS.accent
        : isSupportingNode
          ? COLORS.subtle
          : COLORS.muted;
  const radius = isResult
    ? 0.13
    : isSource
      ? 0.11
      : isPath
        ? 0.095
        : isSupportingNode
          ? 0.055
          : kind === "mythic"
            ? 0.085
            : 0.07;
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 20, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <LabelSprite
        label={word}
        position={labelOffset ?? [0, isSupportingNode ? 0.19 : 0.28, 0]}
        color={color}
        scale={isResult || isSource ? 1.04 : isPath ? 0.96 : isSupportingNode ? 0.64 : kind === "animal" ? 0.76 : 0.86}
      />
    </group>
  );
}

function ProjectedLocationMarker({ position }: { position: readonly [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshBasicMaterial color={COLORS.background} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.14, 0.022, 10, 28]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
      <LabelSprite label="v*" position={[0, 0.27, 0]} color={COLORS.accent} scale={0.82} />
    </group>
  );
}

function networkPosition(word: SemanticNetworkWord): readonly [number, number, number] {
  const position = NETWORK_POSITIONS.get(word);
  if (!position) throw new Error(`No 3D teaching point is defined for ${word}.`);
  return position;
}

function MovementSegment({ from, to }: { from: SemanticNetworkWord; to: SemanticNetworkWord }) {
  const start = useMemo(() => new Vector3(...networkPosition(from)), [from]);
  const end = useMemo(() => new Vector3(...networkPosition(to)), [to]);
  const direction = useMemo(() => end.clone().sub(start).normalize(), [end, start]);
  const length = start.distanceTo(end);
  const midpoint = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [end, start]);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
    [direction],
  );
  const arrowPosition = useMemo(() => end.clone().addScaledVector(direction, -0.11), [direction, end]);

  return (
    <group>
      <mesh position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[0.022, 0.022, Math.max(0.1, length - 0.2), 8]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
      <mesh position={arrowPosition} quaternion={quaternion}>
        <coneGeometry args={[0.075, 0.2, 12]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
    </group>
  );
}

function SceneControls({ onUnavailable }: { onUnavailable: () => void }) {
  const { camera, gl, invalidate, size } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.target.set(-0.15, -0.1, 0);
    const changed = () => invalidate();
    controls.addEventListener("change", changed);

    const contextLost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };

    gl.domElement.addEventListener("webglcontextlost", contextLost);
    if (size.width / size.height < 1.25) camera.position.set(7, 4.7, 8);
    else camera.position.set(5.4, 3.5, 6.2);
    controls.target.set(-0.15, -0.1, 0);
    controls.update();
    invalidate();
    return () => {
      gl.domElement.removeEventListener("webglcontextlost", contextLost);
      controls.removeEventListener("change", changed);
      controls.dispose();
    };
  }, [camera, gl, invalidate, onUnavailable, size.height, size.width]);

  return null;
}

export function EmbeddingCompositionScene3D({
  path,
  source,
  result,
  recipe,
  terms,
  onUnavailable,
}: {
  path: readonly SemanticWord[];
  source: SemanticNetworkWord | null;
  result: CompositionResultWord | CompositionTerm | null;
  recipe: PairRecipe | null;
  terms: readonly CompositionTerm[];
  onUnavailable: () => void;
}) {
  const projection: CompositionProjection = useMemo(
    () => projectComposition3d(terms, resolveTermComposition(terms)),
    [terms],
  );
  const effectiveResult = result ?? projection.result;
  const highlightedWords = useMemo(
    () => new Set<SemanticNetworkWord>([
      ...path,
      ...terms.flatMap((term) => NETWORK_POSITIONS.has(term as SemanticNetworkWord)
        ? [term as SemanticNetworkWord]
        : []),
      ...(recipe ? [...recipe.terms, recipe.result] : []),
      ...(effectiveResult && NETWORK_POSITIONS.has(effectiveResult as SemanticNetworkWord)
        ? [effectiveResult as SemanticNetworkWord]
        : []),
    ]),
    [effectiveResult, path, recipe, terms],
  );
  const visibleEdges = useMemo(
    () => semanticEdgesForHighlights([...highlightedWords]),
    [highlightedWords],
  );
  const visibleNodes = useMemo(
    () => SEMANTIC_NETWORK_NODES.filter(
      ({ word }) => !OUTPUT_ONLY_WORDS.has(word) || highlightedWords.has(word),
    ),
    [highlightedWords],
  );

  return (
    <div className="embedding-composition__network" data-testid="embedding-composition-3d-scene">
      <div className="embedding-composition__scene">
        <Canvas
          aria-hidden="true"
          camera={{ position: [5.4, 3.5, 6.2], fov: 40, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={[COLORS.background]} />
          <CoordinateAxes />
          {(["status", "age", "category", "counterpart", "blend"] as const).map((relation) => (
            <NetworkEdges key={relation} edges={visibleEdges} relation={relation} />
          ))}
          {SEMANTIC_AXIS_LABELS.map(({ label, position }) => (
            <LabelSprite key={label} label={label} position={position} scale={0.58} />
          ))}
          {visibleNodes.map((node) => (
            <WordMarker
              key={node.word}
              node={node}
              isPath={highlightedWords.has(node.word)}
              isSource={node.word === source}
              isResult={node.word === effectiveResult}
            />
          ))}
          {projection.method === "mean" && terms.length > 1 ? (
            <ProjectedLocationMarker position={projection.location} />
          ) : null}
          {path.slice(1).map((word, index) => (
            <MovementSegment key={`${path[index]}-${word}`} from={path[index] as SemanticWord} to={word} />
          ))}
          {recipe ? (
            <>
              <MovementSegment from={recipe.terms[0]} to={recipe.result} />
              <MovementSegment from={recipe.terms[1]} to={recipe.result} />
            </>
          ) : null}
          <SceneControls onUnavailable={onUnavailable} />
        </Canvas>
      </div>
      <VectorCompositionReadout projection={projection} />
    </div>
  );
}

function formatVector(vector: readonly [number, number, number]) {
  return `[${vector.map((value) => value.toFixed(2)).join(", ")}]`;
}

export function VectorCompositionReadout({ projection }: { projection: CompositionProjection }) {
  const resultLabel = projection.resultKind === "authored"
    ? "Authored lexical result"
    : projection.resultKind === "nearest"
      ? "Nearest point in this projection"
      : "Result point";
  const operation = projection.method === "direction"
    ? `v* = v(${projection.components[0]?.label ?? "start"}) + ${projection.components.slice(1).map(({ label }) => `Δ(${label})`).join(" + ")}`
    : projection.method === "mean"
      ? `v* = (1 / ${Math.max(1, projection.components.length)}) Σ v(tᵢ)`
      : `v* = v(${projection.components[0]?.label ?? "term"})`;

  return (
    <section className="embedding-composition__algebra" aria-labelledby="embedding-composition-algebra-title">
      <header>
        <p>Linear algebra</p>
        <h4 id="embedding-composition-algebra-title">From selected vectors to a location</h4>
      </header>
      {projection.components.length > 0 ? (
        <div className="embedding-composition__algebra-steps" role="group" aria-label="Vector composition calculation">
          <section className="embedding-composition__algebra-step" data-stage="input-vectors">
            <h5>Input vectors</h5>
            <div className="embedding-composition__algebra-lines">
              {projection.components.map(({ label, vector }, index) => (
                <code className="embedding-composition__assignment" key={`${label}-${index}`}>
                  {projection.method === "direction" && index > 0 ? "Δ" : "v"}({label}) = {formatVector(vector)}
                </code>
              ))}
            </div>
          </section>
          <section className="embedding-composition__algebra-step" data-stage="compose">
            <h5>Compose</h5>
            <div className="embedding-composition__algebra-lines">
              <code className="embedding-composition__assignment">{operation}</code>
              <code className="embedding-composition__assignment embedding-composition__assignment--total">
                v* = {formatVector(projection.location)}
              </code>
            </div>
          </section>
          <section className="embedding-composition__algebra-step embedding-composition__algebra-step--result" data-stage="result">
            <div className="embedding-composition__algebra-step-heading">
              <h5>Result</h5>
              <span>{resultLabel}</span>
            </div>
            <div className="embedding-composition__algebra-lines">
              <code className="embedding-composition__assignment">{projection.result ?? "unnamed point"}</code>
              {projection.resultKind === "nearest" ? (
                <code className="embedding-composition__assignment">arg min₍w₎ ‖v(w) − v*‖₂</code>
              ) : null}
            </div>
          </section>
        </div>
      ) : (
        <p className="embedding-composition__algebra-empty">Choose a term to compose its projected vector.</p>
      )}
    </section>
  );
}
