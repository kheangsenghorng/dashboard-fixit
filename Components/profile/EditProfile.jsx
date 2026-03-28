"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Camera,
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useRequireAuth } from "../../app/hooks/useRequireAuth";
import { useProfileStore } from "../../app/store/customer/useProfileStore";

const EditProfilePage = () => {
  const { user: authUser, initialized } = useRequireAuth();
  const { loading, error, updateProfile, updateAvatar } = useProfileStore();

  const fileInputRef = useRef(null);

  // States

  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Initialize form when user data loads
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.name || authUser.login || "",
        email: authUser.email || "",
        phone: authUser.phone || authUser.mobile || "",
      });
    }
  }, [authUser]);

  // Check if user has changed anything (Dirty State)
  const isDirty = useMemo(() => {
    if (!authUser) return false;
    return (
      formData.fullName !== (authUser.name || authUser.login || "") ||
      formData.phone !== (authUser.phone || authUser.mobile || "")
    );
  }, [formData, authUser]);

  if (!initialized || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // --- Handlers ---

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // NO REFRESH LOGIC: Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      await updateAvatar(authUser.id, file);
      // Success Notification
      toast.success("Photo updated successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      setPreviewUrl(null);
      toast.error("Failed to upload photo.", { id: uploadToast });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(authUser.id, {
        name: formData.fullName,
        phone: formData.phone,
      });
      // Success Notification
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error("Something went wrong while saving.");
      console.error("Save failed", err);
    }
  };

  const avatarSrc = previewUrl || authUser.avatar || authUser.image;
  const avatarLetter = (formData.fullName || "U").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest mb-3">
              <ShieldCheck size={16} />
              Verified Account
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Edit Profile
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Avatar Card */}
          <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="relative w-40 h-40 bg-indigo-50 rounded-[2.8rem] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden transition-transform group-hover:scale-[1.02]">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="User"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-6xl font-black text-indigo-600">
                    {avatarLetter}
                  </span>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2
                      className="animate-spin text-indigo-600"
                      size={32}
                    />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute -bottom-2 -right-2 bg-indigo-600 p-4 rounded-2xl shadow-xl text-white hover:bg-indigo-700 transition-all active:scale-90 disabled:bg-slate-300"
              >
                <Camera size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="text-center md:text-left space-y-3">
              <h3 className="text-2xl font-black text-slate-900">
                Profile Photo
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-sm font-medium">
                Upload a professional photo. JPG or PNG.
                <br />
                Your photo will be updated{" "}
                <span className="text-indigo-600 font-bold">instantly</span>.
              </p>
            </div>
          </section>

          {/* Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              label="Full Name"
              icon={<User size={20} />}
              value={formData.fullName}
              onChange={(val) => setFormData({ ...formData, fullName: val })}
              placeholder="Your name"
            />

            <FormField
              label="Email Address"
              icon={<Mail size={20} />}
              value={formData.email}
              disabled
              footerText="Verified email cannot be changed."
            />

            <FormField
              label="Phone Number"
              icon={<Phone size={20} />}
              value={formData.phone}
              onChange={(val) => setFormData({ ...formData, phone: val })}
              placeholder="+1 (000) 000-0000"
            />

            <div className="bg-indigo-600/5 rounded-[2rem] p-8 border border-indigo-100/50 flex flex-col justify-center">
              <h4 className="font-black text-indigo-900 mb-1">
                Address & Security
              </h4>
              <p className="text-indigo-600/70 text-sm font-bold flex items-center gap-2 cursor-pointer hover:underline">
                Manage your saved locations <ChevronRight size={14} />
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-6">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  fullName: authUser.name || authUser.login || "",
                  email: authUser.email || "",
                  phone: authUser.phone || authUser.mobile || "",
                })
              }
              className="font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={loading || !isDirty}
              className={`flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black transition-all shadow-xl
                ${
                  !isDirty || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {loading ? "Updating..." : "Save Profile"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Reusable Form Input Component
 */
const FormField = ({
  label,
  icon,
  value,
  onChange,
  disabled,
  placeholder,
  footerText,
}) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
      {label}
    </label>
    <div className="relative group">
      <div
        className={`absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors
        ${
          disabled
            ? "text-slate-300"
            : "text-slate-300 group-focus-within:text-indigo-500"
        }
      `}
      >
        {icon}
      </div>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-16 pl-16 pr-6 rounded-2xl border transition-all font-bold text-slate-700 outline-none
          ${
            disabled
              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50/30"
          }`}
      />
    </div>
    {footerText && (
      <p className="text-[10px] text-slate-400 ml-2 font-bold">{footerText}</p>
    )}
  </div>
);

export default EditProfilePage;
