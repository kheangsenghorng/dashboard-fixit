"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenValid } from "../../lib/token";

export function useGuestGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/login") return;

    if (isTokenValid()) {
      router.replace("/admin/dashboard");
    }
  }, [pathname, router]);
}
