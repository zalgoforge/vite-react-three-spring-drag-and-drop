import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { Mesh } from "three";

export function Floor(props: ThreeElements["mesh"]) {
  const { nodes } = useGLTF("/floor.glb");
  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
      geometry={(nodes.Plane as Mesh).geometry}
      material={(nodes.Plane as Mesh).material}
    ></mesh>
  );
}
