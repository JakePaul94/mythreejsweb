import React, { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAtom } from "jotai";
import {  pageStateAtom } from "../../atoms/globalAtoms";
import { gsap } from "gsap";

const RandomBoxes = ({ count = 30, size = 0.01, range = 3 }) => {
  const [pageState] = useAtom(pageStateAtom);
  const boxes = useRef([]); // Sử dụng useRef để giữ trạng thái các hộp
  const isFirstRender = useRef(true);
  // Tạo các hộp ngẫu nhiên
  useMemo(() => {
    const boxArray = [];
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff // Tạo màu phát sáng
      });
      const box = new THREE.Mesh(geometry, material);

      // Tạo vị trí ngẫu nhiên trong khu vực giới hạn
      box.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.2) * 3,
        (Math.random() - 0.8) * 1
      );

      boxArray.push(box); // Thêm hộp vào mảng
    }
    boxes.current = boxArray; // Gán mảng hộp vào ref
  }, []);

  useFrame(({ clock }) => {
    boxes.current.forEach((box, index) => {
      const amplitude = 0.001; // Biên độ di chuyển
      const speed = 2; // Tốc độ di chuyển
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
      // if (pageState.current === 2 && pageState.previous === 1) {
      //   boxes.current.forEach((box, index) => {
      //     gsap.to(box.position, {
      //       x: 0,
      //       y: 1,
      //       z: 0,
      //       duration: 0.5
      //     });
      //   });
      // }
    }
  }, [pageState]); // Chỉ chạy lại khi modelState thay đổi

  return (
    <>
      {boxes.current.map((box, index) => (
        <primitive key={index} object={box} />
      ))}
    </>
  );
};

export default RandomBoxes;
