import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { pageStateAtom, windowHeightAtom } from "../atoms/globalAtoms";

/**
 * @param {boolean} enabled - false khi đang ở /chat để không chặn wheel/touch
 */
export const useScrollAuto = (enabled = true) => {
  const [, setPageState] = useAtom(pageStateAtom);
  const [windowHeight] = useAtom(windowHeightAtom);
  const [, setBlockTouch] = useState(false);

  const timeoutRef = useRef(null); // timer mở khóa block
  const scrollTimerRef = useRef(null); // timer scrollTo trong changePage
  const audioTimerRef = useRef(null); // timer phát audio
  const audioRef = useRef(null);
  const blockRef = useRef(false);
  const lastYRef = useRef(0);
  const lastWheelRef = useRef(0); // thời điểm wheel event gần nhất

  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio("./display.mp3");
  }

  const clearExistingTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const playAudio = (delay = 2000) => {
    clearTimeout(audioTimerRef.current);
    audioTimerRef.current = setTimeout(() => {
      audioRef.current
        ?.play()
        .catch((err) => console.error("Unable to play audio:", err));
    }, delay);
  };

  const blockChange = (time) => {
    blockRef.current = true;
    setBlockTouch(true);
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => {
      blockRef.current = false;
      setBlockTouch(false);
    }, time);
  };

  const changePage = (curr, prev, yscroll, timescroll) => {
    clearExistingTimeout();
    setPageState({ current: curr, previous: prev });

    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      window.scrollTo({ top: yscroll, behavior: "smooth" });
    }, timescroll);
  };

  useEffect(() => {
    if (!enabled || !windowHeight) return;

    /**
     * Logic chuyển trang dùng chung cho touch + wheel.
     * direction: "down" | "up"
     * Trả về true nếu đã xử lý chuyển trang.
     */
    const handleDirection = (direction) => {
      const scrollSnap =
        Math.round(window.scrollY / windowHeight) * windowHeight;

      if (scrollSnap === 0) {
        if (direction === "down") {
          playAudio(2000);
          changePage(1, 0, windowHeight, 900);
          blockChange(6000);
          return true;
        }
        return false;
      }

      if (scrollSnap === windowHeight) {
        if (direction === "down") {
          changePage(2, 1, windowHeight * 2, 500);
          blockChange(1000);
        } else {
          changePage(0, 1, 0, 500);
          blockChange(3000);
        }
        return true;
      }

      if (scrollSnap === windowHeight * 2 && direction === "up") {
        changePage(1, 2, windowHeight, 500);
        playAudio(2000);
        blockChange(6000);
        return true;
      }

      return false;
    };

    /* ================= TOUCH (mobile) ================= */
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
      const isBlocked = blockRef.current;

      if (
        Math.abs(deltaY) > 20 &&
        isBlocked &&
        window.scrollY === windowHeight * 2
      ) {
        blockRef.current = false;
        setBlockTouch(false);
        return;
      }

      if (Math.abs(deltaY) <= 20 || isBlocked) {
        e.preventDefault();
        return;
      }

      // vuốt lên (deltaY < 0) = cuộn xuống
      const handled = handleDirection(deltaY < 0 ? "down" : "up");
      if (!handled) e.preventDefault();
    };

    /* ================= WHEEL (desktop) ================= */
    const handleWheel = (e) => {
      const now = performance.now();
      const isNewGesture = now - lastWheelRef.current > 150;
      lastWheelRef.current = now;

      // Firefox có thể trả deltaMode = 1 (đơn vị dòng)
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

      const freeStart = windowHeight * 2;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;

      /* ---- Vùng nội dung (từ màn 3 trở đi): tự cuộn ---- */
      if (y >= freeStart - 100) {
        e.preventDefault();

        // Cuộn xuống: xem nội dung
        if (delta > 0) {
          window.scrollTo({
            top: Math.min(y + delta, maxScroll),
            behavior: "instant",
          });
          return;
        }

        // Cuộn lên nhưng chưa tới đỉnh màn 3
        if (y > freeStart + 5) {
          window.scrollTo({
            top: Math.max(y + delta, freeStart),
            behavior: "instant",
          });
          return;
        }

        // Đã ở đỉnh màn 3 mà vẫn cuộn lên: quay về trang 2
        if (!blockRef.current && isNewGesture) handleDirection("up");
        return;
      }

      /* ---- Màn 1 và 2: tự điều khiển chuyển trang ---- */
      e.preventDefault();
      if (blockRef.current) return;
      if (Math.abs(delta) < 10) return;

      handleDirection(delta > 0 ? "down" : "up");
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);

      // Dọn trạng thái dở dang để không bắn sau khi sang /chat
      clearExistingTimeout();
      clearTimeout(scrollTimerRef.current);
      clearTimeout(audioTimerRef.current);
      blockRef.current = false;
      setBlockTouch(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowHeight, enabled]);

  return null;
};