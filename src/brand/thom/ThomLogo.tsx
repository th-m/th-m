import { useEffect, useRef, useState, type RefObject } from "react";
import { motion } from "motion/react";
import type { ThomGlyph, ThomSceneController } from "./threeScene";

export type LogoVariant = "hero" | "header" | "static" | "icon";
export type MotionLevel = "full" | "compact" | "none";

export interface ThomLogoProps {
  variant: LogoVariant;
  motion?: MotionLevel;
  interactive?: boolean;
  ariaLabel?: string;
  className?: string;
}

export interface ThomGlyphStageProps {
  glyph: ThomGlyph;
  replayToken: number;
  motion?: MotionLevel;
  ariaLabel?: string;
}

const INTRO_KEY = "thom:intro:v1";

export function shouldPlayIntro(storage: Pick<Storage, "getItem"> | null, reducedMotion: boolean) {
  return !reducedMotion && storage?.getItem(INTRO_KEY) !== "complete";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useScene(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  view: "logo" | ThomGlyph,
  onController: (controller: ThomSceneController | null) => void,
  onReady: (ready: boolean) => void,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let controller: ThomSceneController | null = null;
    let cancelled = false;
    const resize = new ResizeObserver((entries) => {
      const entry = entries[0];
      controller?.resize(entry.contentRect.width, entry.contentRect.height);
    });
    const visibility = new IntersectionObserver(([entry]) => controller?.setVisible(entry.isIntersecting), { rootMargin: "100px" });
    void import("./threeScene").then(async ({ ThomSceneController: Controller }) => {
      if (cancelled) return;
      try {
        controller = new Controller(canvas, view);
        await controller.ready();
        if (cancelled) {
          controller.dispose();
          return;
        }
        onController(controller);
        onReady(true);
        resize.observe(canvas);
        visibility.observe(canvas);
      } catch {
        onController(null);
        onReady(false);
      }
    });
    return () => {
      cancelled = true;
      resize.disconnect();
      visibility.disconnect();
      onController(null);
      controller?.dispose();
    };
  }, [canvasRef]);
}

const hitAreas: Array<{ glyph: ThomGlyph; label: string; left: string; width: string }> = [
  { glyph: "t", label: "Replay T foundations animation", left: "1.8%", width: "21%" },
  { glyph: "h", label: "Replay H equilibrium animation", left: "25%", width: "21%" },
  { glyph: "o", label: "Replay O emergence animation", left: "48.4%", width: "21.2%" },
  { glyph: "m", label: "Replay M superposition animation", left: "69%", width: "30%" },
];

export function ThomLogo({ variant, motion: motionLevel = "full", interactive = false, ariaLabel = "THOM — Thomas Valadez", className = "" }: ThomLogoProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ThomSceneController | null>(null);
  const [ready, setReady] = useState(false);
  const isWebGl = variant === "hero" && motionLevel !== "none";
  const source = variant === "icon" ? "/brand/favicon.svg" : variant === "header" ? "/brand/thom-compact.svg" : "/brand/thom-master.svg";
  const setController = (controller: ThomSceneController | null) => { controllerRef.current = controller; };

  useScene(canvasRef, "logo", setController, setReady);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !ready || !isWebGl) return;
    if (shouldPlayIntro(window.sessionStorage, reducedMotion)) {
      window.sessionStorage.setItem(INTRO_KEY, "complete");
      controller.playIntro();
    } else {
      controller.settle();
    }
  }, [isWebGl, ready, reducedMotion]);

  if (!isWebGl) {
    return (
      <motion.span
        className={`thom-logo thom-logo--${variant} ${className}`}
        aria-label={ariaLabel}
        role="img"
        initial={false}
        whileHover={variant === "header" && !reducedMotion ? { filter: "brightness(1.25)", opacity: [1, 0.72, 1] } : undefined}
        whileFocus={variant === "header" && !reducedMotion ? { filter: "brightness(1.25)" } : undefined}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={source} alt="" aria-hidden="true" />
      </motion.span>
    );
  }

  return (
    <div className={`thom-logo thom-logo--hero ${ready ? "is-webgl-ready" : ""} ${className}`}>
      <span className="sr-only" role="img" aria-label={ariaLabel} />
      <img className="thom-logo__fallback" src={source} alt="" aria-hidden="true" />
      <canvas ref={canvasRef} className="thom-logo__canvas" aria-hidden="true" />
      {interactive ? (
        <div className="thom-logo__hit-areas">
          {hitAreas.map((area) => (
            <button
              key={area.glyph}
              type="button"
              aria-label={area.label}
              style={{ left: area.left, width: area.width }}
              onPointerEnter={() => !reducedMotion && controllerRef.current?.playGlyph(area.glyph)}
              onFocus={() => !reducedMotion && controllerRef.current?.playGlyph(area.glyph)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ThomGlyphStage({ glyph, replayToken, motion: motionLevel = "full", ariaLabel = "THOM glyph construction" }: ThomGlyphStageProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ThomSceneController | null>(null);
  const [ready, setReady] = useState(false);
  const setController = (controller: ThomSceneController | null) => { controllerRef.current = controller; };
  useScene(canvasRef, glyph, setController, setReady);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.setView(glyph);
    if (ready && replayToken > 0 && !reducedMotion && motionLevel !== "none") controller.playGlyph(glyph);
    else controller.settle();
  }, [glyph, replayToken, ready, reducedMotion, motionLevel]);

  return (
    <div className={`glyph-stage glyph-stage--${glyph} ${ready ? "is-webgl-ready" : ""}`} role="img" aria-label={ariaLabel}>
      <img className="glyph-stage__fallback" src={`/brand/glyph-${glyph}.svg`} alt="" aria-hidden="true" />
      <canvas ref={canvasRef} className="glyph-stage__canvas" aria-hidden="true" />
    </div>
  );
}
