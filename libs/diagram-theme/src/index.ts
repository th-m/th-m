import { thomDesignTokens, type ThomDesignTokens } from "@th-m/design-theme";

export interface DiagramTheme {
  colors: Record<"paper" | "surface" | "raised" | "ink" | "strong" | "muted" | "soft" | "rule" | "boundary" | "accent" | "accentInk" | "link" | "info" | "success" | "warning" | "error", string>;
  fonts: { display: string; sans: string; mono: string };
  easing: { draw: string; converge: string };
  series: string[];
}

export type DiagramThemeOverrides = {
  colors?: Partial<DiagramTheme["colors"]>;
  fonts?: Partial<DiagramTheme["fonts"]>;
  easing?: Partial<DiagramTheme["easing"]>;
  series?: string[];
};

export function createDiagramTheme(overrides: DiagramThemeOverrides = {}, foundation: ThomDesignTokens = thomDesignTokens): DiagramTheme {
  const c = foundation.color;
  const theme: DiagramTheme = {
    colors: {
      paper: c.background, surface: c.surface, raised: c.surfaceRaised,
      ink: c.foreground, strong: c.foregroundStrong, muted: c.foregroundMuted,
      soft: c.foregroundSubtle, rule: c.border, boundary: c.borderStrong,
      accent: c.primary.default, accentInk: c.primary.foreground, link: c.accents.blue,
      info: c.semantic.info.default, success: c.semantic.success.default, warning: c.semantic.warning.default,
      error: c.semantic.error.default, ...overrides.colors,
    },
    fonts: { ...foundation.typography, ...overrides.fonts },
    easing: { ...foundation.easing, ...overrides.easing },
    series: overrides.series ?? Object.values(c.accents),
  };
  // These values enter CSS and offline HTML; accept literal colors and font stacks.
  for (const color of [...Object.values(theme.colors), ...theme.series]) {
    if (!/^#[\da-f]{6}$/i.test(color)) throw new Error(`Diagram colors must be six-digit hex values: ${color}`);
  }
  for (const value of [...Object.values(theme.fonts), ...Object.values(theme.easing)]) {
    if (!value || /[<>;{}\\]|url\s*\(|@/i.test(value)) throw new Error("Invalid diagram CSS token");
  }
  if (!theme.series.length) throw new Error("The diagram series palette cannot be empty");
  return theme;
}

export function diagramCss(theme: DiagramTheme): string {
  const { colors: c, fonts: f } = theme;
  return `:root, svg {
    --color-paper:${c.paper}; --color-paper-2:${c.surface}; --color-ink:${c.ink};
    --color-muted:${c.muted}; --color-soft:${c.soft}; --color-rule:${c.rule};
    --color-rule-solid:${c.boundary}; --color-accent:${c.accent};
    --color-accent-tint:${c.raised}; --color-link:${c.link};
    --color-background:${c.paper}; --color-surface:${c.surface}; --color-card:${c.raised};
    --color-foreground:${c.ink}; --color-foreground-strong:${c.strong}; --color-foreground-muted:${c.muted}; --color-foreground-subtle:${c.soft};
    --color-border:${c.rule}; --color-border-strong:${c.boundary}; --color-primary:${c.accent}; --color-info:${c.info}; --color-error:${c.error};
    --ai-factory-inset:${c.surface}; --ai-factory-label-rule:${c.boundary}; --ai-factory-type-edge:8px; --ai-factory-tracking-label:.08em;
    --diagram-type-node:14px; --diagram-type-copy:14px; --diagram-type-meta:10px; --diagram-type-edge:10px;
    --font-display:${f.display};
    --font-serif:${f.display}; --font-sans:${f.sans}; --font-mono:${f.mono};
    --paper:${c.paper}; --paper-2:${c.surface}; --ink:${c.ink}; --muted:${c.muted};
    --soft:${c.soft}; --rule:${c.rule}; --rule-solid:${c.boundary}; --accent:${c.accent};
    --accent-tint:${c.raised}; --link:${c.link}; --sans:${f.sans}; --serif:${f.display}; --mono:${f.mono};
    --ease-draw:${theme.easing.draw}; --ease-converge:${theme.easing.converge};
  }
  svg { background:${c.paper}; color:${c.ink}; font-synthesis:none; }
  text { font-family:${f.sans}; }
  text.title, text.diagram-title { font-family:${f.display}; font-weight:400; fill:${c.strong}; }
  text.node-title, text.node-name { font-size:var(--diagram-type-node); font-family:${f.sans}; font-weight:500; fill:${c.ink}; }
  text.subtitle, text.node-sub, text.legend { fill:${c.muted}; }
  text.section, text.section-sub, text.node-type, text.arrow-label, text.eyebrow,
  text.sublabel, text.footnote { font-family:${f.mono}; font-weight:400; fill:${c.muted}; }
  `;
}

export function diagramStyleGuide(theme: DiagramTheme): string {
  const c = theme.colors;
  const roles = { paper:c.paper, "paper-2":c.surface, ink:c.ink, muted:c.muted,
    soft:c.soft, rule:c.rule, "rule-solid":c.boundary, accent:c.accent,
    "accent-tint":c.raised, link:c.link, info:c.info, error:c.error };
  return `# THOM diagram style guide\n\nGenerated from @th-m/design-theme. Regenerate with diagrams:setup after token changes.\n\n` +
    `## Tokens\n\n| Role | Value |\n| --- | --- |\n` +
    Object.entries(roles).map(([role,value]) => `| ${role} | ${value} |`).join("\n") +
    `\n\n## Typography\n\nTitle/callout: ${theme.fonts.display}, weight 400.\nNode names: ${theme.fonts.sans}, weight 500.\nSublabels/eyebrows/arrow labels: ${theme.fonts.mono}, weight 400.\n` +
    `\n## Composition\n\nUse the upstream diagram grammar with THOM's dark canvas, square surfaces, fine rules, and generous space. Gold marks purpose, agency, and selected paths. Information blue marks the truth/evaluation family and evidence provenance, not verified status. Use --color-info or data-thom-role=\"info\" for evidence labels and edges. Red marks faults or contradictions; missing connections retain their gold cross. Neutral ink carries structure; shapes and labels preserve meaning without color. Reuse canonical icons with <g data-thom-icon="goal" transform="translate(x y) scale(s)"/> (160-unit glyph frame); retain the catalog meaning. Experience is a labeled node, never a Vision alias. Use 14px Inter for concepts and captions, 10px mono for metadata, square nodes, readable relationship labels, and explicit disconnected marks. Mobile scenes need an authored compact reading path with an optional full diagram, not a scaled-down desktop canvas. Use categories only when they encode a labeled distinction. Preserve all supplied text. Embed the supplied fonts.\n` +
    `\n## Motion\n\nDraw relationships in semantic order, then show directed flow. Keep nodes, labels, and camera stable. Complete static composition is the default; playback is opt-in and respects reduced motion.\n`;
}
