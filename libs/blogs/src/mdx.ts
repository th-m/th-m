import type { ComponentType } from "react";
import type { PublishedPost } from "./publish";

interface ArticleAssetBase {
  tags: readonly string[];
}

export interface ArticleImageAsset extends ArticleAssetBase {
  kind: "image";
  source: `assets/${string}`;
  alt: string;
  caption?: string;
}

export interface ArticleComponentAsset extends ArticleAssetBase {
  kind: "figure" | "interactive" | "preview";
  label: string;
  description?: string;
}

export type ArticleAsset = ArticleImageAsset | ArticleComponentAsset;
export type ArticleAssetRegistry = Record<string, ArticleAsset>;

export interface ArticleRenderContext {
  post: PublishedPost;
  assetUrl: (value: string) => string;
}

type ComponentAssetKeys<Registry extends ArticleAssetRegistry> = {
  [Key in keyof Registry]: Registry[Key] extends ArticleImageAsset ? never : Key;
}[keyof Registry];

export type ArticleComponentMap<Registry extends ArticleAssetRegistry> = {
  [Key in ComponentAssetKeys<Registry>]: ComponentType<never>;
};

export type ArticleComponentFactory<Registry extends ArticleAssetRegistry> = (
  context: ArticleRenderContext,
) => ArticleComponentMap<Registry>;

export function defineArticleAssets<const Registry extends ArticleAssetRegistry>(
  registry: Registry,
): Registry {
  return registry;
}

export function defineArticleComponents<const Registry extends ArticleAssetRegistry>(
  _registry: Registry,
  factory: ArticleComponentFactory<Registry>,
): ArticleComponentFactory<Registry> {
  return factory;
}

export function validateArticleAssetRegistry(value: unknown, slug: string): ArticleAssetRegistry {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${slug}/article-assets.ts must define an asset object.`);
  }

  const registry: ArticleAssetRegistry = {};
  for (const [id, rawAsset] of Object.entries(value)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`${slug}/article-assets.ts asset ids must use stable kebab-case: ${id}`);
    }
    if (!rawAsset || typeof rawAsset !== "object" || Array.isArray(rawAsset)) {
      throw new Error(`${slug}/article-assets.ts ${id} must be an asset object.`);
    }
    const asset = rawAsset as Record<string, unknown>;
    if (!Array.isArray(asset.tags) || asset.tags.length === 0 || asset.tags.some(
      (tag) => typeof tag !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag),
    )) {
      throw new Error(`${slug}/article-assets.ts ${id} tags must be non-empty kebab-case strings.`);
    }
    if (!new Set(asset.tags).size || new Set(asset.tags).size !== asset.tags.length) {
      throw new Error(`${slug}/article-assets.ts ${id} tags must be unique.`);
    }

    if (asset.kind === "image") {
      if (typeof asset.source !== "string" || !/^assets\/[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(asset.source) || asset.source.includes("..")) {
        throw new Error(`${slug}/article-assets.ts ${id} source must be a safe assets/ path.`);
      }
      if (typeof asset.alt !== "string" || asset.alt.trim().length === 0) {
        throw new Error(`${slug}/article-assets.ts ${id} must define non-empty alt text.`);
      }
      if (asset.caption !== undefined && (typeof asset.caption !== "string" || asset.caption.trim().length === 0)) {
        throw new Error(`${slug}/article-assets.ts ${id} caption must be a non-empty string when provided.`);
      }
      registry[id] = {
        kind: "image",
        source: asset.source as `assets/${string}`,
        alt: asset.alt.trim(),
        ...(typeof asset.caption === "string" ? { caption: asset.caption.trim() } : {}),
        tags: asset.tags as string[],
      };
      continue;
    }

    if (asset.kind !== "figure" && asset.kind !== "interactive" && asset.kind !== "preview") {
      throw new Error(`${slug}/article-assets.ts ${id} has an unsupported kind.`);
    }
    if (typeof asset.label !== "string" || asset.label.trim().length === 0) {
      throw new Error(`${slug}/article-assets.ts ${id} must define a non-empty label.`);
    }
    if (asset.description !== undefined && (typeof asset.description !== "string" || asset.description.trim().length === 0)) {
      throw new Error(`${slug}/article-assets.ts ${id} description must be non-empty when provided.`);
    }
    registry[id] = {
      kind: asset.kind,
      label: asset.label.trim(),
      ...(typeof asset.description === "string" ? { description: asset.description.trim() } : {}),
      tags: asset.tags as string[],
    };
  }
  return registry;
}
