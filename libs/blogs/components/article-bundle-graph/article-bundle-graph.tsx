import * as React from "react";
import { CardSpotlight } from "@th-m/ui";
import { BlogLink } from "../links";
import {
  articleBundleEdges,
  articleBundleMobileNodes,
  articleBundleNodes,
  BUNDLE_VIEWBOX,
  MOBILE_BUNDLE_VIEWBOX,
  bundleNodeCenter,
  type BundleNode,
  type BundleNodeKind,
} from "./article-bundle";

export interface ArticleBundlePost {
  slug: string;
  title: string;
  description: string;
}

export interface ArticleBundleGraphProps {
  posts?: readonly ArticleBundlePost[];
  className?: string;
  currentSlug?: string;
  nextSlug?: string;
}

const KIND_LABEL: Record<BundleNodeKind, string> = {
  fundamental: "Foundation",
  hub: "Hub",
  branch: "Branch",
};

interface EdgeAnchor {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

function edgeAnchor(from: BundleNode, to: BundleNode): EdgeAnchor {
  const source = bundleNodeCenter(from);
  const target = bundleNodeCenter(to);
  return {
    from: { x: source.x, y: from.y + from.height },
    to: { x: target.x, y: to.y },
  };
}

function edgePath({ from, to }: EdgeAnchor): string {
  const mid = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}`;
}

interface EdgeLayerProps {
  className: string;
  markerId: string;
  nodes: BundleNode[];
  viewBox: { width: number; height: number };
}

function EdgeLayer({ className, markerId, nodes, viewBox }: EdgeLayerProps) {
  const bySlug = new Map(nodes.map((node) => [node.slug, node]));

  return (
    <svg
      className={["home-graph__edges", className].join(" ")}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path className="home-graph__arrow" d="M 0 0 L 8 4 L 0 8 z" />
        </marker>
      </defs>
      {articleBundleEdges.map((edge) => {
        const from = bySlug.get(edge.from);
        const to = bySlug.get(edge.to);
        if (!from || !to) return null;
        return (
          <path
            key={`${edge.from}-${edge.to}`}
            className="home-graph__edge"
            d={edgePath(edgeAnchor(from, to))}
            markerEnd={`url(#${markerId})`}
          />
        );
      })}
    </svg>
  );
}

/**
 * The shared AI Factory essay-bundle graph used on the home page and inside
 * the opening article. Supplying posts filters it to the published manifest;
 * omitting posts renders the canonical six-essay sequence.
 */
export function ArticleBundleGraph({ posts, className, currentSlug, nextSlug }: ArticleBundleGraphProps) {
  const titleId = React.useId();
  const instanceId = React.useId().replace(/:/g, "");
  const bySlug = new Map(posts?.map((post) => [post.slug, post]));
  const nodes = posts ? articleBundleNodes.filter((node) => bySlug.has(node.slug)) : articleBundleNodes;
  const mobileNodes = articleBundleMobileNodes.filter((node) => nodes.some(({ slug }) => slug === node.slug));
  const mobileBySlug = new Map(mobileNodes.map((node) => [node.slug, node]));
  if (nodes.length === 0) return null;

  const { width: viewWidth, height: viewHeight } = BUNDLE_VIEWBOX;

  return (
    <section className={["home-graph", className].filter(Boolean).join(" ")} aria-labelledby={titleId}>
      <header className="home-graph__header">
        <h2 id={titleId}>AI Factory</h2>
        <p className="home-graph__lede">
          Three foundations converge into the Knowledge Factory, then branch into ontology and cognition.
        </p>
      </header>

      {nextSlug && <p className="home-graph__next"><BlogLink href={`/writing/${nextSlug}`}>Next: {nodes.find(node => node.slug === nextSlug)?.title ?? nextSlug} →</BlogLink></p>}
      <div className="home-graph__viewport">
        <div className="home-graph__frame">
          <EdgeLayer
            className="home-graph__edges--desktop"
            markerId={`${instanceId}-desktop`}
            nodes={nodes}
            viewBox={BUNDLE_VIEWBOX}
          />
          <EdgeLayer
            className="home-graph__edges--mobile"
            markerId={`${instanceId}-mobile`}
            nodes={mobileNodes}
            viewBox={MOBILE_BUNDLE_VIEWBOX}
          />

          {nodes.map((node) => {
            const post = bySlug.get(node.slug);
            const mobileNode = mobileBySlug.get(node.slug);
            const title = post?.title ?? node.title;
            const description = post?.description ?? node.summary;
            return (
              <CardSpotlight
                key={node.slug}
                className={["home-graph__node", `home-graph__node--${node.kind}`].join(" ")}
                style={{
                  left: `${(node.x / viewWidth) * 100}%`,
                  top: `${(node.y / viewHeight) * 100}%`,
                  width: `${(node.width / viewWidth) * 100}%`,
                  height: `${(node.height / viewHeight) * 100}%`,
                  "--home-node-mobile-left": `${((mobileNode?.x ?? node.x) / MOBILE_BUNDLE_VIEWBOX.width) * 100}%`,
                  "--home-node-mobile-top": `${((mobileNode?.y ?? node.y) / MOBILE_BUNDLE_VIEWBOX.height) * 100}%`,
                  "--home-node-mobile-width": `${((mobileNode?.width ?? node.width) / MOBILE_BUNDLE_VIEWBOX.width) * 100}%`,
                  "--home-node-mobile-height": `${((mobileNode?.height ?? node.height) / MOBILE_BUNDLE_VIEWBOX.height) * 100}%`,
                } as React.CSSProperties}
              >
                <BlogLink
                  href={`/writing/${node.slug}`}
                  className="home-graph__node-link"
                  aria-current={node.slug === currentSlug ? "page" : undefined}
                  aria-label={`${title}. ${description}`}
                >
                  <span className="home-graph__node-meta">
                    <span className="home-graph__node-kind">{KIND_LABEL[node.kind]}</span>
                    <span className="home-graph__node-order">{node.order}</span>
                  </span>
                  <span className="home-graph__node-title">{title}</span>
                  <span className="home-graph__node-desc" aria-hidden="true">{node.summary}</span>
                  <span className="home-graph__node-cta" aria-hidden="true">
                    <span className="home-graph__node-cta-label">{node.slug === currentSlug ? "You are here" : "Read essay"}</span>
                    <span>↗</span>
                  </span>
                </BlogLink>
              </CardSpotlight>
            );
          })}
        </div>
      </div>
    </section>
  );
}
