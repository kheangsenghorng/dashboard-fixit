"use client";

import { useAuthHandler } from "../hooks/useAuthHandler";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    hasHydrated,
    handleLogin,
  } = useAuthHandler();

  if (!hasHydrated) return null;

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button disabled={loading} onClick={handleLogin}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
