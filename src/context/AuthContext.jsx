"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("fundora_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setStoredUser = (userData, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fundora_token", token);
      localStorage.setItem("fundora_user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const loadUserFromStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("fundora_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("fundora_token") : null;
    let cancelled = false;

    const init = async () => {
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/auth/me");
        if (cancelled) return;
        setUser(res.data.user);
        localStorage.setItem("fundora_user", JSON.stringify(res.data.user));
      } catch {
        if (cancelled) return;
        const cached = loadUserFromStorage();
        if (cached) setUser(cached);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();

    const onLogout = () => setUser(null);
    window.addEventListener("fundora-auth-logout", onLogout);
    return () => {
      cancelled = true;
      window.removeEventListener("fundora-auth-logout", onLogout);
    };
  }, [loadUserFromStorage]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setStoredUser(res.data.user, res.data.token);
    return res.data.user;
  };

  const register = async ({ name, email, password, image, role }) => {
    const res = await api.post("/api/auth/register", { name, email, password, image, role });
    setStoredUser(res.data.user, res.data.token);
    return res.data.user;
  };

  const googleSignIn = useCallback(async (credential) => {
    const res = await api.post("/api/auth/google", { credential });
    setStoredUser(res.data.user, res.data.token);
    return res.data.user;
  }, []);

  const logout = () => {
    localStorage.removeItem("fundora_token");
    localStorage.removeItem("fundora_user");
    setUser(null);
    router.push("/");
  };

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
      localStorage.setItem("fundora_user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleSignIn, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
