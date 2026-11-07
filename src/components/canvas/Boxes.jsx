import React, { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAtom } from "jotai";
import {  pageStateAtom } from "../../atoms/globalAtoms";
import { gsap } from "gsap";

const RandomBoxes = ({ count = 30, size = 0.01, range = 3 }) => {
  const [pageState] = useAtom(pageStateAtom);
  const boxes = useRef([]); 
  const isFirstRender = useRef(true);
  useMemo(() => {
    const boxArray = [];
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff 
      });
      const box = new THREE.Mesh(geometry, material);

      box.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.2) * 3,
        (Math.random() - 0.8) * 1
      );

      boxArray.push(box); 
    }
    boxes.current = boxArray; 
  }, []);

  useFrame(({ clock }) => {
    boxes.current.forEach((box, index) => {
      const amplitude = 0.001; 
      const speed = 2; 
      box.position.y +=
        amplitude * Math.sin(clock.getElapsedTime() * speed + index);

      // Thay đổi độ sáng
      box.material.emissiveIntensity =
        0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 3 + index); // Tạo hiệu ứng nhấp nháy
    });
  });

  // Thay đổi kích thước hộp theo trạng thái model
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Đánh dấu lần render đầu tiên
      return; // Không chạy hàm lần đầu
    }

    const targetScale = { x: 0.1, y: 20, z: 0.1 };

    if (pageState) {
      if (
        (pageState.current === 1 && pageState.previous === 0) ||
        (pageState.current === 0 && pageState.previous === 1)
      ) {
        boxes.current.forEach((box, index) => {
          gsap.to(box.scale, {
            delay:0.5,
            x: targetScale.x,
            y: targetScale.y,
            z: targetScale.z,
            duration: 0.5,
            onComplete: () => {
              gsap.to(box.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.5
              });
            }
          });
        });
      }
    }
  }, [pageState]); 

  return (
    <>
      {boxes.current.map((box, index) => (
        <primitive key={index} object={box} />
      ))}
    </>
  );
};

export default RandomBoxes;
