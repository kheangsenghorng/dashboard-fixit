"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Globe,
  ImagePlus,
  FileText,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useOwnerStore } from "../../store/ownerStore";
import LocationPickerOSM from "../../../Components/LocationPickerOSM";
import { useDocumentOwnerStore } from "../../store/owner/useDocumentStore";
import Link from "next/link";

export default function BecomeCompanyForm() {
  const { user: authUser } = useAuthGuard();
  const { createOwner, loading, error: storeError } = useOwnerStore();
  const { uploadDocument } = useDocumentOwnerStore();
  const router = useRouter();

  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    business_name: "",
    address: "",
    lat: "",
    lng: "",
    map_url: "",
    logo: null,
    images: [],
    document: null,
    document_type: "id_card",
    country: "KH",
    privacyAccepted: false,
  });

  useEffect(() => {
    if (!authUser) {
      router.push("/auth/login");
      return;
    }

    if (authUser.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    if (authUser.role === "owner") {
      router.push("/owner/dashboard");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      userId: authUser.id || "",
    }));
  }, [authUser, router]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationSelect = (location) => {
    const lat = location?.lat ?? "";
    const lng = location?.lng ?? "";
    const address = location?.address || "";
    const mapUrl =
      lat !== "" && lng !== ""
        ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}`
        : "";
    setFormData((prev) => ({ ...prev, address, lat, lng, map_url: mapUrl }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLocalError("");

    const config = {
      logo: { max: 2048, mimes: ["jpg", "jpeg", "png", "webp"] },
      images: { max: 2048, mimes: ["jpg", "jpeg", "png", "webp"] },
      document: { max: 5120, mimes: ["jpg", "jpeg", "png", "pdf"] },
    };

    const currentConfig = config[field];

    for (let file of files) {
      const fileSizeKb = file.size / 1024;
      const extension = file.name.split(".").pop().toLowerCase();

      if (fileSizeKb > currentConfig.max) {
        setLocalError(
          `${file.name} is too large. Max ${
            currentConfig.max / 1024
          }MB allowed.`
        );
        return;
      }

      if (!currentConfig.mimes.includes(extension)) {
        setLocalError(
          `Invalid format for ${file.name}. Allowed: ${currentConfig.mimes.join(
            ", "
          )}`
        );
        return;
      }
    }

    if (field === "images") {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.privacyAccepted) {
        setLocalError("You must accept the Privacy Policy to proceed.");
        return;
      }

      if (!formData.document) {
        setLocalError("You must accept document");
        return;
      }

      if (!authUser || authUser.role !== "customer") return;

      const payload = new FormData();
      payload.append("user_id", authUser.id);
      payload.append("business_name", formData.business_name);
      payload.append("address", formData.address);
      if (formData.lat) payload.append("lat", formData.lat);
      if (formData.lng) payload.append("lng", formData.lng);
      if (formData.map_url) payload.append("map_url", formData.map_url);
      if (formData.logo) payload.append("logo", formData.logo);
      if (formData.images.length > 0) {
        formData.images.forEach((file) => payload.append("images[]", file));
      }

      const success = await createOwner(payload);
      if (!success) return;

      if (formData.document) {
        const uploadForm = new FormData();
        uploadForm.append("file", formData.document);
        uploadForm.append("document_type", formData.document_type);
        uploadForm.append("country", formData.country);
        await uploadDocument(uploadForm);
      }
      router.push("/");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] tracking-[0.2em] uppercase mb-2 text-left">
              <div className="w-8 h-[2px] bg-blue-600" /> Secure Onboarding
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase text-left">
              Partner <span className="text-blue-600">Portal</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-[24px] border border-slate-200 shadow-sm">
            <ShieldCheck className="text-blue-600 w-6 h-6" />
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Status
              </p>
              <p className="text-sm font-bold text-slate-700">
                Pending Registration
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Business Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <SectionTitle icon={Building2} title="Identity Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 text-left">
                <StyledInput
                  label="Business Name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Official Name"
                />
                <StyledInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full physical address"
                />
              </div>
              <div className="mt-8 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  Pin Location
                </label>
                <div className="rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-inner">
                  <LocationPickerOSM onChange={handleLocationSelect} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                <MiniInput label="Latitude" value={formData.lat} icon={Globe} />
                <MiniInput
                  label="Longitude"
                  value={formData.lng}
                  icon={Globe}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Uploads & Verification */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden text-left">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 blur-[70px] rounded-full" />

              <div className="relative z-10">
                <SectionTitle icon={ImagePlus} title="Media & Assets" />

                <div className="grid grid-cols-2 gap-4 mt-8 mb-6 text-left">
                  <StyledSelect
                    label="Doc Type"
                    name="document_type"
                    value={formData.document_type}
                    onChange={handleChange}
                    options={[
                      { value: "id_card", label: "ID Card" },
                      { value: "passport", label: "Passport" },
                      { value: "driver_license", label: "License" },
                    ]}
                  />
                  <StyledInput
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="KH"
                  />
                </div>

                {/* Upload Slots */}
                <div className="space-y-4">
                  <ModernUploadSlotLight
                    label="Corporate Logo"
                    subLabel="Allow PNG, JPG, WEBP (Max 2MB)"
                    icon={ImagePlus}
                    accept=".png,.jpg,.jpeg,.webp"
                    fileName={formData.logo?.name}
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                  <ModernUploadSlotLight
                    label="Business Gallery"
                    subLabel="Allow PNG, JPG, WEBP (Max 2MB)"
                    icon={ImagePlus}
                    multiple
                    accept=".png,.jpg,.jpeg,.webp"
                    fileName={
                      formData.images.length
                        ? `${formData.images.length} Photos Selected`
                        : null
                    }
                    onChange={(e) => handleFileChange(e, "images")}
                  />
                  <ModernUploadSlotLight
                    label={`Legal ${formData.document_type.replace("_", " ")}`}
                    subLabel="Allow PNG, JPG, WEBP, PDF (Max 5MB)"
                    icon={FileText}
                    accept=".png,.jpg,.jpeg,.webp,.pdf"
                    fileName={formData.document?.name}
                    onChange={(e) => handleFileChange(e, "document")}
                  />
                </div>

                {/* NEW: PRIVACY POLICY SECTION */}
                <div className="mt-8 pt-8 border-t border-slate-100 text-left">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleChange}
                        className="peer h-6 w-6 appearance-none rounded-xl border-2 border-slate-100 bg-slate-50 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />
                      <CheckCircle2
                        size={14}
                        className="absolute text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                          Accept Privacy Protocol
                        </p>
                        {/* LINK TO FULL PAGE */}
                        <Link
                          href="/privacy-policy"
                          className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          View Full Policy
                        </Link>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold leading-tight mt-1">
                        I confirm that all uploaded documents are authentic and
                        valid.
                      </p>
                    </div>
                  </label>
                </div>
                {/* Error Display */}
                {(localError || storeError) && (
                  <div className="mt-6 flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-200 text-left">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-bold leading-tight uppercase tracking-tight">
                      {localError || storeError}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-8 group bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white rounded-[24px] p-2 transition-all duration-500 flex items-center justify-between shadow-xl"
                >
                  <span className="ml-6 text-[11px] font-black uppercase tracking-[0.3em]">
                    {loading ? "Processing..." : "Submit Registry"}
                  </span>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Account protocol card stays below */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden border border-slate-100 text-left">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="text-blue-600 w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">
                      Account Protocol
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Auth Reference:{" "}
                      <span className="text-slate-900 font-black">
                        {authUser.name}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-5 group">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 text-slate-400 group-hover:text-white">
                      <FileText size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">
                        Document Validation
                      </p>
                      <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                        Our team checks your documents. Once validated, your
                        account is upgraded to Provider status.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 text-slate-400 group-hover:text-white">
                      <CheckCircle2 size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">
                        Owner Activation
                      </p>
                      <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                        Upon final approval, the system unlocks your{" "}
                        <span className="text-slate-900 font-black ml-1 uppercase text-[10px] tracking-tighter">
                          Company Dashboard
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UI HELPERS ---

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
      <Icon size={20} />
    </div>
    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 text-left">
      {title}
    </h3>
  </div>
);

const StyledInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all outline-none"
    />
  </div>
);

const StyledSelect = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const MiniInput = ({ label, value, icon: Icon }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-slate-300" />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">
        {label}
      </span>
    </div>
    <span className="text-xs font-bold text-slate-600 truncate ml-2">
      {value || "0.00"}
    </span>
  </div>
);

const ModernUploadSlotLight = ({
  label,
  subLabel,
  icon: Icon,
  fileName,
  onChange,
  multiple = false,
  accept,
}) => (
  <label className="relative flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all group overflow-hidden">
    <div
      className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${
        fileName ? "bg-blue-600" : "bg-transparent"
      }`}
    />
    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all shadow-sm flex-shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors leading-none mb-1.5 text-left">
        {label}
      </p>
      {fileName ? (
        <div className="text-[11px] font-bold text-blue-600 flex items-center gap-2">
          <CheckCircle2 size={12} strokeWidth={3} className="flex-shrink-0" />
          <span className="truncate">{fileName}</span>
        </div>
      ) : (
        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
          {subLabel} <UploadCloud size={10} className="text-slate-300" />
        </div>
      )}
    </div>
    <input
      type="file"
      className="hidden"
      onChange={onChange}
      multiple={multiple}
      accept={accept}
    />
  </label>
);
