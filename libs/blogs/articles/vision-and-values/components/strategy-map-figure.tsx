import { ResponsiveDiagram, DiagramSummary } from "@th-m/blogs/components";
import "./strategy-map-figure.css";

export function StrategyMapFigure() {
  const nodes = [
    { id: "governing-1", label: "Earn from expertise", kind: "governing" },
    { id: "governing-2", label: "Protect evenings", kind: "governing" },
    { id: "institution", label: "Institutional authority", kind: "external" },
    { id: "strategy", label: "Publish teaching materials", kind: "strategy" },
    { id: "subgoal-1", label: "Reuse lessons", kind: "subgoal" },
    { id: "subgoal-2", label: "Bound the workload", kind: "subgoal" },
    { id: "subgoal-3", label: "Test net benefit", kind: "subgoal" },
    { id: "customer", label: "Customer goals", kind: "stakeholder" },
    { id: "partner", label: "Partner goals", kind: "stakeholder" },
  ] as const;

  return (
    <figure id="strategy-map" className="article-figure strategy-map-figure">
      <ResponsiveDiagram
        label="Governing a strategy"
        summary={
          <DiagramSummary
            label="Governing a strategy"
            steps={[
              { label: nodes[0].label, detail: nodes[1].label, icon: "goal", focal: true },
              { label: nodes[3].label, relation: "directs" },
              {
                label: "Coordinated commitments",
                detail: nodes
                  .filter((n) => n.kind === "subgoal")
                  .map((n) => n.label)
                  .join(" · "),
                relation: "coordinates",
              },
              {
                label: nodes[2].label,
                detail:
                  "Decision rights constrain the work; customer and partner goals shape its context.",
                relation: "remains subject to",
              },
            ]}
          />
        }
      >
        <div className="strategy-map__viewport" tabIndex={0}>
          <div
            className="strategy-map"
            role="img"
            aria-label="Two governing goals direct a strategy, which coordinates three subgoals while institutional authority constrains it and stakeholder goals influence it"
          >
            <svg
              className="strategy-map__connections"
              viewBox="0 0 1000 440"
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
                <path d="M 310 100 V 128 L 400 176" markerEnd="url(#strategy-map-arrow)" />
                <path d="M 550 100 V 128 L 460 176" markerEnd="url(#strategy-map-arrow)" />
                <path d="M 430 244 V 286 M 200 286 H 660" />
                <path
                  d="M 200 286 V 324 M 430 286 V 324 M 660 286 V 324"
                  markerEnd="url(#strategy-map-arrow)"
                />
              </g>

              <g className="strategy-map__connection strategy-map__connection--relational">
                <path d="M 210 210 H 310" markerEnd="url(#strategy-map-arrow)" />
                <path d="M 550 198 L 755 154" markerEnd="url(#strategy-map-arrow)" />
                <path d="M 550 222 L 755 266" markerEnd="url(#strategy-map-arrow)" />
              </g>
            </svg>

            <span className="strategy-map__field-label strategy-map__field-label--hierarchy">
              Internal hierarchy
            </span>
            <span className="strategy-map__field-label strategy-map__field-label--stakeholders">
              Stakeholder field
            </span>

            <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--direction">
              direct
            </span>
            <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--coordination">
              coordinates
            </span>
            <span className="strategy-map__relation strategy-map__relation--constraint">constrains</span>
            <span className="strategy-map__relation strategy-map__relation--customer">aligns with</span>
            <span className="strategy-map__relation strategy-map__relation--partner">coordinates with</span>

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
      </ResponsiveDiagram>
      <figcaption id="strategy-map-caption">
        Governing goals direct the strategy; authority constrains it. Dashed, labeled connections show
        stakeholder influences. A plausible route still needs authorization and worthwhile consequences.
      </figcaption>
    </figure>
  );
}
