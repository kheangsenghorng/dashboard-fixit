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

  const handleLogin = async (customRedirect) => {
    try {
      if (!login || !password) {
        alert("Please enter login and password");
        return;
      }

      const user = await loginAction(login, password);

      const targetRedirect = customRedirect || redirect;

      // Redirect to requested page
      if (targetRedirect) {
        router.replace(targetRedirect);
        return;
      }

      // Role redirect
      switch (user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;

        case "owner":
          router.replace("/owner/dashboard");
          break;

        default:
          router.replace("/");
      }

    } catch (e) {
      console.error(e);
      alert("Login failed. Please check your credentials.");
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