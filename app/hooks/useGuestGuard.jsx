"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../lib/token";

export function useGuestGuard(redirectTo = "/") {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    // If already logged in → go home
    if (token) {
      router.replace(redirectTo);
    }
  }, []);

  return {};
}
