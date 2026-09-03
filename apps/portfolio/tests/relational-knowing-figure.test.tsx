import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelationalKnowingFigure } from "../src/generated/blog-pages/vision-and-values/components/relational-knowing-figure";

describe("relational knowing figure", () => {
  it("puts relational information on the edges between simple nodes", () => {
    const { container } = render(<RelationalKnowingFigure />);

    expect(screen.getByRole("img", { name: /Jon Doe is connected to factual nodes/ })).toBeInTheDocument();
    for (const value of [
      "$72k",
      "Teacher",
      "34",
      "Jon Doe",
      "Book sale",
      "More time",
      "Long commute",
      "feels undervalued",
      "derives purpose",
      "senses time accelerating",
      "excited for",
      "wants",
      "feels pain from",
    ]) {
      expect(screen.getByText(value, { exact: true })).toBeInTheDocument();
    }
    expect(screen.getByText(/appears on the edges that connect them/)).toBeInTheDocument();
    expect(container.querySelector(".relational-knowing-figure__person circle")).toBeInTheDocument();
  });
});
