import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { documentationViolations } from "./repository-policy";

describe("repository documentation policy", () => {
  it("pairs every README with a complete local agent contract", async () => {
    const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    expect(await documentationViolations(workspaceRoot)).toEqual([]);
  });
});
