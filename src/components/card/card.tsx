import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { Euler, Mesh, TextureLoader, Vector3 } from "three";
import cardMiddleSrc from "./assets/card-middle.png";
import cardBackSrc from "./assets/card-back.png";

export type Props = {
  cardSize: number;
  cardThickness: number;
  position?: Vector3;
  rotation?: Euler;
};

export const Card = forwardRef<Mesh, Props>(
  ({ cardSize = 4, cardThickness = 0.1, ...restProps }, ref) => {
    const colorMapMiddle = useLoader(TextureLoader, cardMiddleSrc);
    const colorMapBack = useLoader(TextureLoader, cardBackSrc);
    return (
      <mesh ref={ref} {...restProps}>
        <boxGeometry args={[0.7 * cardSize, cardSize, cardThickness]} />
        <meshStandardMaterial
          map={colorMapMiddle}
          transparent={true}
          attach="material-4"
        />
        <meshStandardMaterial
          map={colorMapBack}
          transparent={true}
          attach="material-5"
        />
      </mesh>
    );
  }
);
