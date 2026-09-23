/** Stable renderer keys, in inventory order. Legacy morpheme keys keep existing links working. */
export const aiFactoryIconKinds = [
  "truth", "coherence", "correspondence", "consequence", "vision", "meaning", "goal", "value",
  "morpheme-diffuse", "morpheme-refined", "term-of-art", "understanding", "inference", "bottleneck",
  "implementation", "automation", "ontology-node", "typed-relation", "disconnected", "operator",
  "text", "label", "token", "embedding", "self", "others",
] as const;

export type AiFactoryIconKind = typeof aiFactoryIconKinds[number];

/** Roles classify how a concept is used in this visual language, not its universal ontology. */
export type AiFactorySemanticRole =
  | "concept" | "evaluation" | "situated state" | "process" | "constraint"
  | "model entity" | "relationship" | "relationship state" | "operation"
  | "language representation" | "model representation" | "participant";

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
    visualGrammar: "A dotted triangle marks the reference for the three related evaluation glyphs; dots do not mean that truth itself is uncertain.",
  },
  coherence: {
    semanticRole: "evaluation", iconId: "coherence", title: "Coherence", subheading: "Does it fit?",
    definition: "Consistency among the claims and relationships within a system.",
    visualGrammar: "A solid triangle connects its three corners to one gold center through dotted internal paths.",
  },
  correspondence: {
    semanticRole: "evaluation", iconId: "correspondence", title: "Correspondence", subheading: "Does it match?",
    definition: "Agreement between a claim or model and the reality or evidence it refers to.",
    visualGrammar: "An inverted triangle links three gold-outlined reference points with gray edges.",
  },
  consequence: {
    semanticRole: "evaluation", iconId: "consequence", title: "Consequence", subheading: "Does it work?",
    definition: "The outcome of an action, considered here as a test of whether it achieves its purpose.",
    visualGrammar: "A right-facing triangle and dotted internal path converge on a gold outcome point.",
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
    visualGrammar: "One gray input branches to three outlined outputs: an example of possible conclusions, not a required input or output count.",
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
};

export function aiFactoryIconLabel(kind: AiFactoryIconKind): string {
  const { title, definition } = aiFactoryIconCatalog[kind];
  return `${title}: ${definition}`;
}
