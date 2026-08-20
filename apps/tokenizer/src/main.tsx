import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@th-m/tokenizer-visualization/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("tokenizer-root");
if (!root) throw new Error("Tokenizer root was not found.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
