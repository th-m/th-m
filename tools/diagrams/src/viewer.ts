import { mountDiagramMotion, type DiagramMotionMode } from "@th-m/diagram-theme/browser";

declare global { interface Window { thomDiagram: ReturnType<typeof mountDiagramMotion> } }

const svg = document.querySelector<SVGSVGElement>("svg")!;
const play = document.querySelector<HTMLButtonElement>("#play")!;
const progress = document.querySelector<HTMLInputElement>("#timeline")!;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let playing = false;
window.thomDiagram = mountDiagramMotion(svg, document.body.dataset.motion as DiagramMotionMode, value => { playing = value; play.textContent = value ? "Pause" : "Play"; updateStatus(); }, time => { progress.value = String(time); updateStatus(); });
play.onclick = () => playing ? window.thomDiagram.pause() : window.thomDiagram.play();
document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => { window.thomDiagram.pause(); window.thomDiagram.seek(0); progress.value = "0"; window.thomDiagram.play(); };
document.querySelector<HTMLButtonElement>("#complete")!.onclick = () => { window.thomDiagram.pause(); window.thomDiagram.seek(window.thomDiagram.duration); progress.value = String(window.thomDiagram.duration); };
progress.oninput = () => { window.thomDiagram.pause(); window.thomDiagram.seek(Number(progress.value)); };
function accessibility() {
  const disabled = reduced.matches || document.body.dataset.motion === "none";
  for (const control of document.querySelectorAll<HTMLButtonElement | HTMLInputElement>("nav button, nav input")) control.disabled = disabled;
  if (disabled) progress.value = "5.75";
  updateStatus();
}
function updateStatus() {
  document.querySelector("#status")!.textContent = reduced.matches ? "Reduced motion · complete diagram"
    : document.body.dataset.motion === "none" ? "Static diagram"
    : playing ? "Following the flow" : Number(progress.value) >= 5.75 ? "Complete diagram · play to follow the flow" : "Paused · resume or use the timeline";
}
reduced.addEventListener("change", accessibility);
accessibility();
