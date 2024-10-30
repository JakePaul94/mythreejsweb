import React, { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import * as THREE from "three";
import { planet } from "../../assets"; // Đảm bảo rằng đường dẫn này chính xác
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";

const Ball = () => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // State để theo dõi trạng thái tải texture
  const [pageState] = useAtom(pageStateAtom);
  useEffect(() => {
    const textureLoader = new TextureLoader();
    const loadTextures = () => {
      textureLoader.load(
        planet,
        (loadedTexture) => {
          loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
          setTexture(loadedTexture);
          setIsLoaded(true); // Đánh dấu texture đã được tải
        },
        undefined,
        (error) => {
          console.error("Error loading texture:", error);
        }
      );
    };
    loadTextures();
  }, []);

  useEffect(() => {
    // Tạo hiệu ứng xoay cho quả cầu khi texture đã được tải
    if (isLoaded) {
      const rotateTween = gsap.to(meshRef.current.rotation, {
        x: Math.PI * 2,
        z: Math.PI * 2,
        duration: 55,
        yoyo: true,
        repeat: -1, // Lặp mãi
        ease: "linear" // Tăng đều
      });

      return () => {
        rotateTween.kill(); // Dọn dẹp khi component bị hủy
      };
    }
  }, [isLoaded]); // Thay đổi khi texture được tải
  useEffect(() => {
    // Tạo hiệu ứng thay đổi kích thước cho quả cầu khi texture đã được tải
    if (isLoaded && pageState.current === 1 && pageState.previous === 0) {
     setTimeout(()=>{
      const scaleTween = gsap.to(meshRef.current.scale, {
        x: 1 / 30,
        y: 1 / 30,
        z: 1 / 30,
        duration: 0.5,
        ease: "linear"
      });
      const postionTween = gsap.to(meshRef.current.position, {
        x: 0,
        y: -1 / 2,
        z: 0,
        duration: 0.5,
        ease: "linear",
        onComplete:()=>{
          gsap.to(meshRef.current.position, {
            x: 0.5,
            y: 1.4 ,
            z: 0.1,
            duration: 0.5,
            ease: "linear"
        })}
      });
      return () => {
        scaleTween.kill();
        postionTween.kill(); // Dọn dẹp khi component bị hủy
      };
     },500)
    }
    if (isLoaded && pageState.current === 0 && pageState.previous === 1) {
      const scaleTween = gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: "linear"
      });
      const postionTween = gsap.to(meshRef.current.position, {
        x: 0,
        y: -1.07,
        z: 0,
        duration: 0.5,
        ease: "linear"
      });
      return () => {
        scaleTween.kill();
        postionTween.kill(); // Dọn dẹp khi component bị hủy
      };
    }
  }, [isLoaded, pageState]); // Thay đổi khi texture được tải

  return (
    <>
      <ambientLight intensity={0.5} /> {/* Thêm ánh sáng nền */}
      <pointLight position={[10, 10, 10]} /> {/* Thêm ánh sáng điểm */}
      {isLoaded && ( // Chỉ hiển thị mesh khi texture đã được tải
        <mesh ref={meshRef} position={[0, -1.07, 0]}>
          <sphereGeometry args={[1, 30, 30]} />
          <meshLambertMaterial
            map={texture} // Gán texture đã tải
            depthWrite={false}
            depthTest={true}
            transparent={true}
          />
        </mesh>
      )}
    </>
  );
};

export default Ball;
