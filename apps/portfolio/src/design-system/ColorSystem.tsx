import type { CSSProperties } from "react";
import { accentPalette, semanticColorNames, thomDesignTokens, type SemanticColorName } from "@th-m/design-theme";

const semanticClasses: Record<SemanticColorName, { soft: string; solid: string; dot: string }> = {
  success: {
    soft: "border-success/35 bg-success/10 text-success hover:border-success/55 hover:bg-success/[16%] active:bg-success/[22%]",
    solid: "border-success bg-success text-success-foreground hover:border-success-hover hover:bg-success-hover active:border-success-active active:bg-success-active",
    dot: "bg-success",
  },
  info: {
    soft: "border-info/35 bg-info/10 text-info hover:border-info/55 hover:bg-info/[16%] active:bg-info/[22%]",
    solid: "border-info bg-info text-info-foreground hover:border-info-hover hover:bg-info-hover active:border-info-active active:bg-info-active",
    dot: "bg-info",
  },
  warning: {
    soft: "border-warning/35 bg-warning/10 text-warning hover:border-warning/55 hover:bg-warning/[16%] active:bg-warning/[22%]",
    solid: "border-warning bg-warning text-warning-foreground hover:border-warning-hover hover:bg-warning-hover active:border-warning-active active:bg-warning-active",
    dot: "bg-warning",
  },
  error: {
    soft: "border-error/35 bg-error/10 text-error hover:border-error/55 hover:bg-error/[16%] active:bg-error/[22%]",
    solid: "border-error bg-error text-error-foreground hover:border-error-hover hover:bg-error-hover active:border-error-active active:bg-error-active",
    dot: "bg-error",
  },
};

const accentClasses = [
  "border-accent-1/35 bg-accent-1/10 text-accent-1",
  "border-accent-2/35 bg-accent-2/10 text-accent-2",
  "border-accent-3/35 bg-accent-3/10 text-accent-3",
  "border-accent-4/35 bg-accent-4/10 text-accent-4",
  "border-accent-5/35 bg-accent-5/10 text-accent-5",
  "border-accent-6/35 bg-accent-6/10 text-accent-6",
] as const;

const surfaceSpecimens = [
  { label: "Card", classes: "border-border bg-card text-card-foreground", token: "bg-card · text-card-foreground" },
  { label: "Hover card", classes: "border-border bg-hover-card text-hover-card-foreground", token: "bg-hover-card · text-hover-card-foreground" },
  { label: "Popover", classes: "border-border-strong bg-popover text-popover-foreground", token: "bg-popover · text-popover-foreground" },
  { label: "Dialog", classes: "border-border-strong bg-dialog text-dialog-foreground shadow-2xl", token: "bg-dialog · text-dialog-foreground" },
] as const;

const rules = [
  "Primary is reserved for brand emphasis, principal actions, selection, and focus.",
  "Success, info, warning, and error communicate status and always include text or icon context.",
  "Accents identify categories and visualization series; they never substitute for semantic status.",
  "Use one accent family inside a component and place chromatic text only on neutral surfaces.",
  "Decorative borders may stay quiet; inputs, controls, and meaningful boundaries use border-strong.",
  "Neutral interactions progress from surface to surface-raised to popover across hover and active states.",
] as const;

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="mb-10 grid gap-3 border-b border-border pb-8 md:grid-cols-[180px_1fr]">
      <p className="m-0 font-mono text-[10px] uppercase tracking-[.16em] text-primary">{eyebrow}</p>
      <div>
        <h2 className="m-0 max-w-4xl font-display text-4xl font-normal leading-none tracking-[-.035em] text-foreground-strong md:text-6xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground-muted md:text-base">{copy}</p>
      </div>
    </header>
  );
}

export interface ColorSystemProps {
  embedded?: boolean;
}

export function ColorSystem({ embedded = false }: ColorSystemProps) {
  const IntroHeading = embedded ? "h2" : "h1";

  return (
    <div
      className={`mx-auto w-[calc(100vw-24px)] pb-24 text-foreground md:w-[min(1440px,calc(100vw-48px))] ${embedded ? "pt-0" : "pt-32"}`}
      id={embedded ? "color-system" : undefined}
    >
      <section className={`border-b border-border pb-20 md:pb-28 ${embedded ? "pt-20 md:pt-28" : "pt-10"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">THOM · System 1.0</p>
        <IntroHeading className="mt-6 max-w-5xl font-display text-6xl font-normal leading-[.86] tracking-[-.055em] text-foreground-strong md:text-8xl lg:text-9xl">Color with a job to do.</IntroHeading>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground-muted">A dark, restrained palette that keeps gold as the brand constant, gives status an unmistakable vocabulary, and lets categorical color remain expressive without becoming noise.</p>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="01 · Foundation" title="Canvas, content, and structural contrast." copy="Every interface begins with the same near-black canvas, warm ivory content, and a two-level border hierarchy." />
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {[
            ["Background", thomDesignTokens.color.background, "bg-background text-foreground"],
            ["Surface", thomDesignTokens.color.surface, "bg-surface text-surface-foreground"],
            ["Raised", thomDesignTokens.color.surfaceRaised, "bg-surface-raised text-surface-raised-foreground"],
            ["Foreground", thomDesignTokens.color.foreground, "bg-foreground text-foreground-inverse"],
            ["Muted", thomDesignTokens.color.foregroundMuted, "bg-foreground-muted text-foreground-inverse"],
            ["Brand / Primary", thomDesignTokens.color.primary.default, "bg-primary text-primary-foreground"],
          ].map(([label, value, classes]) => (
            <article className={`min-h-44 p-6 ${classes}`} key={label}>
              <p className="m-0 font-mono text-[10px] uppercase tracking-[.14em]">{label}</p>
              <p className="mt-20 font-mono text-xs">{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="02 · Semantics" title="Status colors that stay in their lane." copy="Each intent owns a readable base, a lightened hover, a darkened active state, and a dark foreground for solid fills." />
        <div className="grid gap-5 lg:grid-cols-2">
          {semanticColorNames.map((name) => (
            <article className="border border-border bg-surface p-6" key={name}>
              <header className="flex items-center justify-between gap-4">
                <h3 className="m-0 font-display text-3xl font-normal capitalize">{name}</h3>
                <span className={`size-3 rounded-full ${semanticClasses[name].dot}`} aria-hidden="true" />
              </header>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">{name === "success" ? "Completed, healthy, or available." : name === "info" ? "Neutral guidance or new context." : name === "warning" ? "Attention is required before proceeding." : "Failure, destructive action, or invalid state."}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[.1em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${semanticClasses[name].soft}`} type="button">Soft treatment</button>
                <button className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[.1em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${semanticClasses[name].solid}`} type="button">Solid action</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="03 · Accents" title="Six categorical colors, two stable handles." copy="Use hue names when the color itself matters and ordinal aliases when assigning a sequence dynamically." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accentPalette.map((accent, index) => (
            <article className={`border p-6 ${accentClasses[index]}`} key={accent.name}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="m-0 font-display text-3xl font-normal capitalize">{accent.name}</h3>
                <span className="size-4 rounded-full bg-(--accent-color)" style={{ "--accent-color": accent.value } as CSSProperties} aria-hidden="true" />
              </div>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[.1em]">accent-{accent.ordinal} · accent-{accent.name}</p>
              <p className="mt-2 font-mono text-xs">{accent.value}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4 border border-border bg-surface p-5 text-sm text-foreground-muted">
          <span className="flex shrink-0 gap-1" aria-hidden="true">
            {accentPalette.map((accent) => <i className="size-2 rounded-full bg-(--accent-color)" style={{ "--accent-color": accent.value } as CSSProperties} key={accent.name} />)}
          </span>
          Dynamic consumers set <code className="font-mono text-primary">--accent-color</code> from the typed palette and use Tailwind variable utilities.
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="04 · Elevation" title="Foregrounds follow the surface." copy="Elevation becomes slightly lighter and warmer as context moves from page content toward focused overlays." />
        <div className="grid gap-5 lg:grid-cols-4">
          {surfaceSpecimens.map((surface) => (
            <article className={`min-h-52 border p-6 ${surface.classes}`} key={surface.label}>
              <p className="m-0 font-mono text-[9px] uppercase tracking-[.14em] text-foreground-muted">Visual specimen</p>
              <h3 className="mt-14 font-display text-3xl font-normal">{surface.label}</h3>
              <p className="mt-3 font-mono text-[9px] leading-5 text-foreground-muted">{surface.token}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="05 · Interaction" title="Hover invites. Active confirms. Focus locates." copy="State changes increase contrast without changing the role a color communicates." />
        <div className="flex flex-wrap gap-4 border border-border bg-surface p-6 md:p-10">
          <button className="border border-primary bg-primary px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-primary-foreground transition-colors duration-150 hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" type="button">Primary action</button>
          <button className="border border-border bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-foreground transition-colors duration-150 hover:border-border-strong hover:bg-surface-raised active:bg-popover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" type="button">Neutral action</button>
          <button className="border border-border bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-foreground opacity-40" type="button" disabled>Disabled</button>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <SectionHeading eyebrow="06 · Composition" title="Constraints keep color coherent." copy="The system stays expressive by limiting where each family can carry meaning." />
        <ol className="m-0 grid list-none gap-px border border-border bg-border p-0 md:grid-cols-2">
          {rules.map((rule, index) => (
            <li className="grid min-h-40 grid-cols-[40px_1fr] gap-5 bg-background p-6" key={rule}>
              <span className="font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="m-0 text-sm leading-7 text-foreground-muted">{rule}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex justify-end border-t border-border pb-4 pt-16">
        <div className="text-right font-mono text-[9px] uppercase leading-6 tracking-[.12em] text-foreground-muted">
          <p className="m-0">Tailwind v4 · Dark foundation</p>
          <p className="m-0">{Object.keys(thomDesignTokens.color.semantic).length} semantic · {accentPalette.length} accent</p>
        </div>
      </div>
    </div>
  );
}
