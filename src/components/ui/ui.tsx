import * as THREE from "three";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { createFindTimestampIndexes } from "./timestamp";
import { Text } from "@react-three/drei";
import { useControls } from "leva";
import { Card } from "../card/card";

const euler = new THREE.Euler(0, 0, 0);

type CardPhase = "in-deck" | "draw" | "in-hand" | "discarded";

type Card = {
  id: string;
};

type Snapshot = {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  time: number;
  phase: CardPhase;
};

const findTimestampIndexes = createFindTimestampIndexes<Snapshot>(
  (x) => x.time
);

const getCardPhase = (time: number, snapshots: Snapshot[]): CardPhase => {
  const [_, nextIndex] = findTimestampIndexes(snapshots, time);
  const nextSnapshot = snapshots[nextIndex];

  return nextSnapshot.phase;
};

export function Ui() {
  const { time, timeMult } = useControls({
    time: { value: 250, min: 100, max: 1000, step: 10 },
    timeMult: { value: 1, min: 0.1, max: 10, step: 0.1 },
  });
  const meshRef = useRef<(Mesh | null)[]>([]);
  const textRef = useRef<{ text: string }>(null);
  const deckRef = useRef<Mesh>(null);
  const timeStart = useRef<number>(0);

  const deck = Array.from({ length: 10 }, (_, i) => {
    return {
      id: i.toString(),
    };
  });

  const snapshots: Snapshot[] = [
    {
      position: new THREE.Vector3(4, 0, 0),
      rotation: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI / 2, 0, 0)
      ),
      time: 0,
      phase: "in-deck",
    },
    {
      position: new THREE.Vector3(4, 0.5, 0),
      rotation: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI / 2, 0, 0)
      ),
      time: time * timeMult,
      phase: "draw",
    },
    {
      position: new THREE.Vector3(4, 0.5, 0),
      rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      time: time * 2 * timeMult,
      phase: "draw",
    },
    {
      position: new THREE.Vector3(3, 0.5, 2),
      rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      time: time * 3 * timeMult,
      phase: "draw",
    },
    {
      position: new THREE.Vector3(-3, 0.5, 2),
      rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      time: time * 20 * timeMult,
      phase: "in-hand",
    },
    {
      position: new THREE.Vector3(-3, -1, 2),
      rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      time: time * 20.2 * timeMult,
      phase: "discarded",
    },
  ];

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    timeStart.current += delta * 1000;

    if (
      timeStart.current >
      snapshots[snapshots.length - 1].time + 1000 * deck.length
    ) {
      timeStart.current = 0;
    }

    deck.forEach((card, i) => {
      const time = timeStart.current - i * 1000;
      const mesh = meshRef.current[i];
      if (!mesh) {
        return;
      }
      const [prevSnapshotIndex, currentSnapshotIndex] = findTimestampIndexes(
        snapshots,
        time
      );

      const prevSnapshot = snapshots[prevSnapshotIndex];
      const currentSnapshot = snapshots[currentSnapshotIndex];

      const timeDelta =
        (time - prevSnapshot.time) / (currentSnapshot.time - prevSnapshot.time);

      mesh.rotation.setFromQuaternion(
        prevSnapshot.rotation.clone().slerp(currentSnapshot.rotation, timeDelta)
      );
      mesh.position.lerpVectors(
        prevSnapshot.position,
        currentSnapshot.position,
        timeDelta
      );
    });

    const cardsInDeck = deck.filter((card, i) => {
      const time = timeStart.current - i * 1000;
      const cardPhase = getCardPhase(time, snapshots);
      return cardPhase === "in-deck";
    }).length;

    if (textRef.current) {
      textRef.current.text = `cards in deck: ${cardsInDeck}/${deck.length}`;
    }

    if (deckRef.current) {
      deckRef.current.visible = cardsInDeck > 0;
      deckRef.current.scale.z = cardsInDeck / deck.length;
    }
  });

  return (
    <>
      <Text
        ref={textRef}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.2}
        lineHeight={1}
        position={[4, 2, 0]}
      >
        info:
      </Text>
      {deck.map((card, i) => (
        <Card
          key={card.id}
          cardName={card.id}
          cardDescription="description"
          cardStrength={i}
          cardSize={0.7}
          ref={(el) => (meshRef.current[i] = el)}
          position={snapshots[0].position}
          rotation={euler.setFromQuaternion(snapshots[0].rotation)}
        />
      ))}

      <mesh
        ref={deckRef}
        position={snapshots[0].position}
        rotation={euler.setFromQuaternion(snapshots[0].rotation)}
      >
        <boxGeometry args={[0.7, 1, 0.1]} />
        <meshStandardMaterial color="grey" />
      </mesh>
    </>
  );
}
