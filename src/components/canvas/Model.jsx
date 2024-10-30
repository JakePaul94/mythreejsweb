import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";
import { useFrame } from "@react-three/fiber";

const Model = () => {
  const [pageState] = useAtom(pageStateAtom);
  const group = useRef();
  const particlesRef = useRef(null);

  const { scene, animations } = useGLTF("./model2.glb");
  const { actions } = useAnimations(animations, group);
  const [isShowWireframe, setIsShowFrame] = useState(false);
  useEffect(() => {
    const originalMaterials = {};
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        originalMaterials[child.name] = child.material.clone(); // Lưu material theo tên
      }
    });

    group.current.originalMaterials = originalMaterials; // Lưu vào trường mới của group
  }, [scene]);

  useEffect(() => {
    if (pageState.current === 0) {
      if (pageState.previous === 0) {
        actions["idle"].play();
      }
      if (pageState.previous === 1) {
        setTimeout(() => {
          scene.traverse((child) => {
            if (child.isMesh) {
              child.material = group.current.originalMaterials[child.name];

              if (child.name === "FBHead") {
                if (child) {
                  child.visible = true;
                }
              }
            }
          }, 1500);
          actions["jumpdown"].setLoop(THREE.LoopOnce);
          actions["jumpdown"].timeScale = 1;
          actions["jumpdown"].play();
          setTimeout(() => {
            actions["idle"].play();
          }, 1000);
        });
      }
    }
    if (pageState.current === 1) {
      if (pageState.previous === 0) {
        actions["jumpup"].setLoop(THREE.LoopOnce);
        actions["jumpup"].timeScale = 2;
        actions["jumpup"].play();
        actions["Show"].timeScale = 1;
        actions["Show"].play();
        setTimeout(() => {
          scene.traverse((child) => {
            if (child.isMesh) {
              if (child.name === "FBHead") {
                if (child) {
                  child.visible = false;
                }
              } else {
                child.material = new THREE.MeshStandardMaterial({
                  color: "#5e2601", // Màu trắng của tượng
                  roughness: 0.6, // Độ thô, tạo cảm giác như đá
                  metalness: 0.1, // Kim loại thấp để giữ cảm giác của đá
                  wireframe: true // Kích hoạt chế độ wireframe
                });
              }
            }
          });
        }, 1400);
      } else if (pageState.previous === 2) {
        actions["Show"].timeScale = 0.12;
        actions["Show"].play();
      }
    }

    return () => {
      for (const action of Object.values(actions)) {
        action.stop();
      }
    };
  }, [pageState]);

  return (
    <group ref={group} dispose={null} scale={0.7}>
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

export default Model;
