import { useState } from "react";
import { NeuralNetworkVisualization } from "./NeuralNetworkVisualization";
import { TransformerLab } from "./TransformerLab";

export const languageModelExperiences = ["trace", "lab"] as const;
export type LanguageModelExperience = (typeof languageModelExperiences)[number];

export interface LanguageModelWorkbenchProps {
  initialExperience?: LanguageModelExperience;
  reducedMotion?: "system" | "always" | "never";
  className?: string;
}

export function LanguageModelWorkbench({
  initialExperience = "trace",
  reducedMotion = "system",
  className = "",
}: LanguageModelWorkbenchProps) {
  const [experience, setExperience] = useState(initialExperience);
  return (
    <section className={`nnv-workbench ${className}`} aria-label="Language model learning workbench" data-experience={experience}>
      <nav className="nnv-workbench__nav" aria-label="Learning experience">
        <div>
          <span>Choose a lens</span>
          <strong>{experience === "trace" ? "Follow one token through inference" : "Transform inputs and inspect training telemetry"}</strong>
        </div>
        <div>
          <button type="button" aria-pressed={experience === "trace"} onClick={() => setExperience("trace")}><span>01</span>Inference trace</button>
          <button type="button" aria-pressed={experience === "lab"} onClick={() => setExperience("lab")}><span>02</span>Transformer lab</button>
        </div>
      </nav>
      {experience === "trace"
        ? <NeuralNetworkVisualization reducedMotion={reducedMotion} />
        : <TransformerLab reducedMotion={reducedMotion} />}
    </section>
  );
}
