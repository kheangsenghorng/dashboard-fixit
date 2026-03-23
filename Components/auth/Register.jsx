"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Loader2,
  UserPlus,
  User,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../app/store/useAuthStore";
import { useSearchParams } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const storeError = useAuthStore((s) => s.error);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "customer",
  });

  const error = localError || storeError;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (formData.password !== formData.password_confirmation) {
      setLocalError("Password confirmation does not match.");
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role,
      });

      router.push(
        `/auth/verify-otp${
          redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""
        }`
      );
    } catch (e) {
      console.error("Register error:", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-2 text-white">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-500">Create your account to continue</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPasswordConfirmation ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password_confirmation}
                onChange={(e) =>
                  handleChange("password_confirmation", e.target.value)
                }
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600 transition"
              >
                {showPasswordConfirmation ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-70 transition shadow-lg shadow-blue-200"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={
              redirect
                ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
                : "/auth/login"
            }
            className="text-blue-600 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
