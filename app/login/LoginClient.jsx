"use client";

import { useAuthHandler } from "../hooks/useAuthHandler";
import { useGuestGuard } from "../hooks/useGuestGuard";
// Importing icons
import { Mail, Lock, Loader2, LogIn } from "lucide-react";

export default function Login() {
  useGuestGuard("/admin/dashboard");

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  } = useAuthHandler();

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

        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Forgot Password Link (Visual only) */}
          <div className="flex justify-end">
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
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
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}