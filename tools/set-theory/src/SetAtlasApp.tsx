import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDocument,
  buildSetAtlasScene,
  createBlankDocument,
  deleteDocument,
  duplicateDocument,
  loadSetAtlasLibrary,
  removeDocumentPin,
  renameDocument,
  replaceDocument,
  saveSetAtlasLibrary,
  setActiveDocument,
  SetAtlasCanvas,
  updateDocumentPin,
  updateDocumentSource,
  updateDocumentViewport,
  type AnalyzeError,
  type AnalyzeResult,
  type AtlasDiagnostic,
  type AtlasSymbolStatus,
  type SetAtlasDocument,
  type SetAtlasLibrary,
  type SetAtlasScene,
  type SetAtlasSource,
  type TypeRelation,
  type TypeSetSymbol,
} from "@th-m/set-theory-visualization";
import { CodeEditor } from "./CodeEditor";

type LeftTab = "library" | "types";
type InspectorTab = "source" | "selection" | "diagnostics";
type AnalysisStatus = "idle" | "working" | "current" | "stale" | "error";

const STARTER_SOURCE = `type CanCross = "green" | "orange";
type ShouldStop = "orange" | "red";
type TrafficLight = CanCross | ShouldStop;

type WithName = { name: string };
type WithAge = { age: number };
type User = WithName & WithAge;

type Universe = unknown;
type Impossible = string & number;
type EscapeHatch = any;
type Collection<T> = T[];
`;

const emptyScene: SetAtlasScene = {
  width: 1280,
  height: 820,
  regions: [],
  cards: [],
  atoms: [],
  warnings: [],
};

function activeDocument(library: SetAtlasLibrary): SetAtlasDocument {
  return library.documents.find(({ id }) => id === library.activeDocumentId) ?? library.documents[0];
}

function relationLabel(relation: TypeRelation, selectedId: string): string {
  if (relation.kind === "proper-subset") {
    return relation.sourceId === selectedId ? "is contained by" : "contains";
  }
  if (relation.kind === "equivalent") return "is equivalent to";
  if (relation.kind === "disjoint") return "is disjoint from";
  if (relation.kind === "overlap") return "overlaps";
  return "has an uncertain relation to";
}

function statusLabel(status: AnalysisStatus): string {
  if (status === "working") return "Analyzing";
  if (status === "current") return "Compiler current";
  if (status === "stale") return "Showing last valid atlas";
  if (status === "error") return "Compiler errors";
  return "Awaiting source";
}

function sourceSummary(source: SetAtlasSource): string {
  if (source.mode === "snippet") return source.fileName || "input.ts";
  return source.sourceFilePath || "No project file selected";
}

function LibraryPanel({
  library,
  document,
  analysis,
  tab,
  search,
  open,
  onTab,
  onSearch,
  onSwitch,
  onCreate,
  onDuplicate,
  onDelete,
  onSelectSymbol,
  onClose,
}: {
  library: SetAtlasLibrary;
  document: SetAtlasDocument;
  analysis: AnalyzeResult | null;
  tab: LeftTab;
  search: string;
  open: boolean;
  onTab: (tab: LeftTab) => void;
  onSearch: (value: string) => void;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSelectSymbol: (id: string) => void;
  onClose: () => void;
}) {
  const symbols = (analysis?.symbols ?? []).filter((symbol) =>
    `${symbol.name} ${symbol.display}`.toLowerCase().includes(search.toLowerCase()),
  );
  const statusOrder: AtlasSymbolStatus[] = ["region", "universe", "empty", "template", "exception"];

  return (
    <div className={`set-panel-shell set-panel-shell--library${open ? " is-open" : ""}`}>
      <aside className="set-panel set-library" aria-label="Set atlas library">
        <div className="set-panel-heading">
          <div>
            <span className="set-eyebrow">LOCAL WORKBENCH</span>
            <h1>TypeScript sets</h1>
          </div>
          <button className="set-icon-button set-panel-close" type="button" onClick={onClose}>Close</button>
        </div>
        <div className="set-panel-tabs" aria-label="Library panel">
          <button type="button" className={tab === "library" ? "is-active" : ""} onClick={() => onTab("library")}>Atlases</button>
          <button type="button" className={tab === "types" ? "is-active" : ""} onClick={() => onTab("types")}>Types</button>
        </div>
        {tab === "library" ? (
          <>
            <div className="set-library-actions">
              <button className="set-button set-button--primary" type="button" onClick={onCreate}>New atlas</button>
            </div>
            <nav className="set-document-list" aria-label="Saved set atlases">
              {library.documents.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === document.id ? "is-active" : ""}
                  onClick={() => onSwitch(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.source.mode === "snippet" ? "PASTED TYPESCRIPT" : "PROJECT FILE"}</span>
                  <small>{sourceSummary(item.source)}</small>
                </button>
              ))}
            </nav>
            <div className="set-library-footer">
              <button className="set-button" type="button" onClick={onDuplicate}>Duplicate</button>
              <button className="set-button set-button--error" type="button" onClick={onDelete}>Delete</button>
              <p>Source references, viewport, and pins are saved in this browser.</p>
            </div>
          </>
        ) : (
          <div className="set-type-index">
            <label className="set-search-field">
              <span>FILTER DECLARED TYPES</span>
              <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by name or type" />
            </label>
            <div className="set-type-groups">
              {statusOrder.map((status) => {
                const matches = symbols.filter((symbol) => symbol.status === status);
                if (matches.length === 0) return null;
                return (
                  <section key={status}>
                    <h2>{status === "region" ? "SETS" : status.toUpperCase()}</h2>
                    {matches.map((symbol) => (
                      <button key={symbol.id} type="button" onClick={() => onSelectSymbol(symbol.id)}>
                        <strong>{symbol.name}</strong>
                        <span>{symbol.kind} · {symbol.display}</span>
                      </button>
                    ))}
                  </section>
                );
              })}
              {analysis && symbols.length === 0 && <p className="set-empty-copy">No declared types match this filter.</p>}
              {!analysis && <p className="set-empty-copy">Analyze valid TypeScript to populate the type index.</p>}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function InspectorPanel({
  document,
  analysis,
  scene,
  selected,
  selectedRelations,
  diagnostics,
  tab,
  open,
  onTab,
  onClose,
  onSource,
  onAnalyze,
  onUnpin,
}: {
  document: SetAtlasDocument;
  analysis: AnalyzeResult | null;
  scene: SetAtlasScene;
  selected: TypeSetSymbol | null;
  selectedRelations: Array<{ relation: TypeRelation; other?: TypeSetSymbol }>;
  diagnostics: AtlasDiagnostic[];
  tab: InspectorTab;
  open: boolean;
  onTab: (tab: InspectorTab) => void;
  onClose: () => void;
  onSource: (source: SetAtlasSource) => void;
  onAnalyze: () => void;
  onUnpin: (sceneId: string) => void;
}) {
  const projectSource = document.source.mode === "project" ? document.source : null;
  const snippetSource = document.source.mode === "snippet" ? document.source : null;
  const selectedRegion = selected ? scene.regions.find((region) => region.symbolIds.includes(selected.id)) : undefined;
  const selectedCard = selected ? scene.cards.find((card) => card.symbolId === selected.id) : undefined;

  return (
    <div className={`set-panel-shell set-panel-shell--inspector${open ? " is-open" : ""}`}>
      <aside className="set-panel set-inspector" aria-label="Set atlas inspector">
        <div className="set-panel-heading">
          <div>
            <span className="set-eyebrow">ATLAS INSPECTOR</span>
            <h2>{tab === "source" ? "TypeScript source" : tab === "selection" ? selected?.name ?? "No selection" : "Diagnostics"}</h2>
          </div>
          <button className="set-icon-button set-panel-close" type="button" onClick={onClose}>Close</button>
        </div>
        <div className="set-panel-tabs set-panel-tabs--three" aria-label="Inspector panel">
          <button type="button" className={tab === "source" ? "is-active" : ""} onClick={() => onTab("source")}>Source</button>
          <button type="button" className={tab === "selection" ? "is-active" : ""} onClick={() => onTab("selection")}>Type</button>
          <button type="button" className={tab === "diagnostics" ? "is-active" : ""} onClick={() => onTab("diagnostics")}>Issues {diagnostics.length + scene.warnings.length}</button>
        </div>
        {tab === "source" && (
          <div className="set-inspector-content set-source-content">
            <div className="set-segmented set-source-mode" aria-label="Source mode">
              <button
                type="button"
                className={snippetSource ? "is-active" : ""}
                onClick={() => onSource({ mode: "snippet", fileName: "input.ts", code: STARTER_SOURCE })}
              >Paste</button>
              <button
                type="button"
                className={projectSource ? "is-active" : ""}
                onClick={() => onSource({ mode: "project", sourceFilePath: "" })}
              >Project file</button>
            </div>
            {snippetSource ? (
              <>
                <label className="set-field">
                  <span>VIRTUAL FILE NAME</span>
                  <input
                    value={snippetSource.fileName}
                    onChange={(event) => onSource({ ...snippetSource, fileName: event.target.value })}
                    spellCheck={false}
                  />
                </label>
                <div className="set-editor-frame">
                  <CodeEditor
                    value={snippetSource.code}
                    onChange={(code) => onSource({ ...snippetSource, code })}
                    ariaLabel="Pasted TypeScript source"
                  />
                </div>
                <p className="set-helper-copy">Analyzed locally with a strict compiler profile after you pause typing.</p>
              </>
            ) : (
              <>
                <label className="set-field">
                  <span>TYPESCRIPT FILE PATH</span>
                  <input
                    value={projectSource?.sourceFilePath ?? ""}
                    onChange={(event) => onSource({ ...(projectSource ?? { mode: "project" as const }), sourceFilePath: event.target.value })}
                    placeholder="/absolute/path/to/model.ts"
                    spellCheck={false}
                  />
                </label>
                <label className="set-field">
                  <span>TSCONFIG OVERRIDE · OPTIONAL</span>
                  <input
                    value={projectSource?.tsconfigPath ?? ""}
                    onChange={(event) => onSource({ ...(projectSource ?? { mode: "project" as const, sourceFilePath: "" }), tsconfigPath: event.target.value || undefined })}
                    placeholder="Nearest tsconfig.json is used"
                    spellCheck={false}
                  />
                </label>
                <button className="set-button set-button--primary" type="button" onClick={onAnalyze} disabled={!projectSource?.sourceFilePath}>Load or refresh file</button>
                {analysis?.sourceText && (
                  <div className="set-editor-frame is-readonly">
                    <CodeEditor value={analysis.sourceText} readOnly ariaLabel="Referenced TypeScript source" />
                  </div>
                )}
                <p className="set-helper-copy">Project files are read-only. Imports and compiler options are resolved locally.</p>
              </>
            )}
          </div>
        )}
        {tab === "selection" && (
          <div className="set-inspector-content">
            {selected ? (
              <>
                <div className="set-type-card">
                  <span>{selected.status.toUpperCase()} · {selected.kind.toUpperCase()}</span>
                  <strong>{selected.name}</strong>
                  <code>{selected.display}</code>
                  {selected.detail && <p>{selected.detail}</p>}
                </div>
                {(selectedRegion || selectedCard) && document.pins[selectedRegion?.id ?? selectedCard?.id ?? ""] && (
                  <button className="set-button" type="button" onClick={() => onUnpin(selectedRegion?.id ?? selectedCard?.id ?? "")}>Release pinned position</button>
                )}
                <section className="set-relation-list">
                  <h3>RELATIONSHIPS</h3>
                  {selectedRelations.map(({ relation, other }) => (
                    <article key={`${relation.sourceId}:${relation.targetId}`}>
                      <span>{relationLabel(relation, selected.id)}</span>
                      <strong>{other?.name ?? "Unknown type"}</strong>
                      <small>{relation.confidence}{relation.reason ? ` · ${relation.reason}` : ""}</small>
                    </article>
                  ))}
                  {selectedRelations.length === 0 && <p className="set-empty-copy">No pairwise relationships were produced for this type.</p>}
                </section>
              </>
            ) : <p className="set-empty-copy">Select a region or choose a type from the index.</p>}
          </div>
        )}
        {tab === "diagnostics" && (
          <div className="set-inspector-content set-diagnostics">
            {diagnostics.map((diagnostic, index) => (
              <article key={`${diagnostic.code}:${diagnostic.span?.start ?? index}`} className={`is-${diagnostic.severity}`}>
                <span>{diagnostic.severity.toUpperCase()} · TS{diagnostic.code}</span>
                <p>{diagnostic.message}</p>
                {diagnostic.span && <small>Line {diagnostic.span.line}, column {diagnostic.span.column}</small>}
              </article>
            ))}
            {scene.warnings.map((warning, index) => (
              <article key={`geometry:${index}`} className="is-warning">
                <span>ATLAS · APPROXIMATE</span>
                <p>{warning}</p>
              </article>
            ))}
            {diagnostics.length === 0 && scene.warnings.length === 0 && <p className="set-empty-copy">No compiler or geometry issues.</p>}
          </div>
        )}
      </aside>
    </div>
  );
}

export function SetAtlasApp() {
  const [library, setLibrary] = useState(loadSetAtlasLibrary);
  const document = activeDocument(library);
  const [latestAnalysis, setLatestAnalysis] = useState<AnalyzeResult | null>(null);
  const [lastValidAnalysis, setLastValidAnalysis] = useState<AnalyzeResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<LeftTab>("library");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("source");
  const [typeSearch, setTypeSearch] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [fitRequest, setFitRequest] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastValidRef = useRef<AnalyzeResult | null>(null);

  useEffect(() => saveSetAtlasLibrary(library), [library]);

  const commitDocument = useCallback((next: SetAtlasDocument) => {
    setLibrary((current) => replaceDocument(current, next));
  }, []);

  const runAnalysis = useCallback(async (source: SetAtlasSource) => {
    const revision = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnalysisStatus("working");
    try {
      const response = await fetch("/__sets/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ revision, source }),
        signal: controller.signal,
      });
      const payload = await response.json() as AnalyzeResult | AnalyzeError;
      if (revision !== requestRef.current) return;
      if (!response.ok || "error" in payload) throw new Error("error" in payload ? payload.error : "TypeScript analysis failed.");
      setLatestAnalysis(payload);
      const hasErrors = payload.diagnostics.some(({ severity }) => severity === "error");
      if (!hasErrors) {
        lastValidRef.current = payload;
        setLastValidAnalysis(payload);
        setAnalysisStatus("current");
      } else {
        setAnalysisStatus(lastValidRef.current ? "stale" : "error");
        setInspectorTab("diagnostics");
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setAnalysisStatus(lastValidRef.current ? "stale" : "error");
      setToast(error instanceof Error ? error.message : "TypeScript analysis failed.");
    }
  }, []);

  useEffect(() => {
    setLatestAnalysis(null);
    setLastValidAnalysis(null);
    lastValidRef.current = null;
    setSelectedSymbolId(null);
    setAnalysisStatus("idle");
    setFitRequest((value) => value + 1);
  }, [document.id]);

  useEffect(() => {
    if (document.source.mode !== "snippet") return;
    const timer = window.setTimeout(() => void runAnalysis(document.source), 420);
    return () => window.clearTimeout(timer);
  }, [document.id, document.source, runAnalysis]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const renderAnalysis = lastValidAnalysis ?? latestAnalysis;
  const scene = useMemo(
    () => renderAnalysis ? buildSetAtlasScene(renderAnalysis, document.pins) : emptyScene,
    [renderAnalysis, document.pins],
  );
  const diagnostics = latestAnalysis?.diagnostics ?? [];
  const selected = renderAnalysis?.symbols.find(({ id }) => id === selectedSymbolId) ?? null;
  const selectedRelations = useMemo(() => {
    if (!selected || !renderAnalysis) return [];
    return renderAnalysis.relations
      .filter(({ sourceId, targetId }) => sourceId === selected.id || targetId === selected.id)
      .map((relation) => ({
        relation,
        other: renderAnalysis.symbols.find(({ id }) => id === (relation.sourceId === selected.id ? relation.targetId : relation.sourceId)),
      }));
  }, [selected, renderAnalysis]);

  const selectSymbol = (id: string) => {
    setSelectedSymbolId(id);
    setInspectorTab("selection");
    setInspectorOpen(true);
  };

  const createAtlas = () => {
    const next = createBlankDocument("Untitled set atlas");
    setLibrary((current) => addDocument(current, next));
    setLeftTab("library");
    setLibraryOpen(false);
  };

  const duplicateAtlas = () => {
    const next = duplicateDocument(document);
    setLibrary((current) => addDocument(current, next));
    setLibraryOpen(false);
  };

  const deleteAtlas = () => {
    if (!window.confirm(`Delete “${document.name}” from this browser?`)) return;
    setLibrary((current) => deleteDocument(current, document.id));
  };

  const isStale = analysisStatus === "stale";

  return (
    <main className="set-app bg-background text-foreground font-mono">
      <LibraryPanel
        library={library}
        document={document}
        analysis={renderAnalysis}
        tab={leftTab}
        search={typeSearch}
        open={libraryOpen}
        onTab={setLeftTab}
        onSearch={setTypeSearch}
        onSwitch={(id) => { setLibrary((current) => setActiveDocument(current, id)); setLibraryOpen(false); }}
        onCreate={createAtlas}
        onDuplicate={duplicateAtlas}
        onDelete={deleteAtlas}
        onSelectSymbol={selectSymbol}
        onClose={() => setLibraryOpen(false)}
      />
      <section className="set-stage" aria-label="Set atlas canvas">
        <header className="set-toolbar">
          <div className="set-toolbar-primary">
            <button className="set-button set-mobile-panel-button" type="button" onClick={() => setLibraryOpen(true)}>Library</button>
            <label className="set-title-field">
              <span>CURRENT ATLAS</span>
              <input value={document.name} onChange={(event) => commitDocument(renameDocument(document, event.target.value))} />
            </label>
            <button className="set-button set-button--primary" type="button" onClick={() => { setInspectorTab("source"); setInspectorOpen(true); }}>Edit source</button>
          </div>
          <div className="set-toolbar-secondary">
            <span className={`set-analysis-status is-${analysisStatus}`}><i />{statusLabel(analysisStatus)}</span>
            {renderAnalysis && <span className="set-compiler-version">TS {renderAnalysis.compilerVersion}</span>}
            <button className="set-button" type="button" onClick={() => { commitDocument({ ...document, pins: {}, updatedAt: new Date().toISOString() }); setToast("Generated layout restored."); }}>Reset pins</button>
            <button className="set-button" type="button" onClick={() => setFitRequest((value) => value + 1)}>Fit</button>
            <button className="set-button set-mobile-panel-button" type="button" onClick={() => setInspectorOpen(true)}>Inspector</button>
          </div>
        </header>
        {isStale && (
          <button className="set-stale-banner" type="button" onClick={() => { setInspectorTab("diagnostics"); setInspectorOpen(true); }}>
            The source has errors. The canvas is preserving the last valid atlas.
          </button>
        )}
        {renderAnalysis ? (
          <SetAtlasCanvas
            scene={scene}
            selectedSymbolId={selectedSymbolId}
            viewport={document.viewport}
            fitRequest={fitRequest}
            onSelect={selectSymbol}
            onPin={(sceneId, point) => commitDocument(updateDocumentPin(document, sceneId, point))}
            onViewportChange={(viewport) => commitDocument(updateDocumentViewport(document, viewport))}
          />
        ) : (
          <div className="set-canvas-empty">
            <span>SET ATLAS / WAITING</span>
            <h2>{analysisStatus === "working" ? "Reading the type universe…" : "Add valid TypeScript to begin."}</h2>
            <p>The atlas will place named types as contained, separate, or overlapping sets.</p>
          </div>
        )}
      </section>
      <InspectorPanel
        document={document}
        analysis={latestAnalysis}
        scene={scene}
        selected={selected}
        selectedRelations={selectedRelations}
        diagnostics={diagnostics}
        tab={inspectorTab}
        open={inspectorOpen}
        onTab={setInspectorTab}
        onClose={() => setInspectorOpen(false)}
        onSource={(source) => commitDocument(updateDocumentSource(document, source))}
        onAnalyze={() => void runAnalysis(document.source)}
        onUnpin={(sceneId) => commitDocument(removeDocumentPin(document, sceneId))}
      />
      {(libraryOpen || inspectorOpen) && <button className="set-mobile-backdrop" type="button" aria-label="Close side panels" onClick={() => { setLibraryOpen(false); setInspectorOpen(false); }} />}
      {toast && <div className="set-toast" role="status">{toast}</div>}
    </main>
  );
}
