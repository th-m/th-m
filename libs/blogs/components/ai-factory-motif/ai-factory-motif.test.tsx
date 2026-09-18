import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AiFactoryMotif } from "./ai-factory-motif";

afterEach(cleanup);

describe("AiFactoryMotif", () => {
  it.each([
    ["morpheme-to-token", "Meaning does not arrive as a token", "Morpheme", "Token sequence"],
    ["formalized-idea-to-density", "Constraint concentrates the continuation", "Formalized idea", "Targeted token field"],
    ["ontology-to-tokens", "Ontology gives generation a world to target", "Ontology", "Token sequence"],
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
