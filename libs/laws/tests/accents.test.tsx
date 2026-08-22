import { render } from "@testing-library/react";
import { accentColorNames } from "@th-m/design-theme";
import { describe, expect, it } from "vitest";
import { lawLabelAccents, lawLabelAccentVariable } from "../src/accents";
import { LawCard } from "../src/LawCard";
import { LawDetail } from "../src/LawDetail";
import { lawBySlug } from "../src/laws";
import { lawLabels } from "../src/types";

describe("law label accents", () => {
  it("maps every typed label to one of the six theme accents", () => {
    expect(Object.keys(lawLabelAccents)).toEqual([...lawLabels]);
    for (const label of lawLabels) {
      expect(accentColorNames).toContain(lawLabelAccents[label]);
      expect(lawLabelAccentVariable(label)).toBe(
        `var(--color-accent-${lawLabelAccents[label]})`,
      );
    }
  });

  it("uses the same accent property on card and detail labels", () => {
    const law = lawBySlug["fittss-law"]!;
    const card = render(<LawCard law={law} />);
    const cardLabels = Array.from(card.container.querySelectorAll<HTMLElement>(".thom-law-label"));
    const cardAccents = cardLabels.map((label) => label.style.getPropertyValue("--law-label-accent"));
    card.unmount();

    const detail = render(<LawDetail law={law} />);
    const detailAccents = Array.from(
      detail.container.querySelectorAll<HTMLElement>(".thom-law-label"),
      (label) => label.style.getPropertyValue("--law-label-accent"),
    );
    expect(detailAccents).toEqual(cardAccents);
  });
});
