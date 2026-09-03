import "./relational-knowing-figure.css";

const facts = [
  { id: "salary", label: "Salary", value: "$72k", relation: "feels undervalued", y: 58 },
  { id: "profession", label: "Profession", value: "Teacher", relation: "derives purpose", y: 208 },
  { id: "age", label: "Age", value: "34", relation: "senses time accelerating", y: 358 },
] as const;

const contexts = [
  { id: "opportunity", label: "Opportunity", value: "Book sale", relation: "excited for", y: 58 },
  { id: "time", label: "Time", value: "More time", relation: "wants", y: 208 },
  { id: "cause", label: "Cause", value: "Long commute", relation: "feels pain from", y: 358 },
] as const;

export function RelationalKnowingFigure() {
  return (
    <figure className="article-figure relational-knowing-figure" data-figure="relational-knowing">
      <div className="relational-knowing-figure__viewport" tabIndex={0}>
        <svg
          className="relational-knowing-figure__graph"
          viewBox="0 0 1000 500"
          role="img"
          aria-label="Jon Doe is connected to factual nodes for a 72 thousand dollar salary, teacher profession, and age 34, and to contextual nodes for a book sale opportunity, more time, and a long commute. Relational information is carried by the bold edges: feels undervalued, derives purpose, senses time accelerating, excited for, wants, and feels pain from."
        >
          <defs>
            <marker
              id="relational-knowing-arrow"
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

          <text className="relational-knowing-figure__column-label" x="44" y="28">
            Factual information
          </text>
          <text className="relational-knowing-figure__column-label" x="400" y="28">
            Person
          </text>
          <text className="relational-knowing-figure__column-label" x="758" y="28">
            Context
          </text>

          {facts.map((fact, index) => {
            const centerY = fact.y + 36;
            const personY = 224 + index * 20;
            const labelY = index === 0 ? 144 : index === 1 ? 234 : 348;

            return (
              <g key={fact.id}>
                <g className="relational-knowing-figure__node relational-knowing-figure__node--fact">
                  <rect x="44" y={fact.y} width="200" height="72" />
                  <text className="relational-knowing-figure__kind" x="60" y={fact.y + 25}>{fact.label}</text>
                  <text className="relational-knowing-figure__value" x="60" y={fact.y + 51}>{fact.value}</text>
                </g>
                <g className="relational-knowing-figure__edge">
                  <path
                    className="relational-knowing-figure__edge-line"
                    d={`M 244 ${centerY} C 320 ${centerY} 346 ${personY} 440 ${personY}`}
                    markerEnd="url(#relational-knowing-arrow)"
                  />
                  <text className="relational-knowing-figure__edge-label" x="320" y={labelY}>
                    {fact.relation}
                  </text>
                </g>
              </g>
            );
          })}

          <g className="relational-knowing-figure__person">
            <circle cx="500" cy="244" r="58" />
            <text className="relational-knowing-figure__kind" x="500" y="230">Person</text>
            <text className="relational-knowing-figure__person-name" x="500" y="260">Jon Doe</text>
          </g>

          {contexts.map((context, index) => {
            const centerY = context.y + 36;
            const personY = 224 + index * 20;
            const labelY = index === 0 ? 144 : index === 1 ? 234 : 348;

            return (
              <g key={context.id}>
                <g className="relational-knowing-figure__edge">
                  <path
                    className="relational-knowing-figure__edge-line"
                    d={`M 560 ${personY} C 654 ${personY} 680 ${centerY} 754 ${centerY}`}
                    markerEnd="url(#relational-knowing-arrow)"
                  />
                  <text className="relational-knowing-figure__edge-label" x="678" y={labelY}>
                    {context.relation}
                  </text>
                </g>
                <g className="relational-knowing-figure__node relational-knowing-figure__node--context">
                  <rect x="758" y={context.y} width="198" height="72" />
                  <text className="relational-knowing-figure__kind" x="774" y={context.y + 25}>{context.label}</text>
                  <text className="relational-knowing-figure__value relational-knowing-figure__value--context" x="774" y={context.y + 51}>
                    {context.value}
                  </text>
                </g>
              </g>
            );
          })}

          <text className="relational-knowing-figure__footer-label" x="500" y="478">
            Nodes hold entities. Edges carry relational meaning.
          </text>
        </svg>
      </div>
      <figcaption>
        Facts, people, and context can be represented as nodes. What Jon feels, wants, and
        experiences appears on the edges that connect them.
      </figcaption>
    </figure>
  );
}
