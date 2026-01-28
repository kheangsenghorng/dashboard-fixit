"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthGuard(redirectTo = "/login") {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const loadUser = useAuthStore((s) => s.loadUser);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (hasHydrated && !user) {
      loadUser();
    }
  }, [hasHydrated, loadUser, user]);

  // Still hydrating or checking auth
  if (!hasHydrated || loading) {
    return { user: null, ready: false };
  }

  // Not authenticated
  if (!user) {
    router.replace(redirectTo);
    return { user: null, ready: false };
  }

  // Authenticated
  return { user, ready: true };
}
