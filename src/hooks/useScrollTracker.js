import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { pageStateAtom, windowHeightAtom } from "../atoms/globalAtoms";

export const useScrollAuto = () => {
  const [pageState, setPageState] = useAtom(pageStateAtom);
  const [lastY, setLastY] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [windowHeight] = useAtom(windowHeightAtom);
  const [blockTouch, setBlockTouch] = useState(false);
  const timeoutRef = useRef(null);
  const audioRef = useRef(new Audio("./display.mp3"));
  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setLastY(touch.clientY);
  };
  const logstate = (action) => {
    console.log(
      "windowsc :" +
        window.scrollY +
        "   block  :  " +
        blockTouch +
        " action: " +
        action
    );
  };
  const handleTouchMove = (event) => {
      const touch = event.touches[0];
    const moveY = touch.clientY;
    event.preventDefault();
    const deltaY = moveY - lastY;
    if (window.scrollY >= windowHeight * 2 - 100 && deltaY < -20) {
      const newpositon = window.scrollY - 2 * deltaY;
      window.scrollTo({
        top: newpositon,
        behavior: "smooth"
      });
    } else if (window.scrollY > windowHeight * 2 && deltaY > 20) {
      const newpositon = Math.max(
        window.scrollY - 2 * deltaY,
        windowHeight * 2
      );
      if (newpositon === windowHeight * 2) {
        clearExistingTimeout();
      }
      window.scrollTo({
        top: newpositon,
        behavior: "smooth"
      });
    }
    
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const endY = touch.clientY;
    const deltaY = Math.round(endY - lastY);

    const changePage = (curr, pre, yscroll, timescroll) => {
      clearExistingTimeout();
      setPageState({ current: curr, previous: pre });
      setTimeout(() => {
        window.scrollTo({
          top: yscroll,
          behavior: "smooth"
        });
      }, timescroll);
    };
    const blockChange = (time) => {
      timeoutRef.current = setTimeout(() => {
        setBlockTouch(false);
      }, time);
    };

    if (Math.abs(deltaY) > 20 && !blockTouch) {
      setBlockTouch(true);
      if (window.scrollY == 0) {
        if (deltaY < 0) {
          setTimeout(() => {
            audioRef.current.play().catch((error) => {
              console.error("Unable to play audio:", error);
            });
          }, 2000);
          setPageState({ current: 1, previous: 0 });
          changePage(1, 0, windowHeight, 900);
          blockChange(6000);
        } else {
          blockChange(1);
        }
      } else if (window.scrollY == windowHeight) {
        if (deltaY < 0) {
          changePage(2, 1, windowHeight * 2, 500);
          blockChange(1000);
        } else if (deltaY > 0) {
          changePage(0, 1, 0, 500);
        }
        blockChange(3000);
      } else if (window.scrollY === windowHeight * 2 && deltaY > 0) {
        changePage(1, 2, windowHeight, 500);
        setTimeout(() => {
          audioRef.current.play().catch((error) => {
            console.error("Unable to play audio:", error);
          });
        }, 2000);
        blockChange(6000);
      } else {
        event.preventDefault();
      }
    } else if (
      Math.abs(deltaY) > 20 &&
      blockTouch &&
      window.scrollY === windowHeight * 2
    ) {
      setBlockTouch(false);
    } else {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (windowHeight) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false
      });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: false });

      return () => {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [[windowHeight, isTouch]]);

  return null;
};
