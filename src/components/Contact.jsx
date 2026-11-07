import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

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
      await loginWithGoogle(response.credential);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <div>
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        {user ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {user.picture && (
                <img
                  src={user.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs text-secondary">Signed in as</p>
                <p className="truncate font-medium text-white">{user.name}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <MessageCircle size={16} />
              Message me
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-secondary">
              Sign in with Google to chat with me directly.
            </p>
            <div className="self-start">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError("Google sign-in failed.")}
                theme="filled_blue"
                shape="pill"
                locale="en"
              />
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");