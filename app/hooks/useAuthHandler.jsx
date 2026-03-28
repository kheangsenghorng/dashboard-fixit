"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const loginAction = useAuthStore((s) => s.login);
  const setOtpContext = useAuthStore((s) => s.setOtpContext);
  const setError = useAuthStore((s) => s.setError);
  const loading = useAuthStore((s) => s.loading);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (customRedirect) => {
    if (!login || !password) {
      setError("Please enter your login and password.");
      return;
    }

    try {
      const data = await loginAction(login, password);

      setOtpContext({
        login: data.login ?? login,
        channel: data.channel ?? "phone",
        redirect: customRedirect ?? redirect ?? "/",
      });

      router.replace("/auth/verify-otp");
      return data;
    } catch {
      return null;
    }
  };

  return { login, setLogin, password, setPassword, loading, handleLogin };
}
