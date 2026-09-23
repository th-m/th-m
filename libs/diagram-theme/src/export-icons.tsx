import { renderToStaticMarkup } from "react-dom/server";
import { AiFactoryIconGlyph } from "./icons";
import { aiFactoryIconKinds } from "./icon-catalog";

/** SVG fragments from the same geometry used by the live React inventory. */
export function diagramIconFragments(): Record<string, string> {
  return Object.fromEntries(
    aiFactoryIconKinds.map((kind) => [
      kind,
      renderToStaticMarkup(
        <svg xmlns="http://www.w3.org/2000/svg">
          <g className={`ai-factory-icon ai-factory-icon--${kind}`}>
            <AiFactoryIconGlyph kind={kind} />
          </g>
        </svg>,
        { identifierPrefix: `diagram-${kind}-` },
      ),
    ]),
  );
}
