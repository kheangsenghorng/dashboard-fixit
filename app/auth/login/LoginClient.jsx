"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useGuestGuard from "../../hooks/useGuestGuard";
import { useAuthHandler } from "../../hooks/useAuthHandler";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";

export default function LoginClient() {
  useGuestGuard();

  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    return searchParams?.get("redirect") || null;
  }, [searchParams]);

  const { login, setLogin, password, setPassword, loading, handleLogin } =
    useAuthHandler();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    await handleLogin(redirect);
  };

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

        <form
          suppressHydrationWarning
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* Login */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="login"
                placeholder="Email or phone"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="off"
                suppressHydrationWarning
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                suppressHydrationWarning
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* Button */}
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
