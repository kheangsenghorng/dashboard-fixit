"use client";

import React, { useState } from "react";
import { 
  UserPlus, Search, MoreVertical, Mail, 
  Shield, CheckCircle2, Clock, Trash2 
} from "lucide-react";

// Mock Data for Users
const MOCK_USERS = [
  { id: 1, name: "Alex Thompson", email: "alex@power.sys", role: "Admin", status: "Active", joinDate: "Jan 12, 2024" },
  { id: 2, name: "Sarah Chen", email: "sarah.c@power.sys", role: "Editor", status: "Active", joinDate: "Feb 05, 2024" },
  { id: 3, name: "Marcus Wright", email: "m.wright@power.sys", role: "Viewer", status: "Pending", joinDate: "Mar 20, 2024" },
  { id: 4, name: "Elena Rodriguez", email: "elena@power.sys", role: "Editor", status: "Inactive", joinDate: "Dec 15, 2023" },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-400 font-bold mt-2 italic">Manage system access and permissions</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 font-medium">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm italic">
                      <Shield size={14} className="text-indigo-400" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                    {user.joinDate}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 4 of 24 Users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-black uppercase bg-white disabled:opacity-50" disabled>Prev</button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-black uppercase bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Sub-component for Status
function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-50 text-green-600 border-green-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Inactive: "bg-slate-100 text-slate-400 border-slate-200",
  };

  const icons = {
    Active: <CheckCircle2 size={12} />,
    Pending: <Clock size={12} />,
    Inactive: <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}