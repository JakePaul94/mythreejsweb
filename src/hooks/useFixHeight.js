import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { windowHeightAtom } from "../atoms/globalAtoms";

export const useFixHeight = () => {
  const prevHeightRef = useRef(window.outerHeight);
  const [windowHeight, setWindowHeight] = useAtom(windowHeightAtom);
  const setVh = () => {
    const currentHeight = window.outerHeight;

    if (currentHeight >= prevHeightRef.current) {
      const vh = currentHeight * 0.01;
      setWindowHeight(currentHeight);
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      prevHeightRef.current = currentHeight;
    }
  };

  useEffect(() => {
    setVh();

    window.addEventListener("resize", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  return null;
};
