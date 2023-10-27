import React, { Suspense } from "react";
import { Canvas ,useLoader} from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  
  Sphere
} from "@react-three/drei";
import test from '../../assets/tech/css.png'
import CanvasLoader from "../Loader";
import { TextureLoader } from 'three/src/loaders/TextureLoader'


function Scene({icon}) {
  const colorMap = useLoader(TextureLoader, icon)
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh scale={2} animations={'spin'}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    </>
  )
}
const BallCanvas = ({ icon }) => {
 
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
      <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Scene icon={icon}/>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
