import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";
import type { MessageDTO } from "../type/type";

export const useChat = (roomId: string, active: boolean = true) => {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");

  useEffect(() => {
    if (!active || !roomId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    socketService.connect(socketUrl);

    const socket = socketService.socket;

    socket?.on("connect", () => {
      setConnectionStatus("connected");
      socketService.emitJoinRoom(roomId);
    });

    socket?.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socketService.onNewMessage((msg) => {
      setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));
    });

    // Nếu socket đã kết nối sẵn từ trước thì join luôn
    if (socket?.connected) {
      setConnectionStatus("connected");
      socketService.emitJoinRoom(roomId);
    }

    return () => {
      socketService.offAll();
      socketService.disconnect();
    };
  }, [active, roomId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (content.trim() && roomId) {
        socketService.emitSendMessage({
          roomId,
          content: content.trim(),
        });
      }
    },
    [roomId]
  );

  return {
    messages,
    setMessages,
    connectionStatus,
    sendMessage,
  };
};