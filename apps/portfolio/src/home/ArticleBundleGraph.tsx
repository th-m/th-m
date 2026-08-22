import * as React from "react";
import { Link } from "@tanstack/react-router";
import { CardSpotlight } from "@th-m/ui";
import type { BlogManifest } from "@th-m/blogs/publish";
import {
  articleBundleEdges,
  articleBundleMobileNodes,
  articleBundleNodes,
  BUNDLE_VIEWBOX,
  MOBILE_BUNDLE_VIEWBOX,
  bundleNodeCenter,
  type BundleNode,
  type BundleNodeKind,
} from "../content/article-bundle";

export interface ArticleBundleGraphProps {
  posts: BlogManifest["posts"];
  className?: string;
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
    // Emerge from the source card's bottom edge and enter the target's top.
    from: { x: source.x, y: from.y + from.height },
    to: { x: target.x, y: to.y },
  };
}

function edgePath({ from, to }: EdgeAnchor): string {
  const mid = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}`;
}

/**
 * The essay-bundle graph for the home page: the three fundamental essays
 * converge on the Knowledge Factory, which branches into the Ontology and
 * Strategy essays. Nodes are spotlight cards that link to their articles; the
 * edges are a fixed SVG layer behind them.
 */
export function ArticleBundleGraph({ posts, className }: ArticleBundleGraphProps) {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const nodes = articleBundleNodes.filter((node) => bySlug.has(node.slug));
  const mobileNodes = articleBundleMobileNodes.filter((node) => bySlug.has(node.slug));
  const mobileBySlug = new Map(mobileNodes.map((node) => [node.slug, node]));
  if (nodes.length === 0) return null;

  const { width: viewWidth, height: viewHeight } = BUNDLE_VIEWBOX;

  return (
    <section className={["home-graph", className].filter(Boolean).join(" ")} aria-labelledby="home-graph-title">
      <header className="home-graph__header">
        <h2 id="home-graph-title">AI Factory</h2>
      </header>

      <div className="home-graph__viewport">
        <div className="home-graph__frame">
          <svg
            className="home-graph__edges home-graph__edges--desktop"
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            aria-hidden="true"
            focusable="false"
          >
            {articleBundleEdges.map((edge) => {
              const from = nodes.find((node) => node.slug === edge.from);
              const to = nodes.find((node) => node.slug === edge.to);
              if (!from || !to) return null;
              return <path key={`${edge.from}-${edge.to}`} d={edgePath(edgeAnchor(from, to))} />;
            })}
          </svg>
          <svg
            className="home-graph__edges home-graph__edges--mobile"
            viewBox={`0 0 ${MOBILE_BUNDLE_VIEWBOX.width} ${MOBILE_BUNDLE_VIEWBOX.height}`}
            aria-hidden="true"
            focusable="false"
          >
            {articleBundleEdges.map((edge) => {
              const from = mobileBySlug.get(edge.from);
              const to = mobileBySlug.get(edge.to);
              if (!from || !to) return null;
              return <path key={`${edge.from}-${edge.to}`} d={edgePath(edgeAnchor(from, to))} />;
            })}
          </svg>

          {nodes.map((node) => {
            const post = bySlug.get(node.slug);
            const mobileNode = mobileBySlug.get(node.slug);
            if (!post) return null;
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
                <Link
                  to="/writing/$slug"
                  params={{ slug: node.slug }}
                  className="home-graph__node-link"
                  aria-label={`${post.title}. ${post.description}`}
                >
                  <span className="home-graph__node-kind">{KIND_LABEL[node.kind]}</span>
                  <span className="home-graph__node-title">{post.title}</span>
                  <span className="home-graph__node-desc" aria-hidden="true">{post.description}</span>
                </Link>
              </CardSpotlight>
            );
          })}
        </div>
      </div>
    </section>
  );
}
