import {
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { analyzeSetAtlas } from "../../src/analyzer";

const temporaryDirectories: string[] = [];

afterAll(async () => {
  await Promise.all(
    temporaryDirectories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("set atlas TypeScript analyzer", () => {
  it("finds literal containment, overlap, disjointness, equivalence, and special types", async () => {
    const result = await analyzeSetAtlas({
      revision: 7,
      source: {
        mode: "snippet",
        fileName: "traffic.ts",
        code: [
          'type Primary = "red" | "green";',
          'type Warning = "amber" | "red";',
          'type Red = "red";',
          "type Count = number;",
          'type RedAgain = "red";',
          "type Everything = unknown;",
          "type Nothing = never;",
          "type EscapeHatch = any;",
          "type Box<T> = { value: T };",
        ].join("\n"),
      },
    });

    expect(result.revision).toBe(7);
    expect(result.compilerVersion).toMatch(/^7\./);
    expect(result.symbols.map((symbol) => symbol.name)).toEqual([
      "Primary",
      "Warning",
      "Red",
      "Count",
      "RedAgain",
      "Everything",
      "Nothing",
      "EscapeHatch",
      "Box",
    ]);

    const symbols = Object.fromEntries(
      result.symbols.map((symbol) => [symbol.name, symbol]),
    );
    expect(symbols.Everything.status).toBe("universe");
    expect(symbols.Nothing.status).toBe("empty");
    expect(symbols.EscapeHatch.status).toBe("exception");
    expect(symbols.Box.status).toBe("template");
    expect(symbols.Primary.sourceSpan).toMatchObject({ line: 1, column: 1 });

    expect(relation(result, "Red", "Primary")).toMatchObject({
      kind: "proper-subset",
    });
    expect(relation(result, "Primary", "Warning")).toMatchObject({
      kind: "overlap",
    });
    expect(relation(result, "Primary", "Count")).toMatchObject({
      kind: "disjoint",
    });
    expect(relation(result, "Red", "RedAgain")).toMatchObject({
      kind: "equivalent",
    });
    expect(relation(result, "Primary", "Everything")).toMatchObject({
      kind: "proper-subset",
    });
    expect(relation(result, "EscapeHatch", "Primary")).toMatchObject({
      kind: "indeterminate",
      confidence: "approximate",
    });

    const redAtom = result.atoms.find((atom) => atom.label === '"red"');
    expect(redAtom?.kind).toBe("literal");
    expect(redAtom?.ownerIds).toEqual(
      expect.arrayContaining([
        symbols.Primary.id,
        symbols.Warning.id,
        symbols.Red.id,
      ]),
    );
    expect(result.atoms).toContainEqual(
      expect.objectContaining({ label: "number", kind: "primitive" }),
    );
  }, 20_000);

  it("uses structural assignability and marks open object relations as derived", async () => {
    const result = await analyzeSetAtlas({
      revision: 1,
      source: {
        mode: "snippet",
        fileName: "objects.ts",
        code: [
          "interface Named { name: string }",
          "interface Employee { name: string; id: number }",
          "interface Timed { createdAt: Date }",
          "interface Named { readonly name: string }",
          'class Person { name = "Ada" }',
        ].join("\n"),
      },
    });

    expect(
      result.symbols.filter((symbol) => symbol.name === "Named"),
    ).toHaveLength(1);
    expect(relation(result, "Employee", "Named")).toMatchObject({
      kind: "proper-subset",
      confidence: "derived",
    });
    expect(relation(result, "Named", "Timed")).toMatchObject({
      kind: "overlap",
      confidence: "derived",
    });
    expect(
      result.symbols.find((symbol) => symbol.name === "Person")?.kind,
    ).toBe("class");
  }, 20_000);

  it("returns source-positioned diagnostics without dropping resolvable declarations", async () => {
    const result = await analyzeSetAtlas({
      revision: 2,
      source: {
        mode: "snippet",
        fileName: "broken.ts",
        code: "type Good = string;\ntype Broken = DoesNotExist;",
      },
    });

    expect(result.symbols.map((symbol) => symbol.name)).toEqual([
      "Good",
      "Broken",
    ]);
    expect(result.symbols[1].status).toBe("exception");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 2304,
        severity: "error",
        span: expect.objectContaining({ line: 2 }),
      }),
    );
  }, 20_000);

  it("loads imports through the nearest project config and only emits selected-file declarations", async () => {
    const directory = await mkdtemp(join(tmpdir(), "thom-set-atlas-"));
    temporaryDirectories.push(directory);
    const sourceDirectory = join(directory, "src");
    await mkdir(sourceDirectory);
    await writeFile(
      join(directory, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { strict: true, noEmit: true },
        include: ["src"],
      }),
    );
    await writeFile(
      join(sourceDirectory, "shared.ts"),
      'export type Shared = "shared";',
    );
    const entryPath = join(sourceDirectory, "entry.ts");
    const entrySource =
      'import type { Shared } from "./shared";\ntype Local = Shared | "local";\ntype OnlyShared = Shared;';
    await writeFile(entryPath, entrySource);

    const result = await analyzeSetAtlas({
      revision: 3,
      source: { mode: "project", sourceFilePath: entryPath },
    });

    expect(result.resolvedConfigPath).toBe(
      await realpath(join(directory, "tsconfig.json")),
    );
    expect(result.sourceText).toBe(entrySource);
    expect(await readFile(entryPath, "utf8")).toBe(entrySource);
    expect(result.symbols.map((symbol) => symbol.name)).toEqual([
      "Local",
      "OnlyShared",
    ]);
    expect(relation(result, "OnlyShared", "Local")).toMatchObject({
      kind: "proper-subset",
    });
    expect(
      result.diagnostics.filter(
        (diagnostic) => diagnostic.severity === "error",
      ),
    ).toEqual([]);
  }, 20_000);

  it("discovers the owning config when the nearest tsconfig is a solution file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "thom-set-atlas-solution-"));
    temporaryDirectories.push(directory);
    const sourceDirectory = join(directory, "src");
    await mkdir(sourceDirectory);
    await writeFile(
      join(directory, "tsconfig.json"),
      JSON.stringify({ files: [], references: [{ path: "./tsconfig.app.json" }] }),
    );
    await writeFile(
      join(directory, "tsconfig.app.json"),
      JSON.stringify({
        compilerOptions: { strict: true, noEmit: true },
        include: ["src"],
      }),
    );
    const entryPath = join(sourceDirectory, "entry.ts");
    await writeFile(entryPath, 'type Greeting = "Hi" | "Hello";');

    const result = await analyzeSetAtlas({
      revision: 4,
      source: { mode: "project", sourceFilePath: entryPath },
    });

    expect(result.resolvedConfigPath).toBe(
      await realpath(join(directory, "tsconfig.app.json")),
    );
    expect(result.symbols.map((symbol) => symbol.name)).toEqual(["Greeting"]);
    expect(
      result.diagnostics.filter(
        (diagnostic) => diagnostic.severity === "error",
      ),
    ).toEqual([]);
  }, 20_000);

  it("keeps stable symbol identifiers when unrelated source positions change", async () => {
    const base = await analyzeSetAtlas({
      revision: 1,
      source: {
        mode: "snippet",
        fileName: "stable.ts",
        code: "type A = string;",
      },
    });
    const shifted = await analyzeSetAtlas({
      revision: 2,
      source: {
        mode: "snippet",
        fileName: "stable.ts",
        code: "\n\ntype A = string;",
      },
    });
    expect(base.symbols[0].id).toBe(shifted.symbols[0].id);
  }, 20_000);

  it("caps analysis at the first 100 declarations and reports the omission", async () => {
    const code = Array.from(
      { length: 101 },
      (_, index) => `type Item${index} = ${index};`,
    ).join("\n");
    const result = await analyzeSetAtlas({
      revision: 4,
      source: { mode: "snippet", fileName: "large.ts", code },
    });

    expect(result.sourceText).toBe(code);
    expect(result.symbols).toHaveLength(100);
    expect(result.symbols.at(-1)?.name).toBe("Item99");
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "set-atlas/declaration-limit",
        severity: "warning",
        span: expect.objectContaining({ line: 101 }),
      }),
    );
  }, 20_000);
});

function relation(
  result: Awaited<ReturnType<typeof analyzeSetAtlas>>,
  firstName: string,
  secondName: string,
) {
  const firstId = result.symbols.find(
    (symbol) => symbol.name === firstName,
  )?.id;
  const secondId = result.symbols.find(
    (symbol) => symbol.name === secondName,
  )?.id;
  return result.relations.find(
    (candidate) =>
      (candidate.sourceId === firstId && candidate.targetId === secondId) ||
      (candidate.sourceId === secondId && candidate.targetId === firstId),
  );
}
