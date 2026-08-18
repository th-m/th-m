import { access, readFile, realpath } from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  normalize,
  resolve,
} from "node:path";
import { version as compilerVersion } from "typescript";
import {
  API,
  DiagnosticCategory,
  TypeFlags,
  type Checker,
  type Diagnostic,
  type Project,
  type Snapshot,
  type Type,
} from "typescript/unstable/async";
import {
  isClassDeclaration,
  isConditionalTypeNode,
  isEnumDeclaration,
  isIndexedAccessTypeNode,
  isInterfaceDeclaration,
  isMappedTypeNode,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  type ClassDeclaration,
  type EnumDeclaration,
  type InterfaceDeclaration,
  type Node,
  type SourceFile,
  type TypeAliasDeclaration,
} from "typescript/unstable/ast";
import type {
  AnalyzeRequest,
  AnalyzeResult,
  AtlasDiagnostic,
  AtlasSymbolKind,
  AtlasSymbolStatus,
  DiagnosticSeverity,
  LiteralOrPrimitiveAtom,
  RelationConfidence,
  RelationKind,
  SourceSpan,
  TypeRelation,
  TypeSetSymbol,
} from "./types.ts";

type AtlasDeclaration =
  | TypeAliasDeclaration
  | InterfaceDeclaration
  | EnumDeclaration
  | ClassDeclaration;

interface DeclarationDescriptor {
  id: string;
  name: string;
  referenceName: string;
  kind: AtlasSymbolKind;
  declaration: AtlasDeclaration;
  generic: boolean;
  displayHint?: string;
  approximationReasons: string[];
}

interface ResolvedDescriptor extends DeclarationDescriptor {
  type: Type;
  status: AtlasSymbolStatus;
  display: string;
}

interface CompilerSession {
  api: API;
  configPath: string;
  sourcePath: string;
  sourceText: string;
  setSourceText(text: string): void;
}

interface PairProbe {
  leftIndex: number;
  rightIndex: number;
  name: string;
}

const SNIPPET_ROOT = "/__thom_set_atlas__";
const DEFAULT_SNIPPET_FILE = "snippet.ts";
const PROBE_MARKER = "__THOM_SET_ATLAS_INTERSECTION";
const MAX_DECLARATIONS = 100;
const SUPPORTED_SOURCE_EXTENSION =
  /(?:\.d\.(?:ts|mts|cts)|\.(?:ts|tsx|mts|cts))$/i;
const PRIMITIVE_FLAGS: ReadonlyArray<readonly [number, string]> = [
  [TypeFlags.String, "string"],
  [TypeFlags.Number, "number"],
  [TypeFlags.BigInt, "bigint"],
  [TypeFlags.Boolean, "boolean"],
  [TypeFlags.ESSymbol, "symbol"],
  [TypeFlags.Null, "null"],
  [TypeFlags.Undefined, "undefined"],
  [TypeFlags.Void, "void"],
  [TypeFlags.NonPrimitive, "object"],
];

/**
 * Analyze the set relationships expressed by top-level TypeScript declarations.
 *
 * Every invocation owns a native TypeScript API process. This keeps virtual source
 * overlays isolated between callers and, importantly, guarantees that project
 * sources are never written while synthetic intersection aliases are checked.
 */
export async function analyzeSetAtlas(
  request: AnalyzeRequest,
): Promise<AnalyzeResult> {
  validateAnalyzeRequest(request);

  const session =
    request.source.mode === "snippet"
      ? createSnippetSession(request.source.fileName, request.source.code)
      : await createProjectSession(
          request.source.sourceFilePath,
          request.source.tsconfigPath,
        );
  const originalSourceText = session.sourceText;

  try {
    const firstSnapshot = await session.api.updateSnapshot({
      openProjects: [session.configPath],
      openFiles: [session.sourcePath],
    });
    const { project: firstProject, sourceFile: originalSourceFile } = await getSourceProject(
      firstSnapshot,
      session.configPath,
      session.sourcePath,
    );

    const diagnostics = await collectDiagnostics(
      firstProject,
      originalSourceFile,
    );
    const discoveredDeclarations = collectDeclarations(
      originalSourceFile,
      session.sourcePath,
    );
    const descriptors = discoveredDeclarations.slice(0, MAX_DECLARATIONS);
    if (discoveredDeclarations.length > MAX_DECLARATIONS) {
      const firstOmitted = discoveredDeclarations[MAX_DECLARATIONS];
      diagnostics.push({
        code: "set-atlas/declaration-limit",
        severity: "warning",
        message: `This atlas shows the first ${MAX_DECLARATIONS} declarations in source order; ${discoveredDeclarations.length - MAX_DECLARATIONS} additional declaration${discoveredDeclarations.length - MAX_DECLARATIONS === 1 ? " was" : "s were"} omitted.`,
        fileName: originalSourceFile.fileName,
        span: spanForNode(firstOmitted.declaration, originalSourceFile),
      });
    }
    const firstResolved = await resolveDescriptors(
      firstProject.checker,
      descriptors,
    );
    const probes = createPairProbes(firstResolved, originalSourceText);

    let relationProject = firstProject;
    let relationSourceFile = originalSourceFile;
    let resolved = firstResolved;
    let probeTypes = new Map<string, Type>();

    if (probes.length > 0) {
      const augmentedSource = appendIntersectionProbes(
        originalSourceText,
        probes,
        firstResolved,
      );
      session.setSourceText(augmentedSource);

      const probeSnapshot = await session.api.updateSnapshot({
        fileChanges: { changed: [session.sourcePath] },
      });
      const probeSource = await getSourceProject(
        probeSnapshot,
        session.configPath,
        session.sourcePath,
      );
      relationProject = probeSource.project;
      const updatedSourceFile = probeSource.sourceFile;

      if (updatedSourceFile) {
        relationSourceFile = updatedSourceFile;
        const updatedDescriptors = collectDeclarations(
          updatedSourceFile,
          session.sourcePath,
          PROBE_MARKER,
        ).slice(0, MAX_DECLARATIONS);
        resolved = await resolveDescriptors(
          relationProject.checker,
          updatedDescriptors,
        );
        probeTypes = await collectProbeTypes(
          relationProject.checker,
          relationSourceFile,
          probes,
        );
      }
    }

    const symbols = await buildSymbols(
      relationProject.checker,
      resolved,
      originalSourceFile,
    );
    const atoms = await collectAtoms(
      relationProject.checker,
      resolved,
      symbols,
    );
    const relations = await buildRelations(
      relationProject.checker,
      resolved,
      probeTypes,
      probes,
    );

    return {
      revision: request.revision,
      compilerVersion,
      sourceText: originalSourceText,
      sourceFilePath:
        request.source.mode === "snippet"
          ? request.source.fileName || DEFAULT_SNIPPET_FILE
          : session.sourcePath,
      resolvedConfigPath:
        request.source.mode === "project" ? firstProject.configFileName : undefined,
      diagnostics,
      symbols,
      relations,
      atoms,
    };
  } finally {
    await session.api.close();
  }
}

/** Backwards-friendly explicit name for callers that think in terms of source analysis. */
export const analyzeTypeScriptSets = analyzeSetAtlas;

function validateAnalyzeRequest(request: AnalyzeRequest): void {
  if (!request || typeof request !== "object") {
    throw new TypeError("Analyze request must be an object.");
  }
  if (!Number.isSafeInteger(request.revision) || request.revision < 0) {
    throw new TypeError(
      "Analyze request revision must be a non-negative integer.",
    );
  }
  if (!request.source || typeof request.source !== "object") {
    throw new TypeError("Analyze request source is required.");
  }
  if (request.source.mode === "snippet") {
    if (
      typeof request.source.fileName !== "string" ||
      typeof request.source.code !== "string"
    ) {
      throw new TypeError(
        "Snippet sources require a fileName and code string.",
      );
    }
    return;
  }
  if (request.source.mode === "project") {
    if (
      typeof request.source.sourceFilePath !== "string" ||
      !request.source.sourceFilePath.trim()
    ) {
      throw new TypeError("Project sources require a sourceFilePath.");
    }
    if (
      request.source.tsconfigPath !== undefined &&
      (typeof request.source.tsconfigPath !== "string" ||
        !request.source.tsconfigPath.trim())
    ) {
      throw new TypeError(
        "tsconfigPath must be a non-empty string when supplied.",
      );
    }
    return;
  }
  throw new TypeError("Analyze source mode must be either snippet or project.");
}

function createSnippetSession(fileName: string, code: string): CompilerSession {
  const safeFileName = sanitizeSnippetFileName(fileName);
  const sourcePath = join(SNIPPET_ROOT, safeFileName);
  const configPath = join(SNIPPET_ROOT, "tsconfig.json");
  const files = new Map<string, string>([
    [
      configPath,
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          skipLibCheck: true,
        },
        files: [safeFileName],
      }),
    ],
    [sourcePath, code],
  ]);

  const api = new API({
    cwd: SNIPPET_ROOT,
    fs: createOverlayFileSystem(files, SNIPPET_ROOT),
  });
  return {
    api,
    configPath,
    sourcePath,
    sourceText: code,
    setSourceText(text) {
      files.set(sourcePath, text);
    },
  };
}

async function createProjectSession(
  sourceFilePath: string,
  requestedConfigPath?: string,
): Promise<CompilerSession> {
  const absoluteSourcePath = resolveFromCwd(sourceFilePath);
  if (!SUPPORTED_SOURCE_EXTENSION.test(absoluteSourcePath)) {
    throw new Error(
      "Project source must be a TypeScript .ts, .tsx, .mts, or .cts file.",
    );
  }

  const sourcePath = await canonicalFilePath(
    absoluteSourcePath,
    "TypeScript source file",
  );
  const configCandidate = requestedConfigPath
    ? resolveFromCwd(requestedConfigPath)
    : await findNearestTsconfig(dirname(sourcePath));
  const configPath = await canonicalFilePath(
    configCandidate,
    "TypeScript configuration",
  );
  const sourceText = await readFile(sourcePath, "utf8");
  const overlay = new Map<string, string>([[sourcePath, sourceText]]);
  const api = new API({
    cwd: dirname(configPath),
    fs: createOverlayFileSystem(overlay, dirname(configPath)),
  });

  return {
    api,
    configPath,
    sourcePath,
    sourceText,
    setSourceText(text) {
      overlay.set(sourcePath, text);
    },
  };
}

function resolveFromCwd(value: string): string {
  return normalize(isAbsolute(value) ? value : resolve(process.cwd(), value));
}

async function canonicalFilePath(path: string, label: string): Promise<string> {
  try {
    const canonical = await realpath(path);
    await access(canonical);
    return normalize(canonical);
  } catch {
    throw new Error(`${label} was not found: ${path}`);
  }
}

async function findNearestTsconfig(startDirectory: string): Promise<string> {
  let current = normalize(startDirectory);
  while (true) {
    const candidate = join(current, "tsconfig.json");
    try {
      await access(candidate);
      return candidate;
    } catch {
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  throw new Error(`No tsconfig.json was found above ${startDirectory}.`);
}

function sanitizeSnippetFileName(fileName: string): string {
  const candidate = basename(fileName.trim()) || DEFAULT_SNIPPET_FILE;
  return SUPPORTED_SOURCE_EXTENSION.test(candidate)
    ? candidate
    : `${candidate || "snippet"}.ts`;
}

function createOverlayFileSystem(
  files: Map<string, string>,
  virtualDirectory: string,
) {
  const normalizedDirectory = normalize(virtualDirectory);
  return {
    readFile(fileName: string): string | undefined {
      return files.get(normalize(fileName));
    },
    fileExists(fileName: string): boolean | undefined {
      return files.has(normalize(fileName)) ? true : undefined;
    },
    directoryExists(directoryName: string): boolean | undefined {
      const candidate = normalize(directoryName);
      if (candidate === normalizedDirectory) return true;
      for (const fileName of files.keys()) {
        if (dirname(fileName) === candidate) return true;
      }
      return undefined;
    },
    realpath(path: string): string | undefined {
      const candidate = normalize(path);
      return files.has(candidate) || candidate === normalizedDirectory
        ? candidate
        : undefined;
    },
  };
}

async function getSourceProject(
  snapshot: Snapshot,
  configuredPath: string,
  sourcePath: string,
): Promise<{ project: Project; sourceFile: SourceFile }> {
  const configured = snapshot.getProject(configuredPath);
  if (configured) {
    const sourceFile = await configured.program.getSourceFile(sourcePath);
    if (sourceFile) return { project: configured, sourceFile };
  }

  const inferred = await snapshot.getDefaultProjectForFile(sourcePath);
  if (inferred) {
    const sourceFile = await inferred.program.getSourceFile(sourcePath);
    if (sourceFile) return { project: inferred, sourceFile };
  }

  for (const project of snapshot.getProjects()) {
    if (project === configured || project === inferred) continue;
    const sourceFile = await project.program.getSourceFile(sourcePath);
    if (sourceFile) return { project, sourceFile };
  }

  throw new Error(
    `The selected source file is not part of a TypeScript project discovered from ${configuredPath}.`,
  );
}

function collectDeclarations(
  sourceFile: SourceFile,
  sourcePath: string,
  excludeNamePrefix?: string,
): DeclarationDescriptor[] {
  const descriptors = new Map<string, DeclarationDescriptor>();

  for (const statement of sourceFile.statements) {
    const declaration = atlasDeclaration(statement);
    if (!declaration || !declaration.name) continue;
    const kind = declarationKind(declaration);
    const name = declaration.name.text;
    if (excludeNamePrefix && name.startsWith(excludeNamePrefix)) continue;

    const key = `${kind}:${name}`;
    const generic = Boolean(
      "typeParameters" in declaration && declaration.typeParameters?.length,
    );
    const approximationReasons = findApproximationReasons(
      declaration,
      sourceFile,
      name,
    );
    const existing = descriptors.get(key);
    if (existing) {
      existing.generic ||= generic;
      existing.approximationReasons = [
        ...new Set([...existing.approximationReasons, ...approximationReasons]),
      ];
      continue;
    }
    descriptors.set(key, {
      id: stableId("type", `${normalize(sourcePath)}:${kind}:${name}`),
      name,
      referenceName: name,
      kind,
      declaration,
      generic,
      displayHint: isTypeAliasDeclaration(declaration)
        ? declaration.type.getText(sourceFile)
        : undefined,
      approximationReasons,
    });
  }

  return [...descriptors.values()];
}

function atlasDeclaration(node: Node): AtlasDeclaration | undefined {
  if (
    isTypeAliasDeclaration(node) ||
    isInterfaceDeclaration(node) ||
    isEnumDeclaration(node) ||
    isClassDeclaration(node)
  ) {
    return node;
  }
  return undefined;
}

function declarationKind(node: AtlasDeclaration): AtlasSymbolKind {
  if (isTypeAliasDeclaration(node)) return "alias";
  if (isInterfaceDeclaration(node)) return "interface";
  if (isEnumDeclaration(node)) return "enum";
  return "class";
}

function findApproximationReasons(
  declaration: AtlasDeclaration,
  sourceFile: SourceFile,
  declarationName: string,
): string[] {
  const reasons = new Set<string>();

  const visit = (node: Node) => {
    if (isConditionalTypeNode(node)) reasons.add("conditional type");
    if (isIndexedAccessTypeNode(node) || isMappedTypeNode(node)) {
      reasons.add("indexed or mapped type");
    }
    if (
      isTypeReferenceNode(node) &&
      node.typeName.getText(sourceFile) === declarationName
    ) {
      reasons.add("recursive type");
    }
    node.forEachChild(visit);
  };

  declaration.forEachChild(visit);
  return [...reasons];
}

async function resolveDescriptors(
  checker: Checker,
  descriptors: DeclarationDescriptor[],
): Promise<ResolvedDescriptor[]> {
  const types = await checker.getTypeAtLocation(
    descriptors.map((descriptor) => descriptor.declaration.name!),
  );
  const resolved = await Promise.all(
    descriptors.map(
      async (descriptor, index): Promise<ResolvedDescriptor | undefined> => {
        const type = types[index];
        if (!type) return undefined;
        const status = getSymbolStatus(descriptor, type);
        const display = await checker.typeToString(
          type,
          descriptor.declaration,
        );
        return {
          ...descriptor,
          type,
          status,
          display: descriptor.displayHint || display || descriptor.name,
        };
      },
    ),
  );

  // Keep source order. Missing symbols can occur in a severely malformed declaration;
  // its compiler diagnostic is still returned, but it cannot form a meaningful set.
  return resolved.filter((value): value is ResolvedDescriptor =>
    Boolean(value),
  );
}

function getSymbolStatus(
  descriptor: DeclarationDescriptor,
  type: Type,
): AtlasSymbolStatus {
  if (descriptor.generic || type.isTypeParameter()) return "template";
  if (type.isErrorType() || (type.flags & TypeFlags.Any) !== 0)
    return "exception";
  if ((type.flags & TypeFlags.Unknown) !== 0) return "universe";
  if ((type.flags & TypeFlags.Never) !== 0) return "empty";
  return "region";
}

function createPairProbes(
  resolved: ResolvedDescriptor[],
  sourceText: string,
): PairProbe[] {
  let salt = stableHash(sourceText).slice(0, 7);
  while (sourceText.includes(`${PROBE_MARKER}_${salt}`)) salt = `${salt}x`;

  const probes: PairProbe[] = [];
  for (let leftIndex = 0; leftIndex < resolved.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < resolved.length;
      rightIndex += 1
    ) {
      const left = resolved[leftIndex];
      const right = resolved[rightIndex];
      if (!isRelationalStatus(left.status) || !isRelationalStatus(right.status))
        continue;
      probes.push({
        leftIndex,
        rightIndex,
        name: `${PROBE_MARKER}_${salt}_${leftIndex}_${rightIndex}`,
      });
    }
  }
  return probes;
}

function appendIntersectionProbes(
  sourceText: string,
  probes: PairProbe[],
  resolved: ResolvedDescriptor[],
): string {
  const declarations = probes.map(
    (probe) =>
      `type ${probe.name} = ${resolved[probe.leftIndex].referenceName} & ${resolved[probe.rightIndex].referenceName};`,
  );
  return `${sourceText}\n\n// Set Atlas compiler probes (virtual; never written to disk).\n${declarations.join("\n")}\n`;
}

async function collectProbeTypes(
  checker: Checker,
  sourceFile: SourceFile,
  probes: PairProbe[],
): Promise<Map<string, Type>> {
  const declarations = new Map(
    sourceFile.statements
      .filter(isTypeAliasDeclaration)
      .filter((declaration) => declaration.name.text.startsWith(PROBE_MARKER))
      .map((declaration) => [declaration.name.text, declaration] as const),
  );
  const available = probes.flatMap((probe) => {
    const declaration = declarations.get(probe.name);
    return declaration ? [{ probe, declaration }] : [];
  });
  const types = await checker.getTypeAtLocation(
    available.map(({ declaration }) => declaration.name),
  );
  const entries = available.map(
    ({ probe }, index): readonly [string, Type] | undefined => {
      const type = types[index];
      return type ? ([probe.name, type] as const) : undefined;
    },
  );
  return new Map(
    entries.filter((entry): entry is readonly [string, Type] => Boolean(entry)),
  );
}

async function buildSymbols(
  checker: Checker,
  resolved: ResolvedDescriptor[],
  originalSourceFile: SourceFile,
): Promise<TypeSetSymbol[]> {
  return Promise.all(
    resolved.map(async (descriptor) => {
      let detail: string | undefined;
      if (descriptor.status === "template") {
        const count =
          "typeParameters" in descriptor.declaration
            ? (descriptor.declaration.typeParameters?.length ?? 0)
            : 0;
        detail = `Generic template with ${count || "unresolved"} type parameter${count === 1 ? "" : "s"}; instantiate it to visualize a set.`;
      } else if (descriptor.type.isErrorType()) {
        detail = "The compiler could not resolve this type.";
      } else if (descriptor.status === "exception") {
        detail = "`any` is intentionally shown outside set semantics.";
      } else if (descriptor.status === "universe") {
        detail =
          "The universe set: every TypeScript value is assignable to `unknown`.";
      } else if (descriptor.status === "empty") {
        detail = "The empty set: `never` has no values.";
      } else if (descriptor.approximationReasons.length > 0) {
        detail = `Diagram geometry is approximate for this ${descriptor.approximationReasons.join(", ")}.`;
      }

      return {
        id: descriptor.id,
        name: descriptor.name,
        kind: descriptor.kind,
        display:
          descriptor.display || (await checker.typeToString(descriptor.type)),
        status: descriptor.status,
        typeFlags: descriptor.type.flags,
        sourceSpan: spanForNode(descriptor.declaration, originalSourceFile),
        detail,
        atomIds: [],
      };
    }),
  );
}

async function collectAtoms(
  checker: Checker,
  resolved: ResolvedDescriptor[],
  symbols: TypeSetSymbol[],
): Promise<LiteralOrPrimitiveAtom[]> {
  const atoms = new Map<string, LiteralOrPrimitiveAtom>();
  const symbolsById = new Map(symbols.map((symbol) => [symbol.id, symbol]));

  for (const descriptor of resolved) {
    if (
      !isRelationalStatus(descriptor.status) ||
      descriptor.status === "universe" ||
      descriptor.status === "empty"
    ) {
      continue;
    }

    const candidates = descriptor.type.isUnionType()
      ? await descriptor.type.getTypes()
      : [descriptor.type];
    for (const candidate of candidates ?? []) {
      const atom = await atomForType(checker, candidate);
      if (!atom) continue;
      const key = `${atom.kind}:${atom.label}`;
      const existing = atoms.get(key);
      if (existing) {
        if (!existing.ownerIds.includes(descriptor.id))
          existing.ownerIds.push(descriptor.id);
      } else {
        atoms.set(key, {
          id: stableId("atom", key),
          label: atom.label,
          kind: atom.kind,
          ownerIds: [descriptor.id],
        });
      }
      const atomId = atoms.get(key)!.id;
      const symbol = symbolsById.get(descriptor.id);
      if (symbol && !symbol.atomIds.includes(atomId))
        symbol.atomIds.push(atomId);
    }
  }

  return [...atoms.values()].map((atom) => ({
    ...atom,
    ownerIds: [...atom.ownerIds].sort(),
  }));
}

async function atomForType(
  checker: Checker,
  type: Type,
): Promise<Pick<LiteralOrPrimitiveAtom, "label" | "kind"> | undefined> {
  if (type.isLiteralType() || (type.flags & TypeFlags.EnumLiteral) !== 0) {
    return { label: await checker.typeToString(type), kind: "literal" };
  }

  for (const [flag, label] of PRIMITIVE_FLAGS) {
    if ((type.flags & flag) !== 0) return { label, kind: "primitive" };
  }
  return undefined;
}

async function buildRelations(
  checker: Checker,
  resolved: ResolvedDescriptor[],
  probeTypes: Map<string, Type>,
  probes: PairProbe[],
): Promise<TypeRelation[]> {
  const probesByPair = new Map(
    probes.map(
      (probe) => [`${probe.leftIndex}:${probe.rightIndex}`, probe] as const,
    ),
  );
  const neverType = await checker.getNeverType();
  const relationTasks: Array<Promise<TypeRelation>> = [];

  for (let leftIndex = 0; leftIndex < resolved.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < resolved.length;
      rightIndex += 1
    ) {
      const left = resolved[leftIndex];
      const right = resolved[rightIndex];

      if (
        !isRelationalStatus(left.status) ||
        !isRelationalStatus(right.status)
      ) {
        const reason = relationBlockReason(left, right);
        relationTasks.push(
          Promise.resolve({
            sourceId: left.id,
            targetId: right.id,
            kind: "indeterminate" as const,
            confidence: "approximate" as const,
            reason,
          }),
        );
        continue;
      }

      relationTasks.push(
        (async (): Promise<TypeRelation> => {
          const [leftToRight, rightToLeft] = await Promise.all([
            checker.isTypeAssignableTo(left.type, right.type),
            checker.isTypeAssignableTo(right.type, left.type),
          ]);

          let source = left;
          let target = right;
          let kind: RelationKind;
          if (leftToRight && rightToLeft) {
            kind = "equivalent";
          } else if (leftToRight) {
            kind = "proper-subset";
          } else if (rightToLeft) {
            kind = "proper-subset";
            source = right;
            target = left;
          } else {
            const probe = probesByPair.get(`${leftIndex}:${rightIndex}`);
            const intersection = probe ? probeTypes.get(probe.name) : undefined;
            if (!intersection || intersection.isErrorType()) {
              kind = "indeterminate";
            } else {
              const isEmpty =
                (intersection.flags & TypeFlags.Never) !== 0 ||
                (await checker.isTypeAssignableTo(intersection, neverType));
              kind = isEmpty ? "disjoint" : "overlap";
            }
          }

          const { confidence, reason } = relationMetadata(source, target, kind);
          return {
            sourceId: source.id,
            targetId: target.id,
            kind,
            confidence,
            ...(reason ? { reason } : {}),
          };
        })(),
      );
    }
  }

  return Promise.all(relationTasks);
}

function isRelationalStatus(status: AtlasSymbolStatus): boolean {
  return status === "region" || status === "universe" || status === "empty";
}

function relationBlockReason(
  left: ResolvedDescriptor,
  right: ResolvedDescriptor,
): string {
  const blocked = [left, right].filter(
    (item) => !isRelationalStatus(item.status),
  );
  if (blocked.some((item) => item.status === "template")) {
    return "Instantiate generic templates before comparing their sets.";
  }
  if (blocked.some((item) => item.type.isErrorType())) {
    return "The compiler could not resolve one or both types.";
  }
  return "`any` does not behave as a mathematical set, so this relation is intentionally indeterminate.";
}

function relationMetadata(
  left: ResolvedDescriptor,
  right: ResolvedDescriptor,
  kind: RelationKind,
): { confidence: RelationConfidence; reason?: string } {
  if (kind === "indeterminate") {
    return {
      confidence: "approximate",
      reason:
        "The compiler could not materialize a reliable intersection for this pair.",
    };
  }

  const approximationReasons = [
    ...left.approximationReasons,
    ...right.approximationReasons,
  ];
  if (approximationReasons.length > 0) {
    return {
      confidence: "approximate",
      reason: `Compiler relation; diagram geometry is approximate for ${[
        ...new Set(approximationReasons),
      ].join(", ")}.`,
    };
  }

  if (
    (left.type.flags & TypeFlags.Object) !== 0 ||
    (right.type.flags & TypeFlags.Object) !== 0
  ) {
    return {
      confidence: "derived",
      reason:
        "Structural object sets are open; this relation is derived from compiler assignability.",
    };
  }

  return { confidence: "compiler-proven" };
}

async function collectDiagnostics(
  project: Project,
  sourceFile: SourceFile,
): Promise<AtlasDiagnostic[]> {
  const groups = await Promise.all([
    project.program.getSyntacticDiagnostics(sourceFile.fileName),
    project.program.getBindDiagnostics(sourceFile.fileName),
    project.program.getSemanticDiagnostics(sourceFile.fileName),
    project.program.getConfigFileParsingDiagnostics(),
    project.program.getGlobalDiagnostics(),
    project.program.getProgramDiagnostics(),
  ]);
  const seen = new Set<string>();
  const diagnostics: AtlasDiagnostic[] = [];

  for (const diagnostic of groups.flat()) {
    const message = flattenDiagnosticMessage(diagnostic);
    const key = `${diagnostic.fileName ?? ""}:${diagnostic.pos}:${diagnostic.end}:${diagnostic.code}:${message}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const item: AtlasDiagnostic = {
      code: diagnostic.code,
      severity: diagnosticSeverity(diagnostic.category),
      message,
    };
    if (diagnostic.fileName) item.fileName = diagnostic.fileName;
    if (
      diagnostic.fileName === sourceFile.fileName &&
      diagnostic.pos >= 0 &&
      diagnostic.end >= diagnostic.pos
    ) {
      item.span = spanForPositions(diagnostic.pos, diagnostic.end, sourceFile);
    }
    diagnostics.push(item);
  }

  return diagnostics;
}

function flattenDiagnosticMessage(diagnostic: Diagnostic): string {
  const nested =
    diagnostic.messageChain?.map(flattenDiagnosticMessage).filter(Boolean) ??
    [];
  return [diagnostic.text, ...nested].filter(Boolean).join(" ");
}

function diagnosticSeverity(category: DiagnosticCategory): DiagnosticSeverity {
  if (category === DiagnosticCategory.Error) return "error";
  if (category === DiagnosticCategory.Warning) return "warning";
  return "info";
}

function spanForNode(node: Node, sourceFile: SourceFile): SourceSpan {
  return spanForPositions(node.getStart(sourceFile), node.getEnd(), sourceFile);
}

function spanForPositions(
  start: number,
  end: number,
  sourceFile: SourceFile,
): SourceSpan {
  const location = sourceFile.getLineAndCharacterOfPosition(Math.max(0, start));
  return {
    start,
    end,
    line: location.line + 1,
    column: location.character + 1,
  };
}

function stableId(prefix: string, value: string): string {
  return `${prefix}-${stableHash(value)}`;
}

function stableHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
