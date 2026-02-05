"use client";
import React, { useState } from 'react';

import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock Data for Users
const initialUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', status: 'Active', joined: '2024-03-10', role: 'Customer', orders: 12 },
  { id: 2, name: 'Sarah Williams', email: 'sarah.w@example.com', status: 'Inactive', joined: '2024-02-15', role: 'VIP Customer', orders: 45 },
  { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', status: 'Active', joined: '2024-03-22', role: 'Customer', orders: 3 },
  { id: 4, name: 'Emma Davis', email: 'emma.d@example.com', status: 'Active', joined: '2024-01-05', role: 'Customer', orders: 28 },
  { id: 5, name: 'James Wilson', email: 'j.wilson@example.com', status: 'Banned', joined: '2023-11-12', role: 'Customer', orders: 0 },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (

      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customers & Users</h1>
            <p className="text-slate-500 text-sm">Manage your customer database and account status.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md">
            <UserPlus size={18} />
            Add New Customer
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Customers</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">1,284</h3>
              <span className="text-emerald-500 text-xs font-bold pb-1">+4%</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Now</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">712</h3>
              <span className="text-indigo-500 text-xs font-bold pb-1">Live</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">New This Month</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">156</h3>
              <span className="text-emerald-500 text-xs font-bold pb-1">+12%</span>
            </div>
          </div>
        </div>

        {/* Table & Filters Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by name, email or ID..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        user.status === 'Banned' ? 'bg-rose-50 text-rose-600' : 
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">1 to 5</span> of <span className="font-semibold text-slate-900">1,284</span> customers
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-bold">1</button>
              <button className="px-3 py-1 text-slate-600 hover:bg-white rounded-lg text-sm font-medium">2</button>
              <button className="px-3 py-1 text-slate-600 hover:bg-white rounded-lg text-sm font-medium">3</button>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
  );
}