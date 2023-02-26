import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";
import { TextureLoader, Vector3 } from "three";

export function Suzi({ setIsDragging, floorPlane, ...props }: any) {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [pos, setPos] = useState([0, 1, 0]);
  const [spring, api] = useSpring(() => ({
    position: pos,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  let planeIntersectPoint = new Vector3();
  const bind = useDrag(({ active, movement: [x, y], event, timeStamp }) => {
    if (active) {
      (event as any).ray.intersectPlane(floorPlane, planeIntersectPoint);
      setPos([planeIntersectPoint.x, 1.5, planeIntersectPoint.z]);
    }
    setIsDragging(active);
    api.start({
      position: pos,
      scale: active ? 1.2 : 1,
      rotation: [y / aspect, x / aspect, 0],
    });
    return timeStamp;
  });
  const name = (type: string) => `texture/wood/Wood060_1K_${type}.jpg`;

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(
    TextureLoader,
    [
      name("Color"),
      name("Displacement"),
      name("NormalGL"),
      name("Roughness"),
      name("AmbientOcclusion"),
    ]
  );
  console.log(spring);
  const { nodes, materials } = useGLTF(
    "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf"
  );
  return (
    <animated.mesh
      {...(bind() as any)}
      {...spring}
      castShadow
      receiveShadow
      geometry={(nodes.Suzanne as any).geometry}
    >
      <meshStandardMaterial
        displacementScale={0.01}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </animated.mesh>
  );
}
