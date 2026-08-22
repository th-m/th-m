import { useState } from "react";
import { GenerationPlayback } from "@th-m/llm-generation";
import { DecodingExplorer } from "@th-m/llm-decoding";
import { TrainingWalkthrough } from "@th-m/llm-training";

const llmExperiences = [
  { id: "generate", label: "Generate", content: GenerationPlayback },
  { id: "decode", label: "Decode", content: DecodingExplorer },
  { id: "train", label: "Train", content: TrainingWalkthrough },
] as const;

type LlmExperienceId = (typeof llmExperiences)[number]["id"];

/**
 * Drawer tool that recreates the AnimatedLLM experience on the THOM design
 * system: token-by-token generation playback, decoding strategies, and a
 * training walkthrough, each backed by its own library.
 */
export function LlmExplorer() {
  const [experience, setExperience] = useState<LlmExperienceId>("generate");
  const active = llmExperiences.find((item) => item.id === experience) ?? llmExperiences[0];
  const Active = active.content;

  return (
    <div className="llm-explorer">
      <nav className="llm-explorer__tabs" aria-label="LLM learning experience">
        {llmExperiences.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={item.id === experience}
            onClick={() => setExperience(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {/* keyed so playback state resets when switching experiences */}
      <Active key={experience} />
    </div>
  );
}
