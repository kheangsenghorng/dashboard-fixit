"use client";

import React, { useEffect, useState } from "react";
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
import { useRequireAuth } from "../../../../app/hooks/useRequireAuth";
import { useOwnerStore } from "../../../../app/store/owner/useOwnerStore";

const CreateCouponCompany = () => {
  const { user: authUser, initialized } = useRequireAuth();
  const userId = authUser?.id;
  const router = useRouter();

  const { createCoupon, loading, error } = useCouponStore();
  const { fetchOwner, owner } = useOwnerStore();

  const [form, setForm] = useState({
    owner_id: "",
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
    if (!initialized || !userId) return;

    const loadOwner = async () => {
      try {
        const ownerData = await fetchOwner(userId);

        setForm((prev) => ({
          ...prev,
          owner_id: String(ownerData?.id || ""),
        }));
      } catch (err) {
        console.error("Failed to fetch owner:", err);
        toast.error("Failed to load owner");
      }
    };

    loadOwner();
  }, [initialized, userId, fetchOwner]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.owner_id) {
      toast.error("Owner not found");
      return;
    }

    const payload = {
      owner_id: Number(form.owner_id),
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

      <nav className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span>Coupons</span>
        <ChevronRight size={12} />
        <span className="text-slate-600">New Campaign</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Create Coupon
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Configure your new discount campaign.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Campaign Identity
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    name="unique_id"
                    value={form.unique_id}
                    onChange={handleChange}
                    placeholder="e.g. WELCOME30"
                    className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 font-mono font-bold uppercase text-slate-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Discount Type
                    </label>
                    <div className="relative">
                      <select
                        name="discount_type"
                        value={form.discount_type}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border-none bg-slate-50 px-4 py-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      name="discount_value"
                      value={form.discount_value}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Settings2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Rules & Limits
                </h2>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Min. Purchase
                  </label>
                  <input
                    type="number"
                    name="min_purchase"
                    value={form.min_purchase}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    name="max_uses"
                    value={form.max_uses}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Max Uses Per User
                  </label>
                  <input
                    type="number"
                    name="max_uses_per_user"
                    value={form.max_uses_per_user}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Validity Period
                </h2>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="expires_at"
                  value={form.expires_at}
                  onChange={handleChange}
                  className="w-full rounded-xl border-none bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || !form.owner_id}
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-6 lg:col-span-1">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              Live Preview
            </h3>

            <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl bg-[#0f172a] p-8 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Coupon
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    {form.unique_id || "NEWCOUPON"}
                  </h3>
                </div>
                <Ticket size={24} className="text-slate-400" />
              </div>

              <div className="my-8 text-center">
                <div className="flex items-center justify-center gap-2 text-7xl font-extrabold">
                  {previewDiscount}
                  <span className="text-2xl font-bold uppercase text-slate-400">
                    Off
                  </span>
                </div>

                <div className="mt-4 inline-block rounded-xl border-2 border-dashed border-slate-700 px-6 py-3 font-mono text-2xl font-bold tracking-wider">
                  {form.unique_id || "NEWCOUPON"}
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-800 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <div>
                  <span className="mb-0.5 block text-slate-600">Expires</span>
                  <span className="text-white">
                    {form.expires_at || "No expiry"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="mb-0.5 block text-slate-600">Min Spend</span>
                  <span className="text-white">${form.min_purchase || 0}</span>
                </div>
              </div>
            </div>

            {owner && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="mb-2 text-sm font-bold text-slate-700">
                  Owner Info
                </h4>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Owner ID:</span> {owner?.id}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Business:</span>{" "}
                  {owner?.business_name}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Status:</span> {owner?.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCouponCompany;
