"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useOwnerStore } from "../store/owner/useOwnerStore";

export function useOwnerGuard() {
  const authUser = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loadUser = useAuthStore((s) => s.loadUser);

  const owner = useOwnerStore((s) => s.owner);
  const fetchOwner = useOwnerStore((s) => s.fetchOwner);

  useEffect(() => {
    if (!initialized) {
      loadUser();
    }
  }, [initialized, loadUser]);

  useEffect(() => {
    if (authUser?.id) {
      fetchOwner(authUser.id);
    }
  }, [authUser?.id, fetchOwner]);

  return {
    authUser,
    owner,
    ownerId: owner?.id ?? null,
    initialized,
  };
}