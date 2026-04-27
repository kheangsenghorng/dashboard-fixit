"use client";

import React from "react";
import { X, Search, CheckCircle, Plus, Users, UserPlus } from "lucide-react";

const AssignStaffModal = ({
  isOpen,
  onClose,
  providers = [],
  assignedStaff = [],
  onToggle,
  searchQuery = "",
  setSearchQuery,
}) => {
  if (!isOpen) return null;

  const getStaffId = (staff) => staff?.providerId || staff?.id;
  const getStaffName = (staff) =>
    staff?.provider_name ||
    staff?.user?.name ||
    staff?.name ||
    "Unknown Provider";
  const getStaffSpecialty = (staff) =>
    staff?.specialty || staff?.category?.name || "No specialty";

  const filtered = providers.filter((staff) => {
    const name = getStaffName(staff).toLowerCase();
    const specialty = getStaffSpecialty(staff).toLowerCase();
    const term = searchQuery.toLowerCase();
    return name.includes(term) || specialty.includes(term);
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with heavy blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
              Deployment
            </h2>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Assign Staff <Users className="text-indigo-600" size={24} />
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-4">
          {/* Search Bar */}
          <div className="relative mb-6 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Staff List */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((staff, index) => {
                const staffId = getStaffId(staff);
                const staffName = getStaffName(staff);
                const staffSpecialty = getStaffSpecialty(staff);
                const isAssigned = assignedStaff.some(
                  (s) => getStaffId(s) === staffId
                );

                return (
                  <div
                    key={staffId || `staff-${index}`}
                    onClick={() => onToggle(staff)}
                    className={`group flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                      isAssigned
                        ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100"
                        : "border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-all group-hover:scale-110 ${
                          isAssigned
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-700 border border-slate-100"
                        }`}
                      >
                        {staffName?.[0]?.toUpperCase()}
                      </div>

                      <div>
                        <span
                          className={`font-black text-sm block transition-colors ${
                            isAssigned ? "text-indigo-900" : "text-slate-700"
                          }`}
                        >
                          {staffName}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {staffSpecialty}
                        </span>
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isAssigned
                          ? "bg-indigo-600 text-white rotate-0"
                          : "bg-white text-slate-300 rotate-90"
                      }`}
                    >
                      {isAssigned ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-200" />
                </div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  No personnel found
                </p>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <UserPlus size={18} />
            Confirm Deployment ({assignedStaff.length})
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default AssignStaffModal;
