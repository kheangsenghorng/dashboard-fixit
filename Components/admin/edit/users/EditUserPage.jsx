"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, User, Mail, Phone, 
  ShieldCheck, CheckCircle, XCircle, Camera,
  Fingerprint, Briefcase, Globe, Loader2
} from 'lucide-react';
import Image from "next/image";
import { useUsersStore } from '../../../../app/store/useUsersStore';
import { toast } from "react-toastify";

const EditUserPage = ({ userData, onBack }) => {
  const updateUser = useUsersStore((s) => s.updateUser);
  const updateAvatar = useUsersStore((s) => s.updateAvatar);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    is_active: true,
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sync state if userData is loaded or changed
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'customer',
        is_active: userData.is_active ?? true,
        avatar: userData.avatar || null,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(userData.id, formData);
      toast.success("User updated successfully");
      onBack();
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Assuming updateAvatar returns the updated user object or URL
      const response = await updateAvatar(userData.id, file);
      
      // Update local preview
      if (response?.avatar) {
        setFormData(prev => ({ ...prev, avatar: response.avatar }));
      } else {
        // Fallback: create local URL if your API doesn't return the new URL immediately
        setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
      }
      toast.success("Avatar updated");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* NAVIGATION & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="group p-2.5 bg-white border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Fingerprint size={14} />
              <span>User ID: {userData?.id || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
                Discard Changes
            </button>
            
            {/* LINKED TO FORM VIA ID */}
            <button
                type="submit"
                form="edit-user-form"
                disabled={loading || uploading}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:opacity-50 active:scale-95"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Updating...' : 'Save Profile'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center">
                        {formData.avatar ? (
                            <Image
                                src={formData.avatar}
                                alt="Profile"
                                fill
                                loading="eager"
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <span className="text-4xl font-bold text-indigo-400">
                                {formData.name?.charAt(0) || 'U'}
                            </span>
                        )}

                        {/* Uploading Overlay */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="text-white animate-spin" size={24} />
                            </div>
                        )}
                    </div>

                    <label className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full border-4 border-white shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                        <Camera size={16} />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
                
                <div className="text-center space-y-1">
                    <h2 className="text-lg font-bold text-slate-900">{formData.name || 'Full Name'}</h2>
                    <p className="text-sm text-slate-500 truncate">{formData.email}</p>
                    <div className="pt-4 flex justify-center">
                        <StatusBadge isActive={formData.is_active} />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">System Role</span>
                        <span className="text-indigo-600 font-bold uppercase tracking-wider text-[10px] bg-indigo-50 px-2 py-1 rounded-md">{formData.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Region</span>
                        <span className="text-slate-700 font-semibold flex items-center gap-1"><Globe size={14}/> Global</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: FORM FIELDS */}
        <div className="lg:col-span-2">
            <form id="edit-user-form" onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    
                    {/* Basic Information Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <User size={16} />
                            </div>
                            <h3 className="font-bold text-slate-800">Account Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">User Permission Role</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="provider">Provider</option>
                                        <option value="owner">Company</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Account Security Section */}
                    <section className="pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                <Briefcase size={16} />
                            </div>
                            <h3 className="font-bold text-slate-800">Account Control</h3>
                        </div>

                        <div className={`p-5 rounded-2xl border transition-all ${formData.is_active ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.is_active ? 'bg-white text-emerald-600 shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                        {formData.is_active ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Login Accessibility</p>
                                        <p className="text-sm text-slate-500">
                                            {formData.is_active 
                                                ? 'Account is active and verified.' 
                                                : 'Account is currently locked/inactive.'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

function StatusBadge({ isActive }) {
    return isActive ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Account
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
        <XCircle size={12} /> Suspended
      </span>
    );
}

export default EditUserPage;