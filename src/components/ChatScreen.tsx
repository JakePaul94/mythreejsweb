import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowUp,
  Smile,
  Plus,
  Image as ImageIcon,
  ThumbsUp,
  FileText,
  Download,
  Loader2,
  X,
} from "lucide-react";

import myavatar from "../assets/myavatar.jpg";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api.service";

import type { ChatProps } from "../type/chat";
import type { MessageDTO } from "../type/type";

// ======================================================
// CONFIG
// ======================================================

const GROUP_GAP_MS = 5 * 60 * 1000;

const COLORS = {
  primary: "#0b57d0",
  background: "#f8fafd",
  mine: "#d3e3fd",
  theirs: "#ffffff",
  text: "#1f1f1f",
  secondary: "#747775",
  border: "#e3e3e3",
  success: "#22c55e",
};

const responsiveCSS = `
.zchat-overlay,
.zchat-overlay * {
  box-sizing: border-box;
}

.zchat-overlay {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.zchat-messages {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.zchat-messages::-webkit-scrollbar {
  width: 4px;
}

.zchat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.zchat-btn {
  transition: background .15s, transform .12s;
}

.zchat-btn:active {
  transform: scale(.92);
}

.zchat-loading {
  animation: zchat-spin 1s linear infinite;
}

@keyframes zchat-spin {
  to { transform: rotate(360deg); }
}

@media screen and (max-width: 600px) {
  .zchat-overlay {
    padding: 0 !important;
    background: #f8fafd !important;
  }

  .zchat-window {
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .zchat-close {
    display: none !important;
  }
}
`;

// ======================================================
// UTILITIES
// ======================================================

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const dayLabel = (date: Date) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "Hôm nay";
  if (isSameDay(date, yesterday)) return "Hôm qua";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb >= 1024
    ? `${(kb / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(kb))} KB`;
};

const sortMessages = (items: MessageDTO[]) =>
  [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

// ======================================================
// COMPONENT
// ======================================================

const ChatScreen: React.FC<ChatProps> = ({
  roomId,
  roomName = "Trịnh DC",
  onLeave,
}) => {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // State lưu kích thước thật của VisualViewport khi bàn phím ảo đóng/mở
  const [viewportStyle, setViewportStyle] = useState<{
    height: string | number;
    top: number;
  }>({
    height: "100%",
    top: 0,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stickToBottom = useRef(true);
  const firstScroll = useRef(true);

  const { messages, setMessages, sendMessage, connectionStatus } = useChat(
    roomId,
    true
  );

  const isConnected = connectionStatus === "connected";

  // ----------------------------------------------------
  // FIX BÀN PHÍM ẢO TRÊN MOBILE (VISUAL VIEWPORT)
  // ----------------------------------------------------

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportChange = () => {
      setViewportStyle({
        height: vv.height,
        top: vv.offsetTop,
      });

      // Nếu đang ở cuối trang, tự cuộn xuống khi bàn phím đẩy lên
      if (stickToBottom.current) {
        requestAnimationFrame(() => {
          if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
          }
        });
      }
    };

    handleViewportChange();

    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);

    // Chặn body scroll khi đang mở chat
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      vv.removeEventListener("resize", handleViewportChange);
      vv.removeEventListener("scroll", handleViewportChange);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ----------------------------------------------------
  // LOAD HISTORY
  // ----------------------------------------------------

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const history = await apiService.getMessages(roomId);
        if (cancelled) return;

        setMessages((prev) => {
          const map = new Map<string, MessageDTO>();
          [...history, ...prev].forEach((m) => {
            if (m.id) map.set(m.id, m);
          });
          return sortMessages(Array.from(map.values()));
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Load chat history:", err);
          setError("Không thể tải lịch sử tin nhắn.");
        }
      }
    };

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [roomId, setMessages]);

  // ----------------------------------------------------
  // SCROLL
  // ----------------------------------------------------

  const scrollToBottom = useCallback((smooth = false) => {
    const element = listRef.current;
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const element = listRef.current;
    if (!element) return;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    stickToBottom.current = distance < 120;
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    const mine = !!user && last.sender?.id === user.id;

    if (firstScroll.current) {
      requestAnimationFrame(() => scrollToBottom());
      firstScroll.current = false;
      return;
    }

    if (stickToBottom.current || mine) {
      requestAnimationFrame(() => scrollToBottom(true));
    }
  }, [messages, user, scrollToBottom]);

  // ----------------------------------------------------
  // TEXTAREA RESIZE
  // ----------------------------------------------------

  const resizeInput = useCallback(() => {
    const element = inputRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 110)}px`;
  }, []);

  useEffect(() => {
    resizeInput();
  }, [text, resizeInput]);

  // ----------------------------------------------------
  // SEND & UPLOAD
  // ----------------------------------------------------

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || !isConnected || isUploading) return;

    sendMessage(content);
    setText("");

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.focus();
      }
    });
  }, [text, isConnected, isUploading, sendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const pickFile = (accept: string) => {
    if (!fileRef.current || !isConnected || isUploading) return;
    fileRef.current.accept = accept;
    fileRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !roomId) return;

    setError("");
    try {
      setIsUploading(true);
      await apiService.uploadMedia(roomId, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải tệp lên.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ----------------------------------------------------
  // RENDER MESSAGES
  // ----------------------------------------------------

  const renderBody = (message: MessageDTO, isMe: boolean) => {
    if (message.content === "👍" && message.type === "text") {
      return (
        <div style={{ fontSize: 36, lineHeight: 1.2, userSelect: "none" }}>
          👍
        </div>
      );
    }

    if (message.type === "image" && message.media?.url) {
      return (
        <a
          href={message.media.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            maxWidth: 250,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <img
            src={message.media.url}
            alt={message.media.fileName || "Image"}
            loading="lazy"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: 320,
              objectFit: "cover",
            }}
          />
        </a>
      );
    }

    if (message.type === "file" && message.media?.url) {
      return (
        <a
          href={message.media.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 16,
            background: "#fff",
            color: "#1f2937",
            textDecoration: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#e8f0fe",
              color: COLORS.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={20} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {message.media.fileName || "Tệp đính kèm"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              {formatFileSize(message.media.size)}
            </div>
          </div>
          <Download size={17} color="#64748b" />
        </a>
      );
    }

    return (
      <div
        style={{
          padding: "10px 15px",
          borderRadius: 20,
          fontSize: 14.5,
          lineHeight: 1.45,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          color: "#1f1f1f",
          background: isMe ? COLORS.mine : COLORS.theirs,
          boxShadow: isMe ? "none" : "0 1px 2px rgba(0,0,0,.05)",
        }}
      >
        {message.content}
      </div>
    );
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            textAlign: "center",
            color: "#64748b",
            padding: 24,
          }}
        >
          <img
            src={myavatar}
            alt="Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,.1)",
            }}
          />
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
            Trò chuyện trực tiếp với {roomName}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Hãy để lại lời nhắn bên dưới nhé!
          </div>
        </div>
      );
    }

    return messages.map((message, index) => {
      const prev = messages[index - 1];
      const next = messages[index + 1];

      const date = new Date(message.createdAt);
      const prevDate = prev ? new Date(prev.createdAt) : null;
      const nextDate = next ? new Date(next.createdAt) : null;

      const isMe = user
        ? message.sender?.id === user.id
        : message.sender?.role === "client";

      const sameAsPrev =
        !!prev &&
        prev.sender?.id === message.sender?.id &&
        !!prevDate &&
        isSameDay(prevDate, date) &&
        date.getTime() - prevDate.getTime() < GROUP_GAP_MS;

      const sameAsNext =
        !!next &&
        next.sender?.id === message.sender?.id &&
        !!nextDate &&
        isSameDay(nextDate, date) &&
        nextDate.getTime() - date.getTime() < GROUP_GAP_MS;

      const showDay = !prevDate || !isSameDay(prevDate, date);
      const isLast = !sameAsNext;

      return (
        <React.Fragment key={message.id || index}>
          {showDay && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "14px 0",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  color: "#475569",
                  background: "#e2e8f0",
                  fontWeight: 500,
                }}
              >
                {dayLabel(date)}
              </span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginTop: sameAsPrev ? 3 : 10,
            }}
          >
            {!isMe && (
              <div style={{ width: 28, height: 28, flexShrink: 0 }}>
                {isLast && (
                  <img
                    src={myavatar}
                    alt=""
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "78%",
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              {renderBody(message, isMe)}
              {isLast && (
                <span
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    marginTop: 3,
                    padding: "0 4px",
                  }}
                >
                  {formatTime(date)}
                </span>
              )}
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  if (typeof document === "undefined") return null;

  const content = (
    <>
      <style>{responsiveCSS}</style>

      {/* OVERLAY BÁM THEO VISUAL VIEWPORT - KHÔNG BỊ KHOẢNG ĐEN BÀN PHÍM */}
      <div
        className="zchat-overlay"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: viewportStyle.top,
          height: viewportStyle.height,
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          background: "rgba(15, 23, 42, .45)",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <section
          className="zchat-window"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 460,
            height: "min(760px, 100%)",
            background: COLORS.background,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          }}
        >
          {/* 1. HEADER THANH LỊCH KIỂU GOOGLE */}
          <header
            style={{
              display: "flex",
              alignItems: "center",
              height: 60,
              minHeight: 60,
              padding: "0 12px",
              gap: 10,
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <button
              type="button"
              className="zchat-btn"
              onClick={onLeave}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: 0,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1f1f1f",
                cursor: "pointer",
              }}
              aria-label="Quay lại"
            >
              <ArrowLeft size={22} />
            </button>

            <div style={{ position: "relative", width: 38, height: 38 }}>
              <img
                src={myavatar}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: isConnected ? COLORS.success : "#cbd5e1",
                  border: "2px solid #fff",
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1f1f1f",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {roomName}
              </div>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>
                {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
              </div>
            </div>

            <button
              type="button"
              className="zchat-btn zchat-close"
              onClick={onLeave}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: 0,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
          </header>

          {/* 2. DANH SÁCH TIN NHẮN */}
          <main
            className="zchat-messages"
            ref={listRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0",
              minHeight: 0,
              overflowY: "auto",
              padding: "16px 14px 8px",
            }}
          >
            {renderMessages()}
          </main>

          {/* THÔNG BÁO LỖI NẾU CÓ */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                style={{ border: 0, background: "none", color: "#b91c1c" }}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* 3. KHUNG NHẬP LIỆU DẠNG FLOATING CARD 2 TẦNG NHƯ GOOGLE AI */}
          <footer
            style={{
              padding: "6px 12px max(10px, env(safe-area-inset-bottom))",
              background: COLORS.background,
              flexShrink: 0,
            }}
          >
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                borderRadius: 26,
                padding: "10px 12px 8px 16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Tầng 1: Ô nhập văn bản */}
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected || isUploading}
                placeholder={
                  isUploading ? "Đang tải tệp lên..." : "Nhập tin nhắn..."
                }
                style={{
                  width: "100%",
                  minHeight: 26,
                  maxHeight: 110,
                  border: 0,
                  outline: "none",
                  resize: "none",
                  background: "transparent",
                  fontSize: 15.5,
                  lineHeight: "22px",
                  color: "#1f1f1f",
                  fontFamily: "inherit",
                  padding: "2px 0 6px",
                }}
              />

              {/* Tầng 2: Hàng nút công cụ bên dưới giống Google */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                {/* Cụm nút bên trái: + (Tệp), Ảnh, Emoji */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    className="zchat-btn"
                    onClick={() => pickFile("*/*")}
                    disabled={!isConnected || isUploading}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: 0,
                      background: "#f1f5f9",
                      color: "#334155",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Đính kèm tệp"
                  >
                    {isUploading ? (
                      <Loader2 size={18} className="zchat-loading" />
                    ) : (
                      <Plus size={20} />
                    )}
                  </button>

                  <button
                    type="button"
                    className="zchat-btn"
                    onClick={() => pickFile("image/*")}
                    disabled={!isConnected || isUploading}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: 0,
                      background: "transparent",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Gửi ảnh"
                  >
                    <ImageIcon size={20} />
                  </button>

                  <button
                    type="button"
                    className="zchat-btn"
                    onClick={() => {
                      setText((prev) => prev + "😊");
                      inputRef.current?.focus();
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: 0,
                      background: "transparent",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Biểu cảm"
                  >
                    <Smile size={20} />
                  </button>
                </div>

                {/* Cụm nút bên phải: Nút Gửi mũi tên lên hoặc Like */}
                {text.trim() ? (
                  <button
                    type="button"
                    className="zchat-btn"
                    onClick={handleSend}
                    disabled={!isConnected || isUploading}
                    style={{
                      width: 44,
                      height: 36,
                      borderRadius: 999,
                      border: 0,
                      background: "#c2e7ff",
                      color: "#001d35",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Gửi"
                  >
                    <ArrowUp size={20} strokeWidth={2.4} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="zchat-btn"
                    onClick={() => {
                      if (isConnected && !isUploading) sendMessage("👍");
                    }}
                    disabled={!isConnected || isUploading}
                    style={{
                      width: 44,
                      height: 36,
                      borderRadius: 999,
                      border: 0,
                      background: "#f1f5f9",
                      color: COLORS.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Like"
                  >
                    <ThumbsUp size={18} />
                  </button>
                )}
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default ChatScreen;