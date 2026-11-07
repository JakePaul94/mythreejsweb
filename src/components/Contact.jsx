import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSuccess = async (response) => {
    setError("");
    try {
      if (response.credential) {
        // Gửi Google ID Token chuẩn lên Server
        await loginWithGoogle(response.credential);
        navigate("/chat");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      {/* Tiêu đề mục liên hệ */}
      <div className="text-center mb-10">
        <p className={`${styles.sectionSubText} tracking-widest uppercase text-slate-400`}>
          Get in touch
        </p>
        <h3 className={`${styles.sectionHeadText} bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent`}>
          Contact.
        </h3>
      </div>

      {/* Thẻ Kính mờ Dark Glassmorphism */}
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Vệt sáng trang trí neon phía sau */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {user ? (
          /* Trạng thái đã đăng nhập */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-3.5">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "Avatar"}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  Connected as
                </p>
                <p className="font-semibold text-white text-base truncate max-w-[180px]">
                  {user.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <MessageSquare size={17} />
              <span>Open Chat</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* Trạng thái chưa đăng nhập */
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
              <MessageSquare size={22} />
            </div>

            <h4 className="text-lg font-semibold text-white mb-1.5">
              Live Messaging
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
              Connect instantly without filling long forms. One-click sign in to chat directly with me.
            </p>

            {/* Nút Google chuẩn Dark Mode, không viền trắng, không cắt góc */}
            <div className="flex justify-center w-full min-h-[44px]">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError("Google sign-in failed. Please try again.")}
                theme="filled_black" // Nền đen chuẩn tiệp màu
                shape="pill"         // Bo cong tròn dạng viên nhộng
                size="large"
                width="280"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Fast, secure & private connection</span>
            </div>
          </div>
        )}

        {/* Thông báo lỗi nếu có */}
        {error && (
          <p className="mt-4 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center relative z-10">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");