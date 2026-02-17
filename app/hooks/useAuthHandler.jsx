"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthHandler() {
  const router = useRouter();
  const params = useSearchParams();

  const redirect = params.get("redirect");

  const loginAction = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginAction(login, password);

      // Redirect to requested page
      if (redirect) {
        router.replace(redirect);
        return;
      }

      // Default role redirect
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else if (user.role === "owner") {
        router.replace("/owner/dashboard");
      }
    } catch (e) {
      alert("Login failed");
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
