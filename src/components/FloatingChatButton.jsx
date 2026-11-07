import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { MessageCircle, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FloatingChatButton = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAction = (e) => {
    // Ngăn chặn sự kiện lan truyền xuống Three.js / Canvas bên dưới
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Floating button triggered! User status:", user);

    if (user) {
      navigate("/chat");
    } else {
      setShowLoginModal(true);
    }
  };

  // Render thẳng vào document.body để vượt lên trên mọi Canvas của Three.js
  return createPortal(
    <div style={{ position: "relative", zIndex: 999999 }}>
      {/* Nút bấm tròn nổi */}
      <button
        type="button"
        onClick={handleAction}
        onTouchEnd={handleAction}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
          pointerEvents: "auto",
        }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer border-none outline-none"
        aria-label="Chat trực tiếp"
      >
        <MessageCircle size={28} />
      </button>

      {/* Modal đăng nhập Google */}
      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000000,
            pointerEvents: "auto",
          }}
          className="flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="relative w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-1">Trò chuyện trực tiếp</h3>
            <p className="text-xs text-slate-500 mb-5">
              Đăng nhập bằng Google để bắt đầu nhắn tin
            </p>

            <div className="flex justify-center">
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
                shape="pill"
                theme="filled_blue"
                size="large"
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