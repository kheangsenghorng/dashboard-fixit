"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useRoleGuard(allowedRoles) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    if (!allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else if (user.role === "owner") {
        router.replace("/owner/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, allowedRoles, router]);
}
