import { Link } from "@tanstack/react-router";
import type { PublishedPost } from "@th-m/blogs/publish";
import { EmbeddingCompositionExplorer } from "@th-m/embedding-space/composition";
import { DecodingExplorer } from "@th-m/llm-decoding";
import { GenerationPlayback } from "@th-m/llm-generation";
import { TrainingWalkthrough } from "@th-m/llm-training";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import type { ReactNode } from "react";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Term({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

function ArticleLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <LinkPreview url={`/writing/${slug}`} asChild>
      <Link to="/writing/$slug" params={{ slug }}>
        {children}
      </Link>
    </LinkPreview>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

function Flow({ children }: { children: ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

export default function ArticlePage({
  post,
  assetUrl: _assetUrl,
}: {
  post: PublishedPost;
  assetUrl: (value: string) => string;
}) {
  return (
    <TooltipProvider>
      <header>
        <p className="eyebrow">Technical primer</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <div className="article-meta">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt ? (
            <span>Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span>
          ) : null}
        </div>
        {post.tags.length > 0 ? (
          <ul className="article-tags" aria-label="Topics">
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        ) : null}
      </header>

      <Section index="01" title="Overview">
        <p>
          A large language model is a pattern-prediction machine. It receives tokens, uses learned weights to
          estimate a probability distribution over possible next tokens, selects one, appends it to the context,
          and repeats.
        </p>
        <p>Building that machine requires four different operations that are easy to blur together:</p>
        <ol>
          <li><strong>Input:</strong> a tokenizer converts text into token IDs.</li>
          <li><strong>Training:</strong> prediction error changes the model&apos;s weights.</li>
          <li><strong>Model and embeddings:</strong> the learned weights represent statistical regularities in language.</li>
          <li><strong>Inference:</strong> fixed weights turn a prompt into one next-token prediction after another.</li>
        </ol>
        <Card style={{ margin: "1.5em 0" }}>
          <CardHeader>
            <p className="eyebrow" style={{ margin: 0 }}>Core thesis</p>
            <CardTitle>Training changes the weights. Inference uses the weights.</CardTitle>
          </CardHeader>
          <CardContent>
            What the model learns is a structure of conditional patterns: given this context, which token is
            likely to come next?
          </CardContent>
        </Card>
        <p>
          This is not a complete recipe for producing a frontier model. It leaves out data acquisition,
          distributed infrastructure, architecture search, post-training, evaluation, and deployment. Its
          purpose is narrower: to make the computational loop legible from input to generated text.
        </p>
      </Section>

      <Section index="02" title="1. Input: Text Becomes Tokens">
        <p>
          The model does not receive words directly. A{" "}
          <Term label="tokenizer">A reversible mapping between text fragments and integer IDs in a fixed vocabulary.</Term>{" "}
          divides text into units from a fixed vocabulary and assigns each unit an integer ID. A token may be a
          word, part of a word, punctuation, whitespace, or a byte-level fragment.
        </p>
        <p>
          One influential family uses{" "}
          <Term label="byte-pair encoding">A vocabulary-building procedure that repeatedly merges frequent adjacent symbol pairs.</Term>.
          The tokenizer learns frequently recurring symbol pairs and gives them reusable vocabulary entries. The
          same tokenizer must encode the prompt and decode generated token IDs back into text.
        </p>
        <Flow>text → tokenizer → token IDs → tokenizer decoder → text</Flow>
        <p>
          Tokenization is reversible, but it is not semantically neutral. Different vocabularies divide the same
          sentence differently, changing sequence length and the units whose relationships the model must learn.
        </p>
        <p>For a sequence of tokens <code>x₁, x₂, …, xₙ</code>, a decoder language model estimates:</p>
        <Flow>P(xₜ | x₁, x₂, …, xₜ₋₁)</Flow>
        <p>Every position asks the same question: given the tokens so far, what token came next in the training text?</p>
      </Section>

      <Section index="03" title="2. Training: Prediction Error Changes Weights">
        <p>
          During pretraining, almost every token becomes the answer to a prediction made from its preceding
          context. Given <em>The cat sat on the …</em>, the model assigns probabilities to possible continuations.
        </p>
        <p>
          If the observed token is <code>mat</code>,{" "}
          <Term label="cross-entropy loss">A score that penalizes probability assigned away from the observed next token.</Term>{" "}
          measures how much probability the model assigned to it: <code>loss = -ln P(observed token)</code>. A
          high probability produces a small loss; a low probability produces a large one.
        </p>
        <TrainingWalkthrough initialMode="model" autoplay={false} />
        <ol>
          <li>The <strong>loss function</strong> measures the prediction error.</li>
          <li><strong>Backpropagation</strong> identifies how parameters contributed to it.</li>
          <li>The <strong>optimizer</strong> adjusts those parameters to improve future predictions.</li>
        </ol>
        <Flow>context → token probabilities → observed token → loss → backpropagation → updated weights</Flow>
        <p>
          Repeated across an enormous body of text, this process adjusts billions of parameters. It does not
          store the corpus as a searchable collection of sentences. It distills statistical regularities into
          weights that make some continuations more likely than others.
        </p>
        <p>
          Instruction tuning, preference optimization, and other post-training methods can change which
          behaviors the model reliably produces. They still work by changing parameters before ordinary
          inference begins.
        </p>
      </Section>

      <Section index="04" title="3. The Model: Learned Weights and Embeddings">
        <p>The trained model combines an architecture with learned parameters:</p>
        <ul>
          <li><strong>embeddings</strong> map token IDs into learned numerical representations;</li>
          <li><strong>attention</strong> combines information from different positions in the context;</li>
          <li><strong>feed-forward layers</strong> transform each contextualized representation; and</li>
          <li>an <strong>output projection</strong> turns the final representation into one logit per vocabulary token.</li>
        </ul>
        <p>
          For vocabulary <code>V</code> and embedding width <code>d</code>, a learned table{" "}
          <code>E ∈ ℝ^&#123;|V|×d&#125;</code> maps token ID <code>xᵢ</code> to vector{" "}
          <code>eᵢ = E[xᵢ] ∈ ℝᵈ</code>. The rows begin as arbitrary values and acquire predictive structure
          during training.
        </p>
        <EmbeddingCompositionExplorer />
        <p>
          Repeated contexts give the space geometry. Tokens used in similar contexts often develop nearby or
          directionally related embeddings. The explorer compresses a much larger space into three hand-authored
          teaching dimensions. Its vector arithmetic is geometric intuition, not a measured identity from a
          production model.
        </p>
        <p>
          An input embedding is only the starting state. Position, attention, and feed-forward layers transform
          it into a <strong>contextual hidden state</strong>. The token <em>stable</em> therefore produces
          different states in <em>stable counting sort</em> and <em>stable employment</em>.
        </p>
        <Flow>token ID → input embedding → contextual hidden state → output logits → next-token probabilities</Flow>
        <p>
          Embeddings and weights are learned parameters that persist across requests. Contextual hidden states
          and probabilities are temporary activations computed for the current prompt.
        </p>
      </Section>

      <Section index="05" title="4. Inference: One Token at a Time">
        <p>
          At inference time, training has stopped and the model&apos;s weights are fixed. A prompt moves through a
          repeated forward-pass loop: tokenize, embed, contextualize, project to logits, normalize to
          probabilities, select a token, append it, and run the model again.
        </p>
        <GenerationPlayback autoplay={false} />
        <Flow>prompt → tokens → representations → logits → probabilities → selected token → append → repeat</Flow>
        <p>
          Prediction and selection are different operations. The model produces logits; softmax converts them
          into a distribution; a decoding strategy decides what to do with that distribution.
        </p>
        <DecodingExplorer />
        <p>
          Greedy decoding selects the most probable token. Temperature, top-k, and top-p can reshape or restrict
          the available choices before sampling. The same model and prompt can therefore produce different
          continuations without changing a learned weight.
        </p>
      </Section>

      <Section index="06" title="5. What Pattern Prediction Means">
        <p>
          Calling an LLM a pattern-prediction machine describes its operating contract; it does not imply that
          its behavior must be trivial. Learned patterns can include syntax, genre, factual associations,
          algorithms, explanations, tool-use conventions, and long sequences that resemble deliberate
          reasoning. All of them are expressed through conditional next-token probabilities.
        </p>
        <p>
          The model does not retrieve one predetermined answer from its weights. It reconstructs a continuation
          from the prompt, learned parameters, temporary activations, and decoding rule. Small changes in any of
          those can change the generated path.
        </p>
        <p>
          Inference also does not establish that a continuation is correct, meaningful, or worth adopting. As{" "}
          <ArticleLink slug="understanding-is-the-bottleneck">The Understanding Bottleneck</ArticleLink> argues,
          generation produces a candidate artifact; people and institutions still have to ground, interpret,
          evaluate, and absorb it.
        </p>
        <Flow>
          human language → tokens → prediction error → learned weights → prompt-conditioned activations →
          next-token probabilities → generated text
        </Flow>
        <blockquote>
          The machinery is remarkably capable, but its basic operation remains stable: learn patterns by
          predicting tokens, then use those learned patterns to predict again.
        </blockquote>
      </Section>

      <Section index="07" title="Sources">
        <ul>
          <li>Philip Gage, <ExternalLink href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">“A New Algorithm for Data Compression”</ExternalLink> (1994). Introduces byte-pair encoding as a lossless compression technique.</li>
          <li>Rico Sennrich, Barry Haddow, and Alexandra Birch, <ExternalLink href="https://aclanthology.org/P16-1162/">“Neural Machine Translation of Rare Words with Subword Units”</ExternalLink> (2016). Adapts byte-pair encoding to subword tokenization.</li>
          <li>Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, <ExternalLink href="https://www.jmlr.org/papers/v3/bengio03a.html">“A Neural Probabilistic Language Model”</ExternalLink> (2003). Connects conditional word prediction with learned distributed representations.</li>
          <li>Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean, <ExternalLink href="https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/">“Efficient Estimation of Word Representations in Vector Space”</ExternalLink> (2013). Introduces efficient architectures for learning word-vector relationships.</li>
          <li>Ashish Vaswani and colleagues, <ExternalLink href="https://arxiv.org/abs/1706.03762">“Attention Is All You Need”</ExternalLink> (2017). Introduces the Transformer architecture underlying modern decoder language models.</li>
          <li>Claude E. Shannon, <ExternalLink href="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x">“Prediction and Entropy of Printed English”</ExternalLink> (1951). Uses next-character prediction to estimate the redundancy of English.</li>
        </ul>
      </Section>
    </TooltipProvider>
  );
}
