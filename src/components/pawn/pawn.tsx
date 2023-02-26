import { useGLTF } from "@react-three/drei";
import { ThreeElements, ThreeEvent } from "@react-three/fiber";
import { Mesh } from "three";
import { Select } from "@react-three/postprocessing";
import { useState } from "react";

export function Pawn(props: ThreeElements["mesh"]) {
  const { nodes } = useGLTF("/pawn.glb");
  const [selected, setSelected] = useState(true);
  const handleOverIn = (event: ThreeEvent<PointerEvent>) => {
    console.log("in");
    setSelected(true);
  };
  const handleOverOut = (event: ThreeEvent<PointerEvent>) => {
    console.log("out");
    setSelected(false);
  };
  return (
    <Select enabled={true}>
      <mesh
        {...props}
        onPointerOver={handleOverIn}
        onPointerOut={handleOverOut}
        castShadow
        receiveShadow
        geometry={(nodes.Pawn as Mesh).geometry}
        material={(nodes.Pawn as Mesh).material}
      ></mesh>
    </Select>
  );
}
