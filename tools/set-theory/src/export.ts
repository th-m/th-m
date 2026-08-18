import {
  createSetAtlasSvg,
  type SetAtlasSvgOptions,
} from "./renderSvg";
import type { SetAtlasScene } from "./types";

export interface SetAtlasExportOptions extends SetAtlasSvgOptions {
  filename?: string;
  /** PNG device-pixel scale. The product UI uses the 2× default. */
  scale?: number;
}

export function slugifySetAtlasFilename(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "typescript-set-atlas"
  );
}

/** Kept as a compact alias for toolbar consumers shared with the graph editor. */
export const slugifyFilename = slugifySetAtlasFilename;

function resolvedFilename(options: SetAtlasExportOptions, extension: "svg" | "png"): string {
  const requested = options.filename?.replace(/\.(?:svg|png)$/i, "") || options.title || "TypeScript set atlas";
  return `${slugifySetAtlasFilename(requested)}.${extension}`;
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadText(filename: string, contents: string, type: string): void {
  downloadBlob(filename, new Blob([contents], { type }));
}

export async function exportSetAtlasSvg(
  scene: SetAtlasScene,
  options: SetAtlasExportOptions = {},
): Promise<string> {
  const svg = await createSetAtlasSvg(scene, options);
  downloadText(resolvedFilename(options, "svg"), svg, "image/svg+xml;charset=utf-8");
  return svg;
}

function svgDimensions(svg: string): { width: number; height: number } {
  const openingTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const width = Number(openingTag.match(/\bwidth="([0-9.]+)"/i)?.[1]);
  const height = Number(openingTag.match(/\bheight="([0-9.]+)"/i)?.[1]);
  if (!(width > 0) || !(height > 0)) {
    throw new Error("The atlas SVG does not declare finite export dimensions.");
  }
  return { width, height };
}

function loadSvgImage(svg: string): Promise<{ image: HTMLImageElement; url: string }> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The atlas SVG could not be rasterized."));
    };
    image.src = url;
  });
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("The browser could not encode the atlas PNG."));
    }, "image/png");
  });
}

/** Rasterizes the exact SVG scene at a fixed two-device-pixel export scale. */
export async function createSetAtlasPng(
  scene: SetAtlasScene,
  options: SetAtlasExportOptions = {},
): Promise<Blob> {
  const svg = await createSetAtlasSvg(scene, options);
  const dimensions = svgDimensions(svg);
  const scale = Number.isFinite(options.scale) && (options.scale ?? 0) > 0 ? options.scale! : 2;
  const { image, url } = await loadSvgImage(svg);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(dimensions.width * scale);
    canvas.height = Math.ceil(dimensions.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("A 2D canvas is required to export the atlas PNG.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await canvasBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportSetAtlasPng(
  scene: SetAtlasScene,
  options: SetAtlasExportOptions = {},
): Promise<Blob> {
  const blob = await createSetAtlasPng(scene, options);
  downloadBlob(resolvedFilename(options, "png"), blob);
  return blob;
}
