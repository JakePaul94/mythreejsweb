import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { displaysprites, display } from "../../assets";
import { useAtom } from "jotai";
import { pageStateAtom } from "../../atoms/globalAtoms";

const Display = () => {
  const [pageState] = useAtom(pageStateAtom);
  const meshRef = useRef();
  const [texture, setTexture] = useState();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [isSpriteFinished, setIsSpriteFinished] = useState(false);
  const totalFrames = 100; // Tổng số frame trong sprite
  const frameWidth = 5; // Số frame ngang
  const frameHeight = 20; // Số frame dọc
  const frameSizeX = 1 / frameWidth; // Kích thước từng frame theo chiều ngang
  const frameSizeY = 1 / frameHeight; // Kích thước từng frame theo chiều dọc

  useEffect(() => {
    // Tải sprite sheet
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(displaysprites, (loadedTexture) => {
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
      if (frameIndex >= totalFrames) {
        setIsSpriteFinished(true);
        return;
      }
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
      {isTextureLoaded && !isSpriteFinished && isShow && (
        <mesh ref={meshRef} position={[0, 1.3, 0]}>
          <planeGeometry args={[1, 0.4]} />
          <meshBasicMaterial map={texture} transparent opacity={1} />
        </mesh>
      )}

      {isSpriteFinished && (
        <mesh position={[0, 1.3, 0]}>
          <planeGeometry args={[1, 0.4]} />
          <meshBasicMaterial map={'red'} transparent opacity={1} />
        </mesh>
      )}
    </>
  );
};

export default Display;
