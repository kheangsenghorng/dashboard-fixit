"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthGuard() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    if (!initialized) {
      loadUser();
    }
  }, [initialized, loadUser]);

  // ✅ No redirect here — safe to use in navbar for all users
  return { user, initialized };
}
