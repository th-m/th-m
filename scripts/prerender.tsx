import { readFile } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import App from "../src/App";

const output = new URL("../dist/index.html", import.meta.url);
const template = await readFile(output, "utf8");
const markup = renderToString(<App />);

if (!template.includes("<!--app-html-->")) {
  throw new Error("The production index is missing its prerender placeholder.");
}

await Bun.write(output, template.replace("<!--app-html-->", markup));
console.log("Prerendered the complete semantic page and static THOM fallbacks.");
