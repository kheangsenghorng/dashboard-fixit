"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Loader2,
  Save,
  User,
  FileText,
  Camera,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  LayoutDashboard,
  CreditCard,
  Fingerprint,
} from "lucide-react";
import { toast } from "react-toastify";

import DocumentSection from "../Document/page";
import BusinessSettings from "./BusinessSettings";
import PaymentAccountDisplay from "./payment-account-display";
import { useUserStore } from "../../../app/store/owner/useUserStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

export default function OwnerSettingsPage() {
  const { user: authUser } = useAuthGuard();
  const authId = authUser?.id;
  const { user, fetchUser, updateUser, updateAvatar, loading } = useUserStore();

  const [activeTab, setActiveTab] = useState("profile");
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
    if (authId) fetchUser(authId);
  }, [authId, fetchUser]);

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
    try {
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      await updateAvatar(user.id, file);
      toast.success("Avatar synchronized");
    } catch (error) {
      toast.error("Upload failed");
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
      toast.success("Identity updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const renderContent = () => {
    if (loading && !user)
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Decrypting Registry...
          </span>
        </div>
      );

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* AVATAR & IDENTITY HEADER */}
            <div className="relative flex flex-col md:flex-row items-center gap-10 p-10 bg-gradient-to-br from-slate-50 to-white rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-[6px] border-white shadow-2xl ring-1 ring-slate-200">
                  <img
                    src={formData.avatar || "/api/placeholder/150/150"}
                    alt="Avatar"
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <label className="absolute bottom-1 right-1 p-3 bg-slate-900 text-white rounded-full cursor-pointer shadow-xl hover:bg-blue-600 transition-colors border-4 border-white">
                  <Camera size={20} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.is_active
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-rose-500"
                    }`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {formData.is_active
                      ? "Verified Core Identity"
                      : "Inactive Access"}
                  </span>
                </div>

                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  {formData.name || "Accessing..."}
                </h2>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      System Role
                    </p>
                    <p className="text-sm font-bold text-blue-600 uppercase">
                      {formData.role}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 hidden md:block" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Registry ID
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {/* Updated Fix Here */}#
                      {formData.id
                        ? String(formData.id).slice(0, 8)
                        : "00000000"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* INPUT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 px-4">
              {[
                {
                  label: "Display Name",
                  name: "name",
                  type: "text",
                  icon: User,
                },
                {
                  label: "Direct Phone",
                  name: "phone",
                  type: "text",
                  icon: Fingerprint,
                },
                {
                  label: "Email Address",
                  name: "email",
                  type: "email",
                  icon: LayoutDashboard,
                },
              ].map((field, idx) => (
                <div
                  key={field.name}
                  className={`group space-y-3 ${
                    idx === 2 ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 ml-1">
                    <field.icon
                      size={12}
                      className="text-slate-300 group-focus-within:text-blue-500 transition-colors"
                    />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full py-4 px-0 bg-transparent border-b-2 border-slate-100 font-bold text-slate-800 placeholder:text-slate-300 focus:border-blue-600 outline-none transition-all text-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "business":
        return <BusinessSettings />;
      case "documents":
        return <DocumentSection />;
      case "paymenat-account":
        return <PaymentAccountDisplay />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:px-12">
        {/* HEADER AREA */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <div className="w-10 h-[2px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Configuration
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-950">
              Settings<span className="text-blue-600">.</span>
            </h1>
          </div>

          {activeTab === "profile" && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase hover:bg-blue-600 transition-all hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save Identity
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT NAVIGATION */}
          <nav className="lg:col-span-3 flex flex-col gap-2">
            {[
              { id: "profile", label: "Identity", icon: User },
              { id: "business", label: "Business", icon: Building2 },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "paymenat-account", label: "Payments", icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-slate-950 text-white shadow-2xl shadow-slate-300 scale-[1.05]"
                    : "hover:bg-slate-50 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={18}
                    className={
                      activeTab === item.id
                        ? "text-blue-400"
                        : "group-hover:text-slate-600"
                    }
                  />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight
                  size={14}
                  className={
                    activeTab === item.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 transition-opacity"
                  }
                />
              </button>
            ))}
          </nav>

          {/* RIGHT CONTENT PANEL */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-[4rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-slate-50 min-h-[700px]">
              {renderContent()}
            </div>

            <footer className="mt-12 flex justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-all"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                  Back to Summit
                </span>
                <div className="w-1 h-6 bg-slate-400 group-hover:bg-blue-600 transition-colors" />
              </button>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
