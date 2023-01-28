import { memo, useRef, useState } from "react";
import { Canvas, ThreeElements, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";

import {
  AccumulativeShadows,
  Center,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  RandomizedLight,
  useGLTF,
} from "@react-three/drei";
import { useControls } from "leva";
import { DoubleSide, Plane, Vector3 } from "three";

function Box(props: ThreeElements["mesh"]) {
  const name = (type: string) =>
    `src/assets/texture/metal/Metal047B_1K_${type}.jpg`;

  const [colorMap, displacementMap, normalMap, roughnessMap] = useLoader(
    TextureLoader,
    [name("Color"), name("Displacement"), name("NormalGL"), name("Roughness")]
  );
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      castShadow
      receiveShadow
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        displacementScale={0.01}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}

function Suzi({ setIsDragging, floorPlane, ...props }: any) {
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
  const name = (type: string) =>
    `src/assets/texture/wood/Wood060_1K_${type}.jpg`;

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

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
));

function App() {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });
  const [isDragging, setIsDragging] = useState(false);
  const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 12, 12], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={0.5}
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />
      <Center top position={[2.5, 0, 1]}>
        <Box position={[-1.2, 0, 0]} />
      </Center>
      <Center top>
        <Suzi setIsDragging={setIsDragging} floorPlane={floorPlane} />
      </Center>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeBufferGeometry attach="geometry" args={[10, 10]} receiveShadow />
        <meshPhongMaterial attach="material" color="#ccc" side={DoubleSide} />
      </mesh>
      {/*<planeHelper args={[floorPlane, 50, 0x9d4b4b]} />*/}
      <Shadows />
      <OrbitControls makeDefault enabled={!isDragging} />
      <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
      <Environment preset="city" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
}

export default App;
