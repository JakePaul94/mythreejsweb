import { useEffect } from "react";
import { useAtom } from "jotai";
import MobileDetect from "mobile-detect";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, useLocation } from "react-router-dom";

import { CanvasLoader, GlobalCanvas } from "./components";
import Contents from "./Contents";
import MobileOnlyMessage from "./components/MobileOnlyMessage"; // eslint-disable-line no-unused-vars
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import Chat from "./pages/Chat";

import { useScrollAuto } from "./hooks/useScrollTracker";
import { useFixHeight } from "./hooks/useFixHeight";
import { isLoadedAtom, typeOSAtom } from "./atoms/globalAtoms";
import { AuthProvider } from "./context/AuthContext";

function DisableScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}

// Nút chat chỉ hiện ở trang chủ "/"
const ChatButtonWrapper = () => {
  const { pathname } = useLocation();
  if (pathname !== "/") return null;
  return <FloatingChatButton />;
};

const App = () => {
  const [, setTypeOS] = useAtom(typeOSAtom);
  const [isLoaded] = useAtom(isLoadedAtom);
  const { pathname } = useLocation();

  const isChat = pathname === "/chat";

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    setTypeOS(md.os());
  }, [setTypeOS]);

  useFixHeight();

  // Tắt toàn bộ wheel/touch handler khi đang ở /chat
  useScrollAuto(!isChat);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <DisableScrollRestoration />

        {/* Home luôn mount -> không bị vỡ khi quay lại từ /chat */}
        <div
          className="w-full h-auto relative"
          aria-hidden={isChat}
          style={isChat ? { pointerEvents: "none" } : undefined}
        >
          <CanvasLoader />
          <GlobalCanvas />
          {isLoaded && <Contents />}
        </div>

        <Routes>
          <Route path="/" element={null} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ChatButtonWrapper />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;