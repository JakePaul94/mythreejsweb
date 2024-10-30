import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useAtom } from "jotai";
import {  pageStateAtom, typeOSAtom } from "../../atoms/globalAtoms";
import gsap from "gsap";
import MobileDetect from "mobile-detect";

const MovableCamera = () => {
  const cameraRef = useRef();
  const [pageState] = useAtom(pageStateAtom);
  const [typeOS, setTypeOS] = useAtom(typeOSAtom); // Import useState
  // Di chuyển ra ngoài useEffect

  useEffect(() => {
    if (cameraRef.current && typeOS) {
      // Chỉ chạy nếu typeOS đã được gán
      if (typeOS === "iOS") {
        cameraRef.current.position.set(0, 0.6, 3);
      } else {
        cameraRef.current.position.set(0, 1, 3);
      }
      cameraRef.current.aspect = window.innerWidth / window.outerHeight;
      cameraRef.current.fov = 45;
      cameraRef.current.near = 0.11;
      cameraRef.current.lookAt(0, 1, -111);
    }
  }, [typeOS]);

  useEffect(() => {
    if (cameraRef.current) {
      if (pageState.current === 1) {
        if (typeOS === "iOS") {
          gsap.to(cameraRef.current.position, {
            x: 0,
            y: 1,
            z: 3,
            duration: 2,
            delay: 0, // Thời gian chuyển động
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(cameraRef.current.position, {
                x: 0.66,
                y: 0.5,
                z: 1,
                duration: 1,
                delay: 2, // Thời gian chuyển động
                ease: "power1.inOut"
              });
            }
          });
        } else {
          gsap.to(cameraRef.current.position, {
            x: 0.66,
            y: 0.5,
            z: 1,
            duration: 1,
            delay: 4, // Thời gian chuyển động
            ease: "power1.inOut"
          });
        }
      } else {
        let ypos = typeOS === "iOS" ? 0.6 : 1;
        gsap.to(cameraRef.current.position, {
          x: 0,
          y: ypos,
          z: 3,
          duration: 0.4,
          delay: 0, // Thời gian chuyển động
          ease: "power1.inOut",
          onComplete: () => {}
        });
      }
    }
  }, [pageState, typeOS]); // Phụ thuộc vào pageState và typeOS

  return <PerspectiveCamera ref={cameraRef} makeDefault />;
};

export default MovableCamera;
