import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipCard,
  cn,
} from "../src";

describe("cn", () => {
  it("merges class names and deduplicates conflicting tailwind utilities", () => {
    expect(cn("thom-card", "thom-card--interactive", undefined, false)).toBe("thom-card thom-card--interactive");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("Button", () => {
  it("renders a button with the default variant classes", () => {
    render(<Button>Open</Button>);
    const button = screen.getByRole("button", { name: "Open" });
    expect(button).toHaveClass("thom-button", "thom-button--default", "thom-button--size-default");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders outline variant and forwards className", () => {
    render(<Button variant="outline" size="sm" className="custom">Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("thom-button--outline", "thom-button--size-sm", "custom");
  });
});

describe("Card", () => {
  it("renders all card regions", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>A card title</CardTitle>
          <CardDescription>A card description</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "A card title" })).toBeInTheDocument();
    expect(screen.getByText("A card description")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies the interactive class when requested", () => {
    const { container } = render(<Card interactive />);
    expect(container.querySelector(".thom-card")).toHaveClass("thom-card--interactive");
  });
});

describe("Tooltip", () => {
  it("reveals content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger>embedding</TooltipTrigger>
          <TooltipContent>An embedding is a vector.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.queryByText("An embedding is a vector.")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("button", { name: "embedding" }));
    expect(await screen.findByText("An embedding is a vector.")).toBeInTheDocument();
  });
});

describe("HoverCard", () => {
  it("reveals preview content on hover", async () => {
    const user = userEvent.setup();
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <button type="button">cross-entropy</button>
        </HoverCardTrigger>
        <HoverCardContent>Measures next-token surprise.</HoverCardContent>
      </HoverCard>,
    );
    expect(screen.queryByText("Measures next-token surprise.")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("button", { name: "cross-entropy" }));
    expect(await screen.findByText("Measures next-token surprise.")).toBeInTheDocument();
  });
});

describe("TooltipCard", () => {
  it("renders the card and keeps the floating panel in the tree", () => {
    render(
      <TooltipCard
        title="Skip-gram"
        description="Predicts neighbors from a center word."
        tooltipTitle="Skip-gram objective"
        tooltipDescription="Maximize the log probability of context words."
        icon="SG"
      />,
    );
    expect(screen.getByRole("heading", { name: "Skip-gram" })).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Skip-gram objective");
    expect(screen.getByText("Predicts neighbors from a center word.")).toBeInTheDocument();
  });
});

describe("Dialog", () => {
  it("opens on trigger click, closes on Escape, and exposes modal semantics", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dialog title" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Drawer", () => {
  it("opens on trigger click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open tools</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Tool drawer</DrawerTitle>
            <DrawerDescription>Auxiliary interactives live here.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>Embedding explorer</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open tools" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tool drawer" })).toBeInTheDocument();
    expect(screen.getByText("Embedding explorer")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
