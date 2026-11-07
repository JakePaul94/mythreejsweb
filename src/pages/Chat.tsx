import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatScreen from "../components/ChatScreen";
import { apiService } from "../services/api.service";

// Home luôn mount phía sau nên các màn trạng thái phải phủ kín màn hình
const fullScreen =
  "fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white";

const Chat: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Khóa cuộn trang chủ phía sau khi chat mở
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Vào phòng chat
  useEffect(() => {
    let cancelled = false;

    apiService
      .joinClientRoom()
      .then((res) => {
        if (!cancelled) setRoomId(res.roomId);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className={`${fullScreen} gap-3`}>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className={`${fullScreen} text-slate-500`}>
        Đang vào phòng chat...
      </div>
    );
  }

  return (
    <ChatScreen
      roomId={roomId}
      roomName="Chat với Trình"
      onLeave={() => navigate("/")}
    />
  );
};

export default Chat;