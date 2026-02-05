"use client";
import React, { useState } from 'react';

import { 
  Layers, 
  Search, 
  Plus, 
  Briefcase, 
  Users, 
  Edit, 
  Trash2, 
  ChevronRight,
  MoreVertical,
  Settings2,
  CheckCircle
} from 'lucide-react';

// Mock Data for Categories
const initialCategories = [
  { id: 1, name: 'Electrical', description: 'Wiring, socket repairs, and lighting installations', services: 12, providers: 45, status: 'Active', iconColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 2, name: 'Plumbing', description: 'Pipe leaks, drainage, and bathroom fittings', services: 8, providers: 32, status: 'Active', iconColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 3, name: 'Home Cleaning', description: 'Deep cleaning, sanitization, and maid services', services: 15, providers: 88, status: 'Active', iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 4, name: 'HVAC / AC', description: 'Air conditioning repair, gas refill, and maintenance', services: 6, providers: 24, status: 'Active', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { id: 5, name: 'Automotive', description: 'Car repair, oil change, and mechanical checkups', services: 22, providers: 56, status: 'Inactive', iconColor: 'text-slate-600', bgColor: 'bg-slate-50' },
  { id: 6, name: 'Painting', description: 'Interior/Exterior wall painting and waterproofing', services: 4, providers: 18, status: 'Active', iconColor: 'text-rose-600', bgColor: 'bg-rose-50' },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (

      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Categories</h1>
            <p className="text-slate-500 text-sm">Organize services and providers into specialized groups.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Create Category
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Settings2 size={18} />
              Management
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${cat.bgColor} ${cat.iconColor}`}>
                    <Layers size={24} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {cat.status}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
                  {cat.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Briefcase size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Services</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800">{cat.services}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Users size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Providers</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800">{cat.providers}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 px-6 py-3 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                <div className="flex gap-3">
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-rose-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:gap-2 transition-all">
                  Manage Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State / Add Suggestion */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Plus size={24} />
          </div>
          <h4 className="font-bold text-slate-900">Add a New Category</h4>
          <p className="text-sm text-slate-500 max-w-xs mt-1">
            Need to expand your business? Create a new service sector for your customers.
          </p>
          <button className="mt-4 text-sm font-bold text-indigo-600 hover:underline">
            Click here to start
          </button>
        </div>

      </div>

  );
}