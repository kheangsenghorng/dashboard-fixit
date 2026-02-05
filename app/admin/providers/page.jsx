"use client";
import React, { useState } from 'react';

import { 
  HardHat, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Plus,
  ArrowUpRight
} from 'lucide-react';

// Mock Data for Providers
const initialProviders = [
  { 
    id: 1, 
    name: 'Robert Fox', 
    business: 'Fox Electric Solutions',
    category: 'Electrician', 
    status: 'Verified', 
    rating: 4.9, 
    jobs: 156,
    location: 'New York, NY',
    joined: 'Jan 2024'
  },
  { 
    id: 2, 
    name: 'Jane Cooper', 
    business: 'Cooper Plumbing & Co',
    category: 'Plumber', 
    status: 'Pending', 
    rating: 4.5, 
    jobs: 89,
    location: 'Brooklyn, NY',
    joined: 'Feb 2024'
  },
  { 
    id: 3, 
    name: 'Cody Fisher', 
    business: 'Fisher HVAC Services',
    category: 'AC Technician', 
    status: 'Verified', 
    rating: 4.8, 
    jobs: 210,
    location: 'Queens, NY',
    joined: 'Nov 2023'
  },
  { 
    id: 4, 
    name: 'Guy Hawkins', 
    business: 'Elite Painting',
    category: 'Painter', 
    status: 'Suspended', 
    rating: 3.2, 
    jobs: 45,
    location: 'Bronx, NY',
    joined: 'Dec 2023'
  }
];

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Providers</h1>
            <p className="text-slate-500 text-sm">Manage technicians, verify credentials, and monitor performance.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Register New Provider
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Providers', val: '432', icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Verified', val: '380', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Approval', val: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg Rating', val: '4.8', icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-xl font-bold text-slate-900">{stat.val}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name, business or specialty..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Provider / Business</th>
                  <th className="px-6 py-4">Specialty</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Total Jobs</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${provider.name}&background=6366f1&color=fff`} 
                            alt="avatar" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{provider.name}</p>
                          <p className="text-[12px] text-slate-500 font-medium">{provider.business}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {provider.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-900">{provider.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {provider.jobs} jobs
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        provider.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                        provider.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {provider.status === 'Verified' && <CheckCircle2 size={12} />}
                        {provider.status === 'Pending' && <Clock size={12} />}
                        {provider.status === 'Suspended' && <AlertCircle size={12} />}
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent hover:bg-indigo-50 rounded-lg transition-all">
                          <ArrowUpRight size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}