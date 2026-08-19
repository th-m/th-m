import { writeFile } from "node:fs/promises";
import { renderTailwindTheme } from "../src/tailwind";

const output = new URL("../src/theme.css", import.meta.url);
await writeFile(output, renderTailwindTheme(), "utf8");
