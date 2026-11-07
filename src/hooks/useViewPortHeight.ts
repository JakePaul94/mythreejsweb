import { useEffect, useState } from "react";

export const useVisualHeight = () => {
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      // Lấy chiều cao thực tế còn lại khi bàn phím hiện lên
      setHeight(`${window.visualViewport?.height}px`);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    handleResize(); // Chạy lần đầu

    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  return height;
};