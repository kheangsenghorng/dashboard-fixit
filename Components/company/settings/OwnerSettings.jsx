"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Loader2,
  Save,
  User,
  FileText,
  Shield,
  Bell,
  Camera,
  CheckCircle2,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import DocumentSection from "../Document/page";

import { useUserStore } from "../../../app/store/owner/useUserStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import BusinessSettings from "./BusinessSettings";

export default function OwnerSettingsPage() {
  // 1. Get current logged-in user ID from Auth Guard
  const { user: authUser } = useAuthGuard();
  const authId = authUser?.id;

  // 2. Get User Store actions and state
  const { user, fetchUser, updateUser, updateAvatar, loading } = useUserStore();

  const [activeTab, setActiveTab] = useState("profile");

  // 3. Local state strictly for the Identity structure
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    is_active: false,
    avatar: "",
  });

  useEffect(() => {
    if (!authId) return;
    fetchUser(authId);
  }, [authId, fetchUser]);

  // 5. Sync Local State with the Store data
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "owner",
        is_active: user.is_active ?? false,
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    try {
      // instant preview
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));

      await updateAvatar(user.id, file);

      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      await updateUser(user.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      });

      toast.success("Identity synchronized with server");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const renderContent = () => {
    // Show loader if fetching data for the first time
    if (loading && !user)
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Fetching Registry Data...
          </p>
        </div>
      );

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PROFILE HEADER CARD */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
                  <img
                    src={formData.avatar || "/api/placeholder/150/150"}
                    alt="User Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl cursor-pointer shadow-xl hover:scale-110 transition-all border-4 border-slate-50 z-10">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {formData.name || "Loading..."}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      formData.is_active
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {formData.is_active ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {formData.is_active
                      ? "Active Identity"
                      : "Inactive Identity"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                  System Role:{" "}
                  <span className="text-indigo-600">{formData.role}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Global Registry UID: #{formData.id || "---"}
                </p>
              </div>
            </div>

            {/* IDENTITY FORM FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Direct Contact
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  System Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="No email registered"
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        );
      case "business":
        return <BusinessSettings />;
      case "documents":
        return <DocumentSection />;
      default:
        return (
          <div className="py-20 text-center font-black text-slate-300 uppercase tracking-widest">
            Module Offline
          </div>
        );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-screen bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">
            System Console
          </h1>
        </div>

        {activeTab === "profile" && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative overflow-hidden bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center gap-3"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            PUSH IDENTITY CHANGES
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-3">
          {[
            { id: "profile", label: "Identity", icon: User },
            { id: "business", label: "Business", icon: Building2 },
            { id: "documents", label: "Documents", icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all group ${
                activeTab === item.id
                  ? "bg-white shadow-xl shadow-slate-200/50 text-indigo-600"
                  : "text-slate-400 hover:bg-white hover:text-slate-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={20}
                  className={
                    activeTab === item.id
                      ? "text-indigo-600"
                      : "text-slate-300 group-hover:text-slate-500"
                  }
                />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
              {activeTab === item.id && (
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100/50 min-h-[600px]">
            {renderContent()}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[10px] font-black text-slate-300 hover:text-indigo-600 tracking-widest uppercase flex items-center gap-2 transition-colors"
            >
              <RefreshCcw size={14} /> Back to top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
