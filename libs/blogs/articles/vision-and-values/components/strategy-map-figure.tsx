import "./strategy-map-figure.css";

export function StrategyMapFigure() {
  const nodes = [
    { id: "governing-1", label: "Governing goal 1", kind: "governing" },
    { id: "governing-2", label: "Governing goal 2", kind: "governing" },
    { id: "institution", label: "Institutional authority", kind: "external" },
    { id: "strategy", label: "Strategy", kind: "strategy" },
    { id: "subgoal-1", label: "Subgoal 1", kind: "subgoal" },
    { id: "subgoal-2", label: "Subgoal 2", kind: "subgoal" },
    { id: "subgoal-3", label: "Subgoal 3", kind: "subgoal" },
    { id: "customer", label: "Customer goals", kind: "stakeholder" },
    { id: "partner", label: "Partner goals", kind: "stakeholder" },
    { id: "competitor", label: "Competitor goals", kind: "stakeholder" },
  ] as const;

  return (
    <figure id="strategy-map" className="article-figure strategy-map-figure">
      <div className="strategy-map__viewport" tabIndex={0}>
        <div
          className="strategy-map"
          role="img"
          aria-label="Two governing goals direct a strategy, which coordinates three subgoals while institutional authority constrains it and stakeholder goals influence it"
        >
          <svg
            className="strategy-map__connections"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="strategy-map-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" />
              </marker>
            </defs>

            <g className="strategy-map__connection strategy-map__connection--governance">
              <path d="M 310 100 V 124 L 400 160" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 100 V 124 L 460 160" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 430 232 V 294 M 200 294 H 660" />
              <path d="M 200 294 V 340 M 430 294 V 340 M 660 294 V 340" markerEnd="url(#strategy-map-arrow)" />
            </g>

            <g className="strategy-map__connection strategy-map__connection--relational">
              <path d="M 225 196 H 310" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 184 L 755 134" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 196 L 755 274" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 208 L 700 310 H 742 V 414 H 755" markerEnd="url(#strategy-map-arrow)" />
            </g>
          </svg>

          <span className="strategy-map__field-label strategy-map__field-label--hierarchy">Internal hierarchy</span>
          <span className="strategy-map__field-label strategy-map__field-label--stakeholders">Stakeholder field</span>

          <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--direction">
            direct
          </span>
          <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--coordination">
            coordinates
          </span>
          <span className="strategy-map__relation strategy-map__relation--constraint">constrains</span>
          <span className="strategy-map__relation strategy-map__relation--customer">aligns with</span>
          <span className="strategy-map__relation strategy-map__relation--partner">coordinates with</span>
          <span className="strategy-map__relation strategy-map__relation--competitor">anticipates</span>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`strategy-map__node strategy-map__node--${node.kind} strategy-map__node--${node.id}`}
            >
              <span>
                {node.kind === "stakeholder"
                  ? "External goal"
                  : node.kind === "external"
                    ? "Constraint"
                    : node.kind === "governing"
                      ? "Root goal"
                      : node.kind === "subgoal"
                        ? "Goal"
                        : node.kind}
              </span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>
      </div>
      <figcaption id="strategy-map-caption">
        Strategy negotiates two governing goals, coordinates subgoals, and responds to goals and
        constraints held by other people and institutions.
      </figcaption>
    </figure>
  );
}
