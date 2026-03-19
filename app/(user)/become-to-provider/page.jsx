"use client";

import React, { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  FileText,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useRouter } from "next/navigation";

const cambodianProvinces = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
];

export default function BecomeCompanyForm() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push('/');
    }
  }, [authUser, router]);
  
  if (!authUser) return null; // prevents rendering while redirecting

  return (
    <div className="min-h-screen px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <ShieldCheck className="w-3 h-3" />
            Registry
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter uppercase mb-4">
            Become a <span className="text-blue-600">Seller</span>
          </h1>

          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Register your business identity within the global Saby-Tinh
            registry.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 lg:p-12 font-sans">
          <div className="space-y-10">
            {/* BUSINESS LOCATION */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Business Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StyledInput
                  label="Street Address"
                  icon={MapPin}
                  placeholder="e.g. 123 Business Street"
                />

                <div className="relative font-sans">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Province / City
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Search Hub..."
                      className="w-full py-4 pl-12 pr-4 font-sans bg-slate-50 border border-transparent rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-50 w-full" />

            {/* BUSINESS IDENTITY */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                Business Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StyledInput label="Admin Full Name" icon={User} required />
                <StyledInput
                  label="Official Company Name"
                  icon={Building2}
                  required
                />
                <StyledInput
                  label="Secure Contact Email"
                  icon={Mail}
                  type="email"
                  required
                />
                <StyledInput
                  label="Communication Node"
                  icon={Phone}
                  type="tel"
                />
              </div>
            </div>

            {/* DOCUMENT */}
            <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 font-sans">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Business Verification Data
              </h3>

              <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[24px] bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-[10px] font-bold font-sans text-slate-400 uppercase tracking-widest group-hover:text-blue-600 px-4 text-center">
                  Transmit Business License (PDF / DOCX)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="button"
              className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-sans shadow-xl flex items-center justify-center"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
                Submit
              </span>
            </button>

            <div className="flex justify-center gap-2 opacity-40 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                AES-256 Protocol Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Styled Input */
const StyledInput = ({ label, icon: Icon, required, ...props }) => (
  <div className="space-y-2 font-sans">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600" />
      <input
        {...props}
        className="w-full py-4 pl-12 pr-4 font-sans bg-slate-50 border border-transparent rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
      />
    </div>
  </div>
);
