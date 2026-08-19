/** Deterministic orbit motifs coordinated with the active THOM glyph. */
import type { CSSProperties } from "react";
import { brandData } from "./brandData";
import { GOLDEN_RATIO, type Point } from "./geometry";
import type { ThomGlyph } from "./threeScene";

export interface HeroOrbitProps {
  activeGlyph: ThomGlyph | null;
}

const ORBIT_CENTER = 60;
const ORBIT_INNER_RADIUS = 31;
const PENTAGON_RADIUS = 42;
const GOLDEN_START_DELAY_SECONDS = .18;
const pentagonPoints = Array.from({ length: 5 }, (_, index) => {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / 5;
  return {
    x: ORBIT_CENTER + Math.cos(angle) * PENTAGON_RADIUS,
    y: ORBIT_CENTER + Math.sin(angle) * PENTAGON_RADIUS,
  };
});
const goldenTraceOrder = [0, 1, 3, 4, 1, 2, 4, 0, 2, 3, 0];
const goldenSegments = goldenTraceOrder.slice(0, -1).map((from, index) => {
  const to = goldenTraceOrder[index + 1];
  const start = pentagonPoints[from];
  const end = pentagonPoints[to];
  return {
    start,
    end,
    kind: Math.min((from - to + 5) % 5, (to - from + 5) % 5) === 1 ? "side" : "diagonal",
    length: Math.hypot(end.x - start.x, end.y - start.y),
  } as const;
});
const goldenTracePath = goldenTraceOrder
  .map((pointIndex, index) => {
    const point = pentagonPoints[pointIndex];
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(3)} ${point.y.toFixed(3)}`;
  })
  .join(" ");

const positiveFftMagnitudes = brandData.m.fftBins
  .slice(1, 33)
  .map(({ re, im }) => Math.hypot(re, im));
const maximumFftMagnitude = Math.max(...positiveFftMagnitudes);
const normalizedFftMagnitudes = positiveFftMagnitudes.map((magnitude) => magnitude / maximumFftMagnitude);

function orbitPoint(point: Point) {
  return { x: point.x + 10, y: point.y };
}

function animationVariables(values: Record<string, string | number>) {
  return values as CSSProperties;
}

export function HeroOrbit({ activeGlyph }: HeroOrbitProps) {
  const networkDelays = ["0s", "-3.2s", "-1.6s"];
  return (
    <div
      className="hero-orbit"
      data-active-glyph={activeGlyph ?? "idle"}
      data-orbit-state={activeGlyph ? "active" : "idle"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" focusable="false">
        <g className="hero-orbit__rings" data-orbit-motif="idle">
          <circle data-orbit-ring="outer" cx="60" cy="60" r="52" />
          <circle data-orbit-ring="middle" cx="60" cy="60" r="40" />
          <circle data-orbit-ring="inner" cx="60" cy="60" r="26" />
        </g>

        <g className="hero-orbit__motif hero-orbit__motif--t" data-orbit-motif="t">
          {[0, 600, 1200].map((delay, index) => (
            <circle
              key={delay}
              data-orbit-ripple={index + 1}
              data-animation-delay-ms={delay}
              cx="60"
              cy="60"
              r="47"
              style={animationVariables({ "--orbit-delay": `${-delay}ms` })}
            />
          ))}
        </g>

        <g
          className="hero-orbit__motif hero-orbit__motif--h"
          data-orbit-motif="h"
          data-golden-ratio={GOLDEN_RATIO.toFixed(6)}
        >
          <g className="hero-orbit__pentagon" data-golden-construction="pentagon">
            {goldenSegments.filter((segment) => segment.kind === "side").map((segment, index) => (
              <line
                key={index}
                className="hero-orbit__pentagon-segment"
                data-golden-side={index + 1}
                data-segment-length={segment.length.toFixed(6)}
                x1={segment.start.x}
                y1={segment.start.y}
                x2={segment.end.x}
                y2={segment.end.y}
              />
            ))}
            {pentagonPoints.map((point, index) => (
              <circle key={index} className="hero-orbit__pentagon-point" data-golden-point={index + 1} cx={point.x} cy={point.y} r=".72" />
            ))}
          </g>
          <g className="hero-orbit__golden-trail" data-golden-trace="trail">
            {goldenSegments.map((segment, index) => (
              <line
                key={index}
                data-golden-trail-segment={index + 1}
                data-segment-kind={segment.kind}
                data-segment-length={segment.length.toFixed(6)}
                x1={segment.start.x}
                y1={segment.start.y}
                x2={segment.end.x}
                y2={segment.end.y}
                pathLength="1"
                style={animationVariables({ "--segment-delay": `${GOLDEN_START_DELAY_SECONDS + index * .64}s` })}
              />
            ))}
          </g>
          <path className="hero-orbit__golden-dot" data-golden-trace="dot" d={goldenTracePath} pathLength="1" />
        </g>

        <g className="hero-orbit__motif hero-orbit__motif--o" data-orbit-motif="o">
          {brandData.o.alternates.map((network, networkIndex) => (
            <g
              key={network.seed}
              className="hero-orbit__network"
              data-orbit-network={networkIndex + 1}
              data-network-seed={network.seed}
              style={animationVariables({ "--network-delay": networkDelays[networkIndex] })}
            >
              <g className="hero-orbit__chords" data-network-layer="chords">
                {network.chords.map((chord, chordIndex) => {
                  const start = orbitPoint(network.anchors[chord.a]);
                  const end = orbitPoint(network.anchors[chord.b]);
                  return (
                    <line
                      key={`${chord.a}-${chord.b}-${chordIndex}`}
                      data-orbit-chord={chordIndex + 1}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      pathLength="1"
                    />
                  );
                })}
              </g>
              <g className="hero-orbit__intersections" data-network-layer="intersections">
                {network.intersections.map((point, pointIndex) => {
                  const mapped = orbitPoint(point);
                  return <circle key={`${point.x}-${point.y}-${pointIndex}`} data-orbit-intersection={pointIndex + 1} cx={mapped.x} cy={mapped.y} r=".42" />;
                })}
              </g>
            </g>
          ))}
        </g>

        <g className="hero-orbit__motif hero-orbit__motif--m" data-orbit-motif="m">
          <circle className="hero-orbit__spectrum-guide" cx="60" cy="60" r={ORBIT_INNER_RADIUS} />
          {normalizedFftMagnitudes.map((magnitude, index) => {
            const length = 4 + magnitude * 19;
            return (
              <line
                key={index}
                data-fft-bin={index + 1}
                data-fft-magnitude={magnitude.toFixed(6)}
                x1={ORBIT_CENTER}
                y1={ORBIT_CENTER - ORBIT_INNER_RADIUS}
                x2={ORBIT_CENTER}
                y2={ORBIT_CENTER - ORBIT_INNER_RADIUS - length}
                transform={`rotate(${index * (360 / normalizedFftMagnitudes.length)} 60 60)`}
                style={animationVariables({ "--fft-index": index })}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
