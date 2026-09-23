import { render, screen, within } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { aiFactoryIconCatalog, aiFactoryIconKinds, aiFactoryIconLabel } from "@th-m/blogs/components";
import { Route } from "../src/routes/ai-factory-motif";

describe("AI Factory motif review", () => {
  it("uses idea terminology while preserving the abstract and concrete icon variants", async () => {
    const rootRoute = createRootRoute({ component: () => <Outlet /> });
    const pageRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/ai-factory-motif",
      component: Route.options.component,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([pageRoute]),
      history: createMemoryHistory({ initialEntries: ["/ai-factory-motif"] }),
    });
    await router.load();
    render(<RouterProvider router={router} />);

    const sequence = await screen.findByRole("region", { name: "Idea → text → token." });
    expect(within(sequence).getByRole("heading", { name: /^Idea$/ })).toBeInTheDocument();
    expect(within(sequence).getByRole("img", { name: /^Abstract idea:/ })).toBeInTheDocument();

    const inventory = screen.getByRole("region", { name: "Every mark has one job." });
    expect(within(inventory).getAllByRole("article")).toHaveLength(26);
    for (const kind of aiFactoryIconKinds) {
      const spec = aiFactoryIconCatalog[kind];
      const card = inventory.querySelector(`#icon-${kind}`) as HTMLElement;
      expect(within(card).getByTitle("Semantic role")).toHaveTextContent(spec.semanticRole);
      expect(within(card).queryByTitle("Icon ID")).not.toBeInTheDocument();
      expect(card.querySelector(".motif-review__part-meta")?.textContent).toBe(spec.semanticRole);
      expect(within(card).getByRole("heading", { name: spec.title })).toBeInTheDocument();
      expect(within(card).getByRole("img")).toHaveAccessibleName(aiFactoryIconLabel(kind));
      expect(card.querySelector(".motif-review__part-definition")).toHaveTextContent(spec.definition);
      expect(card.querySelector(".motif-review__part-grammar dt")).toHaveTextContent("Visual grammar");
      expect(card.querySelector(".motif-review__part-grammar dd")).toHaveTextContent(spec.visualGrammar);
      if (spec.subheading) {
        expect(card.querySelector(".motif-review__part-subheading")).toHaveTextContent(spec.subheading);
      } else {
        expect(card.querySelector(".motif-review__part-subheading")).not.toBeInTheDocument();
      }
    }
    for (const [kind, label] of [["morpheme-diffuse", "Abstract idea"], ["morpheme-refined", "Concrete idea"]]) {
      const card = inventory.querySelector(`#icon-${kind}`) as HTMLElement;
      expect(within(card).getByRole("heading", { name: label })).toBeInTheDocument();
      expect(within(card).getByRole("img")).toHaveAccessibleName(new RegExp(`^${label}:`));
      expect(card).not.toHaveTextContent(kind.replace("morpheme", "idea"));
      expect(card.querySelector(`#icon-${kind.replace("morpheme", "idea")}`)).toBeInTheDocument();
    }
    expect(document.body).not.toHaveTextContent(/morpheme/i);
  });

  it("explains the risk of implementation bypassing understanding beside the situated diagram", async () => {
    const rootRoute = createRootRoute({ component: () => <Outlet /> });
    const pageRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/ai-factory-motif",
      component: Route.options.component,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([pageRoute]),
      history: createMemoryHistory({ initialEntries: ["/ai-factory-motif"] }),
    });
    await router.load();
    render(<RouterProvider router={router} />);

    const section = await screen.findByRole("region", {
      name: "Understanding used to be a prerequisite. Now we can implement without it.",
    });
    expect(section).toHaveTextContent("Understanding used to be a practical prerequisite to implementation.");
    expect(section).toHaveTextContent("AI can now produce an implementation before we understand the problem.");
    expect(section).toHaveTextContent("we get “slop”: output that looks finished without being understood.");
    expect(within(section).getByRole("img", { name: /Understanding carries a term into implementation/ })).toBeInTheDocument();
    expect(section).toHaveTextContent("AFFORDS");

    const experience = screen.getByRole("region", { name: "Experience, but lacking." });
    expect(Array.from(experience.querySelectorAll("figure"), figure => figure.getAttribute("data-variant"))).toEqual([
      "experience-but-lacking",
      "model-priorities-and-goal-fit",
    ]);
    expect(within(experience).getByRole("img", { name: /Fluent output is not value insight/ })).toBeInTheDocument();
    expect(experience).toHaveTextContent("Training priorities");
    expect(experience).toHaveTextContent("Runtime harness");
    expect(experience).toHaveTextContent("Your actual goal");
    expect(experience).toHaveTextContent("Diogo Almeida");

    const refinement = screen.getByRole("region", {
      name: "The stabilizing state: practice gives a boundary enough continuity to be shared.",
    });
    expect(refinement).toHaveAttribute("id", "motif-02");
    expect(Array.from(refinement.querySelectorAll("figure"), figure => figure.getAttribute("data-variant"))).toEqual([
      "refinement-and-discipline-to-term-of-art",
      "understanding-in-embedding-space",
    ]);
    expect(within(refinement).getByRole("img", { name: /Short input, useful output—or just more tokens/ })).toBeInTheDocument();
    expect(refinement).toHaveTextContent("Embedding space");
    expect(refinement).toHaveTextContent("Useful expansion");
    expect(refinement).toHaveTextContent("Excess output");

    const understanding = screen.getByRole("region", {
      name: "Where understanding lives determines the bottleneck.",
    });
    expect(understanding).toHaveAttribute("id", "motif-03B");
    expect(understanding).toHaveTextContent("The upper topology delegates production");
    expect(within(understanding).getByRole("img", { name: /The same teams, a different place for understanding/ })).toBeInTheDocument();
    expect(understanding).toHaveTextContent("One interpretation gate");
    expect(understanding).toHaveTextContent("Shared intent");

    const inventory = screen.getByRole("region", { name: "Every mark has one job." });
    for (const kind of ["self", "others"]) {
      const card = inventory.querySelector(`#icon-${kind}`)!;
      expect(within(card as HTMLElement).getByRole("img", { name: kind === "self" ? /^Self:/ : /^Others:/ })).toBeInTheDocument();
      expect(card).toHaveTextContent("participant");
    }
    expect(inventory.querySelector("#icon-self .motif-review__part-definition")).toHaveTextContent("The individual whose perspective anchors the relationship.");
    expect(inventory.querySelector("#icon-others .motif-review__part-definition")).toHaveTextContent("People beyond the individual perspective");
  });
});
