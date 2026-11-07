import { apiClient } from "../api/config";
import type { MessageDTO, JoinRoomResponseDTO } from "../type/type";
import axios from "axios";

export const apiService = {
  async joinClientRoom(): Promise<JoinRoomResponseDTO> {
    console.log("--> [FE STEP 3] Đang gọi POST /api/rooms/join...");
    try {
      const { data } = await apiClient.post<JoinRoomResponseDTO>(
        "/rooms/join",
        {},
        { withCredentials: true }
      );
      console.log("--> [FE STEP 3] Vào phòng thành công! RoomId:", data.roomId);
      return data;
    } catch (error: any) {
      console.error(
        "--> [FE STEP 3 ERROR] Lỗi vào phòng chat:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Lỗi kết nối phòng");
    }
  },

  async getMessages(roomId: string): Promise<MessageDTO[]> {
    console.log("--> [FE STEP 4] Đang lấy lịch sử tin nhắn roomId:", roomId);
    try {
      const { data } = await apiClient.get<MessageDTO[]>(`/messages/${roomId}`, {
        withCredentials: true,
      });
      console.log("--> [FE STEP 4] Lấy tin nhắn thành công, số lượng:", data.length);
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("--> [FE STEP 4 ERROR] Lỗi lấy tin nhắn:", error.message);
      return [];
    }
  },

  async uploadMedia(roomId: string, file: File): Promise<MessageDTO> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<MessageDTO>(
      `/media/upload/${roomId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },
};