"use client";

import { useMemo, useState } from "react"; // Added useState
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Added Link
import useGuestGuard from "../../app/hooks/useGuestGuard";

import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react"; // Added Eye icons
import { useAuthHandler } from "../../app/hooks/useAuthHandler";

export default function LoginClient() {
  useGuestGuard();
  const searchParams = useSearchParams();
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

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

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Login Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Email or phone"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} // Dynamic type
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              {/* Eye Icon Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold disabled:opacity-70 transition shadow-lg shadow-indigo-200"
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

        {/* Register Route Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}