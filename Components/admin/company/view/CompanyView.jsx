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
  DollarSign,
  Layers,
  MoreVertical,
  Circle,
  Camera,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
  XCircle,
  Settings,
} from "lucide-react";

import { useParams } from "next/navigation";
import { useOwnerStore } from "@/app/store/ownerStore";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { decodeId } from "../../../../app/utils/hashids";
import Image from "next/image";

// Mock Services Data (Can be replaced with owner.services if available in your API)
const initialServices = [
  {
    id: 1,
    name: "Full House Deep Cleaning",
    category: "Cleaning",
    basePrice: 120.0,
    duration: "4-6 hrs",
    status: "Active",
    popularity: "High",
  },
  {
    id: 2,
    name: "Electrical Socket Repair",
    category: "Electrical",
    basePrice: 45.0,
    duration: "1 hr",
    status: "Active",
    popularity: "Medium",
  },
  {
    id: 3,
    name: "Emergency Pipe Leak",
    category: "Plumbing",
    basePrice: 85.0,
    duration: "2 hrs",
    status: "Active",
    popularity: "High",
  },
];

export default function PremiumOwnerDashboard() {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);

  
  const { user, initialized } = useAuthGuard();

  const { fetchOwner, owner, loading, updateOwner } = useOwnerStore();

  const [reviewLoading, setReviewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) fetchOwner(id);
  }, [id, fetchOwner]);

  if (!user || !initialized) return null;

  if (loading || !owner) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Syncing Owner Data...</p>
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

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-4 md:p-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          {...fadeUp}
          className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={owner.logo || "https://via.placeholder.com/150"}
                className="w-24 h-24 rounded-[30px] shadow-lg object-cover ring-4 ring-gray-50"
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-xl border-4 border-white">
                <ShieldCheck size={16} />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {owner.business_name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isPending
                      ? "bg-amber-50 text-amber-600 border border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {isPending ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  {owner.status}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition">
              <Settings size={20} />
            </button>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-gray-200 hover:scale-105 transition-all">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* ================= ANALYTICS STRIP ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Profile Views",
              value: "1,204",
              icon: Eye,
              color: "text-blue-500",
            },
            {
              title: "Services",
              value: initialServices.length,
              icon: Layers,
              color: "text-indigo-500",
            },
            {
              title: "Bookings",
              value: "312",
              icon: TrendingUp,
              color: "text-emerald-500",
            },
            {
              title: "Docs",
              value: owner.documents?.length || 0,
              icon: FileText,
              color: "text-amber-500",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  {card.title}
                </p>
                <card.icon size={20} className={card.color} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{card.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BUSINESS INFO PANEL */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-8"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Business Details
              </h2>
              <a
                href={owner.map_url}
                target="_blank"
                className="text-indigo-600 text-xs font-bold flex items-center gap-1"
              >
                GOOGLE MAPS <Navigation size={14} />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <DetailItem
                  icon={<MapPin className="text-indigo-500" />}
                  label="Address"
                  value={owner.address}
                />
                <DetailItem
                  icon={<Phone className="text-indigo-500" />}
                  label="Phone Number"
                  value={owner.user?.phone || "N/A"}
                />
                <DetailItem
                  icon={<User className="text-indigo-500" />}
                  label="Owner Name"
                  value={owner.user?.name}
                />
              </div>
              <div className="bg-gray-50 rounded-[30px] p-6 flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Member Since
                </p>
                <p className="text-lg font-bold text-gray-900">Oct 2023</p>
                <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-3/4"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ADMIN ACTION PANEL */}
          <motion.div
            {...fadeUp}
            className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Verification
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Process business application status
              </p>

              {isPending ? (
                <div className="space-y-4">
                  <button
                    disabled={reviewLoading}
                    onClick={() => handleReview("approved")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                  >
                    {reviewLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Approve Business
                      </>
                    )}
                  </button>

                  <button
                    disabled={reviewLoading}
                    onClick={() => handleReview("rejected")}
                    className="w-full bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Reject Application
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[30px] p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-bold text-emerald-800">
                    Business Verified
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Status: {owner.status}
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center mt-6">
              Security Policy V2.4
            </p>
          </motion.div>
        </div>

        {/* ================= SERVICES CATALOG ================= */}
        <motion.div
          {...fadeUp}
          className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Layers size={24} className="text-indigo-600" /> Services List
            </h2>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 bg-gray-50/30">
                  <th className="px-8 py-4">Service</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {initialServices
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {service.duration}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                        {service.category}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-900">
                        ${service.basePrice}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">
                          {service.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2 text-gray-400">
                          <button className="hover:text-indigo-600">
                            <Edit size={16} />
                          </button>
                          <button className="hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ================= DOCUMENT REVIEW ================= */}
        <motion.div
          {...fadeUp}
          className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8"
        >
          <h2 className="text-xl font-bold mb-8">Registration Documents</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {owner.documents?.length ? (
              owner.documents.map((doc, i) => (
                <div
                  key={i}
                  className="group border-2 border-gray-50 rounded-[32px] p-6 hover:border-indigo-100 transition-all bg-white relative"
                >
                  <FileText
                    className="text-gray-300 group-hover:text-indigo-500 transition-colors mb-4"
                    size={32}
                  />
                  <p className="font-bold text-gray-900">{doc.document_type}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                    Status: {doc.status}
                  </p>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:underline"
                    >
                      VIEW PDF <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center bg-gray-50 rounded-[30px] text-gray-400 font-medium italic">
                No documents found for this business.
              </div>
            )}
          </div>
        </motion.div>

        {/* ================= PHOTO GALLERY ================= */}
        <motion.div
          {...fadeUp}
          className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8"
        >
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Camera size={22} className="text-indigo-600" /> Media Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {owner.images?.map((img, i) => (
              <Image
                key={i}
                width={300}
                height={200}
                src={img.url}
                alt={`Owner image ${i + 1}`}
                unoptimized
                className="h-40 w-full object-cover rounded-[24px] hover:scale-105 transition duration-500 shadow-sm"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex gap-4 items-start">
    <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-800 leading-relaxed">{value}</p>
    </div>
  </div>
);
