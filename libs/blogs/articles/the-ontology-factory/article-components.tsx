import { defineArticleComponents } from "@th-m/blogs/mdx";
import { AiFactoryMotif } from "@th-m/blogs/components";
import articleAssets from "./article-assets";
import "./ontology-figures.css";

function PathOwnershipMotif() {
  return <AiFactoryMotif variant="path-declares-ownership" />;
}

function LayerGuidanceMotif() {
  return <AiFactoryMotif variant="layers-guide-implementation" />;
}

function ContextCompositionMotif() {
  return <AiFactoryMotif variant="contracts-govern-action" />;
}

function SoundSculptOntologyMap() {
  return (
    <figure className="ontology-map" aria-labelledby="soundsculpt-ontology-title">
      <header className="ontology-map__header">
        <p>SoundSculpt · relationship map</p>
        <h4 id="soundsculpt-ontology-title">One creative object becomes several related claims</h4>
      </header>

      <div className="ontology-map__spine" aria-label="Composition may guide a performance, which production shapes into rendered sound">
        <span>Composition</span><b aria-hidden="true">→</b>
        <span>Performance</span><b aria-hidden="true">→</b>
        <span>Production</span><b aria-hidden="true">→</b>
        <span>Rendered Sound</span>
      </div>

      <div className="ontology-map__relations">
        <section>
          <p>Rendered Sound</p>
          <ul>
            <li>observable acoustic characteristics</li>
            <li>product-specific timbre assessments</li>
            <li>contributes to perceived mood</li>
          </ul>
        </section>
        <section>
          <p>Perceived Mood</p>
          <ul>
            <li>depends on rendered sound</li>
            <li>depends on listener</li>
            <li>depends on context</li>
          </ul>
        </section>
        <section>
          <p>Rights &amp; Attribution</p>
          <ul>
            <li>relates people and works</li>
            <li>relates recordings and uses</li>
            <li>depends on territory and conditions</li>
          </ul>
        </section>
      </div>

      <figcaption>Each claim belongs to the relationship that makes it valid; none is an intrinsic field on a single object.</figcaption>
    </figure>
  );
}

export default defineArticleComponents(articleAssets, () => ({
  "context-composition-motif": ContextCompositionMotif,
  "layer-guidance-motif": LayerGuidanceMotif,
  "path-ownership-motif": PathOwnershipMotif,
  "soundsculpt-ontology-map": SoundSculptOntologyMap,
}));
