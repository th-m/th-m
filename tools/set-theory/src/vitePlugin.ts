import { realpath } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { isAbsolute, relative, resolve } from "node:path";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import { analyzeSetAtlas } from "@th-m/knowledge-model";
import type { AnalyzeError, AnalyzeRequest } from "@th-m/set-theory-visualization";

const ANALYZE_PATH = "/__sets/analyze";
const MAX_REQUEST_BYTES = 2 * 1024 * 1024;

export interface SetAtlasAnalyzerPluginOptions {
  /** Restricts project-file analysis to this directory. Defaults to Vite's resolved root. */
  root?: string;
}

/** Adds the local-only compiler endpoint to both Vite dev and preview servers. */
export function setAtlasAnalyzerPlugin(
  options: SetAtlasAnalyzerPluginOptions = {},
): Plugin {
  let workspaceRoot = options.root ? resolve(options.root) : process.cwd();

  const install = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(async (request, response, next) => {
      const pathname = request.url
        ? new URL(request.url, "http://localhost").pathname
        : "";
      if (pathname !== ANALYZE_PATH) {
        next();
        return;
      }

      if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        sendJson(response, 405, { revision: 0, error: "Method not allowed." });
        return;
      }
      if (!isLoopbackRequest(request) || !hasSameOrigin(request)) {
        sendJson(response, 403, {
          revision: 0,
          error: "Set analysis is available only on this local origin.",
        });
        return;
      }

      let revision = 0;
      try {
        const payload = await readJsonRequest(request);
        const requestBody = assertAnalyzeRequest(payload);
        revision = requestBody.revision;
        const scopedRequest = await scopeProjectRequest(
          requestBody,
          workspaceRoot,
        );
        const result = await analyzeSetAtlas(scopedRequest);
        sendJson(response, 200, result);
      } catch (error) {
        const status =
          error instanceof RequestBodyTooLargeError
            ? 413
            : error instanceof WorkspaceScopeError
              ? 403
              : 400;
        const body: AnalyzeError = {
          revision,
          error:
            error instanceof Error
              ? error.message
              : "TypeScript analysis failed.",
        };
        sendJson(response, status, body);
      }
    });
  };

  return {
    name: "thom-set-atlas-analyzer",
    apply: "serve",
    configResolved(config) {
      if (!options.root) workspaceRoot = config.root;
    },
    configureServer(server) {
      install(server);
    },
    configurePreviewServer(server) {
      install(server);
    },
  };
}

export const createSetAtlasAnalyzerPlugin = setAtlasAnalyzerPlugin;

async function scopeProjectRequest(
  request: AnalyzeRequest,
  workspaceRoot: string,
): Promise<AnalyzeRequest> {
  if (request.source.mode !== "project") return request;

  const canonicalRoot = await realpath(workspaceRoot);
  const sourceCandidate = isAbsolute(request.source.sourceFilePath)
    ? request.source.sourceFilePath
    : resolve(canonicalRoot, request.source.sourceFilePath);
  const sourceFilePath = await realpath(sourceCandidate).catch(
    () => sourceCandidate,
  );
  assertWithinWorkspace(canonicalRoot, sourceFilePath);

  let tsconfigPath: string | undefined;
  if (request.source.tsconfigPath) {
    const configCandidate = isAbsolute(request.source.tsconfigPath)
      ? request.source.tsconfigPath
      : resolve(canonicalRoot, request.source.tsconfigPath);
    tsconfigPath = await realpath(configCandidate).catch(() => configCandidate);
    assertWithinWorkspace(canonicalRoot, tsconfigPath);
  }

  return {
    ...request,
    source: {
      mode: "project",
      sourceFilePath,
      ...(tsconfigPath ? { tsconfigPath } : {}),
    },
  };
}

function assertWithinWorkspace(root: string, candidate: string): void {
  const pathFromRoot = relative(root, candidate);
  if (
    pathFromRoot === "" ||
    (!pathFromRoot.startsWith("..") && !isAbsolute(pathFromRoot))
  )
    return;
  throw new WorkspaceScopeError(
    "Project analysis is restricted to the current workspace.",
  );
}

function assertAnalyzeRequest(value: unknown): AnalyzeRequest {
  if (!value || typeof value !== "object")
    throw new Error("Request body must be a JSON object.");
  const candidate = value as Partial<AnalyzeRequest>;
  if (!Number.isSafeInteger(candidate.revision) || !candidate.source) {
    throw new Error(
      "Request body must include a non-negative integer revision and source.",
    );
  }
  return candidate as AnalyzeRequest;
}

function isLoopbackRequest(request: IncomingMessage): boolean {
  const hostHeader = request.headers.host;
  if (!hostHeader) return false;
  let hostname: string;
  try {
    hostname = new URL(`http://${hostHeader}`).hostname
      .replace(/^\[|\]$/g, "")
      .toLowerCase();
  } catch {
    return false;
  }
  if (
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    hostname !== "::1"
  )
    return false;

  const remote = request.socket.remoteAddress;
  return (
    !remote ||
    remote === "::1" ||
    remote === "127.0.0.1" ||
    remote.startsWith("::ffff:127.")
  );
}

function hasSameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return (
      new URL(origin).host.toLowerCase() === request.headers.host?.toLowerCase()
    );
  } catch {
    return false;
  }
}

async function readJsonRequest(request: IncomingMessage): Promise<unknown> {
  const declaredLength = Number(request.headers["content-length"] ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    throw new RequestBodyTooLargeError(
      "Analyze request exceeds the 2 MB limit.",
    );
  }

  request.setEncoding("utf8");
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BYTES) {
      throw new RequestBodyTooLargeError(
        "Analyze request exceeds the 2 MB limit.",
      );
    }
  }
  if (!body) throw new Error("Analyze request body is empty.");
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new Error("Analyze request body is not valid JSON.");
  }
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  value: unknown,
): void {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(JSON.stringify(value));
}

class RequestBodyTooLargeError extends Error {}
class WorkspaceScopeError extends Error {}
