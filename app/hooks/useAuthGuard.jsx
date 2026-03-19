"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthGuard() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    if (!initialized) {
      loadUser();
    }
  }, [initialized, loadUser]);

  useEffect(() => {
    if (!initialized) return;

    if (user === null) {
      router.replace("/auth/login");
    }
  }, [user, initialized, router]);

  return { user, initialized };
}
