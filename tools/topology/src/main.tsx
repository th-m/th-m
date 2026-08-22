import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TopologyTool } from "./TopologyTool";
import "./tool.css";

const root = document.getElementById("topology-root");
if (!root) throw new Error("Topology tool root was not found.");

createRoot(root).render(
  <StrictMode>
    <TopologyTool />
  </StrictMode>,
);
