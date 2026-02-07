"use client";

import { useState } from "react";
import { LoadingCard } from "../../Components/LoadingCard";
import { useAuthHandler } from "../hooks/useAuthHandler";
import { useGuestGuard } from "../hooks/useGuestGuard";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";

export default function Login() {
  useGuestGuard("/admin/dashboard");

  const {
    login,
    setLogin,
    password,
    setPassword,
    loading,
    handleLogin,
  } = useAuthHandler();

  // Page-level loading (optional)
  const [isPageLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    await handleLogin();
  };

  // Full-page loader (optional)
  if (isPageLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-scaffold p-6">
        <LoadingCard />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-2">
            <LogIn className="text-white w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Please enter your details to sign in</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">

          {/* Login Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email or Phone
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Email or phone"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold disabled:opacity-70 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
