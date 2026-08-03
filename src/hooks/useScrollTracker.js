import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { pageStateAtom, windowHeightAtom } from "../atoms/globalAtoms";
import { useSwipeable } from "react-swipeable";

export const useScrollAuto = () => {
  const [pageState, setPageState] = useAtom(pageStateAtom);
  const [windowHeight] = useAtom(windowHeightAtom);
  const [blockTouch, setBlockTouch] = useState(false);
  const [lastY, setLastY] = useState(0);

  const timeoutRef = useRef(null);
  const audioRef = useRef(new Audio("./display.mp3"));
  // Dùng ref thay state để tránh stale closure trong event listener
  const blockTouchRef = useRef(false);
  const lastYRef = useRef(0);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const playAudio = (delay = 2000) => {
    setTimeout(() => {
      audioRef.current.play().catch((err) =>
        console.error("Unable to play audio:", err)
      );
    }, delay);
  };

  const blockChange = (time) => {
    blockTouchRef.current = true;
    setBlockTouch(true);
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => {
      blockTouchRef.current = false;
      setBlockTouch(false);
    }, time);
  };

  // Dùng window.scrollTo native — giữ nguyên behavior cho Three.js
  const changePage = (curr, prev, yscroll, timescroll) => {
    clearExistingTimeout();
    setPageState({ current: curr, previous: prev });
    setTimeout(() => {
      window.scrollTo({ top: yscroll, behavior: "smooth" });
    }, timescroll);
  };

  useEffect(() => {
    if (!windowHeight) return;

    const handleTouchStart = (e) => {
      lastYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const deltaY = e.touches[0].clientY - lastYRef.current;
      e.preventDefault();

      if (window.scrollY >= windowHeight * 2 - 100 && deltaY < -20) {
        window.scrollTo({
          top: window.scrollY - 2 * deltaY,
          behavior: "smooth",
        });
      } else if (window.scrollY > windowHeight * 2 && deltaY > 20) {
        const newPos = Math.max(window.scrollY - 2 * deltaY, windowHeight * 2);
        if (newPos === windowHeight * 2) clearExistingTimeout();
        window.scrollTo({ top: newPos, behavior: "smooth" });
      }
    };

    const handleTouchEnd = (e) => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = Math.round(endY - lastYRef.current);

      // Fix stale closure: đọc từ ref thay vì state
      const isBlocked = blockTouchRef.current;

      // Unblock nếu đang ở section 2 (free scroll zone)
      if (Math.abs(deltaY) > 20 && isBlocked && window.scrollY === windowHeight * 2) {
        blockTouchRef.current = false;
        setBlockTouch(false);
        return;
      }

      if (Math.abs(deltaY) <= 20 || isBlocked) {
        e.preventDefault();
        return;
      }

      // Dùng scrollY snapshot để tránh floating point lệch 1-2px
      const scrollSnap = Math.round(window.scrollY / windowHeight) * windowHeight;

      if (scrollSnap === 0) {
        if (deltaY < 0) {
          playAudio(2000);
          changePage(1, 0, windowHeight, 900);
          blockChange(6000);
        } else {
          blockChange(1);
        }
      } else if (scrollSnap === windowHeight) {
        if (deltaY < 0) {
          changePage(2, 1, windowHeight * 2, 500);
          blockChange(1000);
        } else {
          changePage(0, 1, 0, 500);
          blockChange(3000);
        }
      } else if (scrollSnap === windowHeight * 2 && deltaY > 0) {
        changePage(1, 2, windowHeight, 500);
        playAudio(2000);
        blockChange(6000);
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [windowHeight]);

  return null;
};