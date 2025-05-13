import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useKTX2 } from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";
import gsap from "gsap";

const LabModel = () => {
  const [pageState] = useAtom(pageStateAtom);
  const group = useRef();
  const { scene } = useGLTF("./lab2.glb");
  const [spriteTexture, setSpriteTexture] = useState(null);
  const [displayTexture, setDisplayTexture] = useState(null);
  const texture = useKTX2('./output2.ktx2');
  const animationRef = useRef();
  const frameRef = useRef(0);
  const planeMeshRef = useRef(null);
  const animationStartedRef = useRef(false);

  // Tải display texture (ảnh thường)
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./displayraw.jpg', (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.repeat.y = -1;
      loadedTexture.offset.y = 1;
      setDisplayTexture(loadedTexture);
    });
  }, []);

  // Cấu hình sprite texture và tìm mesh Plane
  useEffect(() => {
    if (!texture) return;

    texture.repeat.set(1 / 5, 1 / 10);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    setSpriteTexture(texture);

    scene.traverse((child) => {
      if (child.isMesh && child.name === "Plane") {
        child.material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        planeMeshRef.current = child;
      }
    });
  }, [scene, texture]);

  // Xử lý animation và chuyển đổi texture (chỉ chạy khi pageState.current === 1)
  useEffect(() => {
    if (!spriteTexture || !planeMeshRef.current || pageState.current !== 1 || animationStartedRef.current) {
      return;
    }

    animationStartedRef.current = true;
    const totalFrames = 50;
    let isAnimationComplete = false;

    const updateFrame = () => {
      if (isAnimationComplete) return;

      const column = frameRef.current % 5;
      const row = Math.floor(frameRef.current / 5);

      spriteTexture.offset.set(column / 5, row / 10);

      if (frameRef.current >= totalFrames - 1) {
        isAnimationComplete = true;
        clearInterval(animationRef.current);

        if (displayTexture) {
          planeMeshRef.current.material.map = displayTexture;
          planeMeshRef.current.material.needsUpdate = true;
        }
        return;
      }

      frameRef.current += 1;
    };

    frameRef.current = 0;
    animationRef.current = setInterval(updateFrame, 221);
    updateFrame();

    return () => {
      clearInterval(animationRef.current);
      animationStartedRef.current = false; // Reset trạng thái để có thể chạy lại
    };
  }, [spriteTexture, displayTexture, pageState]);

  // Animation di chuyển nhóm
  useEffect(() => {
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