import { DocumentPopover, ExternalLink, Flow, Table } from "@th-m/blogs/components";
import { NeuralTrainingFigure } from "@th-m/blogs/components/neural-training-figure";
import type { ReactNode } from "react";
import "./llm-compression-detail.css";

export function LlmCompressionDetail({ children }: { children: ReactNode }) {
  return (
    <DocumentPopover
      title="Tokens and Cross-entropy Training"
      trigger={(
        <span className="engineering-detail__trigger">
          <span className="engineering-detail__icon" aria-hidden="true">{"</>"}</span>
          <span>{children}</span>
        </span>
      )}
    >
      <section className="engineering-detail" aria-label="Software engineering detail">
        <p className="engineering-detail__eyebrow">
          <span className="engineering-detail__icon" aria-hidden="true">{"</>"}</span>
          Software engineering detail
        </p>

        <p>
          To drive this point home, it is helpful to understand tokenization and
          cross-entropy training. This is how models learn to identify useful next tokens.
        </p>

        <p>
          Before a model can process text, a <strong>tokenizer</strong> converts it into
          numerical units. The process is designed so those units can later be decoded
          back into text. Technically, tokenization is a lossless compression technique.
          A popular method is <strong>Byte Pair Encoding</strong>, adapted from Philip
          Gage&apos;s{" "}
          <ExternalLink href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">
            “A New Algorithm for Data Compression”
          </ExternalLink>.
        </p>

        <Flow>text → tokens → inference → tokens → text</Flow>

        <p>
          The pretraining process reinforces the model through prediction. Given the
          sentence “the cat sat on the mat,” we remove the word “mat” and ask the model
          to predict the continuation.
        </p>

        <p>Given <em>The cat sat on the …</em>, the model might assign:</p>

        <Table>
          <thead>
            <tr>
              <th>Possible next token</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>mat</code></td><td>70%</td></tr>
            <tr><td><code>floor</code></td><td>15%</td></tr>
            <tr><td><code>chair</code></td><td>5%</td></tr>
            <tr><td>everything else</td><td>10%</td></tr>
          </tbody>
        </Table>

        <NeuralTrainingFigure />

        <ul>
          <li>The loss function measures the prediction error.</li>
          <li>Backpropagation identifies how parameters contributed to it.</li>
          <li>The optimizer updates those parameters to improve future predictions.</li>
        </ul>

        <p>
          Grant Anderson from 3Blue1Brown says using cross-entropy loss is “actually
          equivalent to training the model to be the best possible text compressor.” See{" "}
          <ExternalLink href="https://www.youtube.com/watch?v=l6DKRf-fAAM">
            “Reinventing Entropy | Compression is Intelligence Part 1”
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href="https://www.youtube.com/watch?v=GlYgs6v2YfU">
            “But what is cross-entropy? | Compression is Intelligence Part 2”
          </ExternalLink>.
        </p>
      </section>
    </DocumentPopover>
  );
}
