"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
   
    if (!user) {
  
      loadUser();
    }
  }, []);

  useEffect(() => {
    if (user === null) {

      // no hard redirect now (debug mode)
    }
  }, [user]);

  return { user };
}
