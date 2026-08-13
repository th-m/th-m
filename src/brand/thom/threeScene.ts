import {
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { animate } from "motion";
import { brandData } from "./brandData";
import {
  BRAND_COLORS,
  M_FINAL_MATERIAL,
  interpolatePoints,
  sampleCatenary,
  sampleCompanionCatenary,
  scaleFourierLayer,
  type ChordNetwork,
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
type NetworkMaterial = { material: MeshBasicMaterial | LineMaterial; baseOpacity: number };
type MPartialLine = { core: LineRecord; halo: LineRecord | null };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
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

function createLine(points: Point[], color: string, width: number, opacity = 1, dashed = false, vertexColors?: Color[]): LineRecord {
  const geometry = new LineGeometry();
  geometry.setPositions(toThreePositions(points));
  if (vertexColors) geometry.setColors(vertexColors.flatMap((vertexColor) => vertexColor.toArray()));
  const lineMaterial = new LineMaterial({
    color: new Color(color),
    linewidth: width,
    transparent: true,
    opacity,
    depthWrite: false,
    alphaToCoverage: true,
    dashed,
    dashSize: dashed ? 3 : 1,
    gapSize: dashed ? 4 : 1,
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

function createMFinalStack(points: Point[]): LineStack {
  const shadow = new Color(BRAND_COLORS.shadow);
  const gold = new Color(BRAND_COLORS.gold);
  const highlight = new Color(BRAND_COLORS.highlight);
  const colors = points.map((point) => {
    const progress = point.x / 100;
    const edge = Math.min(progress, 1 - progress);
    if (edge <= 0.08) return shadow.clone().lerp(gold, edge / 0.08);
    if (edge <= 0.14) return gold.clone().lerp(highlight, (edge - 0.08) / 0.06);
    return highlight.clone();
  });
  const halo = createLine(points, BRAND_COLORS.gold, M_FINAL_MATERIAL.halo.width, M_FINAL_MATERIAL.halo.opacity);
  const middle = createLine(points, BRAND_COLORS.gold, M_FINAL_MATERIAL.middle.width, M_FINAL_MATERIAL.middle.opacity);
  const core = createLine(points, BRAND_COLORS.highlight, M_FINAL_MATERIAL.core.width, M_FINAL_MATERIAL.core.opacity, false, colors);
  halo.line.position.z = -0.25;
  middle.line.position.z = 0;
  core.line.position.z = 0.25;
  return { halo, middle, core };
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
  private piMaterials: ShaderMaterial[] = [];
  private hMaterials: ShaderMaterial[] = [];
  private hPillars = new Group();
  private hPrimary!: LineStack;
  private hCompanion!: LineStack;
  private hAxis!: LineRecord;
  private hMidpointMaterials: MeshBasicMaterial[] = [];
  private piGuide!: LineRecord;
  private piTracer!: Mesh;
  private oCircle!: LineStack;
  private oCanonicalMaterials: NetworkMaterial[] = [];
  private oAlternateMaterials: NetworkMaterial[] = [];
  private mFinal!: LineStack;
  private mComponents: LineRecord[] = [];
  private mPartials: MPartialLine[] = [];
  private state = { pi: 1, piGuide: 0, piOrbit: 0, h: 1, o: 1, oAlt: 0, m: 1, mSeparate: 0 };

  constructor(canvas: HTMLCanvasElement, view: ViewMode = "logo") {
    this.canvas = canvas;
    this.view = view;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 10;
    this.buildScene();
    this.resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
    this.applyState();
    this.renderOnce();
    this.canvas.dataset.renderLoop = "stopped";
  }

  private createGlyphGroup(glyph: ThomGlyph) {
    const placement = brandData.placements[glyph];
    const group = new Group();
    group.position.x = placement.x;
    group.scale.x = placement.scaleX;
    this.scene.add(group);
    return group;
  }

  private buildScene() {
    const tGroup = this.createGlyphGroup("t");
    const piMaterial = metalMaterial();
    this.piMaterials.push(piMaterial);
    tGroup.add(shapeMesh(brandData.pi.display, piMaterial));
    this.piGuide = createLine(brandData.o.circle, BRAND_COLORS.gold, 1, 0);
    this.piGuide.line.position.z = -0.5;
    tGroup.add(this.piGuide.line);
    this.lineRecords.push(this.piGuide);
    this.piTracer = createPoint({ x: 91, y: 59 }, BRAND_COLORS.highlight, 1.7, 0);
    tGroup.add(this.piTracer);

    const hGroup = this.createGlyphGroup("h");
    brandData.h.paths.forEach((path) => {
      const fill = metalMaterial();
      this.hMaterials.push(fill);
      this.hPillars.add(shapeMesh(path, fill));
    });
    hGroup.add(this.hPillars);
    this.hAxis = createLine(brandData.h.axis, BRAND_COLORS.gold, 0.72, 0.2, true);
    this.hAxis.line.position.z = -0.5;
    hGroup.add(this.hAxis.line);
    this.lineRecords.push(this.hAxis);
    this.hPrimary = createLineStack(brandData.h.curve, 1.15);
    this.hCompanion = createLineStack(brandData.h.companion, 0.75);
    addStack(hGroup, this.hPrimary, this.lineRecords);
    addStack(hGroup, this.hCompanion, this.lineRecords);
    const hHalo = createPoint(brandData.h.midpoint, BRAND_COLORS.gold, 5.4, 0.14);
    const hCore = createPoint(brandData.h.midpoint, BRAND_COLORS.highlight, 1.8, 1);
    hHalo.position.z = 0.55;
    hCore.position.z = 0.8;
    this.hMidpointMaterials.push(hHalo.material as MeshBasicMaterial, hCore.material as MeshBasicMaterial);
    hGroup.add(hHalo, hCore);

    const oGroup = this.createGlyphGroup("o");
    this.oCircle = createLineStack(brandData.o.circle, 1.05);
    addStack(oGroup, this.oCircle, this.lineRecords);
    this.addNetwork(oGroup, brandData.o.canonical, this.oCanonicalMaterials, 0);
    this.addNetwork(oGroup, brandData.o.alternates[0], this.oAlternateMaterials, 1.5);

    const mGroup = this.createGlyphGroup("m");
    brandData.m.components.forEach((points) => {
      const record = createLine(points, BRAND_COLORS.gold, 0.78, 0);
      this.mComponents.push(record);
      this.lineRecords.push(record);
      mGroup.add(record.line);
    });
    brandData.m.restingLayers.forEach((layer) => {
      const points = scaleFourierLayer(brandData.m.partialSums[layer.partialIndex], brandData.m.coefficients[0].a / 2, layer.amplitudeScale);
      const core = createLine(points, BRAND_COLORS.gold, layer.width, layer.opacity);
      const halo = layer.haloOpacity > 0 ? createLine(points, BRAND_COLORS.gold, layer.haloWidth, layer.haloOpacity) : null;
      this.mPartials.push({ core, halo });
      this.lineRecords.push(core);
      mGroup.add(core.line);
      if (halo) {
        halo.line.position.z = -0.2;
        this.lineRecords.push(halo);
        mGroup.add(halo.line);
      }
    });
    this.mFinal = createMFinalStack(brandData.m.hero);
    addStack(mGroup, this.mFinal, this.lineRecords);
  }

  private pushNetworkMaterial(material: MeshBasicMaterial | LineMaterial, baseOpacity: number, collection: NetworkMaterial[]) {
    material.opacity = baseOpacity;
    collection.push({ material, baseOpacity });
  }

  private addNetwork(group: Group, network: ChordNetwork, materials: NetworkMaterial[], z: number) {
    network.chords.forEach((chord) => {
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
      const halo = createLine(points, BRAND_COLORS.gold, 2.4, 0.045);
      const core = createLine(points, BRAND_COLORS.gold, 0.76, 0.44);
      halo.line.position.z = z;
      core.line.position.z = z + 0.15;
      this.lineRecords.push(halo, core);
      this.pushNetworkMaterial(halo.material, halo.baseOpacity, materials);
      this.pushNetworkMaterial(core.material, core.baseOpacity, materials);
      group.add(halo.line, core.line);
    });
    network.anchors.forEach((point) => {
      const halo = createPoint(point, BRAND_COLORS.gold, 3.5, 0.08);
      const core = createPoint(point, BRAND_COLORS.highlight, 1.02, 0.94);
      halo.position.z = z + 0.2;
      core.position.z = z + 0.4;
      this.pushNetworkMaterial(halo.material as MeshBasicMaterial, 0.08, materials);
      this.pushNetworkMaterial(core.material as MeshBasicMaterial, 0.94, materials);
      group.add(halo, core);
    });
    network.intersections.forEach((point) => {
      const mesh = createPoint(point, BRAND_COLORS.gold, 0.72, 0.58);
      mesh.position.z = z + 0.45;
      this.pushNetworkMaterial(mesh.material as MeshBasicMaterial, 0.58, materials);
      group.add(mesh);
    });
    network.highlights.forEach((point) => {
      const halo = createPoint(point, BRAND_COLORS.gold, 4.2, 0.11);
      const core = createPoint(point, BRAND_COLORS.highlight, 1.25, 1);
      halo.position.z = z + 0.55;
      core.position.z = z + 0.75;
      this.pushNetworkMaterial(halo.material as MeshBasicMaterial, 0.11, materials);
      this.pushNetworkMaterial(core.material as MeshBasicMaterial, 1, materials);
      group.add(halo, core);
    });
  }

  private applyState() {
    const s = this.state;
    this.piMaterials.forEach((fill) => {
      fill.uniforms.uOpacity.value = 0.06 + s.pi * 0.94;
      fill.uniforms.uProgress.value = clamp(s.pi);
    });
    this.piGuide.material.opacity = s.piGuide * 0.36;
    this.piGuide.line.visible = s.piGuide > 0.001;
    const guideScale = 0.85 + Math.sin(s.piGuide * Math.PI) * 0.3;
    this.piGuide.line.scale.set(guideScale, guideScale, 1);
    const guideOffset = 50 * (1 - guideScale);
    this.piGuide.line.position.x = guideOffset;
    this.piGuide.line.position.y = (120 - 59) * (1 - guideScale);
    const angle = s.piOrbit * Math.PI * 2;
    this.piTracer.position.x = 50 + Math.cos(angle) * 41 * guideScale;
    this.piTracer.position.y = 120 - (59 + Math.sin(angle) * 41 * guideScale);
    (this.piTracer.material as MeshBasicMaterial).opacity = s.piGuide;

    this.hMaterials.forEach((fill) => {
      fill.uniforms.uOpacity.value = clamp(s.h * 2.4);
      fill.uniforms.uProgress.value = clamp(s.h * 1.3);
    });
    this.hPillars.scale.y = Math.max(0.001, clamp(s.h));
    this.hPillars.position.y = 16 * (1 - clamp(s.h));
    const hProgress = Math.max(0, s.h);
    const primaryProgress = clamp((hProgress - 0.28) / 0.72);
    const companionProgress = clamp((hProgress - 0.44) / 0.56);
    setStackPoints(this.hPrimary, interpolatePoints(brandData.h.straight, sampleCatenary(128, hProgress), primaryProgress));
    setStackPoints(this.hCompanion, interpolatePoints(brandData.h.companionStraight, sampleCompanionCatenary(128, hProgress), companionProgress));
    setStackOpacity(this.hPrimary, clamp((s.h - 0.2) * 1.65));
    setStackOpacity(this.hCompanion, clamp((s.h - 0.38) * 1.65) * 0.76);
    this.hAxis.material.opacity = clamp((s.h - 0.12) * 1.8) * 0.2;
    this.hAxis.line.visible = this.hAxis.material.opacity > 0.001;
    const midpointOpacity = clamp((s.h - 0.62) / 0.38);
    this.hMidpointMaterials[0].opacity = midpointOpacity * 0.14;
    this.hMidpointMaterials[1].opacity = midpointOpacity;

    setStackOpacity(this.oCircle, clamp(s.o * 2));
    this.oCanonicalMaterials.forEach((record, index) => {
      const stagger = index / Math.max(1, this.oCanonicalMaterials.length - 1);
      const progress = clamp((s.o - 0.16 - stagger * 0.42) / 0.22) * (1 - s.oAlt * 0.78);
      record.material.opacity = record.baseOpacity * progress;
      record.material.visible = record.material.opacity > 0.001;
    });
    this.oAlternateMaterials.forEach((record, index) => {
      const stagger = index / Math.max(1, this.oAlternateMaterials.length - 1);
      const progress = clamp((s.oAlt - stagger * 0.35) / 0.3);
      record.material.opacity = record.baseOpacity * progress;
      record.material.visible = record.material.opacity > 0.001;
    });

    const introProgress = clamp(s.m);
    this.mComponents.forEach((record, index) => {
      const fan = (index - (this.mComponents.length - 1) / 2) * 3.2 * s.mSeparate;
      record.line.position.y = fan;
      record.line.position.z = 1 + index * 0.2;
      const stagger = index / Math.max(1, this.mComponents.length - 1);
      const componentIn = clamp((introProgress - stagger * 0.12) / 0.1);
      const componentOut = 1 - clamp((introProgress - 0.25) / 0.25);
      record.material.opacity = componentIn * componentOut * 0.18 + s.mSeparate * 0.28;
      record.line.visible = record.material.opacity > 0.001;
    });
    this.mPartials.forEach((record, index) => {
      const stagger = index / Math.max(1, this.mPartials.length - 1);
      const start = 0.195 + stagger * (0.695 - 0.195);
      const reveal = clamp((introProgress - start) / 0.085) * (1 - s.mSeparate * 0.55);
      for (const line of [record.halo, record.core]) {
        if (!line) continue;
        line.material.opacity = line.baseOpacity * reveal;
        line.line.visible = line.material.opacity > 0.001;
      }
    });
    setStackOpacity(this.mFinal, clamp((introProgress - 0.659) / 0.341) * (1 - s.mSeparate * 0.72));
  }

  setView(view: ViewMode) {
    this.view = view;
    this.resize(this.size.width, this.size.height);
  }

  resize(width: number, height: number) {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.size.width, this.size.height, false);
    const aspect = this.size.width / this.size.height;
    const placement = this.view === "logo" ? null : brandData.placements[this.view];
    const base = placement
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
    this.renderOnce();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) {
      this.renderer.setAnimationLoop(null);
      this.canvas.dataset.renderLoop = "stopped";
    } else this.renderOnce();
  }

  private begin() {
    this.animationGeneration += 1;
    this.controls.forEach((control) => control.stop());
    this.controls = [];
    if (this.visible) {
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
      animate(this.state, { pi: 1, piGuide: 0, piOrbit: 1 }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] }),
      animate(this.state, { h: [0, 1.04, 1] }, { delay: 0.22, duration: 0.52, ease: [0.16, 1, 0.3, 1], times: [0, 0.76, 1] }),
      animate(this.state, { o: 1 }, { delay: 0.48, duration: 0.72, ease: [0.22, 1, 0.36, 1] }),
      animate(this.state, { m: 1 }, { delay: 0.78, duration: 0.82, ease: [0.16, 1, 0.3, 1] }),
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
    const generation = this.begin();
    this.settleBaseForGlyph(glyph);
    let control;
    if (glyph === "t") {
      this.state.piGuide = 0;
      this.state.piOrbit = 0;
      control = animate(this.state, { piGuide: [0, 1, 0], piOrbit: 1 }, { duration: 0.55, ease: [0.4, 0, 0.2, 1], times: [0, 0.72, 1] });
    } else if (glyph === "h") {
      control = animate(this.state, { h: [1, 1.04, 0.985, 1] }, { duration: 0.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.34, 0.68, 1] });
    } else if (glyph === "o") {
      control = animate(this.state, { oAlt: [0, 1, 1, 0] }, { duration: 0.76, ease: [0.22, 1, 0.36, 1], times: [0, 0.58, 0.8, 1] });
    } else {
      control = animate(this.state, { mSeparate: [0, 1, 0] }, { duration: 0.82, ease: [0.16, 1, 0.3, 1], times: [0, 0.48, 1] });
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

  renderOnce() {
    if (!this.visible) return;
    this.applyState();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
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
