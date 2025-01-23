import { useProgress } from "@react-three/drei";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { loadings } from "../constants";
import { useAtom } from "jotai";
import { isLoadedAtom } from "../atoms/globalAtoms";
import { useFixHeight } from "../hooks/useFixHeight";

const PCView = () => {
  
  return (
    <div
      className="fixed w-full z-40 items-center flex justify-center bg-black-200 content-center h-screen"
    >
        PC View Unacceptable
    </div>
  );
};

export default PCView;
