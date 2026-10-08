"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  website?: string;
  user_role?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AuthContextType {
  user: User | null;
  currentOrg: Organization | null;
  credits: number;
  loading: boolean;
  toasts: ToastMessage[];
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshCredits: () => Promise<void>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshCredits = async () => {
    try {
      const data = await apiFetch<{ balance: number }>("/credits/account");
      setCredits(data.balance);
    } catch {
      // ignore if unauthenticated
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await apiFetch<User>("/auth/me");
      setUser(userData);

      const orgData = await apiFetch<Organization>("/organizations/current");
      setCurrentOrg(orgData);
      localStorage.setItem("current_org_id", orgData.id);

      await refreshCredits();
    } catch (e) {
      setUser(null);
      setCurrentOrg(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await loadUserData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("current_org_id");
    setUser(null);
    setCurrentOrg(null);
    setCredits(0);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentOrg,
        credits,
        loading,
        toasts,
        login,
        logout,
        refreshCredits,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
