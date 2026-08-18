import type {
  AnalyzeResult,
  AtlasCard,
  Point,
  RegionShape,
  RelationConfidence,
  RelationKind,
  SetAtlasScene,
  TypeRelation,
  TypeSetSymbol,
} from "./types";

const OUTER_PADDING = 96;
const ISLAND_GAP = 150;
const REGION_GAP = 64;
const CARD_WIDTH = 274;
const CARD_HEIGHT = 116;

interface RegionGroup {
  id: string;
  symbolIds: string[];
  labels: string[];
  display: string;
  universe: boolean;
}

interface GroupRelation {
  sourceId: string;
  targetId: string;
  kind: Exclude<RelationKind, "equivalent">;
  confidence: RelationConfidence;
  reason?: string;
  synthetic?: boolean;
}

export interface ContainmentEdge {
  sourceId: string;
  targetId: string;
}

interface RegionBlock {
  id: string;
  regions: Map<string, RegionShape>;
  root: RegionShape;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

class DisjointSets {
  private readonly parent = new Map<string, string>();

  constructor(ids: Iterable<string>) {
    for (const id of ids) this.parent.set(id, id);
  }

  find(id: string): string {
    const current = this.parent.get(id);
    if (!current) return id;
    if (current === id) return current;
    const root = this.find(current);
    this.parent.set(id, root);
    return root;
  }

  union(left: string, right: string): void {
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);
    if (leftRoot === rightRoot) return;
    const [root, child] = [leftRoot, rightRoot].sort();
    this.parent.set(child, root);
  }
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "en");
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function relationKey(relation: Pick<GroupRelation, "sourceId" | "targetId" | "kind">): string {
  if (relation.kind === "proper-subset") {
    return `${relation.kind}:${relation.sourceId}>${relation.targetId}`;
  }
  const [left, right] = [relation.sourceId, relation.targetId].sort(compareText);
  return `${relation.kind}:${left}|${right}`;
}

function confidenceRank(confidence: RelationConfidence): number {
  if (confidence === "approximate") return 3;
  if (confidence === "derived") return 2;
  return 1;
}

function mergeRelation(previous: GroupRelation | undefined, next: GroupRelation): GroupRelation {
  if (!previous) return next;
  const preferred =
    confidenceRank(next.confidence) > confidenceRank(previous.confidence) ? next : previous;
  return {
    ...preferred,
    reason:
      [previous.reason, next.reason]
        .filter((reason): reason is string => Boolean(reason))
        .sort(compareText)
        .join("; ") || undefined,
    synthetic: previous.synthetic && next.synthetic,
  };
}

function mergeEquivalentSymbols(
  symbols: TypeSetSymbol[],
  relations: TypeRelation[],
): { groups: RegionGroup[]; symbolToGroup: Map<string, string> } {
  const regionSymbols = symbols
    .filter(({ status }) => status === "region" || status === "universe")
    .sort((left, right) => compareText(left.id, right.id));
  const regionIds = new Set(regionSymbols.map(({ id }) => id));
  const sets = new DisjointSets(regionIds);

  for (const relation of relations) {
    if (
      relation.kind === "equivalent" &&
      regionIds.has(relation.sourceId) &&
      regionIds.has(relation.targetId)
    ) {
      sets.union(relation.sourceId, relation.targetId);
    }
  }

  const byRoot = new Map<string, TypeSetSymbol[]>();
  for (const symbol of regionSymbols) {
    const root = sets.find(symbol.id);
    const bucket = byRoot.get(root) ?? [];
    bucket.push(symbol);
    byRoot.set(root, bucket);
  }

  const groups = [...byRoot.values()]
    .map((members): RegionGroup => {
      members.sort((left, right) => compareText(left.id, right.id));
      const symbolIds = members.map(({ id }) => id);
      return {
        id: symbolIds[0],
        symbolIds,
        labels: members.map(({ name }) => name).sort(compareText),
        display: members.map(({ display }) => display).sort(compareText)[0] ?? "",
        universe: members.some(({ status }) => status === "universe"),
      };
    })
    .sort((left, right) => compareText(left.id, right.id));

  const symbolToGroup = new Map<string, string>();
  for (const group of groups) {
    for (const symbolId of group.symbolIds) symbolToGroup.set(symbolId, group.id);
  }
  return { groups, symbolToGroup };
}

function groupRelations(
  relations: TypeRelation[],
  groups: RegionGroup[],
  symbolToGroup: Map<string, string>,
): GroupRelation[] {
  const deduplicated = new Map<string, GroupRelation>();
  for (const relation of relations) {
    if (relation.kind === "equivalent") continue;
    const sourceId = symbolToGroup.get(relation.sourceId);
    const targetId = symbolToGroup.get(relation.targetId);
    if (!sourceId || !targetId || sourceId === targetId) continue;
    const grouped: GroupRelation = {
      sourceId,
      targetId,
      kind: relation.kind,
      confidence: relation.confidence,
      reason: relation.reason,
    };
    const key = relationKey(grouped);
    deduplicated.set(key, mergeRelation(deduplicated.get(key), grouped));
  }

  const universes = groups.filter(({ universe }) => universe);
  for (const universe of universes) {
    for (const group of groups) {
      if (group.id === universe.id) continue;
      const grouped: GroupRelation = {
        sourceId: group.id,
        targetId: universe.id,
        kind: "proper-subset",
        confidence: "compiler-proven",
        reason: "Every set is contained by unknown.",
        synthetic: true,
      };
      const key = relationKey(grouped);
      deduplicated.set(key, mergeRelation(deduplicated.get(key), grouped));
    }
  }

  return [...deduplicated.values()].sort((left, right) =>
    compareText(relationKey(left), relationKey(right)),
  );
}

/** Removes A ⊂ C when the same containment is already represented by A ⊂ B ⊂ C. */
export function reduceTransitiveContainment<T extends ContainmentEdge>(edges: T[]): T[] {
  const ordered = [...edges].sort((left, right) =>
    compareText(`${left.sourceId}>${left.targetId}`, `${right.sourceId}>${right.targetId}`),
  );
  const adjacency = new Map<string, Set<string>>();
  for (const edge of ordered) {
    const targets = adjacency.get(edge.sourceId) ?? new Set<string>();
    targets.add(edge.targetId);
    adjacency.set(edge.sourceId, targets);
  }

  const hasAlternatePath = (edge: T): boolean => {
    const queue = [...(adjacency.get(edge.sourceId) ?? [])].filter(
      (targetId) => targetId !== edge.targetId,
    );
    const visited = new Set<string>([edge.sourceId]);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) continue;
      if (current === edge.targetId) return true;
      visited.add(current);
      queue.push(...(adjacency.get(current) ?? []));
    }
    return false;
  };

  return ordered.filter((edge) => !hasAlternatePath(edge));
}

function calculateDepths(ids: string[], containment: ContainmentEdge[]): Map<string, number> {
  const parents = new Map<string, string[]>();
  for (const { sourceId, targetId } of containment) {
    parents.set(sourceId, [...(parents.get(sourceId) ?? []), targetId]);
  }
  const memo = new Map<string, number>();
  const visit = (id: string, active: Set<string>): number => {
    const known = memo.get(id);
    if (known !== undefined) return known;
    if (active.has(id)) return 0;
    const nextActive = new Set(active).add(id);
    const depth = Math.max(
      0,
      ...(parents.get(id) ?? []).map((parentId) => visit(parentId, nextActive) + 1),
    );
    memo.set(id, depth);
    return depth;
  };
  for (const id of ids) visit(id, new Set());
  return memo;
}

function choosePrimaryParents(
  ids: string[],
  containment: ContainmentEdge[],
  depths: Map<string, number>,
): Map<string, string> {
  const candidates = new Map<string, string[]>();
  for (const { sourceId, targetId } of containment) {
    candidates.set(sourceId, [...(candidates.get(sourceId) ?? []), targetId]);
  }
  const selected = new Map<string, string>();
  for (const id of ids) {
    const parents = [...new Set(candidates.get(id) ?? [])].sort((left, right) => {
      const depthDifference = (depths.get(right) ?? 0) - (depths.get(left) ?? 0);
      return depthDifference || compareText(left, right);
    });
    if (parents[0] && parents[0] !== id) selected.set(id, parents[0]);
  }
  return selected;
}

function translateRegions(regions: Map<string, RegionShape>, dx: number, dy: number): void {
  for (const region of regions.values()) {
    region.cx += dx;
    region.cy += dy;
  }
}

function cloneRegions(regions: Map<string, RegionShape>): Map<string, RegionShape> {
  return new Map(
    [...regions].map(([id, region]) => [
      id,
      { ...region, symbolIds: [...region.symbolIds], labels: [...region.labels] },
    ]),
  );
}

function regionBounds(regions: Iterable<RegionShape>): Bounds {
  const values = [...regions];
  if (values.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  return {
    minX: Math.min(...values.map(({ cx, rx }) => cx - rx)),
    minY: Math.min(...values.map(({ cy, ry }) => cy - ry)),
    maxX: Math.max(...values.map(({ cx, rx }) => cx + rx)),
    maxY: Math.max(...values.map(({ cy, ry }) => cy + ry)),
  };
}

function mergeRegionMaps(target: Map<string, RegionShape>, source: Map<string, RegionShape>): void {
  for (const [id, region] of source) target.set(id, region);
}

function overlapConnectedComponents(
  ids: string[],
  shouldOverlap: (left: string, right: string) => boolean,
): string[][] {
  const sets = new DisjointSets(ids);
  for (let leftIndex = 0; leftIndex < ids.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < ids.length; rightIndex += 1) {
      if (shouldOverlap(ids[leftIndex], ids[rightIndex])) {
        sets.union(ids[leftIndex], ids[rightIndex]);
      }
    }
  }
  const components = new Map<string, string[]>();
  for (const id of ids) {
    const root = sets.find(id);
    components.set(root, [...(components.get(root) ?? []), id]);
  }
  return [...components.values()]
    .map((component) => component.sort(compareText))
    .sort((left, right) => compareText(left[0], right[0]));
}

function packBoxes(
  boxes: Array<{ id: string; width: number; height: number }>,
  gap: number,
): Map<string, Point> {
  if (boxes.length === 0) return new Map();
  const totalArea = boxes.reduce(
    (sum, box) => sum + (box.width + gap) * (box.height + gap),
    0,
  );
  const targetWidth = Math.max(
    boxes[0].width,
    Math.sqrt(totalArea) * (boxes.length > 2 ? 1.25 : 1.7),
  );
  const placements = new Map<string, Point>();
  let cursorX = 0;
  let cursorY = 0;
  let rowHeight = 0;
  for (const box of boxes) {
    if (cursorX > 0 && cursorX + box.width > targetWidth) {
      cursorX = 0;
      cursorY += rowHeight + gap;
      rowHeight = 0;
    }
    placements.set(box.id, { x: cursorX, y: cursorY });
    cursorX += box.width + gap;
    rowHeight = Math.max(rowHeight, box.height);
  }
  return placements;
}

function arrangeOverlappingBlocks(
  blocks: RegionBlock[],
  shouldOverlap: (left: string, right: string) => boolean,
): Map<string, RegionShape> {
  if (blocks.length === 0) return new Map();
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const components = overlapConnectedComponents(
    blocks.map(({ id }) => id).sort(compareText),
    shouldOverlap,
  );
  const componentLayouts: Array<{
    id: string;
    regions: Map<string, RegionShape>;
    bounds: Bounds;
  }> = [];

  for (const component of components) {
    const regions = new Map<string, RegionShape>();
    const members = component.map((id) => byId.get(id)).filter(Boolean) as RegionBlock[];
    const largestRadius = Math.max(...members.map(({ root }) => Math.max(root.rx, root.ry)), 1);
    for (let index = 0; index < members.length; index += 1) {
      const member = members[index];
      const copy = cloneRegions(member.regions);
      let x = 0;
      let y = 0;
      if (members.length === 2) {
        const other = members[1 - index];
        const minimum = Math.max(18, Math.abs(member.root.rx - other.root.rx) + 18);
        const maximum = Math.max(minimum, (member.root.rx + other.root.rx) * 0.62);
        const distance = Math.min(maximum, Math.max(minimum, largestRadius * 0.72));
        x = (index === 0 ? -1 : 1) * (distance / 2);
      } else if (members.length > 2) {
        const radius = largestRadius * Math.max(0.62, (members.length / Math.PI) * 0.5);
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / members.length;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius * 0.72;
      }
      translateRegions(copy, x, y);
      mergeRegionMaps(regions, copy);
    }
    componentLayouts.push({ id: component[0], regions, bounds: regionBounds(regions.values()) });
  }

  const boxes = componentLayouts.map(({ id, bounds }) => ({
    id,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  }));
  const placements = packBoxes(boxes, REGION_GAP);
  const result = new Map<string, RegionShape>();
  for (const component of componentLayouts) {
    const placement = placements.get(component.id) ?? { x: 0, y: 0 };
    translateRegions(
      component.regions,
      placement.x - component.bounds.minX,
      placement.y - component.bounds.minY,
    );
    mergeRegionMaps(result, component.regions);
  }
  const bounds = regionBounds(result.values());
  translateRegions(result, -(bounds.minX + bounds.maxX) / 2, -(bounds.minY + bounds.maxY) / 2);
  return result;
}

function ellipseContainsEllipse(parent: RegionShape, child: RegionShape, margin = 7): boolean {
  const parentRx = Math.max(1, parent.rx - margin);
  const parentRy = Math.max(1, parent.ry - margin);
  for (let index = 0; index < 48; index += 1) {
    const angle = (index * Math.PI * 2) / 48;
    const x = child.cx + Math.cos(angle) * child.rx;
    const y = child.cy + Math.sin(angle) * child.ry;
    const score = ((x - parent.cx) / parentRx) ** 2 + ((y - parent.cy) / parentRy) ** 2;
    if (score > 1.00001) return false;
  }
  return true;
}

function expandEllipseToContain(parent: RegionShape, child: RegionShape): void {
  parent.rx = Math.max(parent.rx, child.rx + 48);
  parent.ry = Math.max(parent.ry, child.ry + 42);
  for (let pass = 0; pass < 4; pass += 1) {
    let maximumScore = 1;
    for (let index = 0; index < 64; index += 1) {
      const angle = (index * Math.PI * 2) / 64;
      const x = child.cx + Math.cos(angle) * child.rx;
      const y = child.cy + Math.sin(angle) * child.ry;
      const score =
        ((x - parent.cx) / Math.max(1, parent.rx - 12)) ** 2 +
        ((y - parent.cy) / Math.max(1, parent.ry - 12)) ** 2;
      maximumScore = Math.max(maximumScore, score);
    }
    if (maximumScore <= 1.00001) return;
    const scale = Math.sqrt(maximumScore) * 1.012;
    parent.rx *= scale;
    parent.ry *= scale;
  }
}

function ellipsesIntersect(left: RegionShape, right: RegionShape): boolean {
  const dx = left.cx - right.cx;
  const dy = left.cy - right.cy;
  const horizontal = Math.max(1, left.rx + right.rx);
  const vertical = Math.max(1, left.ry + right.ry);
  return (dx / horizontal) ** 2 + (dy / vertical) ** 2 < 0.998;
}

function createRegionBlock(
  groupId: string,
  groups: Map<string, RegionGroup>,
  children: Map<string, string[]>,
  depths: Map<string, number>,
  atomCount: Map<string, number>,
  overlapPairs: Set<string>,
  active: Set<string>,
): RegionBlock {
  const group = groups.get(groupId);
  if (!group || active.has(groupId)) {
    const fallback: RegionShape = {
      id: groupId,
      symbolIds: group?.symbolIds ?? [groupId],
      labels: group?.labels ?? [groupId],
      display: group?.display ?? groupId,
      cx: 0,
      cy: 0,
      rx: 112,
      ry: 78,
      depth: depths.get(groupId) ?? 0,
      approximate: true,
    };
    return { id: groupId, root: fallback, regions: new Map([[groupId, fallback]]) };
  }

  const nextActive = new Set(active).add(groupId);
  const childBlocks = (children.get(groupId) ?? [])
    .sort(compareText)
    .map((childId) =>
      createRegionBlock(childId, groups, children, depths, atomCount, overlapPairs, nextActive),
    );
  const childRegions = arrangeOverlappingBlocks(childBlocks, (left, right) =>
    overlapPairs.has([left, right].sort(compareText).join("|")),
  );

  const labelLength = Math.max(
    group.labels.join(" ≡ ").length,
    Math.min(48, group.display.length),
  );
  let rx = clamp(88 + labelLength * 2.15, 108, group.universe ? 250 : 202);
  let ry = clamp(70 + (atomCount.get(group.id) ?? 0) * 2.8, 76, 142);

  if (childBlocks.length === 1) {
    const child = childRegions.get(childBlocks[0].id);
    if (child) {
      translateRegions(childRegions, -child.cx, -child.cy);
      rx = Math.max(rx, child.rx + 58);
      ry = Math.max(ry, child.ry + 52);
    }
  } else if (childBlocks.length > 1) {
    const bounds = regionBounds(childBlocks.map(({ id }) => childRegions.get(id)).filter(Boolean) as RegionShape[]);
    translateRegions(childRegions, -(bounds.minX + bounds.maxX) / 2, -(bounds.minY + bounds.maxY) / 2);
    const directChildren = childBlocks
      .map(({ id }) => childRegions.get(id))
      .filter(Boolean) as RegionShape[];
    rx = Math.max(rx, ...directChildren.map(({ cx, rx: childRx }) => Math.abs(cx) + childRx + 46));
    ry = Math.max(ry, ...directChildren.map(({ cy, ry: childRy }) => Math.abs(cy) + childRy + 42));
  }

  const root: RegionShape = {
    id: group.id,
    symbolIds: [...group.symbolIds],
    labels: [...group.labels],
    display: group.display,
    cx: 0,
    cy: 0,
    rx,
    ry,
    depth: depths.get(group.id) ?? 0,
    approximate: false,
  };
  for (const childId of children.get(groupId) ?? []) {
    const child = childRegions.get(childId);
    if (child) expandEllipseToContain(root, child);
  }
  childRegions.set(group.id, root);
  return { id: group.id, root, regions: childRegions };
}

function semanticComponents(ids: string[], relations: GroupRelation[]): string[][] {
  const sets = new DisjointSets(ids);
  for (const relation of relations) {
    if (relation.kind === "proper-subset" || relation.kind === "overlap") {
      sets.union(relation.sourceId, relation.targetId);
    }
  }
  const components = new Map<string, string[]>();
  for (const id of ids) {
    const root = sets.find(id);
    components.set(root, [...(components.get(root) ?? []), id]);
  }
  return [...components.values()]
    .map((component) => component.sort(compareText))
    .sort((left, right) => compareText(left[0], right[0]));
}

function collectDescendants(id: string, children: Map<string, string[]>): Set<string> {
  const descendants = new Set<string>();
  const queue = [...(children.get(id) ?? [])];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || descendants.has(current)) continue;
    descendants.add(current);
    queue.push(...(children.get(current) ?? []));
  }
  return descendants;
}

function pinForGroup(
  group: RegionGroup,
  pins: Record<string, Point>,
): { point?: Point; conflicting: boolean } {
  const keys = [group.id, ...group.symbolIds.filter((id) => id !== group.id)].filter(
    (id) => pins[id],
  );
  const point = keys[0] ? pins[keys[0]] : undefined;
  const conflicting = Boolean(
    point && keys.some((key) => pins[key].x !== point.x || pins[key].y !== point.y),
  );
  return { point, conflicting };
}

function applyPins(
  regions: Map<string, RegionShape>,
  groups: RegionGroup[],
  pins: Record<string, Point>,
  children: Map<string, string[]>,
  depths: Map<string, number>,
  warnings: string[],
): Set<string> {
  const pinned = new Map<string, Point>();
  for (const group of groups) {
    const resolved = pinForGroup(group, pins);
    if (resolved.point) pinned.set(group.id, resolved.point);
    if (resolved.conflicting) {
      warnings.push(`${group.labels.join(" ≡ ")} has conflicting equivalent-region pins; the canonical pin was used.`);
    }
  }
  const pinnedIds = new Set(pinned.keys());
  const ordered = [...pinned].sort((left, right) => {
    const depthDifference = (depths.get(left[0]) ?? 0) - (depths.get(right[0]) ?? 0);
    return depthDifference || compareText(left[0], right[0]);
  });

  for (const [id, point] of ordered) {
    const region = regions.get(id);
    if (!region) continue;
    const dx = point.x - region.cx;
    const dy = point.y - region.cy;
    region.cx = point.x;
    region.cy = point.y;
    for (const descendantId of collectDescendants(id, children)) {
      if (pinnedIds.has(descendantId)) continue;
      const descendant = regions.get(descendantId);
      if (descendant) {
        descendant.cx += dx;
        descendant.cy += dy;
      }
    }
  }
  return pinnedIds;
}

function relationLabel(groupById: Map<string, RegionGroup>, relation: GroupRelation): string {
  const source = groupById.get(relation.sourceId)?.labels.join(" ≡ ") ?? relation.sourceId;
  const target = groupById.get(relation.targetId)?.labels.join(" ≡ ") ?? relation.targetId;
  return `${source} / ${target}`;
}

function validateGeometry(
  regions: Map<string, RegionShape>,
  relations: GroupRelation[],
  groupById: Map<string, RegionGroup>,
  warnings: string[],
): void {
  const warn = (relation: GroupRelation, explanation: string) => {
    const left = regions.get(relation.sourceId);
    const right = regions.get(relation.targetId);
    if (left) left.approximate = true;
    if (right) right.approximate = true;
    warnings.push(`${relationLabel(groupById, relation)}: ${explanation}`);
  };

  for (const relation of relations) {
    const source = regions.get(relation.sourceId);
    const target = regions.get(relation.targetId);
    if (!source || !target) continue;
    if (relation.confidence === "approximate") {
      warn(relation, relation.reason ?? "the compiler relationship is approximate");
    }
    if (relation.kind === "proper-subset" && !ellipseContainsEllipse(target, source)) {
      warn(relation, "containment could not be represented exactly by the current ellipse geometry");
    } else if (relation.kind === "disjoint" && ellipsesIntersect(source, target)) {
      warn(relation, "the current ellipses intersect even though the sets are disjoint");
    } else if (
      relation.kind === "overlap" &&
      (!ellipsesIntersect(source, target) ||
        ellipseContainsEllipse(source, target, 0) ||
        ellipseContainsEllipse(target, source, 0))
    ) {
      warn(relation, "the overlap could not be represented exactly by the current ellipse geometry");
    }
  }
}

function createCards(symbols: TypeSetSymbol[], x: number, y: number): AtlasCard[] {
  const statusOrder = { empty: 0, template: 1, exception: 2 } as const;
  return symbols
    .filter(
      (symbol): symbol is TypeSetSymbol & { status: "empty" | "template" | "exception" } =>
        symbol.status === "empty" || symbol.status === "template" || symbol.status === "exception",
    )
    .sort(
      (left, right) =>
        statusOrder[left.status] - statusOrder[right.status] || compareText(left.id, right.id),
    )
    .map((symbol, index) => ({
      id: `card:${symbol.id}`,
      symbolId: symbol.id,
      label: symbol.name,
      detail:
        symbol.detail ??
        (symbol.status === "empty"
          ? "never / the empty set"
          : symbol.status === "exception"
            ? "any / outside set algebra"
            : symbol.display),
      status: symbol.status,
      x: x + (index % 2) * (CARD_WIDTH + 24),
      y: y + Math.floor(index / 2) * (CARD_HEIGHT + 24),
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    }));
}

function projectPointIntoRegions(point: Point, owners: RegionShape[]): Point {
  const projected = { ...point };
  for (let pass = 0; pass < 16; pass += 1) {
    for (const owner of owners) {
      const rx = Math.max(12, owner.rx - 28);
      const ry = Math.max(12, owner.ry - 28);
      const dx = projected.x - owner.cx;
      const dy = projected.y - owner.cy;
      const score = (dx / rx) ** 2 + (dy / ry) ** 2;
      if (score > 1) {
        const scale = 0.96 / Math.sqrt(score);
        projected.x = owner.cx + dx * scale;
        projected.y = owner.cy + dy * scale;
      }
    }
  }
  return projected;
}

/**
 * Converts compiler semantics into a deterministic, framework-independent atlas scene.
 * Pin coordinates represent ellipse centres and may be keyed by a region's canonical or
 * equivalent symbol id.
 */
export function buildSetAtlasScene(
  result: AnalyzeResult,
  pins: Record<string, Point> = {},
): SetAtlasScene {
  const warnings: string[] = [];
  const { groups, symbolToGroup } = mergeEquivalentSymbols(result.symbols, result.relations);
  const groupById = new Map(groups.map((group) => [group.id, group]));
  const relations = groupRelations(result.relations, groups, symbolToGroup);
  const containmentRelations = relations.filter(
    (relation): relation is GroupRelation & { kind: "proper-subset" } =>
      relation.kind === "proper-subset",
  );
  const reducedContainment = reduceTransitiveContainment(containmentRelations);
  const depths = calculateDepths(
    groups.map(({ id }) => id),
    reducedContainment,
  );
  const primaryParents = choosePrimaryParents(
    groups.map(({ id }) => id),
    reducedContainment,
    depths,
  );
  const children = new Map<string, string[]>();
  for (const [childId, parentId] of primaryParents) {
    children.set(parentId, [...(children.get(parentId) ?? []), childId]);
  }
  for (const childIds of children.values()) childIds.sort(compareText);

  const atomCount = new Map<string, number>();
  for (const atom of result.atoms) {
    for (const ownerId of new Set(atom.ownerIds.map((id) => symbolToGroup.get(id)).filter(Boolean))) {
      if (ownerId) atomCount.set(ownerId, (atomCount.get(ownerId) ?? 0) + 1);
    }
  }
  const overlapPairs = new Set(
    relations
      .filter(({ kind }) => kind === "overlap")
      .map(({ sourceId, targetId }) => [sourceId, targetId].sort(compareText).join("|")),
  );

  const roots = groups
    .map(({ id }) => id)
    .filter((id) => !primaryParents.has(id))
    .sort(compareText);
  const rootBlocks = new Map(
    roots.map((id) => [
      id,
      createRegionBlock(id, groupById, children, depths, atomCount, overlapPairs, new Set()),
    ]),
  );

  const rootFor = (id: string): string => {
    const visited = new Set<string>();
    let current = id;
    while (primaryParents.has(current) && !visited.has(current)) {
      visited.add(current);
      current = primaryParents.get(current) ?? current;
    }
    return current;
  };
  const descendantsByRoot = new Map<string, Set<string>>();
  for (const group of groups) {
    const root = rootFor(group.id);
    const descendants = descendantsByRoot.get(root) ?? new Set<string>();
    descendants.add(group.id);
    descendantsByRoot.set(root, descendants);
  }
  const rootConnection = (leftRoot: string, rightRoot: string): boolean =>
    relations.some(
      ({ sourceId, targetId, kind }) =>
        (kind === "overlap" || kind === "proper-subset") &&
        ((descendantsByRoot.get(leftRoot)?.has(sourceId) &&
          descendantsByRoot.get(rightRoot)?.has(targetId)) ||
          (descendantsByRoot.get(leftRoot)?.has(targetId) &&
            descendantsByRoot.get(rightRoot)?.has(sourceId))),
    );

  const components = semanticComponents(
    groups.map(({ id }) => id),
    relations,
  );
  const islandLayouts: Array<{ id: string; regions: Map<string, RegionShape>; bounds: Bounds }> = [];
  for (const component of components) {
    const componentRoots = [...new Set(component.map(rootFor))]
      .sort(compareText)
      .map((rootId) => rootBlocks.get(rootId))
      .filter(Boolean) as RegionBlock[];
    const islandRegions = arrangeOverlappingBlocks(componentRoots, rootConnection);
    islandLayouts.push({
      id: component[0],
      regions: islandRegions,
      bounds: regionBounds(islandRegions.values()),
    });
  }

  const islandBoxes = islandLayouts.map(({ id, bounds }) => ({
    id,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  }));
  const islandPlacements = packBoxes(islandBoxes, ISLAND_GAP);
  const laidOutRegions = new Map<string, RegionShape>();
  for (const island of islandLayouts) {
    const placement = islandPlacements.get(island.id) ?? { x: 0, y: 0 };
    translateRegions(
      island.regions,
      placement.x - island.bounds.minX + OUTER_PADDING,
      placement.y - island.bounds.minY + OUTER_PADDING,
    );
    mergeRegionMaps(laidOutRegions, island.regions);
  }

  // A malformed containment cycle has no forest root. Keep every declaration visible.
  for (const group of groups) {
    if (!laidOutRegions.has(group.id)) {
      const fallback = createRegionBlock(
        group.id,
        groupById,
        new Map(),
        depths,
        atomCount,
        overlapPairs,
        new Set(),
      );
      translateRegions(fallback.regions, OUTER_PADDING + laidOutRegions.size * 250, OUTER_PADDING);
      mergeRegionMaps(laidOutRegions, fallback.regions);
      warnings.push(`${group.labels.join(" ≡ ")} participates in a containment cycle and was laid out separately.`);
    }
  }

  applyPins(laidOutRegions, groups, pins, children, depths, warnings);

  // Pins can move children. Expanding ancestors preserves semantic containment without
  // changing any user-selected centre coordinate.
  const deepestFirst = [...containmentRelations].sort(
    (left, right) =>
      (depths.get(right.sourceId) ?? 0) - (depths.get(left.sourceId) ?? 0) ||
      compareText(relationKey(left), relationKey(right)),
  );
  for (let pass = 0; pass < 2; pass += 1) {
    for (const relation of deepestFirst) {
      const child = laidOutRegions.get(relation.sourceId);
      const parent = laidOutRegions.get(relation.targetId);
      if (child && parent && !ellipseContainsEllipse(parent, child)) {
        expandEllipseToContain(parent, child);
      }
    }
  }

  validateGeometry(laidOutRegions, relations, groupById, warnings);

  const ownerSequence = new Map<string, number>();
  const atoms = [...result.atoms]
    .sort((left, right) => compareText(left.id, right.id))
    .map((atom) => {
      const ownerGroupIds = [
        ...new Set(atom.ownerIds.map((ownerId) => symbolToGroup.get(ownerId)).filter(Boolean)),
      ] as string[];
      const owners = ownerGroupIds
        .map((ownerId) => laidOutRegions.get(ownerId))
        .filter(Boolean) as RegionShape[];
      const ownerKey = ownerGroupIds.sort(compareText).join("|") || "unowned";
      const sequence = ownerSequence.get(ownerKey) ?? 0;
      ownerSequence.set(ownerKey, sequence + 1);
      const center = owners.length
        ? {
            x: owners.reduce((sum, owner) => sum + owner.cx, 0) / owners.length,
            y: owners.reduce((sum, owner) => sum + owner.cy, 0) / owners.length,
          }
        : { x: OUTER_PADDING, y: OUTER_PADDING };
      const seed = stableHash(`${ownerKey}:${atom.id}`);
      const angle = ((seed % 360) * Math.PI) / 180 + sequence * 2.399963;
      const distance = 16 + (sequence % 4) * 18;
      const candidate = {
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
      };
      const point = projectPointIntoRegions(candidate, owners);
      return {
        id: atom.id,
        label: atom.label,
        x: point.x,
        y: point.y,
        ownerIds: [...atom.ownerIds],
      };
    });

  const bounds = regionBounds(laidOutRegions.values());
  // Special types sit below the semantic field so they do not force the Venn geometry
  // into a wide, illegible fit-to-canvas scale.
  const cardX = laidOutRegions.size > 0 ? Math.max(OUTER_PADDING, bounds.minX) : OUTER_PADDING;
  const cardY = laidOutRegions.size > 0 ? bounds.maxY + OUTER_PADDING : OUTER_PADDING;
  const cards = createCards(result.symbols, cardX, cardY);
  const maxCardX = Math.max(cardX, ...cards.map((card) => card.x + card.width));
  const maxCardY = Math.max(cardY, ...cards.map((card) => card.y + card.height));
  const uniqueWarnings = [...new Set(warnings)].sort(compareText);

  return {
    width: Math.ceil(Math.max(960, bounds.maxX + OUTER_PADDING, maxCardX + OUTER_PADDING)),
    height: Math.ceil(Math.max(640, bounds.maxY + OUTER_PADDING, maxCardY + OUTER_PADDING)),
    regions: [...laidOutRegions.values()].sort(
      (left, right) => left.depth - right.depth || compareText(left.id, right.id),
    ),
    cards,
    atoms,
    warnings: uniqueWarnings,
  };
}
