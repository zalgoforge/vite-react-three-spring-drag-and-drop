import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { Euler, Mesh, TextureLoader, UniformsUtils, Vector3 } from "three";
import cardMiddleSrc from "./assets/card-middle.png";
import cardBackSrc from "./assets/card-back.png";
import skeletonFaceSrc from "./assets/faces/skeleton.png";
import { Center, Text } from "@react-three/drei";
import robotoFontSrc from "./assets/Roboto-Medium.ttf";

export type Props = {
  cardName: string;
  cardDescription: string;
  cardStrength: number;
  cardSize: number;
  cardThickness?: number;
  position?: Vector3;
  rotation?: Euler;
};

export const Card = forwardRef<Mesh, Props>(
  (
    {
      cardSize = 4,
      cardThickness = 0.1,
      cardName,
      cardDescription,
      cardStrength,
      ...restProps
    },
    ref
  ) => {
    const colorMapMiddle = useLoader(TextureLoader, cardMiddleSrc);
    const colorMapBack = useLoader(TextureLoader, cardBackSrc);
    const colorMapSkeleton = useLoader(TextureLoader, skeletonFaceSrc);

    const pitchMaterialParams = {
      uniforms: UniformsUtils.merge([
        {
          texture1: null,
          texture2: null,
        },
      ]),
      vertexShader: `
             
        precision highp float;
        precision highp int;
        
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
               
        `,
      fragmentShader: `
             
        precision mediump float;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        varying vec2 vUv;
        
        void main() {
            vec4 t1 = texture2D( texture1, vUv );
            vec4 t2 = texture2D( texture2, vUv );
            gl_FragColor = vec4(mix(t1.rgb, t2.rgb, t2.a), 1.0);
        }
               
        `,
    };
    return (
      <>
        <mesh ref={ref} {...restProps}>
          <boxGeometry args={[0.7 * cardSize, cardSize, cardThickness]} />
          <shaderMaterial
            args={[pitchMaterialParams]}
            uniforms={{
              texture1: { value: colorMapSkeleton },
              texture2: { value: colorMapMiddle },
            }}
            attach="material-4"
          />
          <meshStandardMaterial
            map={colorMapBack}
            transparent={true}
            attach="material-5"
          />
          <Text
            color="white"
            outlineColor="#ff0100"
            outlineWidth={0.01}
            outlineBlur={0.2}
            anchorX="center"
            anchorY="middle"
            fontSize={0.8}
            lineHeight={1}
            position={[-1.81, 2.76, 0.01]}
          >
            {cardStrength}
          </Text>
          <Text
            color="white"
            outlineColor="#ff0100"
            outlineWidth={0.01}
            outlineBlur={0.2}
            anchorX="center"
            anchorY="middle"
            fontSize={0.3}
            lineHeight={1}
            position={[0, -1.28, 0.01]}
          >
            {cardName}
          </Text>

          <Text
            color="black"
            outlineColor="#ffffff"
            outlineWidth={0.01}
            outlineBlur={0.6}
            outlineOpacity={0.3}
            anchorX="center"
            anchorY="middle"
            fontSize={0.2}
            lineHeight={1}
            position={[0, -2.5, 0.01]}
            maxWidth={4}
            textAlign="center"
            font={robotoFontSrc}
          >
            {cardDescription}
          </Text>
        </mesh>
      </>
    );
  }
);
