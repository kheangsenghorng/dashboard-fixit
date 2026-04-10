"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Plus,
  X,
  DollarSign,
  Clock,
  ImageIcon,
  FileText,
  Layout,
  ChevronRight,
  RotateCcw,
  Zap,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Hooks & Stores (Assuming these paths remain the same)
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";
import ContentLoader from "../../ContentLoader";

export default function CreateServicePage() {
  const router = useRouter();
  const { user: authUser } = useAuthGuard();
  const { createService, owners = [], fetchOwners } = useServiceStoreCompany();
  const {
    activeTypes = [],
    categories = [],
    fetchActiveCategories,
    fetchActiveTypes,
  } = useTypeStoreCompany();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    type_id: "",
    base_price: "",
    duration: "",
    owner_id: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchActiveCategories();
    if (authUser?.role === "admin") fetchOwners();
  }, []);

  useEffect(() => {
    if (formData.category_id) fetchActiveTypes(formData.category_id);
  }, [formData.category_id]);

  const filteredCategories = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const progress = useMemo(() => {
    let p = 0;
    if (formData.category_id) p += 25;
    if (formData.type_id) p += 25;
    if (formData.title && formData.base_price) p += 25;
    if (previews.length > 0) p += 25;
    return p;
  }, [formData, previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (key === "images") return;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            data.append(`${key}[]`, item);
          });
          return;
        }

        data.append(key, value);
      });

      imageFiles.forEach((file) => {
        if (file instanceof File) {
          data.append("images[]", file);
        }
      });

      const res = await createService(data);
      console.log(res);

      if (res.success) {
        toast.success("Service live!");
        router.push(
          authUser?.role === "admin" ? "/admin/services" : "/owner/services"
        );
      }
    } catch (error) {
      console.error("Create service error:", error);

      const errors = error?.response?.data?.errors;

      if (errors) {
        // Get first validation error message
        const firstError = Object.values(errors)?.flat()?.[0];

        toast.error(firstError || "Validation failed");
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Error creating service"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ContentLoader
        title="Syncing Network"
        subtitle="Deploying your new service to the marketplace..."
      />
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* MODERN BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-40">
        {/* TOP NAV BAR */}
        <nav className="flex items-center justify-between mb-16">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-slate-300">
              <ArrowLeft size={18} />
            </div>
            <span className="font-semibold text-sm">Back to Dashboard</span>
          </motion.button>

          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border-2 border-white ${
                    progress >= i * 25 ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
              {progress}% Complete
            </span>
          </div>
        </nav>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
              Marketplace Entry
            </span>
            <h1 className="text-6xl font-black tracking-tight text-slate-900">
              Create{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Service
              </span>
            </h1>
          </motion.div>
        </header>

        <form id="service-form" onSubmit={handleSubmit} className="space-y-10">
          {/* STEP 1: CATEGORY SELECTION */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <Layers size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Service Classification</h2>
                  <p className="text-sm text-slate-500">
                    Define your niche and specialization
                  </p>
                </div>
              </div>
              {formData.category_id && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, category_id: "", type_id: "" }))
                  }
                  className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                >
                  Reset Selection
                </button>
              )}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {!formData.category_id ? (
                  <motion.div
                    key="cat-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="relative mb-8">
                      <Search
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        placeholder="Search categories..."
                        className="w-full bg-slate-100/50 border-transparent rounded-2xl py-4 pl-14 pr-6 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredCategories.map((cat) => (
                        <motion.button
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({ ...p, category_id: cat.id }))
                          }
                          className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-md transition-all text-center"
                        >
                          <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 rounded-2xl p-3 group-hover:bg-indigo-50 transition-colors">
                            <Image
                              src={cat.icon}
                              width={64}
                              height={64}
                              className="object-contain"
                              alt=""
                              unoptimized
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                            {cat.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="type-grid"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              type_id: type.id.toString(),
                            }))
                          }
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                            formData.type_id === type.id.toString()
                              ? "border-indigo-600 bg-indigo-50/50"
                              : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                            <Image
                              src={type.icon}
                              width={48}
                              height={48}
                              className="object-cover"
                              alt=""
                              unoptimized
                            />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="font-bold text-slate-900 truncate">
                              {type.name}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                              Select
                            </p>
                          </div>
                          {formData.type_id === type.id.toString() && (
                            <CheckCircle2
                              size={18}
                              className="ml-auto text-indigo-600"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* STEP 2: CONTENT & LOGISTICS */}
          <AnimatePresence>
            {formData.type_id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
                {/* Details Card */}
                <div className="lg:col-span-8 space-y-8">
                  <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="text-indigo-600" size={20} />
                      <h3 className="text-lg font-bold">Service Details</h3>
                    </div>

                    {authUser?.role === "admin" && (
                      <div className="grid grid-cols-1 gap-2">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">
                          Account Owner
                        </label>
                        <select
                          value={formData.owner_id}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              owner_id: e.target.value,
                            }))
                          }
                          className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="">Select Partner Account...</option>
                          {owners.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.business_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">
                        Service Title
                      </label>
                      <input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="e.g., Premium Studio Portrait Session"
                        className="w-full text-3xl font-black outline-none placeholder:text-slate-200 border-b-2 border-slate-100 focus:border-indigo-600 transition-colors pb-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Explain what makes this service unique..."
                        className="w-full p-5 bg-slate-50 rounded-2xl border-none font-medium outline-none resize-none leading-relaxed focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </section>

                  <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="text-indigo-600" size={20} />
                        <h3 className="text-lg font-bold">Portfolio Media</h3>
                      </div>
                      <label className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        <span className="flex items-center gap-2">
                          <Plus size={14} /> Add Images
                        </span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {previews.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center">
                        <p className="text-slate-400 font-medium">
                          No images uploaded yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {previews.map((src, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100"
                          >
                            <Image
                              src={src}
                              fill
                              className="object-cover"
                              alt=""
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFiles((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                                setPreviews((prev) =>
                                  prev.filter((_, idx) => idx !== i)
                                );
                              }}
                              className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                {/* Logistics Column */}
                <div className="lg:col-span-4 space-y-6">
                  <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-10">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Zap size={18} className="text-indigo-400" /> Logistics
                      </h3>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Base Rate
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-indigo-400">
                            $
                          </span>
                          <input
                            type="number"
                            value={formData.base_price}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                base_price: e.target.value,
                              }))
                            }
                            placeholder="0"
                            className="bg-transparent text-5xl font-black outline-none w-full placeholder:text-slate-700"
                          />
                          <span className="text-sm font-bold text-slate-500 uppercase">
                            USD
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Duration
                        </p>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                          <Clock size={20} className="text-indigo-400" />
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                duration: e.target.value,
                              }))
                            }
                            placeholder="Min"
                            className="bg-transparent text-2xl font-bold outline-none w-20 placeholder:text-slate-700"
                          />
                          <span className="text-xs font-bold text-slate-400 uppercase">
                            Minutes
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <Globe size={14} className="text-indigo-400" />
                          <span>Visible to global marketplace</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <ShieldCheck size={14} className="text-indigo-400" />
                          <span>Verified Secure Transaction</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                    <p className="text-xs text-indigo-700 leading-relaxed italic font-medium">
                      "High-quality descriptions and clear pricing increase
                      booking conversion by up to 40%."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* DYNAMIC ACTION BAR */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] p-3 flex items-center justify-between border border-white/10"
          >
            <div className="pl-6 pr-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Status
              </p>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">
                {progress === 100 ? "Ready to Launch" : "Drafting Service"}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              form="service-form"
              disabled={progress < 100}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs tracking-tighter transition-all ${
                progress === 100
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Sparkles size={16} />
              PUBLISH NOW
            </motion.button>
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        ::placeholder {
          color: #cbd5e1;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
