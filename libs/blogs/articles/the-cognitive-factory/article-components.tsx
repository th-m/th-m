import { Fragment } from "react";
import { defineArticleComponents } from "@th-m/blogs/mdx";
import { AiFactoryMotif } from "@th-m/blogs/components";
import articleAssets from "./article-assets";

const LIGHT_CONE_ROWS: Array<[string, string, string]> = [
  ["Temporal reach", "Which past decisions and future consequences matter?", "Recover an applicable experiment and name the next outcome review."],
  ["Domain reach", "Which connected systems and people enter the explanation?", "Trace an import error to a customer task and its owning team."],
  ["Interpretation", "Which alternatives and missing evidence remain visible?", "Distinguish a regression from an intended product tradeoff."],
  ["Retained learning", "Can experience change a later recommendation?", "Use a completed experiment without treating it as a current instruction."],
  ["Authority", "Which interventions are actually permitted?", "Keep a proposed change within the team's explicit mandate."],
  ["Accountability", "Who owns interpretation, correction, and freshness?", "Identify the decision owner and the owner of disputed context."],
];

export function LightConeScorecard() {
  return (
    <table className="essay-scorecard">
      <caption className="essay-figure__caption">Cognitive reach for one configured factory: proposed evaluation questions</caption>
      <thead>
        <tr>
          <th scope="col">Dimension</th>
          <th scope="col">Question</th>
          <th scope="col">Observable evidence</th>
        </tr>
      </thead>
      <tbody>
        {LIGHT_CONE_ROWS.map(([dimension, question, evidence], index) => (
          <Fragment key={dimension}>
            {index === 0 ? (
              <tr><th scope="colgroup" colSpan={3}>Capability reach</th></tr>
            ) : index === 4 ? (
              <tr><th scope="colgroup" colSpan={3}>Governance conditions</th></tr>
            ) : null}
            <tr>
              <th scope="row">{dimension}</th>
              <td>{question}</td>
              <td>{evidence}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

function ConsequenceReturnsToContextMotif() {
  return <AiFactoryMotif variant="consequence-returns-to-context" />;
}

export default defineArticleComponents(articleAssets, () => ({
  "consequence-returns-to-context-motif": ConsequenceReturnsToContextMotif,
  "light-cone-scorecard": LightConeScorecard,
}));
