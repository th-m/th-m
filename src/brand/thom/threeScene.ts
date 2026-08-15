import {
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { animate } from "motion";
import { brandData } from "./brandData";
import {
  BRAND_COLORS,
  displayStrokeWorldWidth,
  H_ANIMATION,
  H_COLUMN_MATERIAL,
  H_ISOLATED_VIEW,
  H_MATERIAL,
  H_PHI_STRATEGIES,
  H_PHI_STRATEGY,
  H_PILLAR_CENTERS,
  H_PILLAR_SHAPE,
  hStrokeWorldWidth,
  hAnimationWeights,
  M_ANIMATION,
  M_FINAL_MATERIAL,
  O_ANIMATION,
  O_DISPLAY_MATERIAL,
  PI_ANIMATION,
  PI_MATERIAL,
  fourierComponentBezier,
  fourierPartialBezier,
  sampleBezierChain,
  samplePathOutline,
  type ChordNetwork,
  type CubicBezierSegment,
  type FilledPath,
  type Point,
} from "./geometry";

export type ThomGlyph = "t" | "h" | "o" | "m";
type ViewMode = "logo" | ThomGlyph;
type PlaybackControl = { stop: () => void; then: (callback: () => void) => Promise<void> };

type LineRecord = {
  line: Line2;
  geometry: LineGeometry;
  material: LineMaterial;
  baseOpacity: number;
};

type LineStack = { halo: LineRecord; middle: LineRecord; core: LineRecord };
type HStrokeRecord = {
  mesh: Mesh;
  geometry: BufferGeometry;
  material: MeshBasicMaterial;
  baseOpacity: number;
  worldWidth: number;
};
type HStrokeStack = { halo: HStrokeRecord; middle: HStrokeRecord; core: HStrokeRecord };
type NetworkStage = "anchor" | "chord" | "intersection" | "highlight";
type NetworkMaterial = { material: MeshBasicMaterial | LineMaterial; baseOpacity: number; stage: NetworkStage; order: number };
type MStrokeRecord = {
  mesh: Mesh;
  geometry: BufferGeometry;
  material: MeshBasicMaterial;
  baseOpacity: number;
  segmentCount: number;
  capIndexCount: number;
};
type MStrokeStack = { glow: MStrokeRecord; halo: MStrokeRecord; middle: MStrokeRecord; core: MStrokeRecord };
type MPartialLine = { core: MStrokeRecord; halo: MStrokeRecord | null };
type HLineMaterial = (typeof H_MATERIAL)[keyof typeof H_MATERIAL];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const hPhiTexture = new TextureLoader().loadAsync("/brand/h-phi.png").then((texture) => {
  texture.colorSpace = SRGBColorSpace;
  return texture;
});
const M_WEBGL_FILTER_GLOW = { width: 23, opacity: 0.1 } as const;
const M_LOCAL_SCALE_X = 1.22;
const toThreePositions = (points: Point[]) => points.flatMap((point) => [point.x, 120 - point.y, 0]);

function pointMaterial(color: string, opacity = 1) {
  return new MeshBasicMaterial({
    color: new Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    side: DoubleSide,
  });
}

function phiHaloMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uColor: { value: new Color(BRAND_COLORS.gold) },
      uOpacity: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        float radius = length((vUv - 0.5) * 2.0);
        float halo = 1.0 - smoothstep(0.0, 1.0, radius);
        gl_FragColor = vec4(uColor, halo * uOpacity);
      }
    `,
  });
}

function metalMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uOpacity: { value: 1 },
      uProgress: { value: 1 },
      uShadow: { value: new Color(BRAND_COLORS.shadow) },
      uGold: { value: new Color(BRAND_COLORS.gold) },
      uIvory: { value: new Color(BRAND_COLORS.ivory) },
      uHighlight: { value: new Color(BRAND_COLORS.highlight) },
    },
    vertexShader: `
      varying vec2 vLocal;
      void main() {
        vLocal = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vLocal;
      uniform float uOpacity;
      uniform float uProgress;
      uniform vec3 uShadow;
      uniform vec3 uGold;
      uniform vec3 uIvory;
      uniform vec3 uHighlight;
      void main() {
        float diagonal = clamp((vLocal.x / 100.0) * .42 + (vLocal.y / 120.0) * .58, 0.0, 1.0);
        vec3 color = mix(uShadow, uGold, smoothstep(0.0, .3, diagonal));
        color = mix(color, uHighlight, smoothstep(.25, .5, diagonal));
        color = mix(color, uIvory, smoothstep(.5, .72, diagonal));
        color = mix(color, uShadow, smoothstep(.78, 1.0, diagonal));
        float revealCoordinate = clamp((vLocal.x / 100.0) * .2 + (vLocal.y / 120.0) * .8, 0.0, 1.0);
        float reveal = smoothstep(revealCoordinate - .18, revealCoordinate + .02, uProgress);
        gl_FragColor = vec4(color, uOpacity * reveal);
      }
    `,
  });
}

function piMetalMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uOpacity: { value: 1 },
      uProgress: { value: 1 },
      uShadow: { value: new Color(PI_MATERIAL.shadow) },
      uGold: { value: new Color(PI_MATERIAL.gold) },
      uIvory: { value: new Color(PI_MATERIAL.ivory) },
      uHighlight: { value: new Color(PI_MATERIAL.highlight) },
    },
    vertexShader: `
      varying vec2 vLocal;
      void main() {
        vLocal = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vLocal;
      uniform float uOpacity;
      uniform float uProgress;
      uniform vec3 uShadow;
      uniform vec3 uGold;
      uniform vec3 uIvory;
      uniform vec3 uHighlight;
      void main() {
        float svgY = 120.0 - vLocal.y;
        float diagonal = clamp((vLocal.x / 100.0 + svgY / 120.0) * .5, 0.0, 1.0);
        vec3 color;
        if (diagonal < .28) color = mix(uShadow, uGold, diagonal / .28);
        else if (diagonal < .49) color = mix(uGold, uHighlight, (diagonal - .28) / .21);
        else if (diagonal < .7) color = mix(uHighlight, uIvory, (diagonal - .49) / .21);
        else color = mix(uIvory, uShadow, (diagonal - .7) / .3);
        float revealCoordinate = clamp((vLocal.x / 100.0) * .2 + (svgY / 120.0) * .8, 0.0, 1.0);
        float reveal = smoothstep(revealCoordinate - .18, revealCoordinate + .02, uProgress);
        gl_FragColor = vec4(color, uOpacity * reveal);
      }
    `,
  });
}

function hMetalMaterial(center: number) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uOpacity: { value: 1 },
      uProgress: { value: 1 },
      uCenter: { value: center },
      uEdge: { value: new Color(H_COLUMN_MATERIAL.edge) },
      uBody: { value: new Color(H_COLUMN_MATERIAL.body) },
      uHighlight: { value: new Color(H_COLUMN_MATERIAL.highlight) },
    },
    vertexShader: `
      varying vec2 vLocal;
      void main() {
        vLocal = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vLocal;
      uniform float uOpacity;
      uniform float uProgress;
      uniform float uCenter;
      uniform vec3 uEdge;
      uniform vec3 uBody;
      uniform vec3 uHighlight;
      void main() {
        float across = clamp((vLocal.x - uCenter + ${H_PILLAR_SHAPE.serifHalfWidth.toFixed(1)}) / ${(H_PILLAR_SHAPE.serifHalfWidth * 2).toFixed(1)}, 0.0, 1.0);
        float centerLight = 1.0 - smoothstep(0.0, 0.5, abs(across - 0.5));
        vec3 color = mix(uEdge, uBody, smoothstep(0.0, 0.72, centerLight));
        color = mix(color, uHighlight, centerLight * ${H_COLUMN_MATERIAL.highlightMix.toFixed(2)});
        float revealCoordinate = clamp((vLocal.y - 16.0) / 89.0, 0.0, 1.0);
        float reveal = smoothstep(revealCoordinate - .18, revealCoordinate + .02, uProgress);
        gl_FragColor = vec4(color, uOpacity * reveal);
      }
    `,
  });
}

function shapeFromPath(path: FilledPath): Shape {
  const shape = new Shape();
  path.commands.forEach((command) => {
    if (command.type === "M") shape.moveTo(command.x, 120 - command.y);
    else if (command.type === "L") shape.lineTo(command.x, 120 - command.y);
    else if (command.type === "C") shape.bezierCurveTo(command.x1, 120 - command.y1, command.x2, 120 - command.y2, command.x, 120 - command.y);
    else shape.closePath();
  });
  return shape;
}

function shapeMesh(path: FilledPath, fill: ShaderMaterial): Mesh {
  return new Mesh(new ShapeGeometry(shapeFromPath(path), 18), fill);
}

function createLine(points: Point[], color: string, width: number, opacity = 1, dashed = false, vertexColors?: Color[], worldUnits = false): LineRecord {
  const geometry = new LineGeometry();
  geometry.setPositions(toThreePositions(points));
  if (vertexColors) geometry.setColors(vertexColors.flatMap((vertexColor) => vertexColor.toArray()));
  const lineMaterial = new LineMaterial({
    color: new Color(color),
    linewidth: worldUnits ? width : displayStrokeWorldWidth(width),
    transparent: true,
    opacity,
    depthWrite: false,
    alphaToCoverage: false,
    worldUnits: true,
    dashed,
    dashSize: dashed ? 4 : 1,
    gapSize: dashed ? 3 : 1,
    vertexColors: Boolean(vertexColors),
  });
  const line = new Line2(geometry, lineMaterial);
  line.computeLineDistances();
  return { line, geometry, material: lineMaterial, baseOpacity: opacity };
}

function createLineStack(points: Point[], width = 1.2): LineStack {
  const halo = createLine(points, BRAND_COLORS.gold, width * 4.8, 0.09);
  const middle = createLine(points, BRAND_COLORS.gold, width * 2, 0.34);
  const core = createLine(points, BRAND_COLORS.highlight, width, 1);
  halo.line.position.z = -0.25;
  middle.line.position.z = 0;
  core.line.position.z = 0.25;
  return { halo, middle, core };
}

function hStrokeGeometry(points: Point[], worldWidth: number, localScaleX: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  const halfWidth = worldWidth / 2;
  points.forEach((point, index) => {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const tangentX = (next.x - previous.x) * localScaleX;
    const tangentY = previous.y - next.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    positions.push(
      point.x + normalX * halfWidth / localScaleX, 120 - point.y + normalY * halfWidth, 0,
      point.x - normalX * halfWidth / localScaleX, 120 - point.y - normalY * halfWidth, 0,
    );
    if (index < points.length - 1) {
      const offset = index * 2;
      indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
    }
  });
  for (const endpoint of [points[0], points.at(-1)!]) {
    const centerIndex = positions.length / 3;
    positions.push(endpoint.x, 120 - endpoint.y, 0);
    const capSteps = 12;
    for (let step = 0; step <= capSteps; step += 1) {
      const angle = Math.PI * 2 * step / capSteps;
      positions.push(endpoint.x + Math.cos(angle) * halfWidth / localScaleX, 120 - endpoint.y + Math.sin(angle) * halfWidth, 0);
    }
    for (let step = 0; step < capSteps; step += 1) indices.push(centerIndex, centerIndex + step + 1, centerIndex + step + 2);
  }
  return { positions, indices };
}

function createHStroke(points: Point[], color: string, referenceWidth: number, opacity: number): HStrokeRecord {
  const worldWidth = hStrokeWorldWidth(referenceWidth);
  const data = hStrokeGeometry(points, worldWidth, 1);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(data.positions, 3));
  geometry.setIndex(data.indices);
  const material = new MeshBasicMaterial({
    color: new Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  return { mesh, geometry, material, baseOpacity: opacity, worldWidth };
}

function createOStroke(points: Point[], color: string, referenceWidth: number, opacity: number): HStrokeRecord {
  const worldWidth = displayStrokeWorldWidth(referenceWidth);
  const data = hStrokeGeometry(points, worldWidth, 1);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(data.positions, 3));
  geometry.setIndex(data.indices);
  const material = new MeshBasicMaterial({
    color: new Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  return { mesh, geometry, material, baseOpacity: opacity, worldWidth };
}

function createHStrokeStack(points: Point[], material: HLineMaterial, coreColor: string = BRAND_COLORS.highlight): HStrokeStack {
  const halo = createHStroke(points, BRAND_COLORS.gold, material.haloWidth, material.haloOpacity);
  const middle = createHStroke(points, BRAND_COLORS.gold, material.middleWidth, material.middleOpacity);
  const core = createHStroke(points, coreColor, material.coreWidth, material.coreOpacity);
  halo.mesh.position.z = -0.25;
  middle.mesh.position.z = 0;
  core.mesh.position.z = 0.25;
  return { halo, middle, core };
}

function setHStackOpacity(stack: HStrokeStack, opacity: number) {
  Object.values(stack).forEach((record) => {
    record.material.opacity = record.baseOpacity * opacity;
    record.mesh.visible = record.material.opacity > 0.001;
  });
}

function addHStack(group: Group, stack: HStrokeStack) {
  Object.values(stack).forEach((record) => group.add(record.mesh));
}

function createMStroke(chain: CubicBezierSegment[], color: string, width: number, opacity: number, vertexColors?: Color[]): MStrokeRecord {
  const points = sampleBezierChain(chain, 4);
  const positions: number[] = [];
  const colors: number[] = [];
  const stripIndices: number[] = [];
  points.forEach((point, index) => {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const tangentX = (next.x - previous.x) * M_LOCAL_SCALE_X;
    const tangentY = previous.y - next.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const halfWidth = displayStrokeWorldWidth(width) / 2;
    const y = 120 - point.y;
    positions.push(
      point.x + normalX * halfWidth / M_LOCAL_SCALE_X, y + normalY * halfWidth, 0,
      point.x - normalX * halfWidth / M_LOCAL_SCALE_X, y - normalY * halfWidth, 0,
    );
    if (vertexColors) {
      const vertexColor = vertexColors[index];
      colors.push(...vertexColor.toArray(), ...vertexColor.toArray());
    }
    if (index < points.length - 1) {
      const offset = index * 2;
      stripIndices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
    }
  });
  const addRoundCap = (pointIndex: number, outward: number) => {
    const center = points[pointIndex];
    const neighbor = points[pointIndex === 0 ? 1 : pointIndex - 1];
    const tangentX = (pointIndex === 0 ? neighbor.x - center.x : center.x - neighbor.x) * M_LOCAL_SCALE_X;
    const tangentY = (pointIndex === 0 ? center.y - neighbor.y : neighbor.y - center.y);
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const tx = tangentX / tangentLength;
    const ty = tangentY / tangentLength;
    const stripOffset = pointIndex * 6;
    const sideX = (positions[stripOffset] - center.x) * M_LOCAL_SCALE_X;
    const sideY = positions[stripOffset + 1] - (120 - center.y);
    const vertexOffset = positions.length / 3;
    positions.push(center.x, 120 - center.y, 0);
    for (let step = 0; step <= 8; step += 1) {
      const angle = Math.PI * step / 8;
      positions.push(
        center.x + (sideX * Math.cos(angle) + tx * outward * Math.sin(angle) * Math.hypot(sideX, sideY)) / M_LOCAL_SCALE_X,
        120 - center.y + sideY * Math.cos(angle) + ty * outward * Math.sin(angle) * Math.hypot(sideX, sideY),
        0,
      );
    }
    if (vertexColors) {
      const endpointColor = vertexColors[pointIndex];
      for (let index = 0; index < 10; index += 1) colors.push(...endpointColor.toArray());
    }
    return Array.from({ length: 8 }, (_, index) => [vertexOffset, vertexOffset + index + 1, vertexOffset + index + 2]).flat();
  };
  const startCapIndices = addRoundCap(0, -1);
  const endCapIndices = addRoundCap(points.length - 1, 1);
  const indices = [...startCapIndices, ...stripIndices, ...endCapIndices];
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  if (vertexColors) geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  const material = new MeshBasicMaterial({
    color: vertexColors ? new Color(0xffffff) : new Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    side: DoubleSide,
    vertexColors: Boolean(vertexColors),
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  return { mesh, geometry, material, baseOpacity: opacity, segmentCount: points.length - 1, capIndexCount: startCapIndices.length };
}

function createMPartialStroke(chain: CubicBezierSegment[], width: number, opacity: number): MStrokeRecord {
  const shadow = new Color(BRAND_COLORS.shadow);
  const gold = new Color(BRAND_COLORS.gold);
  const colors = sampleBezierChain(chain, 4).map((point) => {
    const progress = clamp((point.x - 2) / 96);
    const edge = Math.min(progress, 1 - progress);
    return shadow.clone().lerp(gold, clamp(edge / 0.14));
  });
  return createMStroke(chain, BRAND_COLORS.gold, width, opacity, colors);
}

function createMFinalStack(chain: CubicBezierSegment[]): MStrokeStack {
  const points = sampleBezierChain(chain, 4);
  const srgb = (hex: string) => {
    const value = Number.parseInt(hex.slice(1), 16);
    return { r: ((value >> 16) & 255) / 255, g: ((value >> 8) & 255) / 255, b: (value & 255) / 255 };
  };
  const shadow = srgb(BRAND_COLORS.shadow);
  const gold = srgb(BRAND_COLORS.gold);
  const highlight = srgb(BRAND_COLORS.highlight);
  const mixSrgb = (from: typeof shadow, to: typeof shadow, progress: number) => new Color().setRGB(
    from.r + (to.r - from.r) * progress,
    from.g + (to.g - from.g) * progress,
    from.b + (to.b - from.b) * progress,
    SRGBColorSpace,
  );
  const colors = points.map((point) => {
    const progress = clamp((point.x - 2) / 96);
    const edge = Math.min(progress, 1 - progress);
    if (edge <= 0.08) return mixSrgb(shadow, gold, edge / 0.08);
    if (edge <= 0.14) return mixSrgb(gold, highlight, (edge - 0.08) / 0.06);
    return mixSrgb(highlight, highlight, 1);
  });
  const glow = createMStroke(chain, BRAND_COLORS.gold, M_WEBGL_FILTER_GLOW.width, M_WEBGL_FILTER_GLOW.opacity);
  const halo = createMStroke(chain, BRAND_COLORS.gold, M_FINAL_MATERIAL.halo.width, M_FINAL_MATERIAL.halo.opacity);
  const middle = createMStroke(chain, BRAND_COLORS.gold, M_FINAL_MATERIAL.middle.width, M_FINAL_MATERIAL.middle.opacity);
  const core = createMStroke(chain, BRAND_COLORS.highlight, M_FINAL_MATERIAL.core.width, M_FINAL_MATERIAL.core.opacity, colors);
  glow.mesh.position.z = -0.5;
  halo.mesh.position.z = -0.25;
  middle.mesh.position.z = 0;
  core.mesh.position.z = 0.25;
  return { glow, halo, middle, core };
}

function setMStrokeProgress(record: MStrokeRecord, progress: number) {
  const visibleSegments = Math.floor(record.segmentCount * clamp(progress));
  const indexCount = visibleSegments > 0
    ? record.capIndexCount + visibleSegments * 6 + (visibleSegments === record.segmentCount ? record.capIndexCount : 0)
    : 0;
  record.geometry.setDrawRange(0, indexCount);
  record.mesh.visible = visibleSegments > 0 && record.material.opacity > 0.001;
}

function setMStrokeOpacity(record: MStrokeRecord, opacity: number) {
  record.material.opacity = record.baseOpacity * clamp(opacity);
  record.mesh.visible = record.geometry.drawRange.count > 0 && record.material.opacity > 0.001;
}

function setMStackProgress(stack: MStrokeStack, progress: number) {
  Object.values(stack).forEach((record) => setMStrokeProgress(record, progress));
}

function setMStackOpacity(stack: MStrokeStack, opacity: number) {
  Object.values(stack).forEach((record) => setMStrokeOpacity(record, opacity));
}

function addMStack(group: Group, stack: MStrokeStack) {
  Object.values(stack).forEach((record) => group.add(record.mesh));
}

function setStackPoints(stack: LineStack, points: Point[]) {
  const positions = toThreePositions(points);
  Object.values(stack).forEach((record) => record.geometry.setPositions(positions));
}

function setStackOpacity(stack: LineStack, opacity: number) {
  Object.values(stack).forEach((record) => {
    record.material.opacity = record.baseOpacity * opacity;
    record.line.visible = record.material.opacity > 0.001;
  });
}

function addStack(group: Group, stack: LineStack, records: LineRecord[]) {
  Object.values(stack).forEach((record) => {
    records.push(record);
    group.add(record.line);
  });
}

function createPoint(point: Point, color: string, radius: number, opacity = 1): Mesh {
  const mesh = new Mesh(new CircleGeometry(radius, 24), pointMaterial(color, opacity));
  mesh.position.set(point.x, 120 - point.y, 0.5);
  return mesh;
}

export class ThomSceneController {
  readonly renderer: WebGLRenderer;
  readonly scene = new Scene();
  readonly camera = new OrthographicCamera(0, 416, 120, 0, -30, 30);
  private canvas: HTMLCanvasElement;
  private view: ViewMode;
  private visible = true;
  private size = { width: 1, height: 1 };
  private animationGeneration = 0;
  private controls: PlaybackControl[] = [];
  private lineRecords: LineRecord[] = [];
  private tGroup = new Group();
  private piMaterials: ShaderMaterial[] = [];
  private piOutlinePoints = samplePathOutline(brandData.pi.display);
  private piRim!: LineStack;
  private hMaterials: ShaderMaterial[] = [];
  private hGroup = new Group();
  private hPillars = new Group();
  private hA!: HStrokeStack;
  private hB!: HStrokeStack;
  private hTicks: HStrokeStack[] = [];
  private hBrace!: HStrokeStack;
  private hPhi!: Mesh;
  private hPhiHalo!: Mesh;
  private hPhiMaterial = new MeshBasicMaterial({ color: new Color(BRAND_COLORS.highlight), transparent: true, opacity: 0, depthWrite: false, side: DoubleSide });
  private hPhiHaloMaterial = phiHaloMaterial();
  private assetReady: Promise<void> = Promise.resolve();
  private disposed = false;
  private piGuide!: LineRecord;
  private piTracer!: Mesh;
  private oGroup = new Group();
  private oCircle!: HStrokeStack;
  private oCanonicalMaterials: NetworkMaterial[] = [];
  private oAlternateMaterials: NetworkMaterial[] = [];
  private mFinal!: MStrokeStack;
  private mComponents: MStrokeRecord[] = [];
  private mPartials: MPartialLine[] = [];
  private state = { pi: 1, piGuide: 0, piOrbit: 0, h: 1, o: 1, oAlt: 0, m: 1, mSeparate: 0 };

  constructor(canvas: HTMLCanvasElement, view: ViewMode = "logo") {
    this.canvas = canvas;
    this.view = view;
    this.canvas.dataset.glyphView = view;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 10;
    this.buildScene();
    if (this.view === "t") {
      this.tGroup.position.x = 0;
      this.tGroup.scale.x = 1;
    } else if (this.view === "h") this.hGroup.scale.x = H_ISOLATED_VIEW.scaleX;
    else if (this.view === "o") this.oGroup.scale.x = 1;
    this.resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
    this.applyState();
    this.renderOnce();
    this.canvas.dataset.renderLoop = "stopped";
  }

  private createGlyphGroup(glyph: ThomGlyph) {
    const placement = brandData.placements[glyph];
    const group = new Group();
    group.name = glyph;
    group.position.x = placement.x;
    group.scale.x = placement.scaleX;
    this.scene.add(group);
    return group;
  }

  private buildScene() {
    this.tGroup = this.createGlyphGroup("t");
    const piMaterial = piMetalMaterial();
    this.piMaterials.push(piMaterial);
    this.tGroup.add(shapeMesh(brandData.pi.display, piMaterial));
    this.piRim = {
      halo: createLine(this.piOutlinePoints, PI_MATERIAL.gold, 3.1, 0.07),
      middle: createLine(this.piOutlinePoints, PI_MATERIAL.gold, 1.55, 0.16),
      core: createLine(this.piOutlinePoints, PI_MATERIAL.edge, 0.82, 0.88),
    };
    addStack(this.tGroup, this.piRim, this.lineRecords);
    this.piGuide = createLine(this.piOutlinePoints.slice(0, 2), PI_MATERIAL.edge, 1.05, 0);
    this.piGuide.line.position.z = 0.8;
    this.tGroup.add(this.piGuide.line);
    this.lineRecords.push(this.piGuide);
    this.piTracer = createPoint(this.piOutlinePoints[0], PI_MATERIAL.highlight, 1.45, 0);
    this.tGroup.add(this.piTracer);

    this.hGroup = this.createGlyphGroup("h");
    brandData.h.paths.forEach((path, index) => {
      const fill = hMetalMaterial(H_PILLAR_CENTERS[index]);
      this.hMaterials.push(fill);
      this.hPillars.add(shapeMesh(path, fill));
    });
    this.hGroup.add(this.hPillars);
    this.hA = createHStrokeStack(brandData.h.proportion.a, H_MATERIAL.a);
    this.hB = createHStrokeStack(brandData.h.proportion.b, H_MATERIAL.b, BRAND_COLORS.gold);
    this.hTicks = brandData.h.proportion.ticks.map((tick) => createHStrokeStack(tick, H_MATERIAL.tick, BRAND_COLORS.gold));
    this.hBrace = createHStrokeStack(brandData.h.proportion.brace, H_MATERIAL.brace, BRAND_COLORS.gold);
    addHStack(this.hGroup, this.hA);
    addHStack(this.hGroup, this.hB);
    this.hTicks.forEach((tick) => addHStack(this.hGroup, tick));
    addHStack(this.hGroup, this.hBrace);
    const phiStrategy = H_PHI_STRATEGIES[H_PHI_STRATEGY];
    this.hPhiHalo = new Mesh(new PlaneGeometry(phiStrategy.halo.width, phiStrategy.halo.height), this.hPhiHaloMaterial);
    this.hPhiHalo.position.set(phiStrategy.plane.centerX, 120 - phiStrategy.plane.centerY, 1.1);
    this.hGroup.add(this.hPhiHalo);
    this.hPhi = new Mesh(new PlaneGeometry(phiStrategy.plane.width, phiStrategy.plane.height), this.hPhiMaterial);
    this.hPhi.position.set(phiStrategy.plane.centerX, 120 - phiStrategy.plane.centerY, 1.2);
    this.hGroup.add(this.hPhi);
    this.assetReady = hPhiTexture.then((texture) => {
      if (this.disposed) return;
      this.hPhiMaterial.map = texture;
      this.hPhiMaterial.needsUpdate = true;
      this.renderOnce();
    });

    this.oGroup = this.createGlyphGroup("o");
    this.oCircle = {
      halo: createOStroke(brandData.o.circle, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.circle.haloWidth, O_DISPLAY_MATERIAL.circle.haloOpacity),
      middle: createOStroke(brandData.o.circle, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.circle.middleWidth, O_DISPLAY_MATERIAL.circle.middleOpacity),
      core: createOStroke(brandData.o.circle, BRAND_COLORS.highlight, O_DISPLAY_MATERIAL.circle.coreWidth, O_DISPLAY_MATERIAL.circle.coreOpacity),
    };
    this.oCircle.halo.mesh.position.z = -0.25;
    this.oCircle.middle.mesh.position.z = 0;
    this.oCircle.core.mesh.position.z = 0.25;
    addHStack(this.oGroup, this.oCircle);
    this.addNetwork(this.oGroup, brandData.o.canonical, this.oCanonicalMaterials, 0);
    this.addNetwork(this.oGroup, brandData.o.alternates[0], this.oAlternateMaterials, 1.5);

    const mGroup = this.createGlyphGroup("m");
    brandData.m.components.forEach((_points, index) => {
      const record = createMStroke(fourierComponentBezier(brandData.m, index), BRAND_COLORS.gold, brandData.m.componentWidths[index], 0.38);
      this.mComponents.push(record);
      mGroup.add(record.mesh);
    });
    brandData.m.restingLayers.forEach((layer) => {
      const chain = fourierPartialBezier(brandData.m, layer.partialIndex, 64, layer.amplitudeScale);
      const core = createMPartialStroke(chain, layer.width, layer.opacity);
      const halo = layer.haloOpacity > 0 ? createMStroke(chain, BRAND_COLORS.gold, layer.haloWidth, layer.haloOpacity) : null;
      this.mPartials.push({ core, halo });
      mGroup.add(core.mesh);
      if (halo) {
        halo.mesh.position.z = -0.2;
        mGroup.add(halo.mesh);
      }
    });
    this.mFinal = createMFinalStack(fourierPartialBezier(brandData.m, brandData.m.displayHarmonicCount - 1));
    addMStack(mGroup, this.mFinal);
  }

  private pushNetworkMaterial(material: MeshBasicMaterial | LineMaterial, baseOpacity: number, stage: NetworkStage, order: number, collection: NetworkMaterial[]) {
    material.opacity = baseOpacity;
    collection.push({ material, baseOpacity, stage, order });
  }

  private addNetwork(group: Group, network: ChordNetwork, materials: NetworkMaterial[], z: number) {
    network.chords.forEach((chord, index) => {
      const start = network.anchors[chord.a];
      const end = network.anchors[chord.b];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      const inset = 1.7;
      const points = [
        { x: start.x + (dx / length) * inset, y: start.y + (dy / length) * inset },
        { x: end.x - (dx / length) * inset, y: end.y - (dy / length) * inset },
      ];
      const weight = chord.weight ?? 0.55;
      const haloOpacity = O_DISPLAY_MATERIAL.chord.haloOpacity;
      const coreOpacity = 0.38 + weight * 0.46;
      const halo = createOStroke(points, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.chord.haloWidth * (0.7 + weight * 0.6), haloOpacity);
      const core = createOStroke(points, BRAND_COLORS.gold, 0.5 + weight * 0.58, coreOpacity);
      halo.mesh.position.z = z;
      core.mesh.position.z = z + 0.15;
      const order = index / Math.max(1, network.chords.length - 1);
      this.pushNetworkMaterial(halo.material, haloOpacity, "chord", order, materials);
      this.pushNetworkMaterial(core.material, coreOpacity, "chord", order, materials);
      group.add(halo.mesh, core.mesh);
    });
    network.anchors.forEach((point, index) => {
      const halo = createPoint(point, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.anchor.haloRadius, O_DISPLAY_MATERIAL.anchor.haloOpacity);
      const core = createPoint(point, BRAND_COLORS.highlight, O_DISPLAY_MATERIAL.anchor.coreRadius, O_DISPLAY_MATERIAL.anchor.coreOpacity);
      halo.position.z = z + 0.2;
      core.position.z = z + 0.4;
      const order = index / Math.max(1, network.anchors.length - 1);
      this.pushNetworkMaterial(halo.material as MeshBasicMaterial, O_DISPLAY_MATERIAL.anchor.haloOpacity, "anchor", order, materials);
      this.pushNetworkMaterial(core.material as MeshBasicMaterial, O_DISPLAY_MATERIAL.anchor.coreOpacity, "anchor", order, materials);
      group.add(halo, core);
    });
    network.intersections.forEach((point, index) => {
      const mesh = createPoint(point, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.intersection.radius, O_DISPLAY_MATERIAL.intersection.opacity);
      mesh.position.z = z + 0.45;
      this.pushNetworkMaterial(mesh.material as MeshBasicMaterial, O_DISPLAY_MATERIAL.intersection.opacity, "intersection", index / Math.max(1, network.intersections.length - 1), materials);
      group.add(mesh);
    });
    network.highlights.forEach((point, index) => {
      const halo = createPoint(point, BRAND_COLORS.gold, O_DISPLAY_MATERIAL.highlight.haloRadius, O_DISPLAY_MATERIAL.highlight.haloOpacity);
      const core = createPoint(point, BRAND_COLORS.highlight, O_DISPLAY_MATERIAL.highlight.coreRadius, O_DISPLAY_MATERIAL.highlight.coreOpacity);
      halo.position.z = z + 0.55;
      core.position.z = z + 0.75;
      const order = index / Math.max(1, network.highlights.length - 1);
      this.pushNetworkMaterial(halo.material as MeshBasicMaterial, O_DISPLAY_MATERIAL.highlight.haloOpacity, "highlight", order, materials);
      this.pushNetworkMaterial(core.material as MeshBasicMaterial, O_DISPLAY_MATERIAL.highlight.coreOpacity, "highlight", order, materials);
      group.add(halo, core);
    });
  }

  private applyState() {
    const s = this.state;
    this.piMaterials.forEach((fill) => {
      fill.uniforms.uOpacity.value = 0.06 + s.pi * 0.94;
      fill.uniforms.uProgress.value = clamp(s.pi);
    });
    setStackOpacity(this.piRim, clamp(s.pi * 1.4));
    const traceProgress = clamp(s.piOrbit);
    const traceIndex = Math.min(this.piOutlinePoints.length - 1, Math.floor(traceProgress * (this.piOutlinePoints.length - 1)));
    const tracedPoints = this.piOutlinePoints.slice(0, Math.max(2, traceIndex + 1));
    this.piGuide.geometry.setPositions(toThreePositions(tracedPoints));
    this.piGuide.material.opacity = s.piGuide * 0.82;
    this.piGuide.line.visible = s.piGuide > 0.001;
    const tracePoint = this.piOutlinePoints[traceIndex];
    this.piTracer.position.x = tracePoint.x;
    this.piTracer.position.y = 120 - tracePoint.y;
    (this.piTracer.material as MeshBasicMaterial).opacity = s.piGuide;

    const phiStrategy = H_PHI_STRATEGIES[H_PHI_STRATEGY];
    const hWeights = hAnimationWeights(s.h);
    const phiOpacity = hWeights.phi * phiStrategy.coreOpacity;
    const hOpacity = hWeights.h;
    this.hMaterials.forEach((fill) => {
      fill.uniforms.uOpacity.value = hOpacity;
      fill.uniforms.uProgress.value = 1;
    });
    this.hPillars.scale.y = 1;
    this.hPillars.position.y = 0;
    setHStackOpacity(this.hA, hOpacity);
    setHStackOpacity(this.hB, hOpacity);
    this.hTicks.forEach((tick) => setHStackOpacity(tick, hOpacity));
    setHStackOpacity(this.hBrace, hOpacity);
    this.hPhiMaterial.opacity = phiOpacity;
    this.hPhi.visible = phiOpacity > 0.001;
    this.hPhiHaloMaterial.uniforms.uOpacity.value = hWeights.phi * phiStrategy.halo.opacity;
    this.hPhiHalo.visible = this.hPhiHaloMaterial.uniforms.uOpacity.value > 0.001;
    const hPhase = s.h < H_ANIMATION.phiFadeInEnd
      ? "phi-in"
      : s.h < H_ANIMATION.phiHoldEnd
      ? "phi-hold"
      : s.h < H_ANIMATION.crossfadeEnd
      ? "crossfade"
      : "settled";
    this.canvas.dataset.hPhase = hPhase;
    if (phiOpacity > 0.1) this.canvas.dataset.hSawPhi = "true";
    if (hPhase === "crossfade") this.canvas.dataset.hSawCrossfade = "true";

    setHStackOpacity(this.oCircle, clamp((s.o - O_ANIMATION.circle.start) / O_ANIMATION.circle.duration));
    this.oCanonicalMaterials.forEach((record) => {
      const timing = O_ANIMATION[record.stage];
      const progress = clamp((s.o - timing.start - record.order * timing.stagger) / timing.duration) * (1 - s.oAlt * 0.78);
      record.material.opacity = record.baseOpacity * progress;
      record.material.visible = record.material.opacity > 0.001;
    });
    this.oAlternateMaterials.forEach((record) => {
      const timing = O_ANIMATION[record.stage];
      const progress = clamp((s.oAlt - timing.start * 0.45 - record.order * timing.stagger * 0.45) / Math.max(0.16, timing.duration * 0.7));
      record.material.opacity = record.baseOpacity * progress;
      record.material.visible = record.material.opacity > 0.001;
    });

    const introProgress = clamp(s.m);
    this.mComponents.forEach((record, index) => {
      const constructionFan = Math.sin(clamp(introProgress / M_ANIMATION.componentFanEnd) * Math.PI) * (1 - s.mSeparate);
      const fanAmount = 3.2 * s.mSeparate + 1.7 * constructionFan;
      const fan = (index - (this.mComponents.length - 1) / 2) * fanAmount;
      record.mesh.position.y = fan;
      record.mesh.position.z = 1 + index * 0.2;
      const stagger = index / Math.max(1, this.mComponents.length - 1);
      const componentIn = clamp((introProgress - stagger * 0.12) / 0.1);
      const componentOut = 1 - clamp((introProgress - 0.25) / 0.25);
      setMStrokeProgress(record, s.mSeparate > 0.001 ? 1 : componentIn);
      setMStrokeOpacity(record, componentIn * componentOut * (0.34 / record.baseOpacity) + s.mSeparate);
    });
    this.mPartials.forEach((record, index) => {
      const stagger = index / Math.max(1, this.mPartials.length - 1);
      const start = M_ANIMATION.partialStart + stagger * (M_ANIMATION.partialEnd - M_ANIMATION.partialStart);
      const reveal = clamp((introProgress - start) / M_ANIMATION.partialRevealDuration);
      for (const stroke of [record.halo, record.core]) {
        if (!stroke) continue;
        setMStrokeProgress(stroke, reveal);
        setMStrokeOpacity(stroke, 1 - s.mSeparate * 0.55);
      }
    });
    const finalProgress = clamp((introProgress - M_ANIMATION.finalStart) / (1 - M_ANIMATION.finalStart));
    setMStackProgress(this.mFinal, finalProgress);
    setMStackOpacity(this.mFinal, 1 - s.mSeparate * 0.72);
  }

  setView(view: ViewMode) {
    this.view = view;
    this.canvas.dataset.glyphView = view;
    const tPlacement = brandData.placements.t;
    this.tGroup.position.x = view === "t" ? 0 : tPlacement.x;
    this.tGroup.scale.x = view === "t" ? 1 : tPlacement.scaleX;
    const placement = brandData.placements.h;
    this.hGroup.position.x = placement.x;
    this.hGroup.scale.x = view === "h" ? H_ISOLATED_VIEW.scaleX : placement.scaleX;
    const oPlacement = brandData.placements.o;
    this.oGroup.position.x = oPlacement.x;
    this.oGroup.scale.x = view === "o" ? 1 : oPlacement.scaleX;
    this.scene.children.forEach((group) => {
      group.visible = view === "logo" || group.name === view;
    });
    this.resize(this.size.width, this.size.height);
    this.renderOnce(true);
  }

  resize(width: number, height: number) {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.size.width, this.size.height, false);
    const aspect = this.size.width / this.size.height;
    const placement = this.view === "logo" ? null : brandData.placements[this.view];
    const base = this.view === "t"
      ? { centerX: 50, centerY: 60, width: 120, height: 120 }
      : this.view === "h"
      ? {
          centerX: brandData.placements.h.x + H_ISOLATED_VIEW.x + H_ISOLATED_VIEW.width / 2,
          centerY: 120 - (H_ISOLATED_VIEW.y + H_ISOLATED_VIEW.height / 2),
          width: H_ISOLATED_VIEW.width,
          height: H_ISOLATED_VIEW.height,
        }
      : this.view === "o"
      ? { centerX: brandData.placements.o.x + 50, centerY: 60, width: 100, height: 120 }
      : placement
      ? { centerX: placement.x + placement.width / 2, centerY: 60, width: this.view === "m" ? placement.width : Math.max(112, placement.width + 24), height: 120 }
      : { centerX: 208, centerY: 60, width: 416, height: 120 };
    let viewWidth = base.width;
    let viewHeight = base.height;
    if (aspect > viewWidth / viewHeight) viewWidth = viewHeight * aspect;
    else viewHeight = viewWidth / aspect;
    this.camera.left = base.centerX - viewWidth / 2;
    this.camera.right = base.centerX + viewWidth / 2;
    this.camera.top = base.centerY + viewHeight / 2;
    this.camera.bottom = base.centerY - viewHeight / 2;
    this.camera.updateProjectionMatrix();
    this.lineRecords.forEach((record) => record.material.resolution.set(this.size.width, this.size.height));
    this.canvas.dataset.lineScale = (this.size.width / viewWidth).toFixed(4);
    this.renderOnce();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) {
      this.renderer.setAnimationLoop(null);
      this.canvas.dataset.renderLoop = "stopped";
    } else this.renderOnce();
  }

  private isNearViewport() {
    const rect = this.canvas.getBoundingClientRect();
    return rect.bottom >= -100
      && rect.top <= window.innerHeight + 100
      && rect.right >= -100
      && rect.left <= window.innerWidth + 100;
  }

  private begin(force = false) {
    this.animationGeneration += 1;
    this.controls.forEach((control) => control.stop());
    this.controls = [];
    if (force || this.visible || this.isNearViewport()) {
      this.canvas.dataset.renderLoop = "running";
      this.renderer.setAnimationLoop(() => {
        this.applyState();
        this.renderer.render(this.scene, this.camera);
      });
    }
    return this.animationGeneration;
  }

  private finishWhenComplete(generation: number, controls: PlaybackControl[]) {
    Promise.all(controls.map((control) => control.then(() => undefined))).then(() => {
      if (generation !== this.animationGeneration) return;
      Object.assign(this.state, { pi: 1, piGuide: 0, piOrbit: 1, h: 1, o: 1, oAlt: 0, m: 1, mSeparate: 0 });
      this.applyState();
      this.renderOnce();
      this.renderer.setAnimationLoop(null);
      this.canvas.dataset.renderLoop = "stopped";
    }).catch(() => undefined);
  }

  playIntro() {
    const generation = this.begin();
    Object.assign(this.state, { pi: 0, piGuide: 1, piOrbit: 0, h: 0, o: 0, oAlt: 0, m: 0, mSeparate: 0 });
    const controls = [
      animate(this.state, { pi: [0, 0.08, 1], piGuide: [1, 1, 0], piOrbit: 1 }, {
        duration: PI_ANIMATION.durationMs / 1000,
        ease: [0.22, 1, 0.36, 1],
        times: [0, PI_ANIMATION.traceHoldEnd, 1],
      }),
      animate(this.state, { h: 1 }, {
        delay: H_ANIMATION.delayMs / 1000,
        duration: H_ANIMATION.durationMs / 1000,
        ease: "linear",
      }),
      animate(this.state, { o: 1 }, { delay: O_ANIMATION.introDelay, duration: O_ANIMATION.introDuration, ease: [0.22, 1, 0.36, 1] }),
      animate(this.state, { m: 1 }, {
        delay: M_ANIMATION.delayMs / 1000,
        duration: M_ANIMATION.durationMs / 1000,
        ease: "linear",
      }),
    ] as unknown as PlaybackControl[];
    this.controls = controls;
    this.finishWhenComplete(generation, controls);
  }

  settle() {
    this.begin();
    Object.assign(this.state, { pi: 1, piGuide: 0, piOrbit: 1, h: 1, o: 1, oAlt: 0, m: 1, mSeparate: 0 });
    this.applyState();
    this.renderOnce();
    this.renderer.setAnimationLoop(null);
    this.canvas.dataset.renderLoop = "stopped";
  }

  playGlyph(glyph: ThomGlyph) {
    // A direct replay request must run even when the intersection observer has
    // not caught up with keyboard-driven scrolling yet.
    const generation = this.begin(true);
    this.settleBaseForGlyph(glyph);
    let control;
    if (glyph === "t") {
      Object.assign(this.state, { pi: 0, piGuide: 1, piOrbit: 0 });
      control = animate(this.state, { pi: [0, 0.08, 1], piGuide: [1, 1, 0], piOrbit: 1 }, {
        duration: PI_ANIMATION.durationMs / 1000,
        ease: [0.22, 1, 0.36, 1],
        times: [0, PI_ANIMATION.traceHoldEnd, 1],
      });
    } else if (glyph === "h") {
      this.canvas.dataset.hSawPhi = "false";
      this.canvas.dataset.hSawCrossfade = "false";
      this.state.h = 0;
      control = animate(this.state, { h: 1 }, { duration: H_ANIMATION.durationMs / 1000, ease: "linear" });
    } else if (glyph === "o") {
      control = animate(this.state, { oAlt: [0, 1, 1, 0] }, { duration: 0.76, ease: [0.22, 1, 0.36, 1], times: [0, 0.58, 0.8, 1] });
    } else {
      Object.assign(this.state, { m: 0, mSeparate: 0 });
      control = animate(this.state, { m: 1 }, {
        duration: M_ANIMATION.replayDurationMs / 1000,
        ease: "linear",
      });
    }
    const controls = [control] as unknown as PlaybackControl[];
    this.controls = controls;
    this.finishWhenComplete(generation, controls);
  }

  private settleBaseForGlyph(glyph: ThomGlyph) {
    Object.assign(this.state, { pi: 1, h: 1, o: 1, m: 1 });
    if (glyph !== "t") Object.assign(this.state, { piGuide: 0, piOrbit: 1 });
    if (glyph !== "o") this.state.oAlt = 0;
    if (glyph !== "m") this.state.mSeparate = 0;
  }

  async ready() {
    await this.assetReady;
  }

  renderOnce(force = false) {
    if (!this.visible && !force) return;
    this.applyState();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.animationGeneration += 1;
    this.controls.forEach((control) => control.stop());
    this.renderer.setAnimationLoop(null);
    this.canvas.dataset.renderLoop = "stopped";
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Line2) {
        object.geometry.dispose();
        const objectMaterial = object.material;
        if (Array.isArray(objectMaterial)) objectMaterial.forEach((item) => item.dispose());
        else objectMaterial.dispose();
      }
    });
    this.renderer.dispose();
  }
}
