import React, { createContext, useContext, useEffect, useState } from "react";

const API = "http://localhost:3000";
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  // 1. Khi mở lại site: kiểm tra cookie session còn hiệu lực không
  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, []);

  // 2. Đăng nhập Google: gửi idToken lên Backend để nhận Cookie session
  const loginWithGoogle = async (credential: string) => {
    const r = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credential }),
    });
    if (!r.ok) throw new Error("Login failed");
    const d = await r.json();
    setUser(d.user);
    return d.user;
  };

  // 3. Đăng xuất: xóa Cookie session
  const logout = async () => {
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