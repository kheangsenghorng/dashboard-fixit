"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { useMounted } from "./useMounted";
import { getToken } from "../../lib/token";

export function useAuthGuard(redirectTo = "/login") {
  const router = useRouter();
  const mounted = useMounted();

  const { user, loading, loadUser } = useAuthStore();

  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  // Load user once mounted
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const run = async () => {
      const token = getToken();

      if (token) {
        await loadUser();
      }

      if (!cancelled) {
        setReady(true);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [mounted, loadUser]);

  // Redirect logic MUST live in effect
  useEffect(() => {
    if (!mounted || loading || !ready) return;

    const token = getToken();

    if (!token && !user) {
      router.replace(redirectTo).then(() => {
        setError("not-authenticated");
      });
      return;
    }

    if (user && user.role !== "admin") {
      router.replace("/login?error=not-admin").then(() => {
        setError("not-admin");
      });
    }
  }, [mounted, loading, ready, user, router, redirectTo]);

  if (!mounted || loading || !ready) {
    return { user: null, ready: false, error: null };
  }

  return { user, ready: true, error };
}
