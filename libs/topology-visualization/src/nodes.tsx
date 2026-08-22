// Custom reagraph node renderer for layered topologies. Nodes render in the
// outline style shared with the set atlas and proposition graphs: a
// translucent body in the node's color with a crisp wireframe outline of the
// same color. Each layer's categorical accent (or the emphasis gold) is
// carried by the node `fill`, so the outline keeps the layer color coding.
// Labels are rendered by reagraph around whatever shape this returns; only
// the node body is replaced.
import "@react-three/fiber";
import type { NodeRenderer } from "reagraph";

export const thomTopologyNodeRenderer: NodeRenderer = ({ color, size, opacity, selected }) => {
  const intensity = selected ? 0.34 : 0.18;
  return (
    <group>
      {/* Translucent body — the reference-style fill beneath the outline. */}
      <mesh scale={[size, size, size]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          transparent
          opacity={opacity * 0.32}
          fog
        />
      </mesh>
      {/* Outline — a geodesic wireframe in the node color. */}
      <mesh scale={[size, size, size]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </group>
  );
};
