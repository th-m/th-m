import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SetAtlasApp } from "./SetAtlasApp";
import "./sets.css";

const root = document.getElementById("sets-root");
if (!root) throw new Error("Set atlas root was not found.");

createRoot(root).render(
  <StrictMode>
    <SetAtlasApp />
  </StrictMode>,
);
