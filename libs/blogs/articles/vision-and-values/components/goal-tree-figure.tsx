import { ResponsiveDiagram } from "@th-m/blogs/components";
import { AiFactoryIcon } from "@th-m/diagram-theme/icons";
import "./goal-tree-figure.css";

export function GoalTreeFigure() {
  const nodes = [
    { id: "goal", label: "Earn from teaching", tier: "goal" },
    { id: "o1", label: "Reusable lessons", tier: "opportunity" },
    { id: "o2", label: "Educator audience", tier: "opportunity" },
    { id: "o3", label: "Publishing support", tier: "opportunity" },
    { id: "s1", label: "Lesson workbook", tier: "solution" },
    { id: "s2", label: "Teaching guides", tier: "solution" },
    { id: "s3", label: "Educator newsletter", tier: "solution" },
    { id: "s4", label: "Assisted publishing", tier: "solution" },
    { id: "e1", label: "Test demand", tier: "experiment" },
    { id: "e2", label: "Pilot a chapter", tier: "experiment" },
    { id: "e3", label: "Measure net income", tier: "experiment" },
  ] as const;
  const stages = [
    { label: "Goal", kind: "goal", example: "goal", relation: "" },
    { label: "Opportunities", kind: "opportunity", example: "o1", relation: "opens an opportunity" },
    { label: "Solutions", kind: "solution", example: "s1", relation: "suggests a solution" },
    { label: "Experiments", kind: "experiment", example: "e1", relation: "is tested by" },
  ] as const;

  return (
    <figure id="goal-hierarchy" className="article-figure goal-hierarchy-figure">
      <ResponsiveDiagram
        label="From goal to experiment"
        summary={
          <div className="diagram-summary" role="group" aria-label="From goal to experiment — simplified view">
            <ol className="diagram-summary__steps">
              {stages.map((stage, i) => (
                <li key={stage.kind}>
                  {i > 0 && <div className="diagram-summary__relation"><span aria-hidden="true">↓ </span>{stage.relation}</div>}
                  <div className="goal-hierarchy__summary-label">
                    <span className="goal-hierarchy__icon" aria-hidden="true"><AiFactoryIcon kind={stage.kind} /></span>
                    <span>{stage.label}</span>
                  </div>
                  <div className={`diagram-summary__node${i === 0 ? " diagram-node--focal" : ""}`}>
                    <div>
                      <strong>{nodes.find((node) => node.id === stage.example)!.label}</strong>
                      {i === 0 && <p>Protect Jon’s evenings while earning from existing expertise.</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        }
      >
        <div className="goal-hierarchy__viewport" tabIndex={0}>
          <div
            className="goal-hierarchy"
            role="img"
            aria-label="A governing goal branches to three opportunities, four solutions, and three experiments"
          >
            <svg
              className="goal-hierarchy__connections"
              viewBox="0 0 1000 600"
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
              <path d="M 590 120 V 150 M 335 150 H 840" />
              <path
                d="M 335 150 V 180 M 590 150 V 180 M 840 150 V 180"
                markerEnd="url(#goal-hierarchy-arrow)"
              />

              <path d="M 335 268 V 298 M 250 298 H 420" />
              <path
                d="M 250 298 V 330 M 420 298 V 330 M 590 268 V 330 M 840 268 V 330"
                markerEnd="url(#goal-hierarchy-arrow)"
              />

              <path d="M 250 418 V 448 M 200 448 H 360" />
              <path
                d="M 200 448 V 480 M 360 448 V 480 M 840 418 V 480"
                markerEnd="url(#goal-hierarchy-arrow)"
              />
            </svg>

            {stages.map((stage) => (
              <span
                key={stage.kind}
                className={`goal-hierarchy__tier-label goal-hierarchy__tier-label--${stage.label.toLowerCase()}`}
              >
                <span className="goal-hierarchy__icon" aria-hidden="true"><AiFactoryIcon kind={stage.kind} /></span>
                <span>{stage.label}</span>
              </span>
            ))}

            {nodes.map((node) => (
              <div
                key={node.id}
                className={`goal-hierarchy__node goal-hierarchy__node--${node.tier} goal-hierarchy__node--${node.id}`}
              >
                <strong>{node.label}</strong>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveDiagram>
      <figcaption id="goal-hierarchy-caption">
        One possible publishing strategy: earn from Jon’s teaching while protecting his evenings. The goal
        determines which opportunities and experiments are worthwhile. Confirm this direction with Jon.
      </figcaption>
    </figure>
  );
}
