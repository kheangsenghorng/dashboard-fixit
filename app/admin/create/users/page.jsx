"use client";

import React, { useState } from "react";
import { 
  UserPlus, ArrowLeft, Mail, Lock, Shield, 
  User, UserCog, ShieldCheck, AlertCircle, Loader2,
  Eye, EyeOff 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUsersStore } from "../../../store/useUsersStore";
import BulkUserImport from "../../../../Components/admin/BulkUserImport";
import AdminShell from "../../AdminShell";

// --- Toast Imports ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateUserPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manual"); 
  const [errors, setErrors] = useState({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialFormState = {
    name: "", 
    email: "", 
    password: "", 
    password_confirmation: "", 
    role: "customer"
  };

  const [formData, setFormData] = useState(initialFormState);
  const { createUser, importUsers, loading } = useUsersStore();

  const roles = [
    { id: "customer", label: "Customer", desc: "Standard access", icon: User },
    { id: "owner", label: "Owner", desc: "Manage content", icon: UserCog },
    { id: "provider", label: "Provider", desc: "Service access", icon: ShieldCheck },
  ];

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    const createdName = formData.name; // keep name before reset
  
    try {
      await toast.promise(createUser(formData), {
        pending: "Creating user...",
        success: `User ${createdName} created successfully!`,
        error: "Failed to create user",
      });
  
      // ✅ only reset after success
      setFormData(initialFormState);
    } catch (err) {
      // ✅ set errors here (NOT inside toast render)
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
  
      toast.error(err?.response?.data?.message || "Failed to create user");
    }
  };
  

  const handleExcelImport = async (fileData) => {
    setErrors({});
  
    try {
      await toast.promise(importUsers(fileData), {
        pending: "Importing users...",
        success: "Bulk import completed successfully! 🎉",
        error: "Import failed. Please check the file format.",
      });
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
  
      toast.error(err?.response?.data?.message || "Import failed");
    }
  };
  
  return (
    <AdminShell>
      <div className="p-6 text-slate-900">
        <ToastContainer position="top-right" autoClose={4000} />

        {/* Header Area */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <button 
              onClick={() => router.back()} 
              className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-2 font-medium"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Directory
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Add New User</h1>
          </div>

          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex border border-slate-200">
            <button 
              onClick={() => setActiveTab("manual")} 
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "manual" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"}`}
            >
              Single User
            </button>
            <button 
              onClick={() => setActiveTab("excel")} 
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "excel" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"}`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {activeTab === "manual" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: ROLE SELECTOR */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-lg font-bold px-1 text-slate-800">Determine Role</h2>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button 
                      key={role.id} 
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })} 
                      className={`w-full text-left cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${formData.role === role.id ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-white bg-white hover:border-slate-200 shadow-sm"}`}
                    >
                      <div className={`p-2 rounded-lg ${formData.role === role.id ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                        <role.icon size={20} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${formData.role === role.id ? "text-indigo-900" : "text-slate-700"}`}>{role.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: FORM FIELDS */}
              <form onSubmit={handleManualSubmit} className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                        placeholder="e.g. John Doe"
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name[0]}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                        placeholder="email@example.com"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.email[0]}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                        placeholder="••••••••"
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password[0]}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                        placeholder="••••••••"
                        value={formData.password_confirmation} 
                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-8">
                  <p className="text-xs text-slate-400 max-w-[240px] text-center md:text-left">
                    An invitation email will be sent to the user to set up their account.
                  </p>
                  <button 
                    type="submit"
                    disabled={loading} 
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20}/>} 
                    Create User
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <BulkUserImport
              onImport={handleExcelImport} 
              loading={loading} 
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}