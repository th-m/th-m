import "./goal-tree-figure.css";

export function GoalTreeFigure() {
  const nodes = [
    { id: "goal", label: "Governing goal", tier: "goal" },
    { id: "o1", label: "Opportunity 1", tier: "opportunity" },
    { id: "o2", label: "Opportunity 2", tier: "opportunity" },
    { id: "o3", label: "Opportunity 3", tier: "opportunity" },
    { id: "s1", label: "Solution 1", tier: "solution" },
    { id: "s2", label: "Solution 2", tier: "solution" },
    { id: "s3", label: "Solution 3", tier: "solution" },
    { id: "s4", label: "Solution 4", tier: "solution" },
    { id: "e1", label: "Experiment 1", tier: "experiment" },
    { id: "e2", label: "Experiment 2", tier: "experiment" },
    { id: "e3", label: "Experiment 3", tier: "experiment" },
  ] as const;

  return (
    <figure id="goal-hierarchy" className="article-figure goal-hierarchy-figure">
      <div className="goal-hierarchy__viewport" tabIndex={0}>
        <div
          className="goal-hierarchy"
          role="img"
          aria-label="A governing goal branches to three opportunities, four solutions, and three experiments"
        >
          <svg
            className="goal-hierarchy__connections"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="goal-hierarchy-arrow"
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
            <path d="M 590 100 V 136 M 335 136 H 840" />
            <path d="M 335 136 V 166 M 590 136 V 166 M 840 136 V 166" markerEnd="url(#goal-hierarchy-arrow)" />

            <path d="M 335 234 V 286 M 250 286 H 420" />
            <path d="M 250 286 V 316 M 420 286 V 316 M 590 234 V 316 M 840 234 V 316" markerEnd="url(#goal-hierarchy-arrow)" />

            <path d="M 250 384 V 436 M 190 436 H 320" />
            <path d="M 190 436 V 466 M 320 436 V 466 M 840 384 V 466" markerEnd="url(#goal-hierarchy-arrow)" />
          </svg>

          {(["Goal", "Opportunities", "Solutions", "Experiments"] as const).map((tier) => (
            <span key={tier} className={`goal-hierarchy__tier-label goal-hierarchy__tier-label--${tier.toLowerCase()}`}>
              {tier}
            </span>
          ))}

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`goal-hierarchy__node goal-hierarchy__node--${node.tier} goal-hierarchy__node--${node.id}`}
            >
              <span>{node.tier === "goal" ? "Root" : node.tier}</span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>
      </div>
      <figcaption id="goal-hierarchy-caption">
        Opportunities, solutions, and experiments are only meaningful relative to a governing goal.
      </figcaption>
    </figure>
  );
}
