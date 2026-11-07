import React, { useRef } from "react";

/**
 * Component bọc mọi nút bấm / liên kết trên Mobile
 * Giải quyết triệt để vấn đề bị Canvas / useScrollTracker nuốt sự kiện click
 */
const Clickable = ({
  children,
  onClick,
  href,
  target,
  className = "",
  style = {},
  disabled = false,
  as: Component = "button",
  ...props
}) => {
  // Dùng cờ đo khoảng cách di chuyển để phân biệt giữa "CHẠM ĐỂ CLICK" và "VUỐT ĐỂ CUỘN TRANG"
  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handlePointerDown = (e) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    // Nếu ngón tay di chuyển quá 8px -> tính là đang vuốt cuộn trang, không kích hoạt click
    const moveX = Math.abs(e.clientX - startPos.current.x);
    const moveY = Math.abs(e.clientY - startPos.current.y);
    if (moveX > 8 || moveY > 8) {
      isDragging.current = true;
    }
  };

  const handleTrigger = (e) => {
    if (disabled || isDragging.current) return;

    // Ngăn chặn sự kiện lan ra ngoài window / useScrollTracker
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    } else if (href) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <Component
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handleTrigger}
      onClick={handleTrigger}
      disabled={disabled}
      style={{
        touchAction: "manipulation",
        pointerEvents: "auto",
        ...style,
      }}
      className={`cursor-pointer select-none relative z-30 pointer-events-auto ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Clickable;