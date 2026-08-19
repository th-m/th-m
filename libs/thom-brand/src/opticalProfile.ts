/** Optical detail profiles selected from the rendered wordmark width. */
export type OpticalProfile = "display" | "compact" | "micro";
export type LogoOpticalProfile = OpticalProfile | "auto";

export const OPTICAL_PROFILE_WIDTHS = {
  microMax: 120,
  compactMax: 300,
} as const;

export function opticalProfileForWidth(width: number): OpticalProfile {
  if (width <= OPTICAL_PROFILE_WIDTHS.microMax) return "micro";
  if (width <= OPTICAL_PROFILE_WIDTHS.compactMax) return "compact";
  return "display";
}

export const opticalProfileAsset = (profile: OpticalProfile, assetBasePath = "/brand") => {
  const basePath = assetBasePath.endsWith("/") ? assetBasePath.slice(0, -1) : assetBasePath;
  return profile === "display" ? `${basePath}/thom-master.svg` : `${basePath}/thom-${profile}.svg`;
};
