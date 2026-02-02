"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthHandler() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      console.log("user after login:", user);
      

      // Only admin allowed
      if (user?.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }

      // Logged in but not admin
      router.replace("/login?error=not-admin");

    } catch (err) {
      // Invalid credentials / server error
      router.replace("/error?type=login");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    hasHydrated: true,
    handleLogin,
  };
}
