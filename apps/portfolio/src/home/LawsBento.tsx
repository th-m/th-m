import { Link } from "@tanstack/react-router";
import { lawBySlug } from "@th-m/laws";
import { LawCardGrid } from "../laws/LawCardGrid";

const FEATURED_LAW_SLUGS = [
  "aesthetic-usability-effect",
  "cognitive-load",
  "hicks-law",
  "law-of-uniform-connectedness",
  "conways-law",
  "goodharts-law",
  "galls-law",
  "shannons-theorem",
  "bitter-lesson",
  "gigo",
  "curse-of-knowledge",
  "second-law-of-thermodynamics",
] as const;

export const featuredLaws = FEATURED_LAW_SLUGS.map((slug) => lawBySlug[slug]).filter(
  (law) => law !== undefined,
);

/**
 * A deliberately small home-page introduction to the complete Laws catalog.
 */
export function LawsBento() {
  return (
    <section className="home-laws" aria-labelledby="home-laws-title">
      <header className="home-laws__header">
        <h2 id="home-laws-title">Laws</h2>
      </header>
      <div className="home-laws__intro">
        <p className="home-laws__lede">
          A working set of principles for designing interfaces, software systems,
          organizations, and intelligent tools.
        </p>
        <Link className="home-laws__all-link" to="/laws">
          View all laws <span aria-hidden="true">→</span>
        </Link>
      </div>
      <LawCardGrid items={featuredLaws} />
    </section>
  );
}
