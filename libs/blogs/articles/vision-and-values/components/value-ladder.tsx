import "./value-ladder.css";

const valueLadder = [
  {
    intent: "Feel valued",
    goals: ["Increase income from my expertise", "Receive credit for my work"],
  },
  {
    intent: "Have more time",
    goals: ["Spend fewer hours commuting", "Protect evenings with my family"],
  },
  {
    intent: "Preserve purpose",
    goals: ["Keep teaching and helping people", "Reach more people with my ideas"],
  },
] as const;

export function ValueLadder() {
  return (
    <figure
      className="article-figure value-ladder"
      aria-label="Jon Doe: one statement, multiple possible intents and goals"
    >
      <div className="value-ladder__tree">
        <div className="value-ladder__statement">
          <span className="value-ladder__label">Jon Doe says</span>
          <strong>“I want something better”</strong>
        </div>
        <ul className="value-ladder__branches" aria-label="Possible intents" role="list">
          {valueLadder.map(({ intent, goals }) => (
            <li className="value-ladder__branch" key={intent}>
              <div className="value-ladder__intent">
                <span className="value-ladder__label">Possible intent</span>
                <strong>{intent}</strong>
              </div>
              <ul
                className="value-ladder__goals"
                aria-label={`Possible goals for ${intent.toLowerCase()}`}
                role="list"
              >
                {goals.map((goal) => (
                  <li className="value-ladder__goal" key={goal}>
                    <span className="value-ladder__label">Possible goal</span>
                    <span className="value-ladder__goal-text">{goal}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <figcaption>
        These are possible interpretations, not facts about Jon. Several may coexist or compete.
        Confirm and rank them with him before proposing a solution.
      </figcaption>
    </figure>
  );
}
