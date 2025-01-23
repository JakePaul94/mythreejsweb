import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import {
  Model,
  HeaderText,
  HelloText,
  RandomBoxes,
  PhoenixModel,
  LabModel
} from "./canvas";
import MovableCamera from "./canvas/Camera";
import MovingPointLight from "./canvas/Light";
import { pageStateAtom } from "../atoms/globalAtoms";
import { useAtom } from "jotai";


const GlobalCanvas = () => {

  return (
    <div className="z-30 fixed top-0 left-0  w-full h-[calc(var(--vh)*100)]">
      <Canvas shadows dpr={[2, 2]} gl={{ preserveDrawingBuffer: true }}>
        <MovableCamera />
        <Model />
        <PhoenixModel />
        <HelloText />
        <HeaderText />
        <RandomBoxes />
        <MovingPointLight />
        <LabModel />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default GlobalCanvas;
