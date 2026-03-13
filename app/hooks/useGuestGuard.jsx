"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenValid } from "../../lib/token";

export default function useGuestGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/auth/login") return;

    if (isTokenValid()) {
      router.replace("/admin/dashboard");
    }
  }, [pathname, router]);
}