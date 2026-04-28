"use client";

import React from "react";
import { UserCheck, Trash2, Info } from "lucide-react";


const TeamAndInstructions = ({
  assignedStaff = [],
  onAdd,
  onRemove,
  notes,
}) => {
  console.log(assignedStaff);

  const getStaffId = (staff) =>
    staff?.id ||
    staff?.service_booking_provider_id ||
    staff?.providerId ||
    staff?.provider_id ||
    staff?.provider?.id;

  const getProviderId = (staff) =>
    staff?.providerId || staff?.provider_id || staff?.provider?.id || staff?.id;

  const getStaffName = (staff) =>
    staff?.provider_name ||
    staff?.provider?.provider_name ||
    staff?.provider?.user?.name ||
    staff?.user?.name ||
    staff?.name ||
    "Unknown Provider";

  const getStaffSpecialty = (staff) =>
    staff?.specialty ||
    staff?.provider?.specialty ||
    staff?.provider?.category?.name ||
    staff?.category?.name ||
    "No specialty";

  const getStaffInitial = (staff) => {
    const name = getStaffName(staff);
    return name?.[0]?.toUpperCase() || "?";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <UserCheck size={14} /> Assigned Personnel
          </h2>

          <button
            type="button"
            onClick={onAdd}
            className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase"
          > 
            + Add
          </button>
        </div>

        <div className="p-4 flex-1">
          {assignedStaff.length > 0 ? (
            <div className="space-y-2">
              {assignedStaff.map((staff, index) => {
                const staffId = getStaffId(staff);
                const staffName = getStaffName(staff);
                const staffSpecialty = getStaffSpecialty(staff);

                return (
                  <div
                    key={staffId || `assigned-staff-${index}`}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {getStaffInitial(staff)}
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 text-[11px] block">
                          {staffName}
                        </span>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {staffSpecialty}
                        </span>

                        <span className="text-[9px] text-slate-300 font-bold block">
                          Provider ID: {getProviderId(staff)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove?.(staff)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-6 text-slate-300 italic text-[10px]">
              Waiting for assignment
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-slate-50/50">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Info size={14} /> Client Instructions
          </h2>
        </div>

        <div className="p-5 italic text-slate-500 leading-relaxed text-[11px]">
          <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 min-h-[100px]">
            &quot;{notes || "No special instructions provided."}&quot;
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAndInstructions;
