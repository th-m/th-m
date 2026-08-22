import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { setAtlasAnalyzerPlugin } from "../../src/vitePlugin";

const temporary: string[] = [];
afterEach(async () => {
  await Promise.all(temporary.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

interface FakeResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  done: boolean;
  setHeader(name: string, value: string): void;
  end(body: string): void;
}

function makeResponse(): FakeResponse {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    done: false,
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    end(body: string) {
      this.body = body;
      this.done = true;
    },
  };
}

interface FakeRequest {
  headers: Record<string, string | undefined>;
  socket: { remoteAddress: string };
  url: string;
  method: string;
  setEncoding(): void;
  [Symbol.asyncIterator](): AsyncIterator<string>;
}

function makeRequest(
  body: string,
  options: { host?: string; origin?: string; remoteAddress?: string; method?: string; url?: string } = {},
): FakeRequest {
  return {
    headers: {
      host: options.host ?? "127.0.0.1:5191",
      ...(options.origin ? { origin: options.origin } : {}),
    },
    socket: { remoteAddress: options.remoteAddress ?? "::1" },
    url: options.url ?? "/__sets/analyze",
    method: options.method ?? "POST",
    setEncoding() {},
    [Symbol.asyncIterator]: async function* () {
      yield body;
    },
  };
}

type Middleware = (request: unknown, response: FakeResponse, next: () => void) => void | Promise<void>;

function installPlugin(root: string): { middleware: Middleware; next: () => void } {
  let middleware: Middleware = () => undefined;
  const next = () => undefined;
  const plugin = setAtlasAnalyzerPlugin({ root });
  (
    plugin as unknown as {
      configureServer(server: { middlewares: { use(handler: Middleware): void } }): void;
    }
  ).configureServer({
    middlewares: {
      use(handler: Middleware) {
        middleware = handler;
      },
    },
  });
  return { middleware, next };
}

describe("setAtlasAnalyzerPlugin", () => {
  it("rejects non-POST requests with 405", async () => {
    const { middleware, next } = installPlugin(process.cwd());
    const response = makeResponse();
    await middleware(makeRequest("", { method: "GET" }), response, next);
    expect(response.statusCode).toBe(405);
    expect(response.headers["Allow"]).toBe("POST");
  });

  it("rejects non-loopback hosts with 403", async () => {
    const { middleware, next } = installPlugin(process.cwd());
    const response = makeResponse();
    await middleware(makeRequest("{}", { host: "evil.example" }), response, next);
    expect(response.statusCode).toBe(403);
    expect(response.body).toContain("only on this local origin");
  });

  it("rejects cross-origin requests with 403", async () => {
    const { middleware, next } = installPlugin(process.cwd());
    const response = makeResponse();
    await middleware(
      makeRequest("{}", { origin: "https://evil.example" }),
      response,
      next,
    );
    expect(response.statusCode).toBe(403);
  });

  it("analyzes a pasted snippet and returns a typed result", async () => {
    const root = await mkdtemp(join(tmpdir(), "thm-sets-plugin-"));
    temporary.push(root);
    const { middleware, next } = installPlugin(root);
    const response = makeResponse();
    await middleware(
      makeRequest(
        JSON.stringify({
          revision: 7,
          source: { mode: "snippet", fileName: "signal.ts", code: 'type Stop = "red" | "amber";' },
        }),
      ),
      response,
      next,
    );
    expect(response.statusCode).toBe(200);
    expect(response.headers["Content-Type"]).toContain("application/json");
    const result = JSON.parse(response.body) as { revision: number; symbols: unknown[] };
    expect(result.revision).toBe(7);
    expect(result.symbols.length).toBeGreaterThan(0);
  }, 20_000);

  it("restricts project analysis to the workspace with 403", async () => {
    const root = await mkdtemp(join(tmpdir(), "thm-sets-plugin-"));
    temporary.push(root);
    const { middleware, next } = installPlugin(root);
    const response = makeResponse();
    await middleware(
      makeRequest(
        JSON.stringify({
          revision: 1,
          source: { mode: "project", sourceFilePath: "/etc/hosts" },
        }),
      ),
      response,
      next,
    );
    expect(response.statusCode).toBe(403);
    expect(response.body).toContain("restricted to the current workspace");
  });
});
