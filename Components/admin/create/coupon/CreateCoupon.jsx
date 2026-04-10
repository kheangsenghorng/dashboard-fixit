"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  FileText,
  Settings2,
  Calendar,
  ChevronDown,
  Ticket,
} from "lucide-react";
import useCouponStore from "../../../../app/store/useCouponStore";
import ContentLoader from "../../../ContentLoader";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateCoupon = () => {
  const router = useRouter();
  const { createCoupon, loading, error } = useCouponStore();

  const [form, setForm] = useState({
    unique_id: "",
    discount_type: "percent",
    discount_value: "",
    expires_at: "",
    max_uses: "",
    max_uses_per_user: 1,
    min_purchase: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      unique_id: form.unique_id.trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      expires_at: form.expires_at || null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      max_uses_per_user: form.max_uses_per_user
        ? Number(form.max_uses_per_user)
        : 1,
      min_purchase: form.min_purchase ? Number(form.min_purchase) : 0,
      status: form.status,
    };
  
    try {
      await createCoupon(payload);
  
      toast.success("Coupon created successfully!");
  
      router.push("/admin/coupons");
    } catch (err) {
      toast.error("Failed to create coupon");
      console.error("Failed to create coupon:", err);
    }
  };
  const previewDiscount =
    form.discount_type === "percent"
      ? `${form.discount_value || 0}%`
      : `$${form.discount_value || 0}`;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <ContentLoader
              title="Processing"
              subtitle="Creating your coupon..."
              Icon={Ticket}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        <span>Coupons</span>
        <ChevronRight size={12} />
        <span className="text-slate-600">New Campaign</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Create Coupon
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Configure your new discount campaign.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Campaign Identity
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    name="unique_id"
                    value={form.unique_id}
                    onChange={handleChange}
                    placeholder="e.g. WELCOME30"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 font-mono font-bold text-slate-700 uppercase"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Discount Type
                    </label>
                    <div className="relative">
                      <select
                        name="discount_type"
                        value={form.discount_type}
                        onChange={handleChange}
                        className="w-full appearance-none bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      name="discount_value"
                      value={form.discount_value}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Settings2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Rules & Limits
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Min. Purchase
                  </label>
                  <input
                    type="number"
                    name="min_purchase"
                    value={form.min_purchase}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    name="max_uses"
                    value={form.max_uses}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Max Uses Per User
                  </label>
                  <input
                    type="number"
                    name="max_uses_per_user"
                    value={form.max_uses_per_user}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Validity Period
                </h2>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="expires_at"
                  value={form.expires_at}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Live Preview
            </h3>

            <div className="bg-[#0f172a] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Coupon
                  </p>
                  <h3 className="text-xl font-bold mt-1">
                    {form.unique_id || "NEWCOUPON"}
                  </h3>
                </div>
                <Ticket size={24} className="text-slate-400" />
              </div>

              <div className="text-center my-8">
                <div className="text-7xl font-extrabold flex items-center justify-center gap-2">
                  {previewDiscount}
                  <span className="text-2xl font-bold uppercase text-slate-400">
                    Off
                  </span>
                </div>

                <div className="mt-4 border-2 border-dashed border-slate-700 rounded-xl py-3 px-6 inline-block font-mono text-2xl font-bold tracking-wider">
                  {form.unique_id || "NEWCOUPON"}
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-800 pt-4">
                <div>
                  <span className="block text-slate-600 mb-0.5">Expires</span>
                  <span className="text-white">
                    {form.expires_at || "No expiry"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-600 mb-0.5">Min Spend</span>
                  <span className="text-white">${form.min_purchase || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
