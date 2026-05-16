"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  TrendingUp,
  Eye,
  Plus,
  Search,
  Edit,
  Trash2,
  Layers,
  Camera,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
  XCircle,
  Settings,
  Briefcase,
  Calendar,
} from "lucide-react";

import { useParams } from "next/navigation";
import { useOwnerStore } from "@/app/store/ownerStore";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { decodeId } from "../../../../app/utils/hashids";
import Image from "next/image";
import { useServiceStore } from "../../../../app/store/useServiceStore";

export default function PremiumOwnerDashboard() {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const { user, initialized } = useAuthGuard();

  const { fetchOwner, owner, loading, updateOwner } = useOwnerStore();
  const { fetchServicesByOwner, services } = useServiceStore();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchOwner(id);
  }, [id, fetchOwner]);

  useEffect(() => {
    if (!owner?.id) return;
    fetchServicesByOwner(owner.id);
  }, [owner?.id, fetchServicesByOwner]);

  const serviceList = Array.isArray(services) ? services : [];
  const filteredServices = serviceList.filter((service) =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !initialized) return null;

  if (loading || !owner) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase animate-pulse">
            Initializing Dashboard
          </p>
        </div>
      </div>
    );
  }

  const isPending = owner.status === "pending";

  const handleReview = async (status) => {
    setReviewLoading(true);
    await updateOwner(id, { status });
    setReviewLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased selection:bg-blue-100">
      <div className="max-w-[1400px] mx-auto px-6 py-10 md:py-16 space-y-10">
        {/* ================= HEADER SECTION ================= */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-[38px] overflow-hidden bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                <img
                  src={owner.logo || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                  alt="Business Logo"
                />
              </div>
              {/* FIXED: Changed </div> to </motion.div> below */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-xl border-4 border-white"
              >
                <ShieldCheck size={20} />
              </motion.div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {owner.business_name}
                </h1>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                    isPending
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  {owner.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <MapPin size={16} className="text-slate-300" />{" "}
                {owner.address?.split(",")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Settings size={18} /> Settings
            </button>
            <button className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-slate-200">
              Edit Profile
            </button>
          </div>
        </motion.header>

        {/* ================= ANALYTICS STRIP ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Engagement",
              value: "1.2k",
              icon: Eye,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Catalog",
              value: services?.length || 0,
              icon: Layers,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              title: "Revenue",
              value: "312",
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              title: "Identity",
              value: owner?.documents?.length || 0,
              icon: FileText,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm transition-all"
            >
              <div
                className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}
              >
                <card.icon size={22} />
              </div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                {card.title}
              </p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {card.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* BUSINESS INFO PANEL */}
          <div className="lg:col-span-8 bg-white rounded-[44px] border border-slate-100 p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
              <h2 className="text-2xl font-bold tracking-tight">
                Business Intelligence
              </h2>
              <a
                href={owner.map_url}
                target="_blank"
                className="p-2 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Navigation size={20} />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <DetailItem
                  icon={<MapPin size={20} />}
                  label="Primary Address"
                  value={owner.address}
                />
                <DetailItem
                  icon={<Phone size={20} />}
                  label="Direct Line"
                  value={owner.user?.phone || "N/A"}
                />
                <DetailItem
                  icon={<User size={20} />}
                  label="Executive Representative"
                  value={owner.user?.name}
                />
              </div>
              <div className="bg-slate-50/50 rounded-[40px] p-10 border border-slate-100 flex flex-col justify-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-blue-600" size={28} />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Partnership Since
                </p>
                <p className="text-2xl font-black text-slate-900">Oct 2023</p>
              </div>
            </div>
          </div>

          {/* VERIFICATION PANEL */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[44px] p-10 text-white flex flex-col justify-between shadow-2xl shadow-slate-300">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Gatekeeper Review</h2>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                Ensure all compliance standards are met before authorizing
                marketplace presence.
              </p>

              {isPending ? (
                <div className="space-y-4">
                  <button
                    disabled={reviewLoading}
                    onClick={() => handleReview("approved")}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[24px] font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                  >
                    {reviewLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CheckCircle2 size={20} /> Authorize Business
                      </>
                    )}
                  </button>
                  <button
                    disabled={reviewLoading}
                    onClick={() => handleReview("rejected")}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-[24px] font-bold transition-all flex items-center justify-center gap-3"
                  >
                    <XCircle size={20} /> Decline Entry
                  </button>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center backdrop-blur-xl">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-bold text-xl mb-1 text-emerald-400">
                    Identity Verified
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Compliant Business
                  </p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center mt-10 opacity-50">
              Secure Access v2.4
            </p>
          </div>
        </div>

        {/* ================= SERVICES CATALOG ================= */}
        <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Active Inventory
              </h2>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Find a service..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="px-10 pb-10">
            <div className="overflow-hidden border border-slate-50 rounded-3xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-5">Product/Service</th>
                    <th className="px-8 py-5">Classification</th>
                    <th className="px-8 py-5">Starting Price</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredServices.map((service) => {
                    const firstPkg = service.service_packages?.[0];
                    return (
                      <tr
                        key={service.id}
                        className="group hover:bg-slate-50/80 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                              <img
                                src={
                                  service.images?.[0]?.url ||
                                  "https://via.placeholder.com/100"
                                }
                                className="w-full h-full object-cover"
                                alt={service.title}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {service.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                {firstPkg?.duration_hours} Hour Session
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                          {service.category?.name}
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-slate-900">
                          ${firstPkg?.price}
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {service.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-slate-100">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-slate-100">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= PHOTO GALLERY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DOCS */}
          <div className="bg-white rounded-[44px] p-10 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8">Registry Documents</h2>
            <div className="space-y-4">
              {owner.documents?.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{doc.document_type}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {doc.status}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY */}
          <div className="bg-white rounded-[44px] p-10 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Camera size={24} className="text-blue-600" /> Asset Gallery
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {owner.images?.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square rounded-[24px] overflow-hidden"
                >
                  <Image
                    fill
                    src={img.url}
                    alt="Gallery"
                    unoptimized
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="text-white" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <div className="flex gap-6 items-start group">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-base font-bold text-slate-800 leading-tight">
        {value}
      </p>
    </div>
  </div>
);
