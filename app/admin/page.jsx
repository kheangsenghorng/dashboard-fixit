"use client";

import { useAuthGuard } from "../hooks/useAuthGuard";

export default function Admin() {
  const { user, ready } = useAuthGuard();

  if (!ready) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user.name}</p>
    </div>
  );
}
