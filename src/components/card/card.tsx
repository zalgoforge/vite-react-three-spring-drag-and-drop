import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { Euler, Mesh, TextureLoader, Vector3 } from "three";
import cardMiddleSrc from "./assets/card-middle.png";

export type Props = {
  cardSize: number;
  cardThickness: number;
  position?: Vector3;
  rotation?: Euler;
};

export const Card = forwardRef<Mesh, Props>(
  ({ cardSize = 4, cardThickness = 0.1, ...restProps }, ref) => {
    const colorMap = useLoader(TextureLoader, cardMiddleSrc);
    return (
      <mesh ref={ref} {...restProps}>
        <boxGeometry args={[0.7 * cardSize, cardSize, cardThickness]} />
        <meshStandardMaterial map={colorMap} transparent={true} />
      </mesh>
    );
  }
);
