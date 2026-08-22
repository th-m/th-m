// Hand-curated laws beyond the fetched lawsofux.com / timsommer.be snapshot.
// Authored here (not by scripts/fetch-laws.ts) with Wikipedia and canonical
// references as provenance. Extends the snapshot through the merged `laws`
// export in ../index.ts.
import type { Law } from "../types";
import { amdahlsLaw } from "./amdahls-law";
import { anchoringEffect } from "./anchoring-effect";
import { baumolsCostDisease } from "./baumols-cost-disease";
import { benfordsLaw } from "./benfords-law";
import { bitterLesson } from "./bitter-lesson";
import { brandolinisLaw } from "./brandolinis-law";
import { chestertonsFence } from "./chestertons-fence";
import { cobraEffect } from "./cobra-effect";
import { cunninghamsLaw } from "./cunninghams-law";
import { curseOfKnowledge } from "./curse-of-knowledge";
import { dunningKrugerEffect } from "./dunning-kruger-effect";
import { framingEffect } from "./framing-effect";
import { gallsLaw } from "./galls-law";
import { gigo } from "./gigo";
import { godwinsLaw } from "./godwins-law";
import { goodhartsLaw } from "./goodharts-law";
import { haloEffect } from "./halo-effect";
import { hanlonsRazor } from "./hanlons-razor";
import { heapssLaw } from "./heapss-law";
import { humesGuillotine } from "./humes-guillotine";
import { ikeaEffect } from "./ikea-effect";
import { ironLawOfOligarchy } from "./iron-law-of-oligarchy";
import { jevonsParadox } from "./jevons-paradox";
import { lawOfDiminishingReturns } from "./law-of-diminishing-returns";
import { lindyEffect } from "./lindy-effect";
import { littlesLaw } from "./littles-law";
import { lossAversion } from "./loss-aversion";
import { mereExposureEffect } from "./mere-exposure-effect";
import { metcalfesLaw } from "./metcalfes-law";
import { neuralScalingLaws } from "./neural-scaling-laws";
import { noFreeLunchTheorem } from "./no-free-lunch-theorem";
import { nyquistShannonTheorem } from "./nyquist-shannon-theorem";
import { planningFallacy } from "./planning-fallacy";
import { secondLawOfThermodynamics } from "./second-law-of-thermodynamics";
import { shannonsTheorem } from "./shannons-theorem";
import { spotlightEffect } from "./spotlight-effect";
import { sturgeonsLaw } from "./sturgeons-law";
import { sunkCostFallacy } from "./sunk-cost-fallacy";
import { universalScalabilityLaw } from "./universal-scalability-law";
import { zipfsLaw } from "./zipfs-law";

/**
 * Curated extension laws: information & language, AI/ML, reasoning &
 * epistemology, organizations & economics, operations & systems, cognitive
 * effects, and physical metaphors. Appended after the fetched snapshot in the
 * public `laws` export.
 */
export const curatedLaws: Law[] = [
  zipfsLaw,
  heapssLaw,
  shannonsTheorem,
  nyquistShannonTheorem,
  sturgeonsLaw,
  lindyEffect,
  metcalfesLaw,
  benfordsLaw,
  goodhartsLaw,
  gigo,
  noFreeLunchTheorem,
  amdahlsLaw,
  neuralScalingLaws,
  bitterLesson,
  cobraEffect,
  brandolinisLaw,
  hanlonsRazor,
  humesGuillotine,
  chestertonsFence,
  cunninghamsLaw,
  godwinsLaw,
  littlesLaw,
  baumolsCostDisease,
  ironLawOfOligarchy,
  jevonsParadox,
  lawOfDiminishingReturns,
  universalScalabilityLaw,
  gallsLaw,
  dunningKrugerEffect,
  anchoringEffect,
  framingEffect,
  lossAversion,
  ikeaEffect,
  haloEffect,
  curseOfKnowledge,
  planningFallacy,
  spotlightEffect,
  sunkCostFallacy,
  mereExposureEffect,
  secondLawOfThermodynamics,
];

/** Curated laws keyed by their stable ASCII slug. */
export const curatedLawBySlug: Readonly<Record<string, Law>> = Object.fromEntries(
  curatedLaws.map((law) => [law.slug, law]),
);
