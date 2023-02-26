import { ThreeElements, ThreeEvent, useLoader } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { TextureLoader } from "three";

export function Box(props: ThreeElements["mesh"]) {
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
    <Select enabled={selected}>
      <mesh
        {...props}
        castShadow
        receiveShadow
        onPointerOver={handleOverIn}
        onPointerOut={handleOverOut}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
    </Select>
  );
}
