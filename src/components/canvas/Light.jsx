import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { pageStateAtom } from '../../atoms/globalAtoms';

const MovingPointLight = () => {
  const[pageState] = useAtom(pageStateAtom)
  const pointLightRef = useRef();
  const pointLight2Ref = useRef()
  useEffect(() => {
   if(pageState.current === 0){
    pointLightRef.current.visible = true
    pointLight2Ref.current.visible=false
    gsap.to(pointLightRef.current.position, {
      y: 1.2,      // Di chuyển đến vị trí y = 1
      duration: 2, // Thời gian chuyển động
      repeat: -1,  // Lặp vô hạn
      yoyo: true,  // Quay lại vị trí ban đầu
      ease: 'power1.inOut', // Hiệu ứng easing
    });}
    else{
      pointLightRef.current.visible = false
      pointLight2Ref.current.visible=true
      gsap.to(pointLight2Ref.current.position, {
        y: 0,      // Di chuyển đến vị trí y = 1
        duration: 2, // Thời gian chuyển động
        repeat: -1,  // Lặp vô hạn
        yoyo: true,  // Quay lại vị trí ban đầu
        ease: 'power1.inOut', // Hiệu ứng easing
      })
    }
  }, [pageState]);

  return (<>
    <pointLight
      ref={pointLightRef}
      intensity={1}
      distance={5}
      decay={2}
      position={[0, -0.1, 0.4]} // Vị trí ban đầu
      color={"#f0f0f0"}
      castShadow
    />
    <pointLight
      ref={pointLight2Ref}
      intensity={11}
      distance={5}
      decay={2}
      position={[0, 1, 1]} // Vị trí ban đầu
      color={"#fcfcfc"}
      castShadow
    />
    <ambientLight intensity={1} color={"white"}/>
    </>
  );
};

export default MovingPointLight;
