import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TooltipProvider } from "@th-m/ui";
import { ArticleLink, BlogLink, BlogLinkProvider, Callout, ExternalLink, Flow, Gloss, Lede, Paragraph, Quote, Section, Table, Term } from "./index";

afterEach(cleanup);

describe("shared blog presentation", () => {
  it("renders section structure and MDX paragraphs without nested paragraphs", () => {
    const { container } = render(
      <Section index="01" title="Shared structure">
        <Lede><p>Introduction</p></Lede>
        <Paragraph className="authored"><p>Read <strong><p>closely</p></strong>.</p></Paragraph>
        <Quote plain><p>A quoted paragraph.</p></Quote>
        <Flow><p>Frame → test → learn</p></Flow>
      </Section>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Shared structure" })).toBeInTheDocument();
    expect(container.querySelector(".article-outline__index")).toHaveTextContent("01");
    expect(container.querySelector(".article-mdx__lede")).toHaveTextContent("Introduction");
    expect(container.querySelector("p.authored")).toHaveTextContent("Read closely.");
    expect(container.querySelector("p p")).toBeNull();
    expect(container.querySelector("blockquote")).toHaveClass("article-quote--plain");
    expect(container.querySelector(".article-outline__flow")).toHaveTextContent("Frame → test → learn");
  });

  it("supports labeled, titled, emphasized, and unheaded callouts", () => {
    const { container } = render(<>
      <Callout label="Thesis" title="A clear claim" emphasis><p>Evidence matters.</p></Callout>
      <Callout>Unheaded content.</Callout>
    </>);
    expect(screen.getByText("Thesis")).toHaveClass("eyebrow");
    expect(screen.getByRole("heading", { name: "A clear claim" })).toBeInTheDocument();
    const callouts = container.querySelectorAll(".article-claim");
    expect(callouts[0]).toHaveClass("article-claim--emphasis");
    expect(callouts[1]?.querySelector(".thom-card__header")).toBeNull();
    expect(callouts[1]).toHaveTextContent("Unheaded content.");
  });

  it("keeps native table semantics inside a keyboard-focusable scroll wrapper", () => {
    render(<Table aria-label="Comparison"><thead><tr><th>Concept</th></tr></thead><tbody><tr><td>Value</td></tr></tbody></Table>);
    const table = screen.getByRole("table", { name: "Comparison" });
    expect(screen.getByRole("columnheader", { name: "Concept" })).toBeInTheDocument();
    expect(table.parentElement).toHaveClass("article-table-scroll");
    expect(table.parentElement).toHaveAttribute("tabindex", "0");
  });

  it("reveals the standardized term definition on keyboard focus", async () => {
    render(<TooltipProvider delayDuration={0}><Term definition="Text mapped to integer IDs.">tokenizer</Term></TooltipProvider>);
    const term = screen.getByText("tokenizer");
    expect(term).toHaveAttribute("tabindex", "0");
    fireEvent.focus(term);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Text mapped to integer IDs.");
  });

  it("shows structured glosses with examples and preview-enabled references", async () => {
    render(<Gloss definition="A bounded set of rules." example="A domain model." href="https://example.com/context">context</Gloss>);
    fireEvent.focus(screen.getByText("context"));
    expect(await screen.findByText("A bounded set of rules.")).toBeInTheDocument();
    expect(screen.getByText("A domain model.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read more ↗" })).toHaveAttribute("rel", "noreferrer");
  });
});

describe("shared blog links", () => {
  it("renders standalone anchors and retains external-link safety attributes", () => {
    render(<>
      <ArticleLink slug="vision-and-values">Vision</ArticleLink>
      <ExternalLink href="https://example.com/reference">Source</ExternalLink>
      <BlogLink href="#details">Details</BlogLink>
      <BlogLink href="https://example.com/markdown">Markdown destination</BlogLink>
    </>);
    expect(screen.getByRole("link", { name: "Vision" })).toHaveAttribute("href", "/writing/vision-and-values");
    expect(screen.getByRole("link", { name: "Vision" })).not.toHaveAttribute("target");
    for (const name of ["Source", "Markdown destination"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("target", "_blank");
      expect(screen.getByRole("link", { name })).toHaveAttribute("rel", "noreferrer");
    }
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute("href", "#details");
    expect(screen.getByRole("link", { name: "Details" })).not.toHaveAttribute("target");
  });

  it("uses the host renderer and keeps destination previews keyboard accessible", async () => {
    render(
      <BlogLinkProvider renderLink={(props) => <a {...props} data-host-link="true" />}>
        <ArticleLink slug="truth-and-inference">Truth</ArticleLink>
      </BlogLinkProvider>,
    );
    const link = screen.getByRole("link", { name: "Truth" });
    expect(link).toHaveAttribute("data-host-link", "true");
    fireEvent.focus(link);
    await waitFor(() => expect(screen.getByText("/writing/truth-and-inference")).toBeInTheDocument());
  });

  it("retains custom previews", async () => {
    render(<BlogLink href="/writing" preview={<span>Article overview</span>}>Writing</BlogLink>);
    fireEvent.pointerEnter(screen.getByRole("link", { name: "Writing" }));
    expect(await screen.findByText("Article overview")).toBeInTheDocument();
  });
});
