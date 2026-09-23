import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiFactoryIcon } from "./ai-factory-motif";
import { aiFactoryIconCatalog, aiFactoryIconKinds, aiFactoryIconLabel } from "./icon-catalog";

afterEach(cleanup);

describe("AI Factory icon field contract", () => {
  it("covers every existing glyph once with unique public IDs and complete, separate notes", () => {
    expect(aiFactoryIconKinds).toHaveLength(26);
    expect(new Set(aiFactoryIconKinds).size).toBe(26);
    expect(Object.keys(aiFactoryIconCatalog)).toEqual([...aiFactoryIconKinds]);
    expect(new Set(Object.values(aiFactoryIconCatalog).map(icon => icon.iconId)).size).toBe(26);
    for (const icon of Object.values(aiFactoryIconCatalog)) {
      expect(icon.iconId).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      for (const field of [icon.semanticRole, icon.title, icon.definition, icon.visualGrammar]) {
        expect(field.trim().length).toBeGreaterThan(0);
      }
      expect(icon.definition).not.toBe(icon.visualGrammar);
    }
    expect(aiFactoryIconKinds.filter(kind => aiFactoryIconCatalog[kind].subheading)).toEqual([
      "coherence", "correspondence", "consequence", "value",
    ]);
  });

  it("classifies by semantic role rather than inherited drawing or subject area", () => {
    for (const kind of ["inference", "implementation", "automation"] as const) {
      expect(aiFactoryIconCatalog[kind].semanticRole).toBe("process");
    }
    expect(aiFactoryIconCatalog.understanding.semanticRole).toBe("situated state");
    expect(aiFactoryIconCatalog["ontology-node"].semanticRole).toBe("model entity");
    expect(aiFactoryIconCatalog["typed-relation"].semanticRole).toBe("relationship");
    expect(aiFactoryIconCatalog.disconnected.semanticRole).toBe("relationship state");
    expect(aiFactoryIconCatalog.operator.semanticRole).toBe("operation");
    for (const kind of ["term-of-art", "text", "label"] as const) {
      expect(aiFactoryIconCatalog[kind].semanticRole).toBe("language representation");
    }
    for (const kind of ["token", "embedding"] as const) {
      expect(aiFactoryIconCatalog[kind].semanticRole).toBe("model representation");
    }
  });

  it.each(aiFactoryIconKinds)("derives the accessible name for %s from its title and definition", kind => {
    render(<AiFactoryIcon kind={kind} />);
    const { title, definition } = aiFactoryIconCatalog[kind];
    expect(aiFactoryIconLabel(kind)).toBe(`${title}: ${definition}`);
    expect(screen.getByRole("img")).toHaveAccessibleName(`${title}: ${definition}`);
  });

  it("preserves contextual label overrides and legacy renderer keys", () => {
    render(<AiFactoryIcon kind="morpheme-diffuse" label="An idea in this example" />);
    expect(screen.getByRole("img", { name: "An idea in this example" })).toHaveClass("ai-factory-icon--morpheme-diffuse");
    expect(aiFactoryIconCatalog["morpheme-diffuse"].iconId).toBe("idea-diffuse");
    expect(aiFactoryIconCatalog["morpheme-refined"].iconId).toBe("idea-refined");
  });
});
