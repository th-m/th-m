import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { setup } from "./upstreams";
import { generate } from "./generate";
import { workspacePath } from "./paths";

const workspace = resolve(import.meta.dir, "../../..");
try {
  const args = process.argv.slice(2).filter(arg => arg !== "--");
  const command = args.shift();
  if (command === "setup") { await setup(workspace); }
  else if (command === "preview") {
    const { values } = parseArgs({ args, options: { input:{type:"string",default:"tools/diagrams/dist/pipeline.html"} }, strict:true });
    const path = await workspacePath(workspace, values.input!);
    if (!await Bun.file(path).exists()) throw new Error("Generate the HTML file before previewing it");
    Bun.serve({ hostname:"127.0.0.1", port:5193, fetch(request) {
      return new URL(request.url).pathname === "/" ? new Response(Bun.file(path), { headers:{"Content-Type":"text/html; charset=utf-8"} }) : new Response("Not found", {status:404});
    } });
    console.log(`Diagram preview: http://127.0.0.1:5193 (${path})`);
  }
  else if (command === "gen") {
    const { values } = parseArgs({ args, options: {
      engine:{type:"string"}, input:{type:"string"}, output:{type:"string"}, mode:{type:"string",default:"architecture"},
      motion:{type:"string",default:"none"}, theme:{type:"string"}, gif:{type:"boolean",default:false},
    }, strict:true, allowPositionals:false });
    if ((values.engine !== "fireworks" && values.engine !== "diagram-design") || !values.input || !values.output) throw new Error("Provide --engine fireworks|diagram-design --input path --output stem");
    if (values.motion !== "none" && values.motion !== "draw" && values.motion !== "flow") throw new Error("--motion must be none, draw, or flow");
    if (values.gif && values.motion === "none") throw new Error("GIF export requires --motion draw or flow");
    await generate(workspace, { engine:values.engine, input:values.input, output:values.output, mode:values.mode!, motion:values.motion, theme:values.theme, gif:values.gif! });
  } else throw new Error("Usage: diagrams:setup or diagrams:gen -- --engine fireworks|diagram-design --input path --output stem [--motion none|draw|flow] [--gif] [--theme path]");
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
