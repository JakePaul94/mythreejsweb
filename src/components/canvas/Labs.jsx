import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations , Loader , useKTX2} from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";
import gsap from "gsap";

const LabModel = () => {
  const [pageState] = useAtom(pageStateAtom);
  const group = useRef();
  const { scene } = useGLTF("./lab2.glb");
  const [spriteTexture, setSpriteTexture] = useState(null);
  const texture = useKTX2('./output2.ktx2')
  const animationRef = useRef();
  const frameRef = useRef(0);
  useEffect(() => {
    if (!texture) return;

    // Configure texture as a sprite sheet
    texture.repeat.set(1 / 5, 1 / 10); // 5 columns, 10 rows
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    setSpriteTexture(texture);

    // Traverse scene to apply the sprite texture
    scene.traverse((child) => {
      if (child.isMesh && child.name === "Plane") {
        child.material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        child.material.needsUpdate = true;
   // Reset bất kỳ phép xoay nào
 
  
      }
    });
  }, [scene, texture]);
  
  useEffect(() => {
    if (!spriteTexture) return;
  
    const totalFrames = 50; // Total frames (5x10)
  
    const updateFrame = () => {
      const column = frameRef.current % 5; // Current column (0-4)
      const row = Math.floor(frameRef.current / 5); // Current row (0-9)
  
      // Update UV offset to show the correct frame
      spriteTexture.offset.set(column / 5, (row + 1) / 10); // Adjust UV offset
  
      // Kiểm tra nếu đây là frame cuối cùng
      if (frameRef.current >= totalFrames - 1) {
        clearInterval(animationRef.current); // Dừng animation
        return;
      }
  
      // Increment frame for the next update
      frameRef.current += 1; 
    };
  
    // Start animation
    frameRef.current = 0; // Bắt đầu từ frame 0
    animationRef.current = setInterval(updateFrame, 221); // Update every 221ms
  
    // Hiển thị frame đầu tiên ngay lập tức
    updateFrame();
  
    return () => clearInterval(animationRef.current); // Cleanup on unmount
  }, [spriteTexture]);
  
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
