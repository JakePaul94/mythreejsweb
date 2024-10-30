import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { spritesmoke } from "../../assets";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";

const HelloText = () => {
  const [pageState] = useAtom(pageStateAtom);
  const meshRef = useRef();
  const [texture, setTexture] = useState();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isShow, setIsShow] = useState(true);

  const totalFrames = 40; // Tổng số frame trong sprite
  const frameWidth = 4; // Số frame ngang
  const frameHeight = 10; // Số frame dọc
  const frameSizeX = 1 / frameWidth; // Kích thước từng frame theo chiều ngang
  const frameSizeY = 1 / frameHeight; // Kích thước từng frame theo chiều dọc

  useEffect(() => {
    // Tải sprite sheet
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(spritesmoke, (loadedTexture) => {
      setTexture(loadedTexture);
      setIsTextureLoaded(true); // Đánh dấu là texture đã được tải
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (pageState.current === 0) {
        setIsShow(true);
      }
    }, 900);
    if (pageState.current !== 0) {
      setIsShow(false);
    }
  }, [pageState]);

  useFrame((state) => {
    if (meshRef.current && texture) {
      const elapsedTime = state.clock.getElapsedTime();
      const frameIndex = Math.floor((elapsedTime * 10) % totalFrames); // Thay đổi frame theo thời gian
      const column = frameIndex % frameWidth; // Cột hiện tại
      const row = Math.floor(frameIndex / frameWidth); // Hàng hiện tại

      // Tính toán offset texture
      const offsetX = column * frameSizeX; // Thay đổi từ frameSize thành frameSizeX
      const offsetY = row * frameSizeY; // Thay đổi từ frameSize thành frameSizeY

      // Cập nhật offset cho texture
      texture.offset.set(offsetX, 1 - offsetY - frameSizeY); // Y đảo ngược để phù hợp với hệ tọa độ của Three.js
      texture.repeat.set(frameSizeX, frameSizeY); // Thiết lập lặp lại của texture
    }
  });

  return (
    <>
      {isTextureLoaded && texture && isShow && (
        <mesh ref={meshRef} position={[0, 1.3, 0]}>
          <planeGeometry args={[1, 0.4]} />

          <meshBasicMaterial
            map={texture}
            transparent
            opacity={1} // Độ mờ của khói (có thể điều chỉnh)
          />
        </mesh>
      )}
    </>
  );
};

export default HelloText;
