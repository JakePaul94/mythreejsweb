import { useProgress } from "@react-three/drei";
import React, { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { useAtom } from "jotai";
import { isLoadedAtom } from "../atoms/globalAtoms";
import { useFixHeight } from "../hooks/useFixHeight";

// ── 1. HỆ MẶT TRỜI ĐÃ TĂNG KÍCH THƯỚC VÀ GIÃN QUỸ ĐẠO ─────────────────
const PLANETS_DATA = [
  { r: 36, speed: 4, size: 1.8, color: "#b0aeae", label: "Mercury" },
  { r: 52, speed: 8, size: 2.8, color: "#e8d5a3", label: "Venus" },
  {
    r: 72, speed: 13, size: 3.2, color: "#4fc3f7", label: "Earth",
    moon: { dist: 6.5, size: 1.0, color: "#d4d4d4", speed: 3 },
  },
  { r: 90, speed: 20, size: 2.2, color: "#e07060", label: "Mars" },
  {
    r: 118, speed: 45, size: 6.5, color: "#f0b27a", label: "Jupiter",
    bands: true,
  },
  {
    r: 146, speed: 72, size: 5.5, color: "#d4b87a", label: "Saturn",
    rings: true,
  },
  { r: 172, speed: 110, size: 4.0, color: "#7de8e8", label: "Uranus" },
  { r: 192, speed: 155, size: 3.6, color: "#4b82e0", label: "Neptune" },
];

// ── 2. VÀNH TIỂU HÀNH TINH ───────────────
const ASTEROIDS = Array.from({ length: 80 }, (_, i) => {
  const a = (i / 80) * Math.PI * 2 + i * 0.41;
  const rr = 102 + (i % 8) * 1.5; 
  return {
    cx: Math.cos(a) * rr,
    cy: Math.sin(a) * rr,
    r: 0.3 + (i % 4) * 0.2,
    op: 0.18 + (i % 7) * 0.06,
  };
});

// ── 3. SAO NỀN ───────────────────────────
const STARS = Array.from({ length: 300 }, (_, i) => {
  const a = Math.random() * Math.PI * 2;
  const rr = 45 + Math.random() * 380;
  return {
    cx: Math.cos(a) * rr,
    cy: Math.sin(a) * rr,
    r: i % 8 === 0 ? 1.2 : i % 3 === 0 ? 0.7 : 0.4,
    op: 0.15 + Math.random() * 0.6,
    twinkle: i % 5 === 0,
    td: 1.5 + (i % 4) * 0.8,
    tdy: (i % 7) * 0.3,
  };
});

// ── Component ──────────────────────────────────────────────────────────
const CanvasLoader = () => {
  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  const svgWrapRef = useRef(null);
  const [isUnmounted, setIsUnmounted] = useState(false);
  
  // State quản lý dấu 3 chấm
  const [dots, setDots] = useState("");

  useFixHeight();

  const planets = useMemo(() => {
    return PLANETS_DATA.map((p) => ({
      ...p,
      startAngle: Math.floor(Math.random() * 360),
    }));
  }, []);

  // Effect chạy animation dấu 3 chấm
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400); // Tốc độ nhảy dấu chấm (400ms)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setIsLoaded(true), 1500);
    }
  }, [progress]);

  useEffect(() => {
    if (!isLoaded || !svgWrapRef.current) return;
    gsap.to(svgWrapRef.current, {
      scale: 44,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      transformOrigin: "center center",
      onComplete: () => setIsUnmounted(true),
    });
  }, [isLoaded]);

  if (isUnmounted) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 touch-none select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #0d0d30 0%, #07071a 50%, #020208 100%)",
      }}
    >
      {/* Tinh vân CSS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position: "absolute", left: "8%", top: "12%", width: 260, height: 180, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(70,0,140,0.13) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", right: "6%", bottom: "18%", width: 220, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,50,130,0.11) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: "30%", bottom: "8%", width: 180, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(90,0,90,0.09) 0%, transparent 70%)" }} />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-[360px] md:max-w-[480px]">
        {/* SVG wrapper */}
        <div
          ref={svgWrapRef}
          className="w-full aspect-square flex items-center justify-center"
          style={{ willChange: "transform" }}
        >
          <style>{`
            @keyframes solar-spin      { from { transform: rotate(var(--start-deg, 0deg)); } to { transform: rotate(calc(var(--start-deg, 0deg) + 360deg)); } }
            @keyframes sun-pulse       { 0%,100%{opacity:.6} 50%{opacity:1} }
            @keyframes twinkle         { 0%,100%{opacity:.15} 50%{opacity:.95} }
            @keyframes asteroid-drift  { to { transform: rotate(360deg); } }

            .orbit-group  { transform-origin: 0px 0px; animation: solar-spin linear infinite; }
            .ast-ring     { transform-origin: 0px 0px; animation: asteroid-drift 180s linear infinite; }
            .star-tw      { animation: twinkle ease-in-out infinite; }
          `}</style>

          <svg
            className="w-full h-full max-w-[360px] md:max-w-[460px]"
            viewBox="-220 -220 440 440"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <defs>
              <radialGradient id="sunGrad" cx="38%" cy="32%" r="62%">
                <stop offset="0%" stopColor="#fff9d0" />
                <stop offset="30%" stopColor="#ffe040" />
                <stop offset="65%" stopColor="#ff7800" />
                <stop offset="100%" stopColor="#d03000" />
              </radialGradient>

              <filter id="sunGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="pGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="jupiterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5deb3" />
                <stop offset="25%" stopColor="#c4783c" />
                <stop offset="50%" stopColor="#f0b27a" />
                <stop offset="75%" stopColor="#c4783c" />
                <stop offset="100%" stopColor="#e8a060" />
              </linearGradient>

              <linearGradient id="saturnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8d090" />
                <stop offset="50%" stopColor="#d4b87a" />
                <stop offset="100%" stopColor="#b89050" />
              </linearGradient>

              <linearGradient id="earthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4fc3f7" />
                <stop offset="40%" stopColor="#2e7d9c" />
                <stop offset="70%" stopColor="#3d9c5a" />
                <stop offset="100%" stopColor="#4fc3f7" />
              </linearGradient>
            </defs>

            {/* Sao nền */}
            {STARS.map((s, i) =>
              s.twinkle ? (
                <circle key={`st${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} className="star-tw" style={{ animationDuration: `${s.td}s`, animationDelay: `${s.tdy}s` }} />
              ) : (
                <circle key={`st${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
              )
            )}

            {/* Đường quỹ đạo */}
            {planets.map((p, i) => (
              <circle key={`orb${i}`} cx="0" cy="0" r={p.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            ))}

            {/* Vành tiểu hành tinh */}
            <g className="ast-ring">
              {ASTEROIDS.map((a, i) => (
                <circle key={`a${i}`} cx={a.cx} cy={a.cy} r={a.r} fill="#aaa8a0" opacity={a.op} />
              ))}
            </g>

            {/* Hành tinh */}
            {planets.map((p, i) => (
              <g
                key={`pg${i}`}
                className="orbit-group"
                style={{ animationDuration: `${p.speed}s`, "--start-deg": `${p.startAngle}deg` }}
              >
                <circle cx={p.r} cy="0" r={p.size} fill={ i === 4 ? "url(#jupiterGrad)" : i === 5 ? "url(#saturnGrad)" : i === 2 ? "url(#earthGrad)" : p.color } filter="url(#pGlow)" />
                <circle cx={p.r - p.size * 0.28} cy={-p.size * 0.28} r={p.size * 0.32} fill="white" opacity="0.18" />

                {p.rings && (
                  <>
                    <ellipse cx={p.r} cy="0" rx={p.size * 2.0} ry={p.size * 0.45} fill="none" stroke="rgba(210,185,120,0.6)" strokeWidth="1.6" />
                    <ellipse cx={p.r} cy="0" rx={p.size * 2.5} ry={p.size * 0.55} fill="none" stroke="rgba(195,165,100,0.3)" strokeWidth="0.8" />
                  </>
                )}

                {p.moon && (
                  <g className="orbit-group" style={{ animationDuration: `${p.moon.speed}s`, transformOrigin: `${p.r}px 0px` }}>
                    <circle cx={p.r + p.moon.dist} cy="0" r={p.moon.size} fill={p.moon.color} opacity="0.8" />
                  </g>
                )}
              </g>
            ))}

            {/* Mặt trời */}
            <circle cx="0" cy="0" r="24" fill="url(#sunGrad)" filter="url(#sunGlow)" />

          </svg>
        </div>

        {/* ── Text và Thanh Progress Bar phía dưới ── */}
        <div className="flex fixed bottom-7 flex-col items-center gap-2 text-center text-white px-2 w-full max-w-[200px] sm:max-w-[250px]">
          <p className="text-[10px] sm:text-[11px] tracking-widest uppercase opacity-60">
            Trình DC — My personal web
          </p>

          {/* Thanh Tiến trình (Progress Bar) */}
          <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dòng chữ chờ với 3 chấm động */}
          <p className="text-[9px] sm:text-[10px] opacity-40 tracking-wide flex items-center justify-center">
            Vui lòng chờ vài giây để tải dữ liệu
            {/* Cố định width của span để chữ không bị giật (nhảy qua lại) khi thêm dấu chấm */}
            <span className="inline-block w-3 text-left">{dots}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanvasLoader;