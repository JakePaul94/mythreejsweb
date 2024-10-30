import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

import { useAtom } from "jotai";
import { useIsVisible } from "../hooks/useOnVisible";
const ShownSection = () => {
  const showref = useRef();

  const isVisible = useIsVisible(showref);
  useEffect(() => {
    
  }, [isVisible]);
  return <div ref={showref} className="w-full h-[10px]"></div>;
};
const ServiceCard = ({ index, title, icon }) => (
  <div className=" ">
    <motion.div
      variants={fadeIn("right", "spring", index * 1, 2)}
      className="w-full bg-transparent  shadow-card"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 1450
        }}
        className="bg-transparent  w-full h-full"
      >
        <div className="cardinfo flex flex-col justify-center gap-10">
          <img src={icon} className="w-20 h-20 object-cover"></img>
          <p className="h-12 text-xl text-white">{title}</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const About = () => {
  return (
    <div className="z-20">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 z-20 text-white text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled software developer with experience in TypeScript and
        JavaScript, and expertise in frameworks like React, Node.js, and
        Three.js. I'm a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let's work together to bring your ideas to life!
      </motion.p>

      <div className="mt-10 flex h-[600px] content-center justify-center flex-wrap gap-20">
        <ShownSection />
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
