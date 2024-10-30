import React, { useEffect, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useAtom } from "jotai";
import { pageStateAtom, typeOSAtom } from "../../atoms/globalAtoms";
import { gsap } from "gsap"; // Import GSAP
import MobileDetect from "mobile-detect";
const HeaderText = () => {
  const [pageState] = useAtom(pageStateAtom);
  const textRef = useRef();
  const textRef2 = useRef();
  
  const [typeOS, setTypeOS] = useAtom(typeOSAtom);
  const md = new MobileDetect(window.navigator.userAgent);
  const ypos = typeOS === "iOS" ? 1.5 : 1.7;
  const finalPosition1 = useRef([0, ypos, 0]);
  const finalPosition2 = useRef([0, -0.1, 0.2]);
  useEffect(() => {
    setTypeOS(md.os());
  }, []);

 
  const animateText = (
    intermediatePosition1,
    intermediatePosition2,
    targetPosition1,
    targetPosition2,
    durationToIntermediate,
    durationToTarget
  ) => {
    // Di chuyển đến vị trí trung gian
    gsap.to(textRef.current.position, {
      x: intermediatePosition1[0],
      y: intermediatePosition1[1],
      z: intermediatePosition1[2],
      duration: durationToIntermediate,
      onComplete: () => {
        // Sau khi hoàn thành giai đoạn 1, di chuyển đến vị trí mục tiêu
        gsap.to(textRef.current.position, {
          x: targetPosition1[0],
          y: targetPosition1[1],
          z: targetPosition1[2],
          duration: durationToTarget
        });
      }
    });

    // Di chuyển văn bản thứ hai đến vị trí trung gian
    gsap.to(textRef2.current.position, {
      x: intermediatePosition2[0],
      y: intermediatePosition2[1],
      z: intermediatePosition2[2],
      duration: durationToIntermediate,
      onComplete: () => {
        // Sau khi hoàn thành giai đoạn 1, di chuyển đến vị trí mục tiêu
        gsap.to(textRef2.current.position, {
          x: targetPosition2[0],
          y: targetPosition2[1],
          z: targetPosition2[2],
          duration: durationToTarget
        });
      }
    });
  };

  useEffect(() => {
    if (pageState.current === 1 && pageState.previous === 0) {
      animateText(
        [0, 1.5, 0], // intermediatePosition1
        [0, 0.2, 0], // intermediatePosition2
        [0, 3, 0], // targetPosition1
        [0, 3, 0], // targetPosition2
        0.5, // durationToIntermediate
        0.3 // durationToTarget
      );
    }
    if (pageState.current === 0 && pageState.previous === 1) {
      animateText(
        [0, 2, 0], // intermediatePosition1
        [0, 2.5, 0], // intermediatePosition2
        [0, ypos, 0], // targetPosition1
        [0, -0.1, 0.2], // targetPosition2
        0.5, // durationToIntermediate
        1.0 // durationToTarget
      );
    }
  }, [pageState,typeOS]); // Chạy khi pageState thay đổi

  return (
    <>
      <Text
        ref={textRef}
        position={finalPosition1.current} // Sử dụng vị trí cuối cùng
        fontSize={0.097}
        fontWeight={500}
        color="white"
      >
        I   A M   T R I N H . D C
      </Text>
      <Text
        ref={textRef2}
        position={finalPosition2.current} // Sử dụng vị trí cuối cùng
        fontSize={0.02}
        color="white"
      >
        F U L L S T A C K D E V E L O P E R - D E S I G N E R - C O D E R
      </Text>
    </>
  );
};

export default HeaderText;
