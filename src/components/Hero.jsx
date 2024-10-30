import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { styles } from "../styles";
import GlobalCanvas from "./GlobalCanvas";
import { useAtom } from "jotai";
import {initialParametersAtom } from "../atoms/globalAtoms";

const Hero = () => {
  const [initialParameters, setInitialParameters] = useAtom(
    initialParametersAtom
  );
  const windowHeight = initialParameters.windowHeight;

  return (
    <section className={`relative w-full   h-[${windowHeight}px] mx-auto`}>
      <GlobalCanvas />
    </section>
  );
};

export default Hero;
