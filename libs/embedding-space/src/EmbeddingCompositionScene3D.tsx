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
  MathUtils,
  Quaternion,
  SRGBColorSpace,
  Spherical,
  Vector3,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  type CompositionSceneControls,
  type HybridRecipe,
  type MythicalWord,
  type SemanticWord,
} from "./compositionModel";
import {
  SEMANTIC_NETWORK_ANIMAL_WORDS,
  SEMANTIC_NETWORK_CONTEXT_WORDS,
  SEMANTIC_NETWORK_EDGES,
  SEMANTIC_NETWORK_MYTHICAL_WORDS,
  SEMANTIC_NETWORK_NODES,
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

const AXIS_LABELS = [
  { label: "ordinary", position: [-2.05, -1.48, -1.15] },
  { label: "royal", position: [2.02, -1.48, -1.15] },
  { label: "young", position: [-1.88, -1.48, 1.15] },
  { label: "adult", position: [-1.88, 1.5, 1.15] },
  { label: "masculine-coded", position: [1.5, -1.48, -1.62] },
  { label: "role-neutral", position: [1.5, -1.48, 0] },
  { label: "feminine-coded", position: [1.5, -1.48, 1.62] },
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

const NETWORK_POSITIONS = new Map(
  SEMANTIC_NETWORK_NODES.map(({ word, position }) => [word, position]),
);

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

function SceneControls({ onReady, onUnavailable }: {
  onReady: (controls: CompositionSceneControls | null) => void;
  onUnavailable: () => void;
}) {
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

    const reset = () => {
      if (size.width / size.height < 1.25) camera.position.set(7, 4.7, 8);
      else camera.position.set(5.4, 3.5, 6.2);
      controls.target.set(-0.15, -0.1, 0);
      controls.update();
      invalidate();
    };
    const rotate = (horizontal: number, vertical: number) => {
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new Spherical().setFromVector3(offset);
      spherical.theta += horizontal;
      spherical.phi = MathUtils.clamp(spherical.phi + vertical, 0.22, Math.PI - 0.22);
      camera.position.setFromSpherical(spherical).add(controls.target);
      camera.lookAt(controls.target);
      controls.update();
      invalidate();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };

    gl.domElement.addEventListener("webglcontextlost", contextLost);
    onReady({ rotate, reset });
    reset();
    return () => {
      onReady(null);
      gl.domElement.removeEventListener("webglcontextlost", contextLost);
      controls.removeEventListener("change", changed);
      controls.dispose();
    };
  }, [camera, gl, invalidate, onReady, onUnavailable, size.height, size.width]);

  return null;
}

export function EmbeddingCompositionScene3D({
  path,
  source,
  result,
  blend,
  onControlsReady,
  onUnavailable,
}: {
  path: readonly SemanticWord[];
  source: SemanticWord;
  result: SemanticWord | MythicalWord;
  blend: HybridRecipe | null;
  onControlsReady: (controls: CompositionSceneControls | null) => void;
  onUnavailable: () => void;
}) {
  const highlightedWords = useMemo(
    () => new Set<SemanticNetworkWord>([
      ...path,
      ...(blend ? [blend.base, blend.animal, blend.result] : []),
    ]),
    [blend, path],
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
          {(["status", "age", "category", "counterpart", "blend"] as const).map((relation) => (
            <NetworkEdges key={relation} edges={SEMANTIC_NETWORK_EDGES} relation={relation} />
          ))}
          {AXIS_LABELS.map(({ label, position }) => (
            <LabelSprite key={label} label={label} position={position} scale={0.72} />
          ))}
          {SEMANTIC_NETWORK_NODES.map((node) => (
            <WordMarker
              key={node.word}
              node={node}
              isPath={highlightedWords.has(node.word)}
              isSource={node.word === source}
              isResult={node.word === result}
            />
          ))}
          {path.slice(1).map((word, index) => (
            <MovementSegment key={`${path[index]}-${word}`} from={path[index] as SemanticWord} to={word} />
          ))}
          {blend ? (
            <>
              <MovementSegment from={blend.base} to={blend.result} />
              <MovementSegment from={blend.animal} to={blend.result} />
            </>
          ) : null}
          <SceneControls onReady={onControlsReady} onUnavailable={onUnavailable} />
        </Canvas>
      </div>
      <div
        className="embedding-composition__network-key"
        role="group"
        aria-label={`${SEMANTIC_NETWORK_NODES.length} terms and ${SEMANTIC_NETWORK_EDGES.length} semantic links`}
      >
        <p><strong>{SEMANTIC_NETWORK_NODES.length}</strong> terms · <strong>{SEMANTIC_NETWORK_EDGES.length}</strong> semantic links</p>
        <ul aria-label="Semantic link types">
          <li data-relation="status">status</li>
          <li data-relation="age">age</li>
          <li data-relation="category">category</li>
          <li data-relation="counterpart">counterpart</li>
          <li data-relation="blend">authored blend</li>
        </ul>
        <p className="embedding-composition__network-axes">Role-region axes: x status · y age · z role convention. Other clusters use proximity and typed links, not those axes.</p>
        <p className="embedding-composition__network-vocabulary">Context terms: {SEMANTIC_NETWORK_CONTEXT_WORDS.join(", ")}</p>
        <p className="embedding-composition__network-vocabulary">Animals: {SEMANTIC_NETWORK_ANIMAL_WORDS.join(", ")} · Mythical creatures: {SEMANTIC_NETWORK_MYTHICAL_WORDS.join(", ")}</p>
      </div>
    </div>
  );
}
