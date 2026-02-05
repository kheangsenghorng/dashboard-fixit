"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthHandler() {
  const router = useRouter();
  const params = useSearchParams();

  const redirect = params.get("redirect") || "/admin/dashboard";

  const loginAction = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginAction(login, password);

      console.log("🎯 Redirecting to:", redirect);

      router.replace(redirect);
    } catch (e) {
      console.error("Login failed");
    }
  };

  return {
    login,
    setLogin,
    password,
    setPassword,
    loading,
    handleLogin,
  };
}
