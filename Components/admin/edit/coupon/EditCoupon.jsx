"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  FileText,
  Settings2,
  Calendar,
  ChevronDown,
  Ticket,
  Info,
} from "lucide-react";
import useCouponStore from "../../../../app/store/useCouponStore";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const EditCoupon = () => {
  const { id } = useParams();
  const router = useRouter();

  const { coupon, loading, fetchCouponById, updateCoupon } = useCouponStore();

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

  useEffect(() => {
    if (id) {
      fetchCouponById(id);
    }
  }, [id, fetchCouponById]);

  useEffect(() => {
    if (coupon) {
      setForm({
        unique_id: coupon.unique_id || "",
        discount_type: coupon.discount_type || "percent",
        discount_value: coupon.discount_value || "",
        expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
        max_uses: coupon.max_uses || "",
        max_uses_per_user: coupon.max_uses_per_user || 1,
        min_purchase: coupon.min_purchase || "",
        status: coupon.status || "active",
      });
    }
  }, [coupon]);

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
      await updateCoupon(id, payload);
      toast.success("Coupon updated successfully!");
      router.push("/admin/coupons");
    } catch (err) {
      toast.error("Failed to update coupon");
      console.error("Failed to update coupon:", err);
    }
  };

  const previewDiscount =
    form.discount_type === "percent"
      ? `${form.discount_value || 0}%`
      : `$${form.discount_value || 0}`;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        <span>Coupons</span>
        <ChevronRight size={12} />
        <span className="text-slate-600">Edit Campaign</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Edit Coupon
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Update your discount campaign.
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
              {loading ? "Updating..." : "Update Coupon"}
            </button>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Live Preview
            </h3>

            <div className="bg-[#0f172a] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Coupon
                  </p>
                  <h3 className="text-xl font-bold mt-1">
                    {form.unique_id || "NEWCOUPON"}
                  </h3>
                </div>
                <Ticket size={24} className="text-slate-500" />
              </div>

              <div className="text-center my-8">
                <div className="text-7xl font-extrabold flex items-center justify-center gap-2">
                  {previewDiscount}
                  <span className="text-2xl font-bold uppercase text-slate-500">
                    Off
                  </span>
                </div>
                <div className="mt-6 border-2 border-dashed border-slate-700 rounded-xl py-3 px-8 inline-block font-mono text-2xl font-bold tracking-[0.2em]">
                  {form.unique_id || "NEWCOUPON"}
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-800/50 pt-5">
                <div>
                  <span className="block text-slate-600 mb-1">Expires</span>
                  <span className="text-white">
                    {form.expires_at || "No expiry"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-600 mb-1">Min Spend</span>
                  <span className="text-white">${form.min_purchase || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Summary</h3>
              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  This coupon will be updated once you save the changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCoupon;
