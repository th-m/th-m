import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueLadder } from "../src/generated/blog-pages/vision-and-values/components/value-ladder";

describe("Jon Doe's branching value ladder", () => {
  it("connects one statement to three possible intents and their respective goals", () => {
    render(<ValueLadder />);

    const figure = screen.getByRole("figure", {
      name: "Jon Doe: one statement, multiple possible intents and goals",
    });
    expect(within(figure).getByText("“I want something better”")).toBeInTheDocument();
    const branches = within(figure).getByRole("list", { name: "Possible intents" });
    expect(branches.children).toHaveLength(3);

    const examples = [
      { intent: "Feel valued", goals: ["Increase income from my expertise", "Receive credit for my work"] },
      { intent: "Have more time", goals: ["Spend fewer hours commuting", "Protect evenings with my family"] },
      { intent: "Preserve purpose", goals: ["Keep teaching and helping people", "Reach more people with my ideas"] },
    ];
    for (const { intent, goals } of examples) {
      const intentNode = within(branches).getByText(intent);
      const branch = intentNode.closest("li")!;
      const goalList = within(branch).getByRole("list", {
        name: `Possible goals for ${intent.toLowerCase()}`,
      });
      expect(within(goalList).getAllByRole("listitem")).toHaveLength(2);
      for (const goal of goals) expect(within(goalList).getByText(goal)).toBeInTheDocument();
    }
    expect(within(figure).getByText(/possible interpretations, not facts about Jon/)).toBeInTheDocument();
    expect(within(figure).queryByText("Privacy matters")).not.toBeInTheDocument();
  });
});
