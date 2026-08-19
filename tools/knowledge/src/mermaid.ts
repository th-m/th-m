import type { KnowledgeDocument } from "@th-m/knowledge-model";
import { svgShell, tspans, wrapText, type EmbeddedFonts } from "./rendering.ts";

export interface SystemNode {
  id: string;
  label: string;
  groupId?: string;
}

export interface SystemGroup {
  id: string;
  label: string;
  parentId?: string;
  nodeIds: string[];
}

export interface SystemPhase {
  id: string;
  ordinal: number;
  title: string;
}

export interface SystemEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  ordinal?: number;
  phaseId?: string;
  dotted: boolean;
}

export interface SystemModel {
  direction: "TB" | "TD" | "BT" | "LR" | "RL";
  source: string;
  groups: SystemGroup[];
  nodes: SystemNode[];
  phases: SystemPhase[];
  edges: SystemEdge[];
}

function unquote(value: string): string {
  const trimmed = value.trim();
  const unwrapped = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed;
  return unwrapped.replace(/<br\s*\/?>/gi, " · ").replace(/\\n/g, " · ").trim();
}

function parseNodeExpression(expression: string): { id: string; label?: string } {
  const match = expression.trim().match(/^([A-Za-z_][\w-]*)(?:\[(.*)\])?$/);
  if (!match) throw new Error(`Unsupported Mermaid node expression: ${expression}`);
  return { id: match[1], ...(match[2] === undefined ? {} : { label: unquote(match[2]) }) };
}

export function parseMermaidFlowchart(source: string): SystemModel {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const header = lines.find((line) => /^\s*flowchart\s+/i.test(line));
  const direction = header?.trim().split(/\s+/)[1] as SystemModel["direction"] | undefined;
  if (!direction || !["TB", "TD", "BT", "LR", "RL"].includes(direction)) {
    throw new Error("Knowledge proof supports Mermaid flowchart TB/TD/BT/LR/RL sources.");
  }
  const groups: SystemGroup[] = [];
  const nodes = new Map<string, SystemNode>();
  const phases: SystemPhase[] = [];
  const edges: SystemEdge[] = [];
  const groupStack: string[] = [];
  let currentPhaseId: string | undefined;

  const addNode = (parsed: { id: string; label?: string }): void => {
    const previous = nodes.get(parsed.id);
    const groupId = groupStack.at(-1) ?? previous?.groupId;
    nodes.set(parsed.id, { id: parsed.id, label: parsed.label ?? previous?.label ?? parsed.id, ...(groupId ? { groupId } : {}) });
    if (groupId) {
      const group = groups.find(({ id }) => id === groupId);
      if (group && !group.nodeIds.includes(parsed.id)) group.nodeIds.push(parsed.id);
    }
  };

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
    const line = lines[lineNumber].trim();
    if (!line || /^flowchart\s+/i.test(line)) continue;
    const phase = line.match(/^%%\s*Phase\s+(\d+)\s*[—–-]\s*(.+)$/i);
    if (phase) {
      currentPhaseId = `phase-${phase[1]}`;
      phases.push({ id: currentPhaseId, ordinal: Number(phase[1]), title: phase[2].trim() });
      continue;
    }
    if (line.startsWith("%%")) continue;
    const subgraph = line.match(/^subgraph\s+([A-Za-z_][\w-]*)(?:\[(.*)\])?$/i);
    if (subgraph) {
      const group: SystemGroup = {
        id: subgraph[1],
        label: unquote(subgraph[2] ?? subgraph[1]),
        ...(groupStack.at(-1) ? { parentId: groupStack.at(-1) } : {}),
        nodeIds: [],
      };
      groups.push(group);
      groupStack.push(group.id);
      continue;
    }
    if (line === "end") {
      groupStack.pop();
      continue;
    }
    const edgeMatch = line.match(/^(.*?)\s*(-->|-\.->)\s*(.*)$/);
    if (edgeMatch) {
      const sourceNode = parseNodeExpression(edgeMatch[1]);
      let remainder = edgeMatch[3].trim();
      let label = "";
      if (remainder.startsWith("|")) {
        const closing = remainder.indexOf("|", 1);
        if (closing < 0) throw new Error(`Unclosed Mermaid edge label on line ${lineNumber + 1}.`);
        label = unquote(remainder.slice(1, closing));
        remainder = remainder.slice(closing + 1).trim();
      }
      const targetNode = parseNodeExpression(remainder);
      addNode(sourceNode);
      addNode(targetNode);
      const ordinalMatch = label.match(/^(\d+)\.\s*(.*)$/s);
      edges.push({
        id: `edge-${edges.length + 1}`,
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        label: ordinalMatch?.[2]?.trim() ?? label,
        ...(ordinalMatch ? { ordinal: Number(ordinalMatch[1]) } : {}),
        ...(currentPhaseId ? { phaseId: currentPhaseId } : {}),
        dotted: edgeMatch[2] === "-.->",
      });
      continue;
    }
    if (/^[A-Za-z_]/.test(line)) addNode(parseNodeExpression(line));
  }

  const ordered = edges.filter(({ ordinal }) => ordinal !== undefined).sort((left, right) => left.ordinal! - right.ordinal!);
  const duplicate = ordered.find((edge, index) => index > 0 && edge.ordinal === ordered[index - 1].ordinal);
  if (duplicate) throw new Error(`Duplicate process step ${duplicate.ordinal}.`);
  return { direction, source, groups, nodes: [...nodes.values()], phases, edges };
}

export function systemToKnowledgeDocument(id: string, title: string, model: SystemModel): KnowledgeDocument {
  return {
    schemaVersion: 1,
    id,
    title,
    sources: [{ id: `${id}-source`, kind: "mermaid", label: title }],
    entities: model.nodes.map((node) => ({
      id: node.id,
      kind: "system",
      name: node.id,
      label: node.label,
      ...(node.groupId ? { parentId: node.groupId } : {}),
    })),
    groups: model.groups.map((group) => ({ id: group.id, name: group.label, ...(group.parentId ? { parentId: group.parentId } : {}), entityIds: group.nodeIds })),
    relations: model.edges.map((edge) => ({
      id: edge.id,
      kind: edge.ordinal === undefined ? "dependency" : "process-step",
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      label: edge.label,
      ...(edge.ordinal === undefined ? {} : { ordinal: edge.ordinal }),
      ...(edge.phaseId ? { phaseId: edge.phaseId } : {}),
      presentation: { direction: "forward", layoutInfluence: edge.dotted ? "secondary" : "primary", style: edge.dotted ? "dotted" : "solid" },
    })),
    perspectives: [
      { id: "native", kind: "native-mermaid", title: "Native Mermaid" },
      { id: "topology", kind: "system-topology", title: "THOM topology" },
      { id: "process", kind: "phased-process", title: "THOM phased process" },
    ],
    diagnostics: [],
  };
}

interface PositionedNode extends SystemNode { x: number; y: number; width: number; height: number }

function topologyOrder(group: SystemGroup): number {
  const label = group.label.toLowerCase();
  if (label.includes("client") || label.includes("external")) return 0;
  if (label.includes("managed") || label.includes("cognito")) return 2;
  if (label.includes("owned") || label.includes("platform")) return 1;
  return 3;
}

export function renderSystemTopology(model: SystemModel, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const width = 2000;
  const diagramHeight = 910;
  const registerRows = Math.ceil(model.edges.filter(({ ordinal }) => ordinal !== undefined).length / 2);
  const height = diagramHeight + 175 + registerRows * 52;
  const orderedGroups = [...model.groups].sort((left, right) => topologyOrder(left) - topologyOrder(right) || left.id.localeCompare(right.id));
  const groupX = new Map(orderedGroups.map((group, index) => [group.id, 54 + index * 520]));
  const positioned = new Map<string, PositionedNode>();
  const groupMarkup: string[] = [];

  for (const group of orderedGroups) {
    const x = groupX.get(group.id)!;
    const nodes = group.nodeIds.map((id) => model.nodes.find((node) => node.id === id)).filter((node): node is SystemNode => Boolean(node));
    const boxHeight = Math.max(220, nodes.length * 102 + 92);
    groupMarkup.push(`<rect x="${x}" y="132" width="430" height="${boxHeight}" rx="20" fill="#0c0b09" stroke="#554936" stroke-width="1.5"/>`);
    groupMarkup.push(`<text class="display" x="${x + 26}" y="174" font-size="25" fill="#d6b06a">${tspans(wrapText(group.label, 34, 2), x + 26, 174, 25)}</text>`);
    nodes.forEach((node, index) => positioned.set(node.id, { ...node, x: x + 25, y: 205 + index * 102, width: 380, height: 76 }));
  }
  const standalone = model.nodes.filter(({ groupId }) => !groupId);
  standalone.forEach((node, index) => positioned.set(node.id, { ...node, x: 54 + orderedGroups.length * 520, y: 205 + index * 110, width: 250, height: 82 }));

  const nodeMarkup = [...positioned.values()].map((node) => `<g id="node-${node.id}">
    <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="13" fill="#15120d" stroke="#6d5a3b"/>
    <text x="${node.x + 18}" y="${node.y + 29}" font-size="14">${tspans(wrapText(node.label, Math.floor((node.width - 36) / 8), 3), node.x + 18, node.y + 29, 18)}</text>
  </g>`).join("");

  const bundles = new Map<string, SystemEdge[]>();
  for (const edge of model.edges) {
    const key = [edge.sourceId, edge.targetId].sort().join("::");
    bundles.set(key, [...(bundles.get(key) ?? []), edge]);
  }
  const edgeMarkup = [...bundles.values()].map((edges, bundleIndex) => {
    const first = edges[0];
    const source = positioned.get(first.sourceId);
    const target = positioned.get(first.targetId);
    if (!source || !target) return "";
    const ordinals = edges.flatMap(({ ordinal }) => ordinal === undefined ? [] : [ordinal]).sort((a, b) => a - b);
    const supporting = edges.every(({ dotted }) => dotted);
    if (source.id === target.id) {
      const x = source.x + source.width;
      const y = source.y + source.height / 2;
      return `<path d="M${x} ${y} C${x + 70} ${y - 62}, ${x + 70} ${y + 62}, ${x} ${y + 16}" fill="none" stroke="#d6b06a" stroke-width="2" marker-end="url(#arrow)"/><g transform="translate(${x + 50} ${y - 48})"><circle r="18" fill="#d6b06a"/><text x="0" y="5" text-anchor="middle" fill="#050505" font-size="12">${ordinals.join(",")}</text></g>`;
    }
    const leftToRight = source.x <= target.x;
    const sx = leftToRight ? source.x + source.width : source.x;
    const tx = leftToRight ? target.x : target.x + target.width;
    const sy = source.y + source.height / 2;
    const ty = target.y + target.height / 2;
    const offset = ((bundleIndex % 5) - 2) * 10;
    const midpoint = (sx + tx) / 2 + offset;
    const dash = supporting ? ' stroke-dasharray="7 7"' : "";
    const stroke = supporting ? "#8f816e" : "#d6b06a";
    const badge = ordinals.length > 0 ? `<g transform="translate(${midpoint} ${(sy + ty) / 2})"><rect x="-${14 + ordinals.join(",").length * 5}" y="-14" width="${28 + ordinals.join(",").length * 10}" height="28" rx="14" fill="#050505" stroke="${stroke}"/><text x="0" y="4" text-anchor="middle" font-size="11">${ordinals.join(" · ")}</text></g>` : "";
    return `<path d="M${sx} ${sy} C${midpoint} ${sy}, ${midpoint} ${ty}, ${tx} ${ty}" fill="none" stroke="${stroke}" stroke-width="${supporting ? 1.5 : 2}"${dash} marker-end="url(#${supporting ? "arrow-muted" : "arrow"})"/>${badge}`;
  }).join("");

  const orderedEdges = model.edges.filter(({ ordinal }) => ordinal !== undefined).sort((left, right) => left.ordinal! - right.ordinal!);
  const register = orderedEdges.map((edge, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 64 + column * 880;
    const y = diagramHeight + 146 + row * 52;
    return `<g><circle cx="${x + 16}" cy="${y - 5}" r="16" fill="#d6b06a"/><text x="${x + 16}" y="${y}" text-anchor="middle" fill="#050505" font-size="11">${edge.ordinal}</text><text x="${x + 48}" y="${y - 8}" font-size="12" fill="#d6b06a">${edge.sourceId} → ${edge.targetId}</text><text x="${x + 48}" y="${y + 12}" font-size="13">${tspans(wrapText(edge.label, 82, 1), x + 48, y + 12, 18)}</text></g>`;
  }).join("");

  const content = `<text class="display" x="54" y="58" font-size="38">${title}</text><text x="54" y="112" font-size="12" fill="#a99b87">TOPOLOGY · OWNERSHIP LEFT TO RIGHT · ROUTES BUNDLED BY ENDPOINT PAIR</text>${groupMarkup.join("")}${edgeMarkup}${nodeMarkup}<path d="M54 ${diagramHeight + 42} H${width - 54}" stroke="#554936"/><text class="display" x="54" y="${diagramHeight + 94}" font-size="30">Relationship register</text>${register}`;
  return { svg: svgShell({ title: `${title} — THOM topology`, description: "System topology organized by ownership with bundled routes and a complete relationship register.", width, height, fonts, content }), width, height };
}

export function renderPhasedProcess(model: SystemModel, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const phases = [...model.phases].sort((left, right) => left.ordinal - right.ordinal);
  const maximumSteps = Math.max(...phases.map((phase) => model.edges.filter((edge) => edge.phaseId === phase.id && edge.ordinal !== undefined).length));
  const width = Math.max(1320, 120 + maximumSteps * 274);
  const phaseHeight = 270;
  const height = 130 + phases.length * phaseHeight;
  const markup = phases.map((phase, phaseIndex) => {
    const top = 112 + phaseIndex * phaseHeight;
    const steps = model.edges.filter((edge) => edge.phaseId === phase.id && edge.ordinal !== undefined).sort((left, right) => left.ordinal! - right.ordinal!);
    const notes = model.edges.filter((edge) => edge.phaseId === phase.id && edge.ordinal === undefined);
    const cards = steps.map((step, index) => {
      const x = 60 + index * 274;
      const y = top + 58;
      const action = wrapText(step.label, 28, 4);
      return `<g><rect x="${x}" y="${y}" width="246" height="142" rx="17" fill="#15120d" stroke="#6d5a3b"/><circle cx="${x + 27}" cy="${y + 27}" r="17" fill="#d6b06a"/><text x="${x + 27}" y="${y + 32}" text-anchor="middle" fill="#050505" font-size="12">${step.ordinal}</text><text x="${x + 54}" y="${y + 31}" font-size="12" fill="#d6b06a">${step.sourceId} → ${step.targetId}</text><text x="${x + 18}" y="${y + 65}" font-size="13">${tspans(action, x + 18, y + 65, 19)}</text></g>`;
    }).join("");
    const noteText = notes.map((note) => `${note.sourceId} → ${note.targetId}${note.label ? `: ${note.label}` : ""}`).join("  ·  ");
    return `<g><text class="display" x="60" y="${top + 34}" font-size="27"><tspan fill="#d6b06a">${phase.ordinal.toString().padStart(2, "0")}</tspan><tspan dx="18">${phase.title}</tspan></text><path d="M60 ${top + 46} H${width - 60}" stroke="#2d271e"/>${cards}${noteText ? `<text x="60" y="${top + 224}" font-size="11" fill="#a99b87">SUPPORTING · ${noteText}</text>` : ""}</g>`;
  }).join("");
  const content = `<text class="display" x="60" y="58" font-size="38">${title}</text><text x="${width - 60}" y="56" text-anchor="end" font-size="12" fill="#a99b87">PROCESS · PHASES TOP TO BOTTOM · STEPS LEFT TO RIGHT</text>${markup}`;
  return { svg: svgShell({ title: `${title} — phased process`, description: "Ordered process steps grouped by authoritative Mermaid phase comments.", width, height, fonts, content }), width, height };
}
