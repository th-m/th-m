import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import { PropositionGraphEditor } from "@th-m/graph-visualization";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tool.css";

const root = document.getElementById("graph-root");
if (!root) throw new Error("Graph editor root was not found.");

createRoot(root).render(
  <StrictMode>
    <PropositionGraphEditor />
  </StrictMode>,
);
