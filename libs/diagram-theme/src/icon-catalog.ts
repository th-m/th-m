/** Stable renderer keys, in inventory order. Legacy morpheme keys keep existing links working. */
export const aiFactoryIconKinds = [
  "truth", "coherence", "correspondence", "consequence", "vision", "meaning", "goal", "opportunity", "solution", "experiment", "value",
  "morpheme-diffuse", "morpheme-refined", "term-of-art", "understanding", "inference", "bottleneck",
  "implementation", "automation", "ontology-node", "typed-relation", "disconnected", "operator",
  "text", "label", "token", "embedding", "slop-fault", "slop-drift", "slop-decay", "self", "others", "agents", "contact", "threshold", "trigger",
  "knowledge-factory", "factory-worker",
  "factory-engineer", "shared-capital", "solutioning", "graph-context",
] as const;

export type AiFactoryIconKind = typeof aiFactoryIconKinds[number];

/** Roles classify how a concept is used in this visual language, not its universal ontology. */
export type AiFactorySemanticRole =
  | "concept" | "evaluation" | "situated state" | "process" | "constraint"
  | "model entity" | "relationship" | "relationship state" | "operation"
  | "language representation" | "model representation" | "model output" | "participant" | "system" | "resource";

export interface AiFactoryIconSpec {
  readonly semanticRole: AiFactorySemanticRole;
  readonly iconId: string;
  readonly title: string;
  /** Optional question or short statement that refines the title's intent and meaning. */
  readonly subheading?: string;
  readonly definition: string;
  readonly visualGrammar: string;
}

/** One source for inventory language and standalone icon accessibility. Geometry lives separately. */
export const aiFactoryIconCatalog: Readonly<Record<AiFactoryIconKind, AiFactoryIconSpec>> = {
  truth: {
    semanticRole: "concept", iconId: "truth", title: "Truth",
    definition: "What is the case, against which a claim or inference can be checked.",
    visualGrammar: "A dotted blue triangle marks the reference for the three related evaluation glyphs; dots do not mean that truth itself is uncertain. Blue identifies the information and evaluation family, not a verified claim.",
  },
  coherence: {
    semanticRole: "evaluation", iconId: "coherence", title: "Coherence", subheading: "Does it fit?",
    definition: "Consistency among the claims and relationships within a system.",
    visualGrammar: "A solid triangle connects its three corners to one blue center through dotted internal paths.",
  },
  correspondence: {
    semanticRole: "evaluation", iconId: "correspondence", title: "Correspondence", subheading: "Does it match?",
    definition: "Agreement between a claim or model and the reality or evidence it refers to.",
    visualGrammar: "An inverted triangle links three blue-outlined reference points with gray edges.",
  },
  consequence: {
    semanticRole: "evaluation", iconId: "consequence", title: "Consequence", subheading: "Does it work?",
    definition: "The outcome of an action, considered here as a test of whether it achieves its purpose.",
    visualGrammar: "A right-facing triangle and dotted internal path converge on a blue outcome point.",
  },
  vision: {
    semanticRole: "concept", iconId: "vision", title: "Vision",
    definition: "A felt possibility that gives direction before a specific outcome or plan is fixed.",
    visualGrammar: "An outlined center and four detached cardinal rays suggest orientation without a fixed destination.",
  },
  meaning: {
    semanticRole: "concept", iconId: "meaning", title: "Meaning",
    definition: "The significance an expression, experience, or action has in context.",
    visualGrammar: "A gray center sits inside a dotted gold boundary with four dotted diagonal extensions.",
  },
  goal: {
    semanticRole: "concept", iconId: "goal", title: "Goal",
    definition: "A desired outcome that directs action and provides a reference for judging progress.",
    visualGrammar: "Gold crosshairs and a central circle sit within a larger dotted boundary, identifying a target.",
  },
  opportunity: {
    semanticRole: "concept", iconId: "opportunity", title: "Opportunity",
    definition: "A path toward meaning or value: a possibility worth exploring in pursuit of a goal.",
    visualGrammar: "A neutral input rises through the same two curved paths as Experiment, ending in equally sized outlined circles: gray on the left and gold on the right. Gold marks meaning or value; the branches depict possibilities, not guaranteed outcomes.",
  },
  solution: {
    semanticRole: "concept", iconId: "solution", title: "Solution",
    definition: "A proposed intervention intended to address an opportunity and advance a goal.",
    visualGrammar: "A gold outlined diamond sits between two neutral endpoint dots and short horizontal paths. Air gaps separate the intervention from the paths; the mark does not imply verified success.",
  },
  experiment: {
    semanticRole: "evaluation", iconId: "experiment", title: "Experiment",
    definition: "A path toward information: a bounded test of an assumption that produces observations to inform a decision.",
    visualGrammar: "A neutral input rises from below and divides into two curved paths toward equally sized outlined triangles: gray on the left and information blue on the right. The highlight distinguishes observations without implying success or a required two-arm trial.",
  },
  value: {
    semanticRole: "concept", iconId: "value", title: "Value", subheading: "Does it matter?",
    definition: "What matters to participants, guides their choices, and is realized through worthwhile outcomes in their relationships.",
    visualGrammar: "One gold Self dot is surrounded by eight detached, solid rays; there is no enclosing boundary.",
  },
  "morpheme-diffuse": {
    semanticRole: "concept", iconId: "idea-diffuse", title: "Abstract idea",
    definition: "An idea considered apart from a specific instance or implementation.",
    visualGrammar: "A dotted circle and central text dash depict the open, context-dependent form used here, not a rule that every abstract idea is undefined.",
  },
  "morpheme-refined": {
    semanticRole: "concept", iconId: "idea-refined", title: "Concrete idea",
    definition: "An idea specified in relation to a particular situation, object, or action.",
    visualGrammar: "A solid circle and central text dash depict a bounded, shareable form; the boundary alone does not guarantee shared understanding.",
  },
  "term-of-art": {
    semanticRole: "language representation", iconId: "term-of-art", title: "Term of art",
    definition: "An expression with a precise, shared meaning within a domain.",
    visualGrammar: "A solid idea boundary and text dash gain four cardinal connection ports for use in a domain model.",
  },
  understanding: {
    semanticRole: "situated state", iconId: "understanding", title: "Understanding",
    definition: "A situated working model that relates meaning to context, evidence, and stakes.",
    visualGrammar: "A gold boundary and center combine with solid cardinal and dotted diagonal extensions to mark situated context.",
  },
  inference: {
    semanticRole: "process", iconId: "inference", title: "Inference",
    definition: "Drawing conclusions or predictions from premises, evidence, or learned patterns.",
    visualGrammar: "One filled input branches to two outlined candidates and four text-like continuations. A gold segment emphasizes one possibility, not a verified conclusion. The counts illustrate expansion, not a required sampling procedure.",
  },
  bottleneck: {
    semanticRole: "constraint", iconId: "bottleneck", title: "Bottleneck",
    definition: "A limiting condition whose capacity restricts the flow or progress of a larger process.",
    visualGrammar: "Three input paths meet a narrow gate; only the middle path reaches a dotted output circle.",
  },
  implementation: {
    semanticRole: "process", iconId: "implementation", title: "Implementation",
    definition: "Putting a plan, specification, or decision into concrete action or an artifact.",
    visualGrammar: "A small bounded node extends into a directed line with an outlined arrowhead.",
  },
  automation: {
    semanticRole: "process", iconId: "automation", title: "Automation",
    definition: "Execution of a defined process by a system with reduced need for repeated human intervention.",
    visualGrammar: "A gold source connects to a smaller gray execution node and gold outlined arrow. Its understanding-derived form expresses the preferred grounding, not a property of all automation.",
  },
  "ontology-node": {
    semanticRole: "model entity", iconId: "ontology-node", title: "Ontology node",
    definition: "A concept or entity represented within an ontology and connected through typed relationships.",
    visualGrammar: "A gold central boundary connects upward and rightward to smaller gray nodes. Their placement illustrates connections, not semantic directions.",
  },
  "typed-relation": {
    semanticRole: "relationship", iconId: "typed-relation", title: "Typed relation",
    definition: "A named connection that specifies how modeled concepts or entities are related.",
    visualGrammar: "A framed label interrupts a directed edge. The empty specimen reserves space for the relationship name.",
  },
  disconnected: {
    semanticRole: "relationship state", iconId: "disconnected", title: "Disconnected",
    definition: "A state in which a connection between two sides has not been established.",
    visualGrammar: "Two terminated gray edges are separated by a gold cross. This denotes a missing connection, not mathematical inequality.",
  },
  operator: {
    semanticRole: "operation", iconId: "operator", title: "Operator",
    definition: "A specified operation that combines inputs or transforms meaning.",
    visualGrammar: "A plus sign inside a small circle depicts composition. A label or surrounding diagram must identify any more specific operation.",
  },
  text: {
    semanticRole: "language representation", iconId: "text", title: "Text",
    definition: "Ordered written language that expresses meaning in a readable form.",
    visualGrammar: "Three rows of separated horizontal strokes stand for ordered spans of writing, not exact words or tokens.",
  },
  label: {
    semanticRole: "language representation", iconId: "label", title: "Label",
    definition: "A name or short expression assigned to identify something.",
    visualGrammar: "A framed span within the text glyph distinguishes the naming expression from its surrounding text; the frame is not a selection control.",
  },
  token: {
    semanticRole: "model representation", iconId: "token", title: "Token",
    definition: "A discrete unit of encoded input or output processed by a model.",
    visualGrammar: "Adjacent shaded blocks illustrate a token sequence. Each segment stands for one unit; the whole strip is not one token.",
  },
  embedding: {
    semanticRole: "model representation", iconId: "embedding", title: "Embedding",
    definition: "A numerical vector representing an item in a model's learned space.",
    visualGrammar: "A shaded matrix is shorthand for numerical dimensions across representations, not a literal view of one vector or its dimensionality.",
  },
  "slop-fault": {
    semanticRole: "model output", iconId: "slop-fault", title: "Fault", subheading: "Slop · Bad AI output",
    definition: "AI-generated output whose apparent completeness conceals an error or unsupported claim.",
    visualGrammar: "A clean output line is interrupted by one compact red fault. The jagged contour makes the defect visible through shape as well as color.",
  },
  "slop-drift": {
    semanticRole: "model output", iconId: "slop-drift", title: "Drift", subheading: "Slop · Bad AI output",
    definition: "AI-generated output that loses alignment with the intended question, context, or goal.",
    visualGrammar: "Two horizontal strokes fall out of alignment. The displaced red continuation marks departure from the intended course.",
  },
  "slop-decay": {
    semanticRole: "model output", iconId: "slop-decay", title: "Decay", subheading: "Slop · Bad AI output",
    definition: "AI-generated output that loses coherence or usefulness as it continues.",
    visualGrammar: "A solid output line breaks into progressively smaller red fragments, depicting a loss of coherence.",
  },
  self: {
    semanticRole: "participant", iconId: "self", title: "Self",
    definition: "The individual whose perspective anchors the relationship.",
    visualGrammar: "One small solid gold dot, without an enclosing ring or directional spokes.",
  },
  others: {
    semanticRole: "participant", iconId: "others", title: "Others",
    definition: "People beyond the individual perspective who participate in or are affected by the relationship.",
    visualGrammar: "Three equally sized solid gray dots form a compact cluster. Three denotes plurality, not an exact headcount or a difference in worth.",
  },
  agents: {
    semanticRole: "participant", iconId: "agents", title: "Agents",
    definition: "AI systems that pursue goals by choosing and carrying out actions within assigned boundaries.",
    visualGrammar: "Three equally sized solid gray pentagons share the arrangement of Others. The angular shape distinguishes AI agents from people; three denotes plurality, not an exact count.",
  },
  contact: {
    semanticRole: "concept", iconId: "contact", title: "Contact",
    definition: "An event reaches an activation point.",
    visualGrammar: "A muted incoming line meets a gold dot at a short vertical boundary. A gold continuation marks the resulting activation.",
  },
  threshold: {
    semanticRole: "constraint", iconId: "threshold", title: "Threshold",
    definition: "A boundary beyond which a condition becomes active.",
    visualGrammar: "A muted line reaches a dotted vertical boundary, then steps upward into a gold active state.",
  },
  trigger: {
    semanticRole: "concept", iconId: "trigger", title: "Trigger",
    definition: "An event or condition that initiates an action or process.",
    visualGrammar: "Two small, open right-pointing chevrons use fine gold strokes to mark initiation, not speed or repeated execution.",
  },
  "knowledge-factory": {
    semanticRole: "system", iconId: "knowledge-factory", title: "Knowledge factory",
    definition: "The socio-technical system that transforms evidence, expertise, and intent into decisions and product outcomes.",
    visualGrammar: "Three source points enter one bounded transformation system, converge on a gold decision diamond, and leave as two outcome points. Counts illustrate plurality rather than fixed inputs or outputs.",
  },
  "factory-worker": {
    semanticRole: "participant", iconId: "factory-worker", title: "Factory worker",
    definition: "A participant executing a bounded step designed by the larger system; the term describes a role, not talent or status.",
    visualGrammar: "One gold participant point sits on a production rail immediately before one outlined work station, emphasizing execution within a bounded step.",
  },
  "factory-engineer": {
    semanticRole: "participant", iconId: "factory-engineer", title: "Factory engineer",
    definition: "A participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass.",
    visualGrammar: "One gold participant connects to a bracket surrounding three linked stations, marking responsibility for the whole production loop rather than one station.",
  },
  "shared-capital": {
    semanticRole: "resource", iconId: "shared-capital", title: "Shared capital",
    definition: "Reusable organizational assets that accumulate learning and increase future capability.",
    visualGrammar: "Three offset asset layers form a persistent stack while a gold return path carries the lower layer back toward the top to signal reuse.",
  },
  solutioning: {
    semanticRole: "process", iconId: "solutioning", title: "Solutioning",
    definition: "Framing, generating, testing, and revising interventions in response to a meaningful problem.",
    visualGrammar: "Four corner states form a directed revision loop around a gold intervention diamond; the four points name the process here rather than imposing universal phases.",
  },
  "graph-context": {
    semanticRole: "model representation", iconId: "graph-context", title: "Graph context",
    definition: "Navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes, with provenance.",
    visualGrammar: "Five heterogeneous nodes form a navigable network, with one blue route running from a square provenance source through the central node to a referenced node. Blue identifies the evidence reference, not its verification status.",
  },
};

export function aiFactoryIconLabel(kind: AiFactoryIconKind): string {
  const { title, definition } = aiFactoryIconCatalog[kind];
  return `${title}: ${definition}`;
}
