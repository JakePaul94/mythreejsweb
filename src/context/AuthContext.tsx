// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://trinhdc.site";
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  // 1. Kiểm tra session khi mở lại web
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${API}/api/auth/me`, {
      credentials: "include",
      headers,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setUser(d.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, []);

  // 2. Đăng nhập Google
  const loginWithGoogle = async (credential: string) => {
    const r = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credential }),
    });

    if (!r.ok) throw new Error("Login failed");

    const d = await r.json();

    // 👉 LƯU TOKEN VÀO LOCALSTORAGE
    if (d.token) {
      localStorage.setItem("token", d.token);
      console.log("--> [FE] Đã lưu token vào LocalStorage!");
    }

    setUser(d.user);
    return d.user;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};