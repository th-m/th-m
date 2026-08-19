import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { documentationViolations, foundationColorViolations } from "./repository-policy";

describe("repository documentation policy", () => {
  it("pairs every README with a complete local agent contract", async () => {
    const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    expect(await documentationViolations(workspaceRoot)).toEqual([]);
  });
});

describe("repository design-theme policy", () => {
  it("keeps canonical foundation literals inside the owning theme package", async () => {
    const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    expect(await foundationColorViolations(workspaceRoot)).toEqual([]);
  });
});
