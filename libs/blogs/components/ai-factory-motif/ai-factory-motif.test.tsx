import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiFactoryMotif } from "./ai-factory-motif";

afterEach(cleanup);

describe("AiFactoryMotif", () => {
  it.each([
    ["vision-to-morpheme", "Vision becomes a morpheme", "Vision", "Morpheme"],
    ["discipline-to-morpheme", "Discipline stabilizes the morpheme", "Discipline", "Disciplined morpheme"],
    ["ontology-of-morphemes", "Ontology coordinates disciplined morphemes", "Actor", "Constraint"],
  ] as const)("renders the %s chapter with an accessible diagram", (variant, title, firstLabel, secondLabel) => {
    render(<AiFactoryMotif variant={variant} />);

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    const diagram = screen.getByRole("img", { name: new RegExp(title) });
    expect(diagram).toContainElement(screen.getByText(firstLabel));
    expect(diagram).toContainElement(screen.getByText(secondLabel));
    expect(diagram.querySelector("title")).toHaveTextContent(title);
    expect(diagram.querySelector("desc")).not.toBeEmptyDOMElement();
    expect(screen.getByRole("region", { name: "Scrollable AI Factory motif" })).toHaveAttribute("tabindex", "0");
  });
});
