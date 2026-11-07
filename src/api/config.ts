// src/api/config.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://trinhdc.site";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động lấy token từ LocalStorage gắn vào Header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});