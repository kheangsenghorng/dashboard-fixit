"use client";

import { useEffect } from "react";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";

export default function OwnerDashboard() {
  useRoleGuard(["owner"]);

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loadUser = useAuthStore((s) => s.loadUser);

  // Load user on refresh
  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user, loadUser]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Prevent UI flicker
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Owner Dashboard</h1>
      <p>Welcome, {user.name}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
