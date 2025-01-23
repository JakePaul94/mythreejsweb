import { useProgress } from "@react-three/drei";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { loadings } from "../constants";
import { useAtom } from "jotai";
import { isLoadedAtom } from "../atoms/globalAtoms";
import { useFixHeight } from "../hooks/useFixHeight";

const CanvasLoader = () => {
  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  const divRefs = useRef([]);
  const divWrapRef = useRef(null);
  const [isUnmounted, setIsUnmounted] = useState(false);
 
  useFixHeight()
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1500);
    }
  }, [progress]);

  useEffect(() => {
    if (!isUnmounted) {
      loadings.forEach((value, index) => {
        // Tính toán góc quay và thời gian khác nhau cho mỗi div
        if (!isLoaded) {
          const rotationAmount = Math.random() * 360; // Góc quay ngẫu nhiên
          const duration = Math.random() * 2 + 1; // Thời gian ngẫu nhiên từ 1 đến 3 giây

          gsap.to(divRefs.current[index], {
            rotation: rotationAmount,
            duration: duration,
            repeat: -1, // Lặp lại vô hạn
            ease: "power1.inOut",
            yoyo: true // Hiệu ứng easing
          });
          if (index <= 4) {
            const scalex = 1 + (6 - index) * 0.1;
            gsap.to(divRefs.current[index], {
              scale: scalex,
              duration: 2,
              repeat: -1, // Lặp lại vô hạn
              ease: "power1.inOut",
              yoyo: true // Hiệu ứng easing
            });
          }
        } else {
          const scalex = 1 + (6 - index) * 0.1;
          gsap.to(divRefs.current[index], {
            scale: 10,
            duration: 2,
            repeat: -1, // Lặp lại vô hạn
            ease: "power1.inOut",
            yoyo: true // Hiệu ứng easing
          });
        }
      });
    }
  }, [loadings, isLoaded, isUnmounted]);

  useEffect(() => {
    if (isLoaded) {
      gsap.to(divWrapRef.current, {
        opacity: 0,
        duration: 1, 
        onComplete: () => {
          setIsUnmounted(true); 
        }
      });
    }
  }, [isLoaded]);

  if (isUnmounted) {
    return null;
  }
  return (
    <div
      ref={divWrapRef}
      className="fixed w-full z-40 items-center flex justify-center bg-black-200 content-center h-screen"
    >
      <div className="relative flex justify-center flex-col items-center gap-8 w-full h-full">
        <div className="relative flex justify-center items-center  w-32 h-32">
          <div className="absolute  text-[7px]"> {Math.round(progress)}% </div>
          {loadings.map((value, id) => {
            return (
              <div
                key={value.id}
                ref={(el) => (divRefs.current[id] = el)} // Gán ref cho mỗi div
                className="absolute w-24 h-24"
                style={{
                  backgroundImage: `url(${value.img})`,
                  backgroundSize: "cover"
                }}
              ></div>
            );
          })}
        </div>
        <div className="text-[10px] flex flex-col gap-2 text-center"> <p>Trình DC - My personal web </p><p> Vui lòng chờ vài giây để tải dữ liệu ...</p></div>
      </div>
    </div>
  );
};

export default CanvasLoader;
