"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../api/client";

// Helper to set cookie
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper to get cookie
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Helper to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("auth_token");
    const role = getCookie("user_role");
    const savedUser = localStorage.getItem("superadmin_user");

    if (token && role === "superadmin" && savedUser) {
      setUser(JSON.parse(savedUser));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("super-admin/login", {
        email,
        password,
      });

      const { data } = response.data;
      const { token, user } = data;

      setCookie("auth_token", token);
      setCookie("user_role", "superadmin");
      localStorage.setItem("superadmin_user", JSON.stringify(user));

      setUser(user);
      setStatus("authenticated");
      router.push("/");
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("super-admin/logout");
    } catch (e) {
      // Ignore logout error if token already invalid
    } finally {
      deleteCookie("auth_token");
      deleteCookie("user_role");
      localStorage.removeItem("superadmin_user");
      setUser(null);
      setStatus("unauthenticated");
      router.push("/login");
    }
  };

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
  };
}
