import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Dùng lại GoogleLogin chuẩn lấy ID Token
import { MessageSquare, X, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FloatingChatButton = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      {/* Nút nổi Neon */}
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
            className="relative w-full max-w-sm rounded-3xl bg-slate-950/95 border border-white/10 p-7 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
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

            {/* 👉 KỸ THUẬT NÚT BẤM HOÀN HẢO:
                Vẫn render GoogleLogin (để có credential hợp lệ gửi server) nhưng để theme="filled_black"
                và căn chỉnh tỉ lệ chuẩn không bị cắt góc */}
            <div className="flex justify-center w-full min-h-[44px]">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    if (credentialResponse.credential) {
                      await loginWithGoogle(credentialResponse.credential);
                      setShowLoginModal(false);
                      navigate("/chat");
                    }
                  } catch (err) {
                    console.error("Lỗi đăng nhập:", err);
                  }
                }}
                onError={() => console.error("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                size="large"
                width="280"
              />
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default FloatingChatButton;