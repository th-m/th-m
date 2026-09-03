import { Fragment } from "react";

const governingLoop = [
  "Governing values",
  "Metrics and incentives",
  "Repeated local decisions",
  "Customer and employee consequences",
  "Filtered organizational data",
];

export function GoverningLoopFigure() {
  return (
    <figure className="article-figure">
      <div
        className="article-loop"
        aria-label="Governing values reproduce themselves through metrics, decisions, consequences, and filtered data"
      >
        <div className="article-loop__chain">
          {governingLoop.map((node, index) => (
            <Fragment key={node}>
              <div className="article-loop__node">{node}</div>
              {index < governingLoop.length - 1 ? (
                <div className="article-loop__arrow" aria-hidden="true">↓</div>
              ) : null}
            </Fragment>
          ))}
        </div>
        <div className="article-loop__back" aria-hidden="true">
          <span>appears to confirm</span>
          <span>↩</span>
        </div>
      </div>
      <figcaption>
        Filtered data can make a mistaken value hierarchy appear to confirm itself.
      </figcaption>
    </figure>
  );
}
