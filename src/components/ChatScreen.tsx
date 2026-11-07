
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
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  ThumbsUp,
  FileText,
  Download,
  Loader2,
  MoreVertical,
  X,
} from "lucide-react";

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
  primary: "#0878f9",
  primaryDark: "#0068e8",
  background: "#f0f2f5",
  mine: "#dceaff",
  theirs: "#ffffff",
  text: "#1e293b",
  secondary: "#94a3b8",
  border: "#e8edf3",
  success: "#22c55e",
};

// ======================================================
// RESPONSIVE CSS - CÙNG FILE
// ======================================================

const responsiveCSS = `
.zchat-overlay,
.zchat-overlay * {
  box-sizing: border-box;
}

.zchat-overlay {
  -webkit-tap-highlight-color: transparent;
}

.zchat-messages {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  overscroll-behavior: contain;
}

.zchat-messages::-webkit-scrollbar {
  width: 5px;
}

.zchat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.zchat-icon-btn,
.zchat-tool-btn,
.zchat-send-btn,
.zchat-like-btn,
.zchat-emoji-btn {
  transition: background .2s, color .2s, transform .15s;
}

.zchat-icon-btn:hover {
  background: rgba(255,255,255,.16) !important;
}

.zchat-tool-btn:hover,
.zchat-like-btn:hover,
.zchat-emoji-btn:hover {
  background: #f1f5f9 !important;
}

.zchat-send-btn:hover {
  background: #0866df !important;
}

.zchat-icon-btn:active,
.zchat-tool-btn:active,
.zchat-send-btn:active,
.zchat-like-btn:active {
  transform: scale(.93);
}

.zchat-loading {
  animation: zchat-spin 1s linear infinite;
}

@keyframes zchat-spin {
  to { transform: rotate(360deg); }
}

/* Mobile */

@media screen and (max-width: 600px) {
  .zchat-overlay {
    padding: 0 !important;
    background: #fff !important;
  }

  .zchat-window {
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    height: 100dvh !important;
    min-height: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .zchat-header {
    height: 60px !important;
    min-height: 60px !important;
    padding-left: 8px !important;
    padding-right: 10px !important;
  }

  .zchat-close {
    display: none !important;
  }

  .zchat-messages {
    padding: 14px 10px !important;
  }

  .zchat-composer {
    padding-left: 6px !important;
    padding-right: 6px !important;
    padding-bottom: max(8px, env(safe-area-inset-bottom)) !important;
  }

  .zchat-message-column {
    max-width: 82% !important;
  }
}

@media screen and (max-width: 360px) {
  .zchat-header {
    gap: 5px !important;
  }

  .zchat-tool-btn {
    width: 31px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zchat-overlay *,
  .zchat-overlay *::before,
  .zchat-overlay *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
`;

// ======================================================
// STYLESHEET OBJECT
// ======================================================

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background: "rgba(15, 23, 42, .45)",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  window: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 460,
    height: "min(760px, 100%)",
    minHeight: 0,
    overflow: "hidden",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,.18)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    height: 68,
    minHeight: 68,
    padding: "0 14px",
    gap: 11,
    color: "#fff",
    background: "linear-gradient(120deg, #0068ff, #1685ff)",
    zIndex: 2,
  },

  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    flexShrink: 0,
    padding: 0,
    border: 0,
    borderRadius: "50%",
    color: "#fff",
    background: "transparent",
    cursor: "pointer",
  },

  avatarWrapper: {
    position: "relative",
    width: 42,
    height: 42,
    flexShrink: 0,
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    background: "#fff",
  },

  onlineIndicator: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 13,
    height: 13,
    borderRadius: "50%",
    border: "2px solid #1685ff",
  },

  headerInfo: {
    flex: 1,
    minWidth: 0,
  },

  headerName: {
    overflow: "hidden",
    fontSize: 15,
    fontWeight: 650,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  headerStatus: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    fontSize: 11,
    color: "rgba(255,255,255,.85)",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },

  messages: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minHeight: 0,
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    padding: 18,
    background: COLORS.background,
  },

  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 220,
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 68,
    height: 68,
    marginBottom: 16,
    borderRadius: "50%",
    color: COLORS.primary,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(0,0,0,.06)",
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: 650,
    color: "#334155",
  },

  emptyDescription: {
    marginTop: 5,
    fontSize: 12,
    color: "#8492a6",
  },

  dayDivider: {
    display: "flex",
    justifyContent: "center",
    margin: "12px 0 18px",
  },

  dayLabel: {
    padding: "5px 12px",
    borderRadius: 20,
    color: "#fff",
    background: "rgba(100,116,139,.65)",
    fontSize: 10.5,
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    width: "100%",
    marginTop: 12,
  },

  messageAvatar: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: 28,
    height: 28,
    flexShrink: 0,
  },

  messageColumn: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "78%",
    minWidth: 0,
  },

  messageContent: {
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
  },

  bubble: {
    padding: "10px 13px",
    borderRadius: 18,
    fontSize: 14,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    boxShadow: "0 1px 2px rgba(0,0,0,.06)",
  },

  time: {
    marginTop: 4,
    padding: "0 4px",
    color: "#94a3b8",
    fontSize: 10,
  },

  imageLink: {
    display: "block",
    maxWidth: 260,
    overflow: "hidden",
    borderRadius: 13,
  },

  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: 340,
    width: "auto",
    objectFit: "cover",
    borderRadius: 13,
  },

  fileCard: {
    display: "flex",
    alignItems: "center",
    width: 240,
    maxWidth: "100%",
    gap: 10,
    padding: 12,
    borderRadius: 13,
    color: "#334155",
    background: "#fff",
    textDecoration: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,.07)",
  },

  fileIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    flexShrink: 0,
    borderRadius: 10,
    color: COLORS.primary,
    background: "#e8f1ff",
  },

  fileInfo: {
    flex: 1,
    minWidth: 0,
  },

  fileName: {
    overflow: "hidden",
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  fileSize: {
    marginTop: 4,
    color: "#94a3b8",
    fontSize: 10,
  },

  error: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "9px 14px",
    color: "#b91c1c",
    background: "#fef2f2",
    borderTop: "1px solid #fecaca",
    fontSize: 12,
  },

  composer: {
    display: "flex",
    alignItems: "flex-end",
    flexShrink: 0,
    width: "100%",
    gap: 5,
    padding: "10px 12px",
    paddingBottom: "max(10px, env(safe-area-inset-bottom))",
    borderTop: `1px solid ${COLORS.border}`,
    background: "#fff",
  },

  hiddenInput: {
    display: "none",
  },

  composerActions: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexShrink: 0,
  },

  toolButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 40,
    flexShrink: 0,
    border: 0,
    borderRadius: "50%",
    color: COLORS.primary,
    background: "transparent",
    cursor: "pointer",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    flex: 1,
    minWidth: 0,
    padding: "5px 10px",
    border: "1px solid transparent",
    borderRadius: 20,
    background: "#f0f2f5",
  },

  textarea: {
    display: "block",
    flex: 1,
    minWidth: 0,
    minHeight: 30,
    maxHeight: 120,
    padding: "5px 2px",
    resize: "none",
    border: 0,
    outline: "none",
    color: COLORS.text,
    background: "transparent",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: "20px",
    overflowY: "auto",
  },

  emojiButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 29,
    height: 30,
    flexShrink: 0,
    border: 0,
    color: "#94a3b8",
    background: "transparent",
    cursor: "pointer",
  },

  sendButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    flexShrink: 0,
    border: 0,
    borderRadius: "50%",
    color: "#fff",
    background: COLORS.primary,
    cursor: "pointer",
  },

  likeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    flexShrink: 0,
    border: 0,
    borderRadius: "50%",
    color: COLORS.primary,
    background: "transparent",
    cursor: "pointer",
  },

  likeMessage: {
    padding: "2px 5px",
    fontSize: 37,
    lineHeight: 1.3,
    userSelect: "none",
  },
};

// ======================================================
// UTILITIES
// ======================================================

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTime = (date: Date) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const dayLabel = (date: Date) => {
  const now = new Date();
  const yesterday = new Date();

  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "Hôm nay";
  if (isSameDay(date, yesterday)) return "Hôm qua";

  return date.toLocaleDateString("vi-VN");
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
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

// ======================================================
// COMPONENT
// ======================================================

const ChatScreen: React.FC<ChatProps> = ({
  roomId,
  roomName = "Trịnh (Hỗ trợ)",
  onLeave,
}) => {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stickToBottom = useRef(true);
  const firstScroll = useRef(true);

  const {
    messages,
    setMessages,
    sendMessage,
    connectionStatus,
  } = useChat(roomId, true);

  const isConnected = connectionStatus === "connected";

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

          [...history, ...prev].forEach((message) => {
            if (message.id) {
              map.set(message.id, message);
            }
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
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;

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
  // TEXTAREA
  // ----------------------------------------------------

  const resizeInput = useCallback(() => {
    const element = inputRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    resizeInput();
  }, [text, resizeInput]);

  // ----------------------------------------------------
  // SEND MESSAGE
  // ----------------------------------------------------

  const handleSend = useCallback(() => {
    const content = text.trim();

    if (!content || !isConnected || isUploading) return;

    sendMessage(content);
    setText("");

    requestAnimationFrame(() => {
      resizeInput();
      inputRef.current?.focus();
    });
  }, [text, isConnected, isUploading, sendMessage, resizeInput]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // ----------------------------------------------------
  // UPLOAD
  // ----------------------------------------------------

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
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải tệp lên."
      );
    } finally {
      setIsUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  // ----------------------------------------------------
  // RENDER MESSAGE BODY
  // ----------------------------------------------------

  const renderBody = (
    message: MessageDTO,
    isMe: boolean
  ) => {
    if (message.content === "👍" && message.type === "text") {
      return (
        <div style={styles.likeMessage}>
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
          style={styles.imageLink}
        >
          <img
            src={message.media.url}
            alt={message.media.fileName || "Ảnh"}
            loading="lazy"
            style={styles.image}
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
          style={styles.fileCard}
        >
          <div style={styles.fileIcon}>
            <FileText size={23} />
          </div>

          <div style={styles.fileInfo}>
            <div style={styles.fileName}>
              {message.media.fileName || "Tệp đính kèm"}
            </div>

            <div style={styles.fileSize}>
              {formatFileSize(message.media.size)}
            </div>
          </div>

          <Download size={18} color="#94a3b8" />
        </a>
      );
    }

    return (
      <div
        style={{
          ...styles.bubble,
          color: isMe ? "#172b4d" : "#1f2937",
          background: isMe ? COLORS.mine : COLORS.theirs,
        }}
      >
        {message.content}
      </div>
    );
  };

  // ----------------------------------------------------
  // RENDER MESSAGES
  // ----------------------------------------------------

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <Smile size={36} />
          </div>

          <div style={styles.emptyTitle}>
            Chưa có tin nhắn
          </div>

          <div style={styles.emptyDescription}>
            Gửi lời chào để bắt đầu trò chuyện nhé!
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

      const showDay =
        !prevDate || !isSameDay(prevDate, date);

      const isLast = !sameAsNext;

      const bubbleStyle: CSSProperties = {
        ...styles.bubble,
        color: isMe ? "#172b4d" : "#1f2937",
        background: isMe ? COLORS.mine : COLORS.theirs,

        borderTopLeftRadius:
          !isMe && sameAsPrev ? 6 : 18,

        borderTopRightRadius:
          isMe && sameAsPrev ? 6 : 18,

        borderBottomLeftRadius:
          !isMe && sameAsNext ? 6 : 18,

        borderBottomRightRadius:
          isMe && sameAsNext ? 6 : 18,
      };

      return (
        <React.Fragment key={message.id || index}>
          {showDay && (
            <div style={styles.dayDivider}>
              <span style={styles.dayLabel}>
                {dayLabel(date)}
              </span>
            </div>
          )}

          <div
            style={{
              ...styles.messageRow,
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginTop: sameAsPrev ? 3 : 12,
            }}
          >
            {!isMe && (
              <div style={styles.messageAvatar}>
                {isLast && (
                  message.sender?.picture ? (
                    <img
                      src={message.sender.picture}
                      alt=""
                      referrerPolicy="no-referrer"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: COLORS.primary,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {message.sender?.name?.charAt(0) || "T"}
                    </div>
                  )
                )}
              </div>
            )}

            <div
              className="zchat-message-column"
              style={{
                ...styles.messageColumn,
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageContent,
                  borderRadius: 18,
                }}
              >
                {message.type === "text" &&
                message.content !== "👍" ? (
                  <div style={bubbleStyle}>
                    {message.content}
                  </div>
                ) : (
                  renderBody(message, isMe)
                )}
              </div>

              {isLast && (
                <span style={styles.time}>
                  {formatTime(date)}
                </span>
              )}
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  // ----------------------------------------------------
  // PORTAL
  // ----------------------------------------------------

  if (typeof document === "undefined") return null;

  const content = (
    <>
      <style>{responsiveCSS}</style>

      <div
        className="zchat-overlay"
        style={styles.overlay}
      >
        <section
          className="zchat-window"
          style={styles.window}
          aria-label="Cửa sổ trò chuyện"
        >
          {/* HEADER */}

          <header
            className="zchat-header"
            style={styles.header}
          >
            <button
              type="button"
              className="zchat-icon-btn"
              style={styles.iconButton}
              onClick={onLeave}
              aria-label="Quay lại"
            >
              <ArrowLeft size={23} />
            </button>

            <div style={styles.avatarWrapper}>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Trinh"
                alt="Avatar"
                style={styles.avatar}
              />

              <span
                style={{
                  ...styles.onlineIndicator,
                  background: isConnected
                    ? COLORS.success
                    : "#cbd5e1",
                }}
              />
            </div>

            <div style={styles.headerInfo}>
              <div style={styles.headerName}>
                {roomName}
              </div>

              <div style={styles.headerStatus}>
                <span
                  style={{
                    ...styles.statusDot,
                    background: isConnected
                      ? "#4ade80"
                      : "#cbd5e1",
                  }}
                />

                {isConnected
                  ? "Đang hoạt động"
                  : "Đang kết nối..."}
              </div>
            </div>

            <button
              type="button"
              className="zchat-icon-btn"
              style={styles.iconButton}
              aria-label="Tùy chọn"
            >
              <MoreVertical size={22} />
            </button>

            <button
              type="button"
              className="zchat-icon-btn zchat-close"
              style={styles.iconButton}
              onClick={onLeave}
              aria-label="Đóng chat"
            >
              <X size={21} />
            </button>
          </header>

          {/* MESSAGE LIST */}

          <main
            className="zchat-messages"
            ref={listRef}
            onScroll={handleScroll}
            style={styles.messages}
          >
            {renderMessages()}
          </main>

          {/* ERROR */}

          {error && (
            <div style={styles.error}>
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#b91c1c",
                  cursor: "pointer",
                }}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* COMPOSER */}

          <footer
            className="zchat-composer"
            style={styles.composer}
          >
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />

            <div style={styles.composerActions}>
              <button
                type="button"
                className="zchat-tool-btn"
                style={styles.toolButton}
                onClick={() => pickFile("image/*")}
                disabled={!isConnected || isUploading}
                aria-label="Gửi ảnh"
              >
                {isUploading ? (
                  <Loader2
                    size={21}
                    className="zchat-loading"
                  />
                ) : (
                  <ImageIcon size={22} />
                )}
              </button>

              <button
                type="button"
                className="zchat-tool-btn"
                style={styles.toolButton}
                onClick={() => pickFile("*/*")}
                disabled={!isConnected || isUploading}
                aria-label="Đính kèm tệp"
              >
                <Paperclip size={22} />
              </button>
            </div>

            <div
              style={styles.inputWrapper}
              onFocus={() => {
                // Focus styling
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected || isUploading}
                placeholder={
                  isUploading
                    ? "Đang tải tệp lên..."
                    : "Nhập tin nhắn..."
                }
                style={styles.textarea}
              />

              <button
                type="button"
                className="zchat-emoji-btn"
                style={styles.emojiButton}
                onClick={() => {
                  setText((prev) => prev + "😊");
                  inputRef.current?.focus();
                }}
                aria-label="Emoji"
              >
                <Smile size={22} />
              </button>
            </div>

            {text.trim() ? (
              <button
                type="button"
                className="zchat-send-btn"
                style={{
                  ...styles.sendButton,
                  opacity: !isConnected || isUploading ? 0.4 : 1,
                }}
                onClick={handleSend}
                disabled={!isConnected || isUploading}
                aria-label="Gửi"
              >
                <Send size={19} />
              </button>
            ) : (
              <button
                type="button"
                className="zchat-like-btn"
                style={{
                  ...styles.likeButton,
                  opacity: !isConnected || isUploading ? 0.4 : 1,
                }}
                onClick={() => {
                  if (isConnected && !isUploading) {
                    sendMessage("👍");
                  }
                }}
                disabled={!isConnected || isUploading}
                aria-label="Thả like"
              >
                <ThumbsUp size={23} />
              </button>
            )}
          </footer>
        </section>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default ChatScreen;
