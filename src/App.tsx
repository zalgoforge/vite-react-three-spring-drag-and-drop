import { Canvas, useThree } from "@react-three/fiber";
import { memo, useState } from "react";

import {
  AccumulativeShadows,
  Center,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Hud,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
} from "@react-three/drei";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { Floor } from "./components/floor/floor";
import { Pawn } from "./components/pawn/pawn";
import { Ui } from "./components/ui/ui";

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

function MainStage() {
  const [isDragging, setIsDragging] = useState(false);
  // const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={0.5}
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />

      <Selection>
        <Pawn position={[0, 0, 0]} />

        <EffectComposer autoClear={false}>
          <Outline
            edgeStrength={200}
            pulseSpeed={0}
            visibleEdgeColor={"green" as any}
            hiddenEdgeColor={"red" as any}
            height={480}
            blur={false}
            xRay={true}
          />
        </EffectComposer>
      </Selection>

      {/*<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[10, 10]} receiveShadow />
    <meshPhongMaterial attach="material" color="#ccc" side={DoubleSide} />
</mesh>*/}
      {/*<planeHelper args={[floorPlane, 50, 0x9d4b4b]} />*/}
      {/* <Shadows /> */}
      <Floor receiveShadow={true} />
      <OrbitControls makeDefault enabled={!isDragging} />
      <Environment preset="warehouse" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}

function App() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 12, 12], fov: 25 }}>
      <Hud renderPriority={1}>
        <MainStage />
      </Hud>

      <Hud renderPriority={2}>
        <PerspectiveCamera
          makeDefault
          fov={30}
          aspect={1}
          near={1}
          far={1000}
          position={[0, 2, 10]}
        />
        <Ui />
        <directionalLight intensity={0.5} castShadow />
        <ambientLight intensity={1} />
        <pointLight position={[2, 2, 1]} intensity={0.5} />
      </Hud>
    </Canvas>
  );
}

export default App;
