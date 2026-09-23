import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiFactoryIcon, AiFactoryMotif, AiFactorySeriesGraphic, AiFactorySeriesMap } from "./ai-factory-motif";

afterEach(cleanup);

describe("AiFactoryMotif", () => {
  it.each([
    "experience-but-lacking",
    "model-priorities-and-goal-fit",
    "vision-to-morpheme",
    "refinement-and-discipline-to-term-of-art",
    "understanding-in-embedding-space",
    "central-queue-to-bounded-loops",
    "term-of-art-to-implementation",
    "ontology-of-terms",
    "trigger-opens-hypotheses",
    "consequence-returns-to-context",
  ] as const)("uses the same compact edge-label metrics throughout %s", variant => {
    const { container } = render(<AiFactoryMotif variant={variant} />);
    const labels = container.querySelectorAll(".ai-factory-motif__connector-label");
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      const text = label.querySelector("text")!;
      const frame = label.querySelector("rect")!;
      const width = Number(frame.getAttribute("width"));
      expect(frame).toHaveAttribute("height", "16");
      expect(width % 4).toBe(0);
      expect(width).toBeGreaterThanOrEqual(text.textContent!.length * 5.6 + 12);
      expect(Number(frame.getAttribute("x")) + width / 2).toBe(Number(text.getAttribute("x")));
      expect(label).not.toHaveClass("ai-factory-motif__connector-label--compact");
    }
  });

  it.each([
    ["experience-but-lacking", "Personal meaning is not yet shared value", "Experience", "Shared understanding"],
    ["model-priorities-and-goal-fit", "Fluent output is not value insight", "Training priorities", "Your actual goal"],
    ["vision-to-morpheme", "Vision becomes an idea", "Vision", "Idea"],
    ["refinement-and-discipline-to-term-of-art", "Refinement and discipline establish a term of art", "Refinement", "Term of art"],
    ["understanding-in-embedding-space", "Short input, useful output—or just more tokens", "Understanding", "Useful expansion"],
    ["central-queue-to-bounded-loops", "The same teams, a different place for understanding", "One interpretation gate", "System change"],
    ["term-of-art-to-implementation", "Understanding carries a term into implementation", "Term of art", "Implementation"],
    ["ontology-of-terms", "Ontology coordinates terms of art to make them actionable", "Actor", "Constraint"],
    ["trigger-opens-hypotheses", "A trigger opens hypotheses, not a diagnosis", "Typed observation", "Code regression"],
    ["consequence-returns-to-context", "The return edge turns an outcome into learning", "ACTIVITY ONLY", "LEARNING"],
  ] as const)("renders the %s chapter with an accessible diagram", (variant, title, firstLabel, secondLabel) => {
    render(<AiFactoryMotif variant={variant} />);

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    const diagram = screen.getByRole("img", { name: new RegExp(title) });
    expect(diagram).toContainElement(within(diagram).getByText(firstLabel));
    expect(diagram).toContainElement(within(diagram).getByText(secondLabel));
    expect(diagram.querySelector("title")).toHaveTextContent(title);
    expect(diagram.querySelector("desc")).not.toBeEmptyDOMElement();
    expect(screen.getByRole("region", { name: "Scrollable AI Factory motif" })).toHaveAttribute("tabindex", "0");
  });

  it("keeps competing hypotheses visible and defers consequence until after action", () => {
    render(<AiFactoryMotif variant="trigger-opens-hypotheses" />);

    const diagram = screen.getByRole("img", { name: /A trigger opens hypotheses, not a diagnosis/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 520");
    expect(Array.from(diagram.querySelectorAll("[data-hypothesis]"), hypothesis => hypothesis.getAttribute("data-hypothesis"))).toEqual([
      "regression", "tradeoff", "noise",
    ]);
    expect(diagram.querySelector('[data-stage="inference"] .ai-factory-icon--inference')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="typed-observation"] .ai-factory-icon--trigger')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="typed-observation"] .ai-factory-icon--ontology-node')).not.toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="truth-practice-gates"] .ai-factory-icon--coherence')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="truth-practice-gates"] .ai-factory-icon--correspondence')).toBeInTheDocument();
    const consequence = diagram.querySelector('[data-stage="truth-practice-gates"] .ai-factory-icon--consequence')!;
    expect(consequence.closest(".ai-factory-motif__cognitive-deferred")).toBeInTheDocument();
    expect(diagram).toHaveTextContent("NOT AT THE TRIGGER");
    expect(diagram).toHaveTextContent("NO ACTION AUTHORIZED YET");
    expect(diagram.querySelectorAll('[data-relationship^="inference-to-"][marker-end]')).toHaveLength(3);
  });

  it("shows one forward path and makes the return edge the distinction between activity and learning", () => {
    render(<AiFactoryMotif variant="consequence-returns-to-context" />);

    const diagram = screen.getByRole("img", { name: /The return edge turns an outcome into learning/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 420");
    expect(diagram.querySelectorAll('.ai-factory-icon--ontology-node')).toHaveLength(1);
    expect(diagram.querySelectorAll('.ai-factory-icon--automation')).toHaveLength(1);
    expect(diagram.querySelectorAll('.ai-factory-icon--consequence')).toHaveLength(1);
    expect(diagram.querySelector('[data-relationship="consequence-to-end"]')).toHaveClass("ai-factory-motif__connector--inactive");
    expect(diagram.querySelector('[data-outcome="activity"]')).toHaveTextContent("observed, then forgotten");
    const returnEdge = diagram.querySelector('[data-relationship="consequence-to-context"]')!;
    expect(returnEdge).toHaveAttribute("marker-end");
    expect(returnEdge).toHaveAttribute("d", "M752 158V172Q752 180 760 180H896Q904 180 904 188V336Q904 344 896 344H64Q56 344 56 336V166Q56 158 64 158H124");
    expect(diagram.querySelector('[data-outcome="learning"]')).toHaveTextContent("a test, rule, threshold, or definition changes");
    const returnLabel = Array.from(diagram.querySelectorAll(".ai-factory-motif__connector-label"))
      .find(label => label.textContent === "REVISES THE NEXT CYCLE")!;
    expect(returnLabel).not.toHaveClass("ai-factory-motif__connector-label--on-edge");
    expect(returnLabel.querySelector("rect")).toHaveAttribute("y", "316");
    expect(returnLabel.querySelector("text")).toHaveAttribute("y", "328");
    expect(diagram).toHaveTextContent("NEXT CYCLE CHANGED");
  });

  it("composes repository path coordinates into a semantic map and change destination", () => {
    render(<AiFactoryMotif variant="path-declares-ownership" />);

    const diagram = screen.getByRole("img", { name: /A path maps and identifies an owned library/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 488");
    expect(Array.from(diagram.querySelectorAll("[data-path-segment]"), segment => segment.getAttribute("data-path-segment"))).toEqual([
      "boundary", "layer", "domain", "detail",
    ]);
    expect(diagram).toHaveTextContent("libs");
    expect(diagram).toHaveTextContent("edge");
    expect(diagram).toHaveTextContent("audio");
    expect(diagram).toHaveTextContent("state-zustand-player");
    expect(diagram.querySelector(".ai-factory-motif__path-boundary")).toBeInTheDocument();
    expect(diagram.querySelector('[data-coordinate="layer"]')).toHaveTextContent("cross-cutting");
    expect(diagram.querySelector('[data-coordinate="domain"]')).toHaveTextContent("Terms of art");
    expect(diagram.querySelector('[data-coordinate="implementation-details"]')).toHaveTextContent("Zustand");
    expect(diagram.querySelector('[data-coordinate="implementation-details"]')).toHaveTextContent("player store");
    expect(diagram.querySelector('[data-coordinate="implementation-details"]')).toHaveTextContent("playback");
    expect(diagram.querySelector('[data-stage="change-destination"] .ai-factory-motif__path-target-ring')).toBeInTheDocument();
    expect(diagram).toHaveTextContent("IDENTIFIES");
  });

  it("dynamically composes distinct repository contracts into budgeted agent context", () => {
    render(<AiFactoryMotif variant="contracts-govern-action" />);

    const diagram = screen.getByRole("img", { name: /Contracts compose context for bounded action/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 488");
    expect(Array.from(diagram.querySelectorAll("[data-contract]"), contract => contract.getAttribute("data-contract"))).toEqual([
      "readme", "agents", "skill",
    ]);
    expect(diagram.querySelectorAll('[data-contract] .ai-factory-icon--text')).toHaveLength(3);
    expect(diagram.querySelector('[data-contract="skill"] .ai-factory-icon--text')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="contract-composition"] .ai-factory-icon--operator')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="dynamic-context"] .ai-factory-icon--token')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="agent-action"] .ai-factory-icon--automation')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="evaluated-outcome"] .ai-factory-icon--consequence')).toBeInTheDocument();
    expect(diagram.querySelector('[data-stage="dynamic-context"] > rect')).toHaveAttribute("x", "40");
    expect(diagram.querySelector('[data-stage="dynamic-context"] > rect')).toHaveAttribute("width", "248");
    expect(diagram.querySelector('[data-stage="agent-action"] .ai-factory-icon--automation')).toHaveAttribute("transform", expect.stringContaining("translate(488 292)"));
    expect(diagram.querySelector('[data-stage="evaluated-outcome"] .ai-factory-icon--consequence')).toHaveAttribute("transform", expect.stringContaining("translate(816 292)"));
    expect(diagram).toHaveTextContent("fits the agent's");
    expect(diagram).toHaveTextContent("context budget");
    expect(diagram).toHaveTextContent("GOVERNS");
    expect(diagram).toHaveTextContent("EVALUATED BY");
  });

  it("maps layer semantics to build, verification, instrumentation, and automatic application", () => {
    render(<AiFactoryMotif variant="layers-guide-implementation" />);

    const diagram = screen.getByRole("img", { name: /Layers make construction rules executable/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 488");
    expect(Array.from(diagram.querySelectorAll("[data-layer-contract]"), layer => layer.getAttribute("data-layer-contract"))).toEqual([
      "edge", "schema", "engine",
    ]);
    expect(diagram.querySelector('[data-layer-contract="edge"]')).toHaveTextContent("Integration test");
    expect(diagram.querySelector('[data-layer-contract="edge"]')).toHaveTextContent("PostHog + Sentry wrappers");
    expect(diagram.querySelector('[data-layer-contract="schema"]')).toHaveTextContent("Generated TS interface");
    expect(diagram.querySelector('[data-layer-contract="schema"]')).toHaveTextContent("derived from the database");
    expect(diagram.querySelector('[data-layer-contract="engine"]')).toHaveTextContent("Unit tests");
    expect(diagram.querySelectorAll('[data-automation="skill-tool-calls"]')).toHaveLength(3);
    expect(diagram).toHaveTextContent("Skill + tool calls");
    expect(diagram).toHaveTextContent("EXECUTABLE BY DEFAULT");
  });

  it("separates ambiguous inputs, training and harness influences, and unverified goal fit", () => {
    render(<AiFactoryMotif variant="model-priorities-and-goal-fit" />);

    const diagram = screen.getByRole("img", { name: /Fluent output is not value insight/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 616");
    expect(Array.from(diagram.querySelectorAll("[data-input-statement]"), statement => statement.getAttribute("data-input-statement"))).toEqual([
      "Subjective claim", "Incomplete context", "Conflicting requests",
    ]);
    expect(diagram.querySelectorAll('[data-relationship="statement-to-model"][marker-end]')).toHaveLength(3);
    for (const influence of ["training", "harness"]) {
      expect(diagram.querySelector(`[data-influence-source="${influence}"]`)).toBeInTheDocument();
      expect(diagram.querySelector(`[data-influence="${influence}"]`)).toHaveAttribute("marker-end");
    }
    const model = diagram.querySelector('[data-stage="conditioned-model"]')!;
    expect(model.querySelector(".ai-factory-icon--embedding")).toBeInTheDocument();
    expect(model.querySelector(".ai-factory-icon--inference")).toBeInTheDocument();
    expect(model).toHaveTextContent("REPRESENTATION → GENERATION");
    expect(model).toHaveTextContent("encodes supplied tokens");
    expect(model).toHaveTextContent("generates a continuation");

    const output = diagram.querySelector('[data-stage="unverified-response"]')!;
    expect(output).toHaveTextContent("May mislead");
    expect(output).toHaveTextContent("or miss the goal");
    expect(output.querySelector(".ai-factory-icon--value, .ai-factory-icon--goal")).not.toBeInTheDocument();
    expect(diagram.querySelector(".ai-factory-icon--disconnected")).toBeInTheDocument();
    expect(diagram.querySelector('[data-relationship="unverified-goal-fit"]')).not.toHaveAttribute("marker-end");
    expect(diagram.querySelector('[data-stage="user-goal"] .ai-factory-icon--goal')).toBeInTheDocument();
    expect(diagram).toHaveTextContent("fit not established");
    expect(diagram).toHaveTextContent("POSSIBLE FAILURE PATH · NOT AN INEVITABLE OUTCOME");

    const caption = diagram.closest("figure")!.querySelector("figcaption")!;
    expect(caption).toHaveTextContent("Subjective does not mean false.");
    expect(caption).toHaveTextContent("not an inevitable outcome or a measured failure rate");
    const evidence = diagram.closest("figure")!.querySelector("details")!;
    expect(evidence).not.toHaveAttribute("open");
    expect(evidence).toHaveTextContent("illustrative, not a measured count or failure rate");
    expect(evidence).toHaveTextContent("Diogo Almeida");
    expect(evidence).toHaveTextContent("not a universal objective of every model");
    expect(screen.getByRole("link", { name: /his AI Engineer talk/ })).toHaveAttribute("href", "https://ai.engineer/talks/cJ0EOzey--o-jev-ceo-made-chatgpt-building-whats-next");
    expect(screen.getByRole("link", { name: /preference training can favor agreement/ })).toHaveAttribute("href", "https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models");
  });

  it("contrasts grounded short input and useful expansion with excess output without understanding", () => {
    render(<AiFactoryMotif variant="understanding-in-embedding-space" />);

    const diagram = screen.getByRole("img", { name: /Short input, useful output—or just more tokens/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 648");
    const grounded = diagram.querySelector('[data-lane="grounded"]')!;
    const ungrounded = diagram.querySelector('[data-lane="ungrounded"]')!;
    const representation = grounded.querySelector('[data-stage="representation"]')!;
    for (const kind of ["embedding", "understanding", "operator", "term-of-art"]) {
      expect(representation.querySelector(`.ai-factory-icon--${kind}`)).toBeInTheDocument();
    }
    expect(grounded).toHaveTextContent("Fits the intended result");
    const outputHeading = grounded.querySelector(".ai-factory-motif__output-heading")!;
    expect(outputHeading).toHaveTextContent("Useful expansion");
    expect(outputHeading.querySelector(".ai-factory-icon--value")).toHaveAttribute("transform", "translate(888 123) scale(0.2) translate(-80 -80)");
    expect(diagram.querySelectorAll(".ai-factory-icon--value")).toHaveLength(1);
    expect(ungrounded.querySelector(".ai-factory-icon--value")).not.toBeInTheDocument();
    expect(ungrounded).toHaveTextContent("No grounding");
    expect(ungrounded).toHaveTextContent("Does not fit the goal");
    expect(ungrounded).toHaveTextContent("excess tokens · no added value");
    expect(ungrounded.querySelector(".ai-factory-icon--disconnected")).toBeInTheDocument();
    expect(ungrounded.querySelector(".ai-factory-icon--term-of-art")).not.toBeInTheDocument();
    expect(ungrounded).toHaveAttribute("transform", "translate(0 288)");

    for (const lane of [grounded, ungrounded]) {
      expect(Array.from(lane.querySelectorAll("[data-stage]"), stage => stage.getAttribute("data-stage"))).toEqual(["input", "representation", "inference", "output"]);
      expect(lane.querySelector('[data-stage="input"] .ai-factory-icon--label')).toBeInTheDocument();
      expect(lane.querySelector('[data-stage="inference"] .ai-factory-icon--inference')).toBeInTheDocument();
      const inputTokens = lane.querySelectorAll('[data-stage="input"] .ai-factory-motif__embedding-tokens rect');
      const outputTokens = lane.querySelectorAll('[data-stage="output"] .ai-factory-motif__embedding-tokens rect');
      expect(outputTokens.length).toBeGreaterThan(inputTokens.length);
      expect(lane.querySelectorAll("[data-relationship][marker-end]")).toHaveLength(3);
      expect(lane.querySelector('[data-relationship="inference-to-output"]')).toHaveAttribute("d", "M632 168H708");
      const label = lane.querySelector(".ai-factory-motif__connector-label--on-edge")!;
      expect(label).toHaveTextContent("YIELDS");
      expect(label.querySelector("text")).toHaveAttribute("y", "168");
      const frame = label.querySelector("rect")!;
      expect(Number(frame.getAttribute("x"))).toBeGreaterThan(632);
      expect(Number(frame.getAttribute("x")) + Number(frame.getAttribute("width"))).toBeLessThan(700);
    }
    expect(ungrounded.querySelectorAll('.ai-factory-motif__generated-text path').length).toBeGreaterThan(grounded.querySelectorAll('.ai-factory-motif__generated-text path').length);
    expect(ungrounded.querySelectorAll('[data-stage="output"] .ai-factory-motif__embedding-tokens rect').length).toBeGreaterThan(grounded.querySelectorAll('[data-stage="output"] .ai-factory-motif__embedding-tokens rect').length);
    expect(diagram).toHaveTextContent("VALUE ≠ VOLUME");
    expect(screen.getByText(/This is a conceptual contrast, not a measured gain/)).toHaveTextContent("embeddings represent input; the model generates text");
  });

  it("can present the grounded and ungrounded lanes as separate article figures", () => {
    const { rerender } = render(
      <AiFactoryMotif variant="understanding-in-embedding-space" embeddingLane="grounded" />,
    );

    let figure = screen.getByRole("figure");
    let diagram = screen.getByRole("img", { name: /A grounded term can guide useful expansion/ });
    expect(figure).toHaveAttribute("data-embedding-lane", "grounded");
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 360");
    expect(diagram.querySelector('[data-lane="grounded"]')).toBeInTheDocument();
    expect(diagram.querySelector('[data-lane="ungrounded"]')).not.toBeInTheDocument();
    expect(diagram).not.toHaveTextContent("WITHOUT UNDERSTANDING");

    rerender(
      <AiFactoryMotif variant="understanding-in-embedding-space" embeddingLane="ungrounded" />,
    );

    figure = screen.getByRole("figure");
    diagram = screen.getByRole("img", { name: /Fluent inference without understanding/ });
    expect(figure).toHaveAttribute("data-embedding-lane", "ungrounded");
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 360");
    expect(diagram.querySelector('[data-lane="grounded"]')).not.toBeInTheDocument();
    expect(diagram.querySelector('[data-lane="ungrounded"]')).toBeInTheDocument();
    expect(diagram.querySelector('[data-lane="ungrounded"]')).not.toHaveAttribute("transform");
    expect(diagram).not.toHaveTextContent("WITH UNDERSTANDING");
  });

  it("contrasts one interpretation gate with bounded team learning loops", () => {
    render(<AiFactoryMotif variant="central-queue-to-bounded-loops" />);

    const diagram = screen.getByRole("img", { name: /The same teams, a different place for understanding/ });
    expect(diagram).toHaveAttribute("viewBox", "0 0 960 664");

    const centralized = diagram.querySelector('[data-topology="centralized-judgment"]')!;
    const distributed = diagram.querySelector('[data-topology="bounded-learning-loops"]')!;
    for (const topology of [centralized, distributed]) {
      expect(Array.from(topology.querySelectorAll("[data-team]"), team => team.getAttribute("data-team"))).toEqual(["A", "B", "C"]);
    }

    expect(centralized.querySelectorAll("[data-queue-item]")).toHaveLength(3);
    expect(centralized.querySelector(".ai-factory-icon--bottleneck")).toBeInTheDocument();
    expect(centralized).toHaveTextContent("One interpretation gate");
    expect(centralized.querySelector('[data-relationship="central-gate-to-action"]')).toHaveAttribute("marker-end");

    expect(distributed.querySelectorAll('[data-loop="bounded-learning-loop"]')).toHaveLength(3);
    expect(distributed.querySelectorAll('[data-flywheel="understanding-implementation"]')).toHaveLength(3);
    expect(distributed.querySelectorAll(".ai-factory-icon--understanding")).toHaveLength(3);
    expect(distributed.querySelectorAll(".ai-factory-icon--implementation")).toHaveLength(3);
    expect(distributed.querySelectorAll('[data-relationship="understanding-to-implementation"]')).toHaveLength(3);
    expect(distributed.querySelectorAll('[data-relationship="implementation-to-understanding"]')).toHaveLength(3);
    expect(distributed.querySelectorAll('[data-relationship="implementation-output"]')).toHaveLength(3);
    expect(distributed.querySelector(".ai-factory-motif__learning-outcome")).not.toBeInTheDocument();
    for (const loop of distributed.querySelectorAll('[data-loop="bounded-learning-loop"]')) {
      expect(loop).toHaveTextContent("UNDERSTANDINGIMPLEMENTATION");
      expect(loop).not.toHaveTextContent("FEEDBACK");
      expect(loop.querySelectorAll(".ai-factory-motif__learning-loop > [data-relationship][marker-end]")).toHaveLength(2);
      const implementationOutput = loop.querySelector('[data-relationship="implementation-output"]')!;
      expect(implementationOutput.querySelector(".ai-factory-icon__action-vector")).toHaveAttribute("marker-end");
      expect(implementationOutput.closest(".ai-factory-motif__learning-loop")).toBeNull();
    }
    expect(distributed.querySelectorAll('[data-relationship="cross-team-interface"]')).toHaveLength(2);
    expect(Array.from(distributed.querySelectorAll(".ai-factory-motif__connector-label text"), label => label.textContent)).toEqual(["INTERFACE", "INTERFACE"]);
    expect(distributed).toHaveTextContent("Shared intent");
    expect(diagram).toHaveTextContent("SAME TEAMS · DIFFERENT TOPOLOGY");
    expect(screen.getByText(/This is a conceptual operating model, not a measured throughput claim/)).toBeInTheDocument();
  });

  it("renders token volume, input time, and verified value as three separate graphs", () => {
    render(<AiFactoryMotif variant="token-economics" />);

    const figure = document.querySelector('[data-variant="token-economics"]')!;
    const graphs = within(figure as HTMLElement).getAllByRole("img");
    expect(graphs).toHaveLength(3);
    expect(graphs.map(graph => graph.getAttribute("viewBox"))).toEqual(["0 0 320 176", "0 0 320 176", "0 0 320 176"]);
    expect(graphs[0]).toHaveAccessibleName("Token output is larger than token input");
    expect(graphs[1]).toHaveAccessibleName("Time required to prepare token input");
    expect(graphs[2]).toHaveAccessibleName("Output tokens become verified value after evaluation");

    const tokenVolume = figure.querySelector('[data-variable="token-volume"]')!;
    const timeToInput = figure.querySelector('[data-variable="time-to-token-in"]')!;
    const verifiedValue = figure.querySelector('[data-variable="verified-value-out"]')!;
    expect(tokenVolume).toHaveTextContent("N_INPUT");
    expect(tokenVolume).toHaveTextContent("N_OUTPUT");
    expect(tokenVolume).toHaveTextContent("R_TOKEN");
    expect(timeToInput).toHaveTextContent("T_INPUT");
    expect(verifiedValue).toHaveTextContent("V_OUTPUT");
    expect(tokenVolume.querySelector('[data-stage="input-tokens"]')).toBeInTheDocument();
    expect(tokenVolume.querySelector('[data-stage="output-tokens"]')).toBeInTheDocument();
    expect(tokenVolume.querySelectorAll('[data-stage="output-tokens"] rect').length).toBeGreaterThan(
      tokenVolume.querySelectorAll('[data-stage="input-tokens"] rect').length,
    );
    expect(tokenVolume.querySelector(".ai-factory-motif__economics-ratio")).toHaveTextContent("R_TOKEN");
    expect(timeToInput.querySelector(".ai-factory-motif__economics-timer")).toBeInTheDocument();
    expect(timeToInput.querySelector(".ai-factory-motif__economics-timeline-ticks")).toHaveAttribute(
      "d",
      "M48 94V110M104 98V106M160 94V110M216 98V106M272 94V110",
    );
    expect(verifiedValue.querySelector('[data-stage="verified-value"] .ai-factory-icon--value')).toBeInTheDocument();
    expect(screen.getByText(/None of the three implies either of the others/)).toBeInTheDocument();
  });

  it("gives the situated flow clear connector lanes without enclosing station boxes", () => {
    render(<AiFactoryMotif variant="term-of-art-to-implementation" />);

    const diagram = screen.getByRole("img", { name: /Understanding carries a term/ });
    expect(diagram.querySelectorAll(".ai-factory-motif__station")).toHaveLength(0);
    const paths = diagram.querySelectorAll(".ai-factory-motif__connectors > path");
    expect(paths[0]).toHaveAttribute("d", "M196 136H296");
    expect(paths[1]).toHaveAttribute("d", "M424 136H548");
    expect(diagram.querySelectorAll(".ai-factory-motif__connector-label")).toHaveLength(2);
    expect(Array.from(diagram.querySelectorAll(".ai-factory-motif__connector-label text"), label => label.textContent)).toEqual(["APPLIED IN", "AFFORDS"]);
    const labels = diagram.querySelectorAll(".ai-factory-motif__connector-label--on-edge");
    expect(labels).toHaveLength(2);
    for (const [index, label] of Array.from(labels).entries()) {
      const frame = label.querySelector("rect")!;
      const text = label.querySelector("text")!;
      const left = Number(frame.getAttribute("x"));
      const right = left + Number(frame.getAttribute("width"));
      expect(text).toHaveAttribute("y", "136");
      expect(text).toHaveAttribute("dominant-baseline", "middle");
      expect(Number(frame.getAttribute("y")) + Number(frame.getAttribute("height")) / 2).toBe(136);
      expect(left - [196, 424][index]).toBeGreaterThanOrEqual(12);
      expect([296, 548][index] - right).toBeGreaterThanOrEqual(16);
    }
    expect(Array.from(diagram.querySelectorAll(".ai-factory-motif__axis text"), label => label.getAttribute("x"))).toEqual(["132", "360", "588"]);
    expect(diagram.closest("figure")).toHaveAttribute("data-variant", "term-of-art-to-implementation");
  });

  it("distinguishes personal meaning from uncommunicated meaning and unsubstantiated value", () => {
    render(<AiFactoryMotif variant="experience-but-lacking" />);

    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    for (const kind of ["meaning", "text", "understanding", "value"]) {
      expect(diagram.querySelector(`.ai-factory-icon--${kind}`)).toBeInstanceOf(SVGElement);
    }
    expect(diagram.querySelector(".ai-factory-icon--vision")).not.toBeInTheDocument();
    expect(diagram).toHaveTextContent("Experience");
    expect(diagram).not.toHaveTextContent("Meaning is present.");
    expect(diagram).not.toHaveTextContent("significant to me");
    expect(diagram).not.toHaveTextContent("lived, felt, personal");
    expect(diagram).toHaveTextContent("not yet communicated");
    expect(diagram).toHaveTextContent("not yet substantiated");
    expect(diagram.querySelectorAll(".ai-factory-motif__experience-gap")).toHaveLength(2);
    for (const gap of diagram.querySelectorAll(".ai-factory-motif__experience-gap")) {
      expect(gap).not.toHaveAttribute("marker-end");
    }
    expect(diagram.querySelector('[data-gap="communication"]')).toHaveAttribute("d", "M340 124H394M442 124H496");
    expect(diagram.querySelector('[data-gap="value"]')).toHaveAttribute("d", "M340 284H394M442 284H496");
    expect(diagram.querySelectorAll(".ai-factory-icon--disconnected")).toHaveLength(2);
    expect(diagram.querySelector(".ai-factory-motif__experience-break")).not.toBeInTheDocument();
    expect(screen.getByText(/Unsubstantiated value is not the same as no value/)).toBeInTheDocument();
  });

  it("leaves missing bridges unlabeled while preserving the disconnect marks and outcome explanations", () => {
    render(<AiFactoryMotif variant="experience-but-lacking" />);

    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    const labels = diagram.querySelector(".ai-factory-motif__connectors")!.querySelectorAll(".ai-factory-motif__connector-label--on-edge");
    expect(labels).toHaveLength(0);
    expect(diagram).not.toHaveTextContent("NOT SHARED");
    expect(diagram).not.toHaveTextContent("UNPROVEN");
    expect(diagram).toHaveTextContent("not yet communicated");
    expect(diagram).toHaveTextContent("not yet substantiated");
    expect(Array.from(diagram.querySelectorAll(".ai-factory-icon--disconnected"), icon => icon.getAttribute("transform"))).toEqual([
      "translate(418 124) scale(0.5) translate(-80 -80)",
      "translate(418 284) scale(0.5) translate(-80 -80)",
    ]);
    expect(diagram).not.toHaveTextContent("CARRIES");
  });

  it("frames leads to on the text-to-understanding edge with room for both icons and the arrowhead", () => {
    render(<AiFactoryMotif variant="experience-but-lacking" />);

    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    const communication = diagram.querySelector('[data-outcome="communication"]')!;
    const label = communication.querySelector(".ai-factory-motif__connector-label--on-edge")!;
    expect(label).toHaveTextContent("LEADS TO");
    expect(label.querySelector("text")).toHaveAttribute("x", "600");
    expect(label.querySelector("text")).toHaveAttribute("y", "112");
    expect(label.querySelector("text")).toHaveAttribute("dominant-baseline", "middle");
    expect(label.querySelector("rect")).toHaveAttribute("x", "570");
    expect(label.querySelector("rect")).toHaveAttribute("y", "104");
    expect(label.querySelector("rect")).toHaveAttribute("width", "60");
    expect(label.querySelector("rect")).toHaveAttribute("height", "16");
    expect(communication.querySelector('[data-relationship="text-to-understanding"]')).toHaveAttribute("d", "M556 112H652");
    expect(communication.querySelector(".ai-factory-icon--text")).toHaveAttribute("transform", "translate(532 112) scale(0.32) translate(-80 -80)");
    expect(communication.querySelector(".ai-factory-icon--understanding")).toHaveAttribute("transform", "translate(684 112) scale(0.4) translate(-80 -80)");
    expect(diagram.querySelectorAll(".ai-factory-motif__connector-label--on-edge")).toHaveLength(1);
  });

  it("shows text leading to shared understanding and value within a relationship", () => {
    render(<AiFactoryMotif variant="experience-but-lacking" />);

    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    const communication = diagram.querySelector('[data-outcome="communication"]');
    expect(communication?.querySelector(".ai-factory-icon--text")).toBeInTheDocument();
    expect(communication?.querySelector(".ai-factory-icon--understanding")).toBeInTheDocument();
    expect(communication?.querySelector('[data-relationship="text-to-understanding"]')).toHaveAttribute("marker-end");
    expect(communication).toHaveTextContent("Shared understanding");
    expect(communication).not.toHaveTextContent("Shared meaning");
    const communicationLabels = communication!.querySelectorAll(".ai-factory-motif__label");
    expect(communicationLabels).toHaveLength(1);
    expect(communicationLabels[0]).toHaveTextContent("Shared understanding");
    expect(communicationLabels[0]).toHaveAttribute("x", "628");
    expect(communicationLabels[0]).toHaveAttribute("y", "80");
    expect(communicationLabels[0]).toHaveAttribute("text-anchor", "middle");
    const value = diagram.querySelector('[data-outcome="value"]');
    expect(value?.querySelectorAll(".ai-factory-icon--term-of-art")).toHaveLength(0);
    expect(value?.querySelector(".ai-factory-icon--self")).toHaveAttribute("transform", "translate(544 284) scale(0.75) translate(-80 -80)");
    expect(value?.querySelector(".ai-factory-icon--others")).toHaveAttribute("transform", "translate(712 284) scale(0.75) translate(-80 -80)");
    expect(value?.querySelector(".ai-factory-icon--value")).toHaveAttribute("transform", "translate(628 284) scale(0.4) translate(-80 -80)");
    expect(value?.querySelector('[data-relationship="value-between-people"]')).toHaveAttribute("d", "M558 284H598M658 284H686");
    expect(value).toHaveTextContent("Value lies within relationships");
    expect(value).toHaveTextContent("Self");
    expect(value).toHaveTextContent("Others");
  });

  it("reuses the single self dot and three-dot others cluster without term boundaries", () => {
    render(<><AiFactoryIcon kind="self" /><AiFactoryIcon kind="others" /><AiFactoryMotif variant="experience-but-lacking" /></>);

    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    for (const kind of ["self", "others"] as const) {
      const standalone = screen.getByRole("img", { name: kind === "self" ? /^Self:/ : /^Others:/ });
      const composed = diagram.querySelector(`.ai-factory-icon--${kind}`)!;
      const expected = kind === "self" ? [[80, 80]] : [[64, 80], [88, 66], [88, 94]];
      for (const icon of [standalone, composed]) {
        expect(icon.querySelectorAll("circle")).toHaveLength(expected.length);
        expect(icon.querySelector(".ai-factory-icon__morpheme")).not.toBeInTheDocument();
        expect(Array.from(icon.querySelectorAll(`.ai-factory-icon__${kind}-dot`), dot => [
          Number(dot.getAttribute("cx")), Number(dot.getAttribute("cy")),
        ])).toEqual(expected);
        for (const dot of icon.querySelectorAll("circle")) expect(dot).toHaveAttribute("r", "8");
      }
    }
  });

  it("uses one disconnected glyph in the inventory and both missing bridges", () => {
    render(<><AiFactoryIcon kind="disconnected" /><AiFactoryMotif variant="experience-but-lacking" /></>);

    const standalone = screen.getByRole("img", { name: /^Disconnected:/ });
    const diagram = screen.getByRole("img", { name: /Personal meaning is not yet shared value/ });
    for (const icon of [standalone, ...diagram.querySelectorAll(".ai-factory-icon--disconnected")]) {
      expect(icon.querySelector(".ai-factory-icon__disconnected-ends")).toHaveAttribute("d", "M32 80H56M56 68V92M104 68V92M104 80H128");
      expect(icon.querySelector(".ai-factory-icon__disconnected-mark")).toHaveAttribute("d", "M72 72L88 88M88 72L72 88");
      expect(icon.querySelector("[marker-end]")).not.toBeInTheDocument();
    }
  });

  it("uses the shared automation glyph for the ontology action", () => {
    render(<AiFactoryMotif variant="ontology-of-terms" />);

    const action = screen.getByText("Action").closest(".ai-factory-motif__ontology-node");
    expect(action?.querySelector(".ai-factory-icon--automation")).toBeInstanceOf(SVGElement);
    expect(action?.querySelector(".ai-factory-icon__understanding-boundary")).toHaveAttribute("r", "32");
    expect(action?.querySelector(".ai-factory-icon__understanding-core")).toHaveAttribute("r", "5");
    expect(action?.querySelector(".ai-factory-icon__understanding-edge")).not.toBeInTheDocument();
    expect(action?.querySelector(".ai-factory-icon__automation-action")).toHaveAttribute("d", "M112 80H132");
    expect(action?.querySelector(".ai-factory-icon__understanding-center")).toBeNull();
    expect(action?.querySelector(".ai-factory-icon__action-vector")).toHaveAttribute("d", "M156 80H180");
    expect(action?.querySelector(".ai-factory-icon__arrowhead--outline")).toBeInstanceOf(SVGElement);
    expect(action?.querySelector(".ai-factory-icon--term-of-art")).toBeNull();
  });

  it("anchors ontology relationship labels on their edges in padded frames", () => {
    render(<AiFactoryMotif variant="ontology-of-terms" />);

    const diagram = screen.getByRole("img", { name: /Ontology coordinates terms of art/ });
    const labels = diagram.querySelectorAll(".ai-factory-motif__connector-label--on-edge");
    expect(labels).toHaveLength(4);
    expect(Array.from(labels, label => {
      const text = label.querySelector("text");
      return [text?.textContent, text?.getAttribute("x"), text?.getAttribute("y")];
    })).toEqual([
      ["PURSUES", "236", "200"],
      ["DIRECTS", "484", "200"],
      ["SUPPORTS", "360", "136"],
      ["BOUNDS", "360", "268"],
    ]);
    for (const label of labels) {
      expect(label.querySelector("rect")).toHaveAttribute("height", "16");
      expect(Number(label.querySelector("rect")?.getAttribute("width"))).toBeGreaterThanOrEqual(40);
      expect(label.querySelector("text")).toHaveAttribute("dominant-baseline", "middle");
    }
  });

  it("combines vision crosshairs and an abstract boundary for goal in both contexts", () => {
    render(<><AiFactoryIcon kind="goal" /><AiFactoryMotif variant="ontology-of-terms" /></>);

    const standalone = screen.getByRole("img", { name: /^Goal:/ });
    const composed = screen.getByText("Goal").closest(".ai-factory-motif__ontology-node")?.querySelector(".ai-factory-icon--goal");
    expect(composed).toBeInstanceOf(SVGElement);
    expect(screen.getByText("Goal")).toHaveAttribute("x", "344");
    expect(screen.getByText("Goal")).toHaveAttribute("y", "236");
    for (const goal of [standalone, composed!]) {
      expect(goal.querySelector(".ai-factory-icon__morpheme")).toHaveAttribute("r", "32");
      expect(goal.querySelector(".ai-factory-icon__vision-center")).toHaveAttribute("r", "12");
      expect(goal.querySelector(".ai-factory-icon__vision-edge")).toHaveAttribute("d", "M80 36V56M80 104V124M36 80H56M104 80H124");
      expect(goal.querySelectorAll("circle")).toHaveLength(2);
    }
  });

  it("reuses a single self dot with eight detached straight value edges in every context", () => {
    const { container } = render(<>
      <AiFactoryIcon kind="value" />
      <AiFactoryIcon kind="self" />
      <AiFactoryMotif variant="experience-but-lacking" />
      <AiFactoryMotif variant="understanding-in-embedding-space" />
      <AiFactorySeriesMap />
    </>);

    const self = screen.getByRole("img", { name: /^Self:/ }).querySelector("circle")!;
    const values = container.querySelectorAll(".ai-factory-icon--value");
    expect(values).toHaveLength(5);
    for (const value of values) {
      expect(value.querySelectorAll("circle")).toHaveLength(1);
      expect(value.querySelector(".ai-factory-icon__self-dot")?.outerHTML).toBe(self.outerHTML);
      expect(Array.from(value.querySelectorAll(".ai-factory-icon__value-edge"), edge => edge.getAttribute("d"))).toEqual([
        "M80 24V52", "M108 80H136", "M80 108V136", "M24 80H52",
        "M40 40L60 60", "M100 60L120 40", "M100 100L120 120", "M40 120L60 100",
      ]);
      expect(value.querySelector(".ai-factory-icon__value-star, .ai-factory-icon__value-axis")).not.toBeInTheDocument();
    }
  });

  it("uses four cardinal edges and a central circle for vision", () => {
    render(<AiFactoryMotif variant="vision-to-morpheme" />);

    const diagram = screen.getByRole("img", { name: /Vision becomes an idea/ });
    expect(diagram.querySelector(".ai-factory-icon--vision .ai-factory-icon__vision-edge")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-icon--vision .ai-factory-icon__vision-center")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-icon--morpheme-diffuse .ai-factory-icon__morpheme")?.tagName).toBe("circle");
  });

  it("combines refinement and discipline into a term of art with a solid boundary", () => {
    render(<AiFactoryMotif variant="refinement-and-discipline-to-term-of-art" />);

    const diagram = screen.getByRole("img", { name: /Refinement and discipline establish a term of art/ });
    expect(diagram.querySelector(".ai-factory-icon--morpheme-refined .ai-factory-icon__morpheme--refined")).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector(".ai-factory-icon--morpheme-diffuse")).not.toBeInTheDocument();
    expect(diagram).toHaveTextContent("shared meaning");
    expect(diagram).toHaveTextContent("definition · evidence · correction");
    expect(diagram).toHaveTextContent("continuity · clarification");
    expect(diagram).toHaveTextContent("specification");
    expect(diagram.querySelectorAll(".ai-factory-motif__practice")).toHaveLength(2);
    expect(diagram.querySelector('[data-practice="discipline"].ai-factory-motif__practice')).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector('[data-practice="refinement"].ai-factory-motif__practice')).toBeInstanceOf(SVGElement);
    expect(diagram.querySelector('[data-practice="discipline"].ai-factory-motif__practice-input')).toHaveAttribute("marker-end");
    expect(diagram.querySelector('[data-practice="refinement"].ai-factory-motif__practice-input')).toHaveAttribute("marker-end");
    const termOfArt = diagram.querySelector(".ai-factory-icon--term-of-art");
    expect(termOfArt?.querySelector(".ai-factory-icon__morpheme--refined")?.tagName).toBe("circle");
    expect(termOfArt?.querySelector(".ai-factory-icon__term-edge")).toBeInstanceOf(SVGElement);
  });

  it("places establishes on its edge while keeping the operator and arrowhead clear", () => {
    render(<AiFactoryMotif variant="refinement-and-discipline-to-term-of-art" />);

    const diagram = screen.getByRole("img", { name: /Refinement and discipline establish a term of art/ });
    const label = diagram.querySelector(".ai-factory-motif__connector-label--on-edge")!;
    expect(label).toHaveTextContent("ESTABLISHES");
    expect(label.querySelector("text")).toHaveAttribute("x", "432");
    expect(label.querySelector("text")).toHaveAttribute("y", "152");
    expect(label.querySelector("text")).toHaveAttribute("dominant-baseline", "middle");
    const frame = label.querySelector("rect")!;
    expect(frame).toHaveAttribute("x", "394");
    expect(frame).toHaveAttribute("y", "144");
    expect(frame).toHaveAttribute("width", "76");
    expect(frame).toHaveAttribute("height", "16");
    expect(diagram.querySelector(".ai-factory-motif__connector--focal")).toHaveAttribute("d", "M384 152H484");
    expect(diagram.querySelector(".ai-factory-icon--operator")).toHaveAttribute("transform", "translate(360 152) scale(0.72) translate(-80 -80)");
  });

  it("shows understanding carrying a term of art into a concrete implementation", () => {
    render(<AiFactoryMotif variant="term-of-art-to-implementation" />);

    const diagram = screen.getByRole("img", { name: /Understanding carries a term into implementation/ });
    expect(diagram).toHaveTextContent("context · evidence · stakes");
    expect(diagram).toHaveTextContent("decision · test · artifact");
    expect(diagram.querySelector(".ai-factory-icon--understanding .ai-factory-icon__understanding-center")).not.toBeInTheDocument();
    expect(diagram.querySelector(".ai-factory-icon--understanding .ai-factory-icon__understanding-core")).toHaveAttribute("r", "5");
    expect(diagram.querySelector(".ai-factory-icon--implementation .ai-factory-icon__action-vector")).toBeInstanceOf(SVGElement);
  });

  it("shares implementation geometry and self-contained arrows across inventory and diagrams", () => {
    render(<>
      <AiFactoryIcon kind="implementation" />
      <AiFactoryIcon kind="implementation" />
      <AiFactoryMotif variant="term-of-art-to-implementation" />
    </>);

    const icons = document.querySelectorAll(".ai-factory-icon--implementation");
    expect(icons).toHaveLength(3);
    const markerIds = new Set<string>();
    for (const icon of icons) {
      const arrow = icon.querySelector(".ai-factory-icon__action-vector");
      const marker = icon.querySelector("marker");
      expect(marker).toBeInstanceOf(SVGElement);
      expect(arrow).toHaveAttribute("marker-end", `url(#${marker?.id})`);
      expect(arrow).toHaveAttribute("d", "M76 80H124");
      expect(marker).toHaveAttribute("refX", "0");
      expect(marker).toHaveAttribute("markerUnits", "userSpaceOnUse");
      expect(marker?.querySelector("path")).toHaveClass("ai-factory-icon__arrowhead--outline");
      expect(icon.querySelector(".ai-factory-icon__implementation-boundary")).toHaveAttribute("r", "12");
      markerIds.add(marker!.id);
    }
    expect(markerIds.size).toBe(3);
  });

  it("renders a token as contiguous highlighted segments without numbers", () => {
    render(<AiFactoryIcon kind="token" />);

    const token = screen.getByRole("img", { name: /^Token:/ });
    expect(token.querySelectorAll(".ai-factory-icon__token-segment")).toHaveLength(4);
    expect(token.querySelector(".ai-factory-icon__token-boundary")).not.toBeInTheDocument();
    expect(token.querySelector(".ai-factory-icon__token-register")).not.toBeInTheDocument();
    expect(token.querySelectorAll(".ai-factory-icon__token-segment--two")).toHaveLength(1);
    expect(token.querySelectorAll("text")).toHaveLength(0);
  });

  it("renders embeddings as a centered matrix using the token shades without numbers", () => {
    render(<AiFactoryIcon kind="embedding" />);

    const embedding = screen.getByRole("img", { name: /^Embedding:/ });
    const cells = Array.from(embedding.querySelectorAll(".ai-factory-icon__embedding-cell"));
    expect(cells).toHaveLength(16);
    expect(new Set(cells.map((cell) => cell.getAttribute("x")))).toEqual(new Set(["33", "57", "81", "105"]));
    expect(new Set(cells.map((cell) => cell.getAttribute("y")))).toEqual(new Set(["33", "57", "81", "105"]));
    for (const shade of ["one", "two", "three", "four"]) {
      expect(embedding.querySelectorAll(`.ai-factory-icon__token-segment--${shade}`)).toHaveLength(4);
    }
    expect(cells.every((cell) => cell.getAttribute("width") === "22" && cell.getAttribute("height") === "22")).toBe(true);
    expect(embedding.querySelectorAll("text")).toHaveLength(0);
  });

  it("renders three spare slop variants from two paths each", () => {
    render(<>
      <AiFactoryIcon kind="slop-fault" label="Fault" />
      <AiFactoryIcon kind="slop-drift" label="Drift" />
      <AiFactoryIcon kind="slop-decay" label="Decay" />
    </>);

    const expectedPaths = {
      Fault: ["M32 80H68M92 80H128", "M68 80L76 68L84 92L92 80"],
      Drift: ["M32 72H80", "M80 88H128"],
      Decay: ["M32 80H76", "M84 80H104M112 80H124M132 80H136"],
    } as const;
    for (const [label, paths] of Object.entries(expectedPaths)) {
      const slop = screen.getByRole("img", { name: label });
      expect(Array.from(slop.querySelectorAll(":scope > path"), path => path.getAttribute("d"))).toEqual(paths);
      expect(slop.querySelectorAll("rect, circle")).toHaveLength(0);
    }
  });

  it.each(["morpheme-diffuse", "morpheme-refined", "term-of-art"] as const)("uses a text stroke instead of a center dot for %s", (kind) => {
    render(<AiFactoryIcon kind={kind} />);

    const icon = screen.getByRole("img");
    expect(icon.querySelector(".ai-factory-icon__morpheme-center-line")).toHaveAttribute("d", "M-8 0H8");
    expect(icon.querySelector(".ai-factory-icon__morpheme-center-line")).toHaveClass("ai-factory-icon__text-line");
    expect(icon.querySelectorAll("circle")).toHaveLength(1);
    expect(icon.querySelector(".ai-factory-icon__center")).not.toBeInTheDocument();
  });

  it("renders text as ordered, composed semantic spans", () => {
    render(<AiFactoryIcon kind="text" />);

    const text = screen.getByRole("img", { name: /^Text:/ });
    expect(text.querySelector(".ai-factory-icon__text-line")).toBeInstanceOf(SVGElement);
    expect(text.querySelector(".ai-factory-icon__text-highlight")).not.toBeInTheDocument();
    expect(text.querySelector(".ai-factory-icon__frame")).not.toBeInTheDocument();
  });

  it("distinguishes a label with a central box while sharing the text lines", () => {
    render(<><AiFactoryIcon kind="text" /><AiFactoryIcon kind="label" /></>);

    const text = screen.getByRole("img", { name: /^Text:/ });
    const label = screen.getByRole("img", { name: /^Label:/ });
    expect(label.querySelector(".ai-factory-icon__text-line")?.getAttribute("d")).toBe(
      text.querySelector(".ai-factory-icon__text-line")?.getAttribute("d"),
    );
    expect(label.querySelector(".ai-factory-icon__text-highlight")).toHaveAttribute("width", "48");
    expect(label.querySelectorAll("rect")).toHaveLength(1);
  });

  it("builds a term from a refined idea and an ontology from connected terms", () => {
    render(
      <>
        <AiFactoryIcon kind="term-of-art" />
        <AiFactoryIcon kind="ontology-node" />
      </>,
    );

    const term = screen.getByRole("img", { name: /^Term of art:/ });
    expect(term.querySelector(".ai-factory-icon__morpheme--refined")).toBeInstanceOf(SVGElement);
    expect(term.querySelector(".ai-factory-icon__term-edge")).toBeInstanceOf(SVGElement);

    const ontologyNode = screen.getByRole("img", { name: /^Ontology node:/ });
    expect(ontologyNode.querySelectorAll(".ai-factory-icon__ontology-edge")).toHaveLength(2);
    expect(ontologyNode.querySelector(".ai-factory-icon__ontology-edge--connected")).toHaveAttribute("d", "M80 28V48M112 80H132");
    expect(ontologyNode.querySelector(".ai-factory-icon__ontology-edge:not(.ai-factory-icon__ontology-edge--connected)")).toHaveAttribute("d", "M28 80H48M80 112V132");
    expect(ontologyNode.querySelector(".ai-factory-icon__ontology-root")).toBeInstanceOf(SVGElement);
    expect(ontologyNode.querySelector(".ai-factory-icon__ontology-root-core")?.tagName).toBe("path");
    expect(ontologyNode.querySelectorAll(".ai-factory-icon__ontology-term")).toHaveLength(2);
    expect(ontologyNode.querySelectorAll("path.ai-factory-icon__ontology-term-core")).toHaveLength(2);
    expect(ontologyNode.querySelectorAll(".ai-factory-icon__text-line")).toHaveLength(3);
    expect(ontologyNode.querySelectorAll("circle")).toHaveLength(3);
  });

  it("keeps only diagonal rays for meaning while preserving understanding's cardinal edges", () => {
    render(
      <>
        <AiFactoryIcon kind="meaning" />
        <AiFactoryIcon kind="understanding" />
      </>,
    );

    const meaning = screen.getByRole("img", { name: /^Meaning:/ });
    const understanding = screen.getByRole("img", { name: /^Understanding:/ });
    expect(meaning.querySelector(".ai-factory-icon__meaning-edge--cardinal")).not.toBeInTheDocument();
    expect(meaning.querySelectorAll(".ai-factory-icon__meaning-edge")).toHaveLength(1);
    expect(meaning.querySelector(".ai-factory-icon__meaning-center")).not.toBeInTheDocument();
    expect(meaning.querySelector(".ai-factory-icon__meaning-core")).toHaveAttribute("r", "5");
    expect(meaning.querySelector(".ai-factory-icon__meaning-boundary")).toHaveAttribute("r", "32");
    expect(understanding.querySelector(".ai-factory-icon__understanding-edge--cardinal")).toHaveAttribute("d", "M80 28V48M80 112V132M28 80H48M112 80H132");
    expect(understanding.querySelector(".ai-factory-icon__understanding-edge--diagonal")?.getAttribute("d")).toBe(
      meaning.querySelector(".ai-factory-icon__meaning-edge--diagonal")?.getAttribute("d"),
    );
    expect(understanding.querySelector(".ai-factory-icon__understanding-center")).not.toBeInTheDocument();
    expect(understanding.querySelector(".ai-factory-icon__understanding-boundary")).not.toHaveAttribute("stroke-dasharray");
    expect(understanding.querySelector(".ai-factory-icon__understanding-core")).toHaveAttribute("r", "5");
  });

  it("shows implementation as a refined idea extending into action", () => {
    render(<AiFactoryIcon kind="implementation" />);

    const implementation = screen.getByRole("img", { name: /^Implementation:/ });
    expect(implementation.querySelector(".ai-factory-icon__implementation-boundary")).toBeInstanceOf(SVGElement);
    expect(implementation.querySelector(".ai-factory-icon__implementation-core")).toBeInstanceOf(SVGElement);
    expect(implementation.querySelector(".ai-factory-icon__action-vector")).toHaveAttribute("marker-end");
    expect(implementation.querySelector(".ai-factory-icon__action-target")).not.toBeInTheDocument();
  });

  it("renders the series-specific truth, inference, bottleneck, and automation marks", () => {
    render(
      <>
        <AiFactoryIcon kind="truth" />
        <AiFactoryIcon kind="inference" />
        <AiFactoryIcon kind="bottleneck" />
        <AiFactoryIcon kind="automation" />
      </>,
    );

    const truth = screen.getByRole("img", { name: /^Truth:/ });
    expect(truth.querySelector(".ai-factory-icon__truth-triangle--dotted")).toBeInstanceOf(SVGElement);
    expect(truth.querySelectorAll("circle")).toHaveLength(0);

    const inference = screen.getByRole("img", { name: /^Inference:/ });
    expect(inference.querySelector(".ai-factory-icon__inference-junction")).toBeInstanceOf(SVGElement);
    expect(inference.querySelectorAll(".ai-factory-icon__inference-output")).toHaveLength(3);
    expect(inference.querySelector(".ai-factory-icon__inference-path")).not.toHaveAttribute("marker-end");

    const bottleneck = screen.getByRole("img", { name: /^Bottleneck:/ });
    expect(bottleneck.querySelectorAll(".ai-factory-icon__bottleneck-input")).toHaveLength(3);
    expect(bottleneck.querySelector(".ai-factory-icon__bottleneck-boundary")).toHaveAttribute("d", "M92 32V56M92 104V128");
    expect(bottleneck.querySelector(".ai-factory-icon__bottleneck-throat")).toHaveAttribute("d", "M92 68V92M100 68V92");
    expect(bottleneck.querySelector(".ai-factory-icon__bottleneck-output")).toBeInstanceOf(SVGElement);
    const automation = screen.getByRole("img", { name: /^Automation:/ });
    expect(automation.querySelector(".ai-factory-icon__understanding-boundary")).toHaveAttribute("cx", "80");
    expect(automation.querySelector(".ai-factory-icon__understanding-edge")).not.toBeInTheDocument();
    expect(automation.querySelector(".ai-factory-icon__automation-action")).toHaveAttribute("d", "M112 80H132");
    expect(automation.querySelector(".ai-factory-icon__automation-node")).toBeInstanceOf(SVGElement);
    expect(automation.querySelector(".ai-factory-icon__understanding-core")).toHaveAttribute("r", "5");
    expect(automation.querySelector(".ai-factory-icon__understanding-center")).not.toBeInTheDocument();
  });

  it("uses the shared on-edge frame for the typed-relation icon with no label text", () => {
    render(<AiFactoryIcon kind="typed-relation" />);

    const relation = screen.getByRole("img", { name: /^Typed relation:/ });
    expect(relation.querySelector(".ai-factory-icon__relation-line")).toHaveAttribute("d", "M24 80H136");
    expect(relation.querySelector(".ai-factory-icon__relation-line")).toHaveAttribute("marker-end");
    const label = relation.querySelector(".ai-factory-motif__connector-label--on-edge")!;
    expect(label.querySelector("rect")).toHaveAttribute("x", "60");
    expect(label.querySelector("rect")).toHaveAttribute("y", "72");
    expect(label.querySelector("rect")).toHaveAttribute("width", "40");
    expect(label.querySelector("rect")).toHaveAttribute("height", "16");
    expect(label.querySelector("text")).not.toBeInTheDocument();
    expect(relation.querySelector(".ai-factory-icon__relation-label-line")).not.toBeInTheDocument();
  });

  it("maps the six essays through the reusable motif language", () => {
    render(<AiFactorySeriesMap />);

    expect(screen.getByRole("heading", { name: "Six essays describe one operating system." })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Scrollable AI Factory article map" })).toHaveAttribute("tabindex", "0");
    const articles = [
      ["Vision and Values", "/writing/vision-and-values"],
      ["Understanding and Bottlenecks", "/writing/understanding-and-bottlenecks"],
      ["Truth and Inference", "/writing/truth-and-inference"],
      ["The Knowledge Factory", "/writing/the-knowledge-factory"],
      ["Ontology Factory", "/writing/the-ontology-factory"],
      ["Cognitive Factory", "/writing/the-cognitive-factory"],
    ];

    expect(screen.getAllByRole("link").map(link => link.getAttribute("href")))
      .toEqual(articles.map(([, href]) => href));
    expect(screen.getByRole("link", { name: /Understanding and Bottlenecks/ })).toHaveTextContent("02");
    expect(screen.getByRole("link", { name: /Truth and Inference/ })).toHaveTextContent("03");
    for (const [name, href] of articles) {
      expect(screen.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", href);
      expect(screen.getByRole("heading", { name })).toBeVisible();
      expect(screen.getByRole("heading", { name })).not.toHaveClass("ai-factory-series-map__paired-title");
    }
    expect(screen.getByRole("link", { name: /Cognitive Factory/ })).toHaveTextContent(
      "Typed observations, bounded decisions, and evaluated consequences turn activity into retained learning.",
    );
  });

  it("exposes a compact decorative series graphic for article cards", () => {
    const { container } = render(
      <AiFactorySeriesGraphic slug="vision-and-values" compact className="test-graphic" />,
    );

    const graphic = container.querySelector(".test-graphic");
    expect(graphic).toHaveAttribute("aria-hidden", "true");
    expect(graphic).toHaveClass("ai-factory-series-map__equation--compact");
    expect(graphic?.querySelector("svg")).toHaveAttribute("viewBox", "0 28 320 136");
    expect(graphic?.querySelector(".ai-factory-icon--vision")).toBeInTheDocument();
    expect(graphic?.querySelector(".ai-factory-icon--value")).toBeInTheDocument();
  });

  it("labels each series-map icon and uses the Value glyph for Values", () => {
    const { container } = render(<AiFactorySeriesMap />);
    const concepts = container.querySelectorAll(".ai-factory-series-map__concept, .ai-factory-series-map__flywheel-concept");
    expect(Array.from(concepts, (concept) => concept.querySelector("span, text")?.textContent)).toEqual([
      "Vision", "Values", "Understanding", "Bottlenecks", "Truth", "Inference",
      "Ontology", "Automation", "Understanding", "Ontology", "Automation", "Understanding",
    ]);
    expect(concepts[1]?.querySelector(".ai-factory-icon--value")).toBeInTheDocument();
    expect(concepts[6]?.querySelector(".ai-factory-icon--ontology-node")).toBeInTheDocument();
    expect(concepts[8]?.querySelector(".ai-factory-icon--understanding")).toBeInTheDocument();
    expect(concepts[9]?.querySelector(".ai-factory-icon--ontology-node")).toBeInTheDocument();
    expect(concepts[10]?.querySelector(".ai-factory-icon--automation")).toBeInTheDocument();
    expect(container.querySelectorAll(".ai-factory-series-map__paired-title")).toHaveLength(0);
    const panels = container.querySelectorAll(".ai-factory-series-map__equation > svg");
    expect(panels).toHaveLength(6);
    for (const panel of panels) {
      expect(panel).toHaveAttribute("viewBox", "0 0 320 192");
      const labels = panel.querySelectorAll(".ai-factory-series-map__concept > text, .ai-factory-series-map__flywheel-concept > text");
      expect(Array.from(labels, (label) => label.getAttribute("y"))).toEqual(["144", "144"]);
    }
    const cards = container.querySelectorAll(".ai-factory-series-map__item");
    expect(cards[4]?.querySelector(".ai-factory-series-map__relationship")).toHaveTextContent("FORMALIZES");
    expect(cards[5]?.querySelector(".ai-factory-series-map__relationship")).toHaveTextContent(/^FEEDS$/);
    expect(container.querySelectorAll(".ai-factory-series-map__connector")).toHaveLength(4);
    expect(cards[2]?.querySelector(".ai-factory-series-map__connector")).toBeNull();
    expect(cards[5]?.querySelector(".ai-factory-series-map__connector")).toBeNull();
  });

  it("centers the cognitive factory automation's full span over its label", () => {
    render(<AiFactorySeriesMap />);

    const card = screen.getByRole("link", { name: /Cognitive Factory/ });
    const automation = card.querySelector(".ai-factory-icon--automation")!;
    expect(automation).toHaveAttribute("transform", "translate(64 92) scale(0.6) translate(-118 -80)");
    expect(automation.parentElement?.querySelector("text")).toHaveAttribute("x", "64");
    expect(automation.querySelector(".ai-factory-icon__understanding-boundary")).toHaveAttribute("cx", "80");
    expect(automation.querySelector(".ai-factory-icon__understanding-boundary")).toHaveAttribute("r", "32");
    expect(automation.querySelector(".ai-factory-icon__action-vector")).toHaveAttribute("d", "M156 80H180");
    expect(automation.querySelector("marker")).toHaveAttribute("refX", "0");
    expect(automation.querySelector("marker path")).toHaveAttribute("d", "M0 0L8 4L0 8Z");
    expect(card.querySelector(".ai-factory-icon--understanding")).toHaveAttribute("transform", "translate(244 92) scale(0.6) translate(-80 -80)");

    const flywheel = screen.getByRole("img", { name: /Ontology and automation flywheel/ });
    expect(flywheel.querySelector(".ai-factory-icon--automation")).toHaveAttribute("transform", "translate(244 92) scale(0.6) translate(-80 -80)");
  });

  it("shows the knowledge factory as an accessible two-way flywheel with instance-safe arrows", () => {
    render(<><AiFactorySeriesMap /><AiFactorySeriesMap /></>);

    const flywheels = screen.getAllByRole("img", { name: /Ontology and automation flywheel/ });
    expect(flywheels).toHaveLength(2);
    const markerIds = flywheels.map((flywheel) => flywheel.querySelector("marker")?.id);
    expect(new Set(markerIds).size).toBe(2);
    for (const flywheel of flywheels) {
      expect(flywheel).toHaveAccessibleDescription(/Learning from automation informs ontology/);
      expect(flywheel.querySelectorAll(".ai-factory-series-map__flywheel-paths > path")).toHaveLength(2);
      expect(flywheel).not.toHaveTextContent("SYSTEMATIZES");
      expect(flywheel).not.toHaveTextContent("INFORMS");
      expect(flywheel.querySelector(".ai-factory-icon--understanding")).not.toBeInTheDocument();
      expect(flywheel.querySelectorAll(".ai-factory-motif__connector-label")).toHaveLength(0);
      expect(flywheel).not.toHaveTextContent("FLYWHEEL");
      expect(flywheel).toHaveAccessibleDescription(/so long as they remain grounded in understanding/);
      expect(flywheel.closest("a")?.querySelector("p")).toHaveTextContent("Ontology and automation can form a flywheel, so long as they remain grounded in understanding.");
      expect(flywheel.querySelector(".ai-factory-series-map__flywheel-paths")).toHaveAttribute("marker-end", `url(#${flywheel.querySelector("marker")?.id})`);
      expect(flywheel.closest("a")).toHaveAttribute("href", "/writing/the-knowledge-factory");
    }
  });
});
