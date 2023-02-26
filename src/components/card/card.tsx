import { forwardRef } from "react";
import { Euler, Mesh, Vector3 } from "three";

export type Props = {
  cardSize: number;
  cardThickness: number;
  position?: Vector3;
  rotation?: Euler;
};

export const Card = forwardRef<Mesh, Props>(
  ({ cardSize = 4, cardThickness = 0.1, ...restProps }, ref) => (
    <mesh ref={ref} {...restProps}>
      <boxGeometry args={[0.7 * cardSize, cardSize, cardThickness]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  )
);
