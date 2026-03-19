"use client";

import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

export default function AuthInitializer() {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return null;
}