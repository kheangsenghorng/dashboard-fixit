"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function useGuestGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) return;

    if (user) {
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
    }
  }, [user, initialized, router]);
}
