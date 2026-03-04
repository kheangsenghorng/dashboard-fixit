"use client";
import React, { useState, useRef } from 'react';
import { Layers, Save, ArrowLeft, Camera, CheckCircle2, XCircle, Trash2, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useCategoryStore } from '../../../../app/store/useCategoryStore';
import { toast } from "react-toastify";
import ContentLoader from '../../../ContentLoader';
import { AnimatePresence, motion } from 'framer-motion';

export default function CreateServiceCategoryPage() {
  const { createCategory } = useCategoryStore();
  
  const [formData, setFormData] = useState({
    name: '',
    category_group: 'service',
    status: 'active',
    icon: null
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    if (e.target.value.length <= 255) {
      setFormData({ ...formData, name: e.target.value });
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        toast.error("Image too large. Max 2MB allowed.");
        return;
      }
      setFormData({ ...formData, icon: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeIcon = () => {
    setFormData({ ...formData, icon: null });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category_group", formData.category_group);
      data.append("status", formData.status);
      if (formData.icon) data.append("icon", formData.icon);

      await createCategory(data);
      toast.success("Service category created successfully!");
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <ContentLoader title="Processing" subtitle="Creating your service category..." Icon={Sparkles} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto">
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/admin/categories" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all mb-8 group">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                <ArrowLeft size={16} /> 
            </div>
            Back to Categories
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-10 pb-2 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">New Service</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">Configure your category properties</p>
            </div>
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                <Layers size={28} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* ICON UPLOAD (THE FACE) */}
            <div className="relative flex justify-center py-4">
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !preview && fileInputRef.current.click()}
                  className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center overflow-hidden cursor-pointer border-2 transition-all shadow-inner
                    ${preview ? 'border-indigo-100 bg-white' : 'border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300'}`}
                >
                  {preview ? (
                    <img src={preview} alt="Icon Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                             <Camera size={32} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Face</span>
                    </div>
                  )}
                </motion.div>

                {preview && (
                  <button 
                    type="button" 
                    onClick={removeIcon}
                    className="absolute -top-3 -right-3 bg-white text-rose-500 p-2.5 rounded-2xl shadow-xl border border-slate-100 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                
                {!preview && (
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                        <ShieldCheck size={16} />
                    </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleIconChange} />
            </div>

            <div className="space-y-6">
              {/* NAME */}
              <div className="group space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Service Label</label>
                <div className="relative">
                    <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Premium Mechanic" 
                    className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-[6px] focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm placeholder:text-slate-300" 
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <Globe size={18} className="text-slate-200 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                </div>
              </div>

              {/* STATUS TOGGLE */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block text-center">Visibility Status</label>
                <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center max-w-[280px] mx-auto border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'active'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] tracking-wider transition-all ${
                      formData.status === 'active' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/50' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2 size={14} /> ACTIVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'inactive'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] tracking-wider transition-all ${
                      formData.status === 'inactive' ? 'bg-white text-slate-600 shadow-md' : 'text-slate-400'
                    }`}
                  >
                    <XCircle size={14} /> HIDDEN
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? "Syncing Database..." : (
                  <>
                    <Save size={18} />
                    Deploy Category
                  </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="text-center text-slate-400 text-[10px] mt-8 font-bold uppercase tracking-[0.2em]"
        >
          Secure Admin Module • Group: Service Only
        </motion.p>
      </div>
    </div>
  );
}