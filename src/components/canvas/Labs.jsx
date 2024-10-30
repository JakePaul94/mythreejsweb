import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";
import gsap from "gsap";

const LabModel = () => {
  const [pageState] = useAtom(pageStateAtom);
  const group = useRef();
  const { scene } = useGLTF("./lab.glb");

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "linear" });

   
    if (pageState.current === 1) {
      gsap.to(group.current.position, {
        y: -0.16,
        duration: 1,
        ease: "linear",
        delay: 0.5
      });
    } else {
      gsap.to(group.current.position, {
        y: -4,
        duration: 1,
        ease: "linear",
        delay: 0.5
      });
    }
  }, [pageState]);
  return (
    <group ref={group} dispose={null} position={[0, -4, 0]} scale={1}>
      <mesh position={[-0.01, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.5, 32]} />
        <meshPhysicalMaterial
          color="#0077ff"
          metalness={0}
          roughness={0.5}
          transparent={true}
          opacity={0.4}
          transmission={1}
          ior={1.5}
          thickness={2}
          specularIntensity={1}
          reflectivity={0.5}
        />
      </mesh>
      <primitive
        object={scene}
        scale={0.24}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

export default LabModel;
