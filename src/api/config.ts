import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Tự động gửi/nhận Cookie session ở mọi request
  headers: {
    "Content-Type": "application/json",
  },
});