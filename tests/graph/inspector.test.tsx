import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Inspector } from "../../src/graph/Inspector";
import { createWeatherGraph } from "../../src/graph/seed";

describe("graph inspector", () => {
  it("edits a participant's arrowheads independently", () => {
    const graph = createWeatherGraph();
    const updates: typeof graph[] = [];
    render(
      <Inspector
        document={graph}
        selection={{ kind: "relationship", id: "iris" }}
        onUpdateDocument={(update) => updates.push(update(graph))}
        onDeleteSelection={() => undefined}
        onClose={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Arrow direction for Date is Aug 15"), {
      target: { value: "both" },
    });
    const participant = updates.at(-1)?.relationships
      .find(({ id }) => id === "iris")
      ?.participants.find(({ nodeId }) => nodeId === "date");
    expect(participant).toMatchObject({ arrowAtNode: true, arrowAtRelation: true });
  });

  it("commits statement edits on blur", () => {
    const graph = createWeatherGraph();
    const updates: typeof graph[] = [];
    render(
      <Inspector
        document={graph}
        selection={{ kind: "proposition", id: "humidity" }}
        onUpdateDocument={(update) => updates.push(update(graph))}
        onDeleteSelection={() => undefined}
        onClose={() => undefined}
      />,
    );

    const field = screen.getByLabelText("Statement");
    fireEvent.change(field, { target: { value: "Humidity is twenty-four percent" } });
    fireEvent.blur(field);
    expect(updates.at(-1)?.propositions.find(({ id }) => id === "humidity")?.statement).toBe(
      "Humidity is twenty-four percent",
    );
  });
});
