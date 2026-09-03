import { LinkPreview } from "@th-m/ui";
import "./goals-article.css";

type ConversationMessage = {
  speaker: string;
  kind: "user" | "model";
  text: string;
};

const conversationPreviews: Record<string, ConversationMessage[]> = {
  ChatGPT: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "ChatGPT",
      kind: "model",
      text: "Truth, human agency, nonmaleficence, justice, usefulness, humility, and privacy. When these conflict, it prioritizes truthful assistance that preserves agency while minimizing serious harm.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "ChatGPT",
      kind: "model",
      text: "Correctness, clarity, simplicity, maintainability, safety, testability, observability, performance, consistency, and reversibility—usually ordered as correct, clear, simple, and safe before fast.",
    },
  ],
  Claude: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "Claude",
      kind: "model",
      text: "Honesty, genuine helpfulness, concern for the person rather than only the task, avoiding serious harm, intellectual curiosity, even-handedness, and a stable character across contexts.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "Claude",
      kind: "model",
      text: "Read before writing, respect the requested scope, prefer the simplest working solution, verify correctness honestly, fix causes rather than symptoms, make structure carry meaning, and treat errors as part of the design.",
    },
  ],
  DeepSeek: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "DeepSeek",
      kind: "model",
      text: "Helpfulness, harmlessness, honesty, intellectual integrity, respect for autonomy, and humility. It describes these as aspirational guidelines shaped by training and reinforcement rather than human feelings.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "DeepSeek",
      kind: "model",
      text: "Next-token prediction with alignment, constrained decoding, source and boundary awareness, attentional fairness, privacy and robustness, multi-step reasoning, and avoiding both sycophancy and excessive refusal.",
    },
  ],
};

function ConversationPreview({ model }: { model: keyof typeof conversationPreviews }) {
  return (
    <article
      className="goals-conversation-preview"
      role="document"
      aria-label={`${model} shared conversation preview`}
    >
      <header className="goals-conversation-preview__header">
        <span>Shared conversation</span>
        <strong>{model}</strong>
      </header>
      <div className="goals-conversation-preview__thread" tabIndex={0}>
        {conversationPreviews[model].map((message, index) => (
          <section
            className={`goals-conversation-preview__message goals-conversation-preview__message--${message.kind}`}
            key={`${message.speaker}-${index}`}
          >
            <strong>{message.speaker}</strong>
            <p>{message.text}</p>
          </section>
        ))}
      </div>
      <footer className="goals-conversation-preview__footer">
        <span>Condensed from the shared thread</span>
        <span aria-hidden="true">Open full conversation ↗</span>
      </footer>
    </article>
  );
}

function ConversationLink({
  model,
  href,
}: {
  model: keyof typeof conversationPreviews;
  href: string;
}) {
  return (
    <LinkPreview url={href} external preview={<ConversationPreview model={model} />}>
      {model}
    </LinkPreview>
  );
}

export { ConversationLink };
export { default } from "./components/registry";
