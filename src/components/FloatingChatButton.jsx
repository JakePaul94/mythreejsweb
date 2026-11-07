import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google"; // 👉 Dùng Hook này
import { MessageSquare, X, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FloatingChatButton = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Khởi tạo hàm trigger Google Login dạng popup mượt mà
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Gửi access_token (hoặc gọi loginWithGoogle)
        await loginWithGoogle(tokenResponse.access_token || tokenResponse.code);
        setShowLoginModal(false);
        navigate("/chat");
      } catch (err) {
        console.error("Lỗi đăng nhập:", err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => console.error("Google Login Failed"),
  });

  const handleAction = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (user) {
      navigate("/chat");
    } else {
      setShowLoginModal(true);
    }
  };

  return createPortal(
    <div style={{ position: "relative", zIndex: 999999 }}>
      {/* Nút nổi */}
      <button
        type="button"
        onClick={handleAction}
        onTouchEnd={handleAction}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 999999,
          pointerEvents: "auto",
        }}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20 outline-none"
        aria-label="Direct Chat"
      >
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
        <MessageSquare size={24} className="relative z-10 transition-transform group-hover:rotate-6" />
      </button>

      {/* Modal Dark Glassmorphism */}
      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000000,
            pointerEvents: "auto",
          }}
          className="flex items-center justify-center bg-black/75 backdrop-blur-md px-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-slate-950/90 border border-white/10 p-7 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Vệt sáng trang trí */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 border border-blue-400/30 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
              <Sparkles size={22} />
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
              Direct Communication
            </h3>
            <p className="text-xs text-slate-400 mb-6 px-3 leading-relaxed">
              Sign in with your Google account to start a real-time conversation directly with me.
            </p>

            {/* 👉 NÚT GOOGLE TỰ THIẾT KẾ: KÍNH MỜ, VIỀN SÁNG, LOGO GOOGLE CHUẨN */}
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-98 transition-all duration-200 cursor-pointer text-slate-100 font-medium text-sm"
            >
              {/* Logo Google SVG sắc nét */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.14C3.25 21.37 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.26C.46 8.19 0 10.03 0 12s.46 3.81 1.26 5.41l4.02-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.59l4.02 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loading ? "Connecting..." : "Đăng nhập bằng Google"}</span>
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default FloatingChatButton;