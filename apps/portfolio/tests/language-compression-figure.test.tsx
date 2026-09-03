import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageCompressionFigure } from "../src/generated/blog-pages/vision-and-values/components/language-compression-figure";

describe("language compression figure", () => {
  it("distinguishes a lived experience from its expression and names what is omitted", () => {
    render(<LanguageCompressionFigure />);

    const figure = screen.getByRole("figure", {
      name: "From Jon's experience to the word pain: language leaves details unstated",
    });
    const experience = within(figure).getByText("Pain", { exact: true });
    const expression = within(figure).getByText("“pain”");
    expect(within(experience.parentElement!).getAllByRole("img")).toHaveLength(4);
    for (const name of ["Eye", "Heart", "Mind", "Hand"]) {
      expect(within(experience.parentElement!).getByRole("img", { name })).toBeInTheDocument();
    }
    expect(within(figure).queryByText("Jon’s particular pain")).not.toBeInTheDocument();
    expect(experience.compareDocumentPosition(expression) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(figure).getByText("Represented in language").tagName).toBe("STRONG");
    expect(experience.parentElement?.querySelectorAll("line")).toHaveLength(4);
    expect(within(expression.parentElement!).queryByText("Language")).not.toBeInTheDocument();
    expect(expression.parentElement).toHaveTextContent(/^“pain”$/);
    expect(within(figure).getByText("Left unstated by this word").parentElement).toHaveTextContent(
      "Cause · intensity · personal history · desired response",
    );
    expect(within(figure).getByText("The word names the experience; it does not contain it.")).toBeInTheDocument();
    expect(within(figure).queryByText(/Context and conversation/)).not.toBeInTheDocument();
  });
});
