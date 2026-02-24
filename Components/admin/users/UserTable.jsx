import React from "react";
import Image from "next/image";
import { Mail, Phone, Crown, Wrench, Pencil, Trash2, Check, User as UserIcon } from "lucide-react";

export default function UserTable({ 
  users, 
  selectedSet, 
  isAllSelected, 
  toggleSelectAll, 
  toggleSelectOne, 
  onEdit, 
  onDelete,
  isLoading,
  formatPhoneNumber 
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              {/* SELECT ALL COLUMN */}
              <th className="pl-8 py-5 w-16 border-b border-slate-100">
                <button 
                  onClick={toggleSelectAll}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isAllSelected ? "bg-slate-900 border-slate-900 shadow-md" : "bg-white border-slate-200"
                  }`}
                >
                  {isAllSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                </button>
              </th>

              {/* OTHER HEADERS */}
              <th className="px-4 py-5 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Identity</th>
              <th className="px-4 py-5 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Communication</th>
              <th className="px-4 py-5 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Access Tier</th>
              <th className="px-4 py-5 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Status</th>
              <th className="pr-8 py-5 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y divide-slate-50 transition-opacity ${isLoading ? "opacity-40 pointer-events-none" : ""}`}>
            {users.map((user) => {
              const isSelected = selectedSet.has(user.id);
              
              return (
                <tr key={user.id} className={`group transition-all ${isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/50"}`}>
                  {/* SELECT ONE COLUMN */}
                  <td className="pl-8 py-5 relative">
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />}
                    <button 
                      onClick={() => toggleSelectOne(user.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected ? "bg-indigo-600 border-indigo-600 shadow-sm" : "bg-white border-slate-200 group-hover:border-slate-300"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                    </button>
                  </td>

                  {/* IDENTITY COLUMN */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform duration-300">
                        {user.avatar ? (
                          <Image src={user.avatar} alt="" fill className="object-cover" unoptimized />
                        ) : (
                          <span className="text-sm uppercase">{user.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[14px] leading-tight mb-1">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail size={12} strokeWidth={2.5} />
                          <span className="text-xs font-medium tracking-tight">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT COLUMN */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Phone size={14} />
                      </div>
                      {formatPhoneNumber(user.phone)}
                    </div>
                  </td>

                  {/* ACCESS/ROLE COLUMN */}
                  <td className="px-4 py-5">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* STATUS COLUMN */}
                  <td className="px-4 py-5">
                    <StatusIndicator active={user.is_active} />
                  </td>

                  {/* ACTIONS COLUMN */}
                  <td className="pr-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => onEdit(user.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all"
                      >
                        <Pencil size={16}/>
                      </button>
                      <button 
                        onClick={() => onDelete(user.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 hover:shadow-md transition-all"
                      >
                        <Trash2 size={16}/>
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
  );
}

/**
 * SUB-COMPONENT: Status Indicator
 */
function StatusIndicator({ active }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
      active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-400"}`} />
      {active ? "Active" : "Disabled"}
    </div>
  );
}

/**
 * SUB-COMPONENT: Role Badge
 */
function RoleBadge({ role }) {
  const config = {
    owner: { color: "bg-amber-50 text-amber-700 border-amber-100", icon: Crown },
    provider: { color: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: Wrench },
    customer: { color: "bg-slate-50 text-slate-600 border-slate-200", icon: UserIcon },
  };

  const { color, icon: Icon } = config[role] || config.customer;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${color}`}>
      <Icon size={12} strokeWidth={2.5} />
      {role}
    </span>
  );
}