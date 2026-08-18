import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@xyflow/react/dist/style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GraphApp } from "./GraphApp";
import "./graph.css";

const root = document.getElementById("graph-root");
if (!root) throw new Error("Graph editor root was not found.");

createRoot(root).render(
  <StrictMode>
    <GraphApp />
  </StrictMode>,
);
