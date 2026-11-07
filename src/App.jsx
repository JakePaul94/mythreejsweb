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

/**
 * Chặn mọi cử chỉ vuốt / lăn chuột / phím cuộn khi `locked = true`.
 * Dùng pha capture + stopPropagation để chặn cả các listener khác trên window.
 */
function useLockGestures(locked) {
  useEffect(() => {
    if (!locked) return;

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onKey = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    const opts = { passive: false, capture: true };
    const events = ["wheel", "touchstart", "touchmove", "touchend"];

    events.forEach((ev) => window.addEventListener(ev, stop, opts));
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
      events.forEach((ev) => window.removeEventListener(ev, stop, opts));
      window.removeEventListener("keydown", onKey);
    };
  }, [locked]);
}

// Nút chat chỉ hiện ở trang chủ "/" và sau khi load xong
const ChatButtonWrapper = ({ isLoaded }) => {
  const { pathname } = useLocation();
  if (pathname !== "/" || !isLoaded) return null;
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

  // Chưa load xong ở trang chủ -> khóa vuốt/cuộn
  useLockGestures(!isLoaded && !isChat);

  // Chỉ bật cuộn tự động khi đã load xong và không ở /chat
  useScrollAuto(isLoaded && !isChat);

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

        <ChatButtonWrapper isLoaded={isLoaded} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;