// Custom reagraph node shapes for the proposition graph. Nodes render in the
// outline style shared with the set atlas: a translucent body in the node's
// color with a crisp wireframe outline of the same color. Propositions keep
// the classic sphere; relationship nodes render as octahedrons — a distinct
// "connector" mark that echoes the accent color already assigned to the
// relationship node type. Labels are rendered by reagraph around whatever
// shape this returns; only the node body is replaced.
import "@react-three/fiber";
import type { NodeRenderer } from "reagraph";

export const thomGraphNodeRenderer: NodeRenderer = ({ color, node, size, opacity, selected }) => {
  const isRelationship = node.data?.kind === "relationship";
  const intensity = selected ? 0.34 : 0.18;
  return (
    <group>
      {/* Translucent body — the reference-style fill beneath the outline. */}
      <mesh scale={[size, size, size]}>
        {isRelationship ? (
          <octahedronGeometry args={[1, 0]} />
        ) : (
          <sphereGeometry args={[1, 16, 12]} />
        )}
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          transparent
          opacity={opacity * 0.32}
          fog
        />
      </mesh>
      {/* Outline — a geodesic wireframe for spheres, the octahedron edges for connectors. */}
      <mesh scale={[size, size, size]}>
        {isRelationship ? (
          <octahedronGeometry args={[1, 0]} />
        ) : (
          <icosahedronGeometry args={[1, 1]} />
        )}
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </group>
  );
};
