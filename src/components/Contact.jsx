import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google"; // 👉 Dùng Hook
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        await loginWithGoogle(tokenResponse.access_token || tokenResponse.code);
        navigate("/chat");
      } catch (err) {
        console.error(err);
        setError("Sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in failed. Please try again."),
  });

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <div className="text-center mb-10">
        <p className={`${styles.sectionSubText} tracking-widest uppercase`}>Get in touch</p>
        <h3 className={`${styles.sectionHeadText} bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent`}>
          Contact.
        </h3>
      </div>

      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/40 p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {user ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
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
                <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">Connected as</p>
                <p className="font-semibold text-white text-base truncate max-w-[180px]">{user.name}</p>
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
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <MessageSquare size={22} />
            </div>

            <h4 className="text-lg font-semibold text-white mb-1.5">
              Live Messaging
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
              Connect instantly without filling long forms. One-click sign in to chat directly.
            </p>

            {/* 👉 NÚT GOOGLE CUSTOM: ĐỒNG BỘ 100% VỚI DARK THEME */}
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              disabled={loading}
              className="w-full max-w-xs flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/15 hover:border-cyan-400/50 shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-98 transition-all duration-200 cursor-pointer text-white font-medium text-sm"
            >
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

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Fast, secure & private connection</span>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");