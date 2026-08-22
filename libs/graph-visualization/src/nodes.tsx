// Custom reagraph node shapes for the proposition graph. Propositions keep
// the classic sphere; relationship nodes render as octahedrons — a distinct
// "connector" mark that echoes the accent color already assigned to the
// relationship node type. Labels are rendered by reagraph around whatever
// shape this returns; only the node body is replaced.
import "@react-three/fiber";
import type { NodeRenderer } from "reagraph";

export const thomGraphNodeRenderer: NodeRenderer = ({ color, node, size, opacity, selected }) => {
  const isRelationship = node.data?.kind === "relationship";
  return (
    <group>
      <mesh scale={[size, size, size]}>
        {isRelationship ? (
          <octahedronGeometry args={[1, 0]} />
        ) : (
          <sphereGeometry args={[1, 25, 25]} />
        )}
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.9 : 0.7}
          transparent
          opacity={opacity}
          fog
        />
      </mesh>
    </group>
  );
};
