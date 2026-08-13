import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource/ibm-plex-mono/400.css";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Application root was not found");

if (root.querySelector("main")) {
  ReactDOM.hydrateRoot(root, <React.StrictMode><App /></React.StrictMode>);
} else {
  ReactDOM.createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
}
