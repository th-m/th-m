import { expect, test } from "@playwright/test";

const route = "/writing/vision-and-values";

test("renders every declarative training frame with aligned target styling", async ({ page }) => {
  test.setTimeout(60_000);
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(route);
  const scene = page.locator("section.nnl");
  await expect(scene).toBeVisible();

  await expect(scene.locator("g.nnl-node:visible")).toHaveCount(13);
  await expect(scene.locator("g.nnl-node.nnl-node-tone-primary")).toHaveCount(3);
  await expect(scene.locator("path.nnl-edge")).toHaveCount(36);
  await expect(scene.locator("path.nnl-edge.nnl-edge-tone-primary")).toHaveCount(2);
  await expect(scene.locator(".nnl__probs")).toBeVisible();
  await expect(scene.getByRole("heading", { name: "LLM Training" })).toBeVisible();
  await expect(scene.locator(".nnl__summary")).toHaveText("Next-token probabilities for “The cat sat on the …”");
  await expect(scene.locator(".nnl__eyebrow")).toHaveCount(0);
  await expect(scene.locator(".nnl__prob-heading")).toHaveCount(0);
  await expect(scene.locator('.nnl__prob[data-node-id="output-mat"] .nnl__prob-token')).toHaveText("“mat”");
  await expect(scene.locator('.nnl__prob[data-node-id="output-floor"] .nnl__prob-token')).toHaveText("“floor”");

  await scene.getByRole("button", { name: /Step 2 of 4: Target \+ loss/ }).click();
  await expect(scene.locator('.nnl__prob[data-node-id="output-mat"]')).toBeVisible();
  await expect(scene.getByRole("status").getByText(
    "The target is the actual next token in the training data; loss is higher when the model assigns that token less probability.",
  )).toBeVisible();

  for (let epoch = 1; epoch <= 5; epoch += 1) {
    const snapshotId = `epoch-${epoch}`;
    const nextSnapshotId = `epoch-${Math.min(epoch + 1, 5)}`;
    const expectedFrames = [
      { step: "forward", snapshot: snapshotId },
      { step: "loss", snapshot: snapshotId },
      { step: "backward", snapshot: snapshotId },
      { step: "update", snapshot: nextSnapshotId },
    ];

    for (const [stepIndex, expected] of expectedFrames.entries()) {
      const state = await page.evaluate(async ({ index, expectedStep, expectedIteration }) => {
        const sceneElement = document.querySelector<HTMLElement>("section.nnl")!;
        const buttons = sceneElement.querySelectorAll<HTMLButtonElement>(".nnl__step");
        buttons[index].click();
        for (let attempt = 0; attempt < 100; attempt += 1) {
          if (
            sceneElement.dataset.stepId === expectedStep
            && sceneElement.dataset.iterationId === expectedIteration
          ) break;
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        const incomingTargetEdge = sceneElement.querySelector<SVGPathElement>(
          'path[data-edge-id="hidden-2-4--output-mat"]',
        );
        const targetNode = sceneElement.querySelector<SVGGElement>('g[data-node-id="output-mat"]');
        const targetBar = sceneElement.querySelector<HTMLElement>('.nnl__prob[data-node-id="output-mat"]');
        return {
          iteration: sceneElement.dataset.iterationId,
          step: sceneElement.dataset.stepId,
          snapshot: sceneElement.dataset.snapshotId,
          incomingTargetDanger: incomingTargetEdge?.classList.contains("nnl-edge-tone-danger") ?? false,
          targetNodeDanger: targetNode?.classList.contains("nnl-node-tone-danger") ?? false,
          targetBarDanger: targetBar?.classList.contains("nnl-value-tone-danger") ?? false,
          outputPredictionPrimary: sceneElement.querySelector('g[data-node-id="output-floor"]')
            ?.classList.contains("nnl-node-tone-primary") ?? false,
          outputPredictionEdgePrimary: sceneElement.querySelector('path[data-edge-id="hidden-2-4--output-floor"]')
            ?.classList.contains("nnl-edge-tone-primary") ?? false,
          targetGradientEdges: sceneElement.querySelectorAll(
            'path.nnl-edge-tone-accent[data-to="output-mat"]',
          ).length,
          backpropagationEdgeIds: [...sceneElement.querySelectorAll('path.nnl-edge-tone-accent')]
            .map((edge) => edge.getAttribute("data-edge-id")),
          competingOutputEdges: sceneElement.querySelectorAll('path[data-to="output-floor"]').length,
          outsideCount: sceneElement.querySelectorAll('path[data-edge-id="prediction--target"]').length,
          primaryNodeIds: [...sceneElement.querySelectorAll('g.nnl-node-tone-primary')]
            .map((node) => node.getAttribute("data-node-id")),
          highlightedEdgeCount: sceneElement.querySelectorAll(
            'path.nnl-edge-tone-primary, path.nnl-edge-tone-accent, path.nnl-edge-tone-danger',
          ).length,
          updateSigns: [...sceneElement.querySelectorAll(
            'g.neural-training-figure__update-sign--positive, g.neural-training-figure__update-sign--negative',
          )].map((node) => ({
            id: node.getAttribute("data-node-id"),
            sign: node.querySelector(".nnl-node__value")?.textContent,
            fontSize: getComputedStyle(node.querySelector(".nnl-node__value")!).fontSize,
            positive: node.classList.contains("neural-training-figure__update-sign--positive"),
          })),
          iterationInControls: sceneElement.querySelector(
            ".nnl__controls > .nnl__chip--iteration",
          )?.textContent,
          iterationInReadout: sceneElement.querySelector(
            ".nnl__readout .nnl__chip--iteration",
          )?.textContent ?? null,
          telemetryAlignmentDelta: (() => {
            const copy = sceneElement.querySelector<HTMLElement>(".nnl__readout-copy");
            const chips = sceneElement.querySelector<HTMLElement>(".nnl__chips");
            if (!copy || !chips) return null;
            const copyRect = copy.getBoundingClientRect();
            const chipsRect = chips.getBoundingClientRect();
            if (window.matchMedia("(max-width: 640px)").matches) {
              return Math.abs(copyRect.left - chipsRect.left);
            }
            return Math.abs(
              (copyRect.top + copyRect.bottom) / 2 - (chipsRect.top + chipsRect.bottom) / 2,
            );
          })(),
        };
      }, { index: stepIndex, expectedStep: expected.step, expectedIteration: snapshotId });

      expect(state.iteration).toBe(snapshotId);
      expect(state.step).toBe(expected.step);
      expect(state.snapshot).toBe(expected.snapshot);
      expect(state.iterationInControls).toBe(`epoch ${epoch} / 5`);
      expect(state.iterationInReadout).toBeNull();

      if (expected.step === "loss") {
        expect(state.incomingTargetDanger).toBe(true);
        expect(state.targetNodeDanger).toBe(true);
        expect(state.targetBarDanger).toBe(true);
        expect(state.outputPredictionPrimary).toBe(false);
        expect(state.outputPredictionEdgePrimary).toBe(false);
        expect(state.outsideCount).toBe(0);
        expect(state.telemetryAlignmentDelta).toBeLessThanOrEqual(1);
      }
      if (expected.step === "backward") {
        expect(state.outputPredictionPrimary).toBe(false);
        expect(state.targetGradientEdges).toBe(1);
        expect(state.backpropagationEdgeIds).toEqual([
          "input-1--hidden-1-3",
          "hidden-1-3--hidden-2-4",
          "hidden-2-4--output-mat",
        ]);
        expect(state.competingOutputEdges).toBe(0);
        expect(state.telemetryAlignmentDelta).toBeLessThanOrEqual(1);
      }
      if (expected.step === "update") {
        expect(state.primaryNodeIds).toEqual(["input-1", "hidden-1-3", "hidden-2-4"]);
        expect(state.highlightedEdgeCount).toBe(0);
        expect(state.updateSigns).toEqual([
          { id: "input-1", sign: "+", fontSize: "20px", positive: true },
          { id: "hidden-1-3", sign: "+", fontSize: "20px", positive: true },
          { id: "hidden-2-4", sign: "−", fontSize: "20px", positive: false },
        ]);
        expect(state.telemetryAlignmentDelta).toBeLessThanOrEqual(1);
      }
    }

    if (epoch < 5) {
      await page.evaluate(async (expectedIteration) => {
        const sceneElement = document.querySelector<HTMLElement>("section.nnl")!;
        sceneElement.querySelector<HTMLButtonElement>(".nnl__ctrl--next")!.click();
        for (let attempt = 0; attempt < 100; attempt += 1) {
          if (sceneElement.dataset.iterationId === expectedIteration) break;
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }, `epoch-${epoch + 1}`);
    }
  }

  await scene.locator(".nnl__step").first().focus();
  await page.keyboard.press("Enter");
  await expect(scene).toHaveAttribute("data-step-id", "forward");
  expect(await scene.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
  expect(consoleErrors).toEqual([]);
});

test("starts at the final fixed frame under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);

  const scene = page.locator("section.nnl");
  await expect(scene).toHaveAttribute("data-motion", "reduced");
  await expect(scene).toHaveAttribute("data-iteration-id", "epoch-5");
  await expect(scene).toHaveAttribute("data-step-id", "update");
  await expect(scene).toHaveAttribute("data-snapshot-id", "epoch-5");
});
