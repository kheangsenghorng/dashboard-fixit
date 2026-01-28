"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthHandler() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (hasHydrated && user && !loading) {
      router.replace("/admin");
    }
  }, [hasHydrated, user, loading, router]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      alert("Login failed");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    hasHydrated,
    handleLogin,
  };
}
