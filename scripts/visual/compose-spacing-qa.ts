import sharp from "sharp";
import type { OverlayOptions } from "sharp";
import { fileURLToPath } from "node:url";

const audit = new URL("../../.codex/audits/brand-spacing-2/", import.meta.url);

const sourceT = "/Users/thom/Desktop/Screenshot 2026-08-14 at 10.31.34 PM.png";
const sourceH = "/Users/thom/Desktop/Screenshot 2026-08-14 at 10.31.39 PM.png";
const priorLockup = new URL("../../.codex/audits/brand-spacing/01-final-desktop.jpg", import.meta.url);
const currentLockup = new URL("01-desktop.jpg", audit);
const currentHPage = new URL("03-mark-h.png", audit);
const comparisonOutput = new URL("spacing-comparison.jpg", audit);

const background = "#050505";
const gold = "#d6b06a";

async function contained(input: string | Buffer, width: number, height: number) {
  return sharp(input)
    .flatten({ background })
    .resize({ width, height, fit: "contain", background })
    .jpeg({ quality: 94 })
    .toBuffer();
}

function label(text: string, width: number) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="44">
    <rect width="100%" height="100%" fill="${background}"/>
    <text x="0" y="28" fill="${gold}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="2">${text}</text>
  </svg>`);
}

const focusedWidth = 360;
const focusedHeight = 420;
const focusedGap = 24;
const edge = 28;
const boardWidth = edge * 2 + focusedWidth * 4 + focusedGap * 3;

const currentTCrop = await sharp(fileURLToPath(currentLockup))
  .extract({ left: 160, top: 300, width: 300, height: 360 })
  .jpeg({ quality: 94 })
  .toBuffer();
const currentHCrop = await sharp(fileURLToPath(currentHPage))
  .extract({ left: 53, top: 328, width: 477, height: 521 })
  .jpeg({ quality: 94 })
  .toBuffer();

const focusedPanels = await Promise.all([
  contained(sourceT, focusedWidth, focusedHeight),
  contained(currentTCrop, focusedWidth, focusedHeight),
  contained(sourceH, focusedWidth, focusedHeight),
  contained(currentHCrop, focusedWidth, focusedHeight),
]);

const lockupWidth = Math.floor((boardWidth - edge * 2 - focusedGap) / 2);
const lockupHeight = Math.round(lockupWidth / 1.44);
const lockupPanels = await Promise.all([
  contained(fileURLToPath(priorLockup), lockupWidth, lockupHeight),
  contained(fileURLToPath(currentLockup), lockupWidth, lockupHeight),
]);

const focusedTop = 70;
const lockupLabelTop = focusedTop + focusedHeight + 56;
const lockupTop = lockupLabelTop + 44;
const boardHeight = lockupTop + lockupHeight + edge;

const composites: OverlayOptions[] = [];
const focusedLabels = ["SOURCE T / PI", "CURRENT T / PI", "SOURCE H", "CURRENT H"];
focusedPanels.forEach((panel, index) => {
  const left = edge + index * (focusedWidth + focusedGap);
  composites.push({ input: label(focusedLabels[index], focusedWidth), left, top: 18 });
  composites.push({ input: panel, left, top: focusedTop });
});

const lockupLabels = ["PRIOR PASS / WORDMARK", "CURRENT / TIGHTER T + H"];
lockupPanels.forEach((panel, index) => {
  const left = edge + index * (lockupWidth + focusedGap);
  composites.push({ input: label(lockupLabels[index], lockupWidth), left, top: lockupLabelTop });
  composites.push({ input: panel, left, top: lockupTop });
});

await sharp({ create: { width: boardWidth, height: boardHeight, channels: 3, background } })
  .composite(composites)
  .jpeg({ quality: 94 })
  .toFile(fileURLToPath(comparisonOutput));

await Bun.write(new URL("spacing-measurements.json", audit), `${JSON.stringify({
  sourceT,
  sourceH,
  priorLockup: priorLockup.pathname,
  currentLockup: currentLockup.pathname,
  browserViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  geometry: {
    tLegInset: { display: 5.5, compact: 5 },
    tInnerLegGap: 13.3,
    hPillarCenters: [25, 75],
    hPillarSpan: 50,
    hStemWidth: 4.7,
    hSerifWidth: 15.6,
    hColumnMaterial: { edge: "#bd9a63", body: "#d2bc96", highlight: "#e2d2b4" },
    hCurveAnchors: [28, 72],
    opticalGaps: { tToH: 10, hToO: 12, oToM: 12 },
  },
}, null, 2)}\n`);

console.log(`Wrote ${fileURLToPath(comparisonOutput)}`);
