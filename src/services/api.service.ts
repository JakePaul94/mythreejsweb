import { apiClient } from "../api/config";
import type { MessageDTO, JoinRoomResponseDTO } from "../type/type";
import axios from "axios";

interface ApiError {
  error?: string;
  message?: string;
}

export const apiService = {
  /**
   * 1 User = 1 Phòng (Server tự lấy user từ cookie)
   */
  async joinClientRoom(): Promise<JoinRoomResponseDTO> {
    try {
      const { data } = await apiClient.post<JoinRoomResponseDTO>(
        "/rooms/join",
        {},
        { withCredentials: true }
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiError>(error)) {
        throw new Error(error.response?.data?.error || "Lỗi kết nối phòng");
      }
      throw new Error("Lỗi không xác định");
    }
  },

  /**
   * Lấy lịch sử tin nhắn của phòng
   */
  async getMessages(roomId: string): Promise<MessageDTO[]> {
    try {
      const { data } = await apiClient.get<MessageDTO[]>(`/messages/${roomId}`, {
        withCredentials: true,
      });
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      console.error("Axios getMessages error:", error);
      return [];
    }
  },

  /**
   * Upload ảnh hoặc file đính kèm
   */
  async uploadMedia(roomId: string, file: File): Promise<MessageDTO> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await apiClient.post<MessageDTO>(
        `/media/upload/${roomId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (error: unknown) {
      throw new Error("Không thể upload file");
    }
  },
};