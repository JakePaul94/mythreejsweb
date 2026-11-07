import { io, Socket } from "socket.io-client";
import type { MessageDTO } from "../type/type";

class SocketService {
  public socket: Socket | null = null;

  connect = (url: string) => {
  if (this.socket?.connected) return;

  const token = localStorage.getItem("token");

  this.socket = io(url, {
    withCredentials: true,
    auth: {
      token: token, // 👉 Truyền token vào auth của Socket
    },
    transports: ["websocket", "polling"],
  });
};

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };

  emitJoinRoom = (roomId: string) => {
    this.socket?.emit("join_room", { roomId });
  };

  emitSendMessage = (data: { roomId: string; content: string }) => {
    this.socket?.emit("send_message", {
      roomId: data.roomId,
      content: data.content,
      type: "text",
    });
  };

  onNewMessage = (callback: (message: MessageDTO) => void) => {
    this.socket?.on("new_message", callback);
  };

  offAll = () => {
    this.socket?.removeAllListeners();
  };
}

export const socketService = new SocketService();