"use client";
import React, { useState } from 'react';

import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  DollarSign, 
  Clock, 
  Layers,
  MoreVertical,
  CheckCircle2,
  Circle
} from 'lucide-react';

// Mock Data for Services
const initialServices = [
  { 
    id: 1, 
    name: 'Full House Deep Cleaning', 
    category: 'Cleaning', 
    basePrice: 120.00, 
    duration: '4-6 hrs', 
    status: 'Active',
    popularity: 'High'
  },
  { 
    id: 2, 
    name: 'Electrical Socket Repair', 
    category: 'Electrical', 
    basePrice: 45.00, 
    duration: '1 hr', 
    status: 'Active',
    popularity: 'Medium'
  },
  { 
    id: 3, 
    name: 'Emergency Pipe Leak', 
    category: 'Plumbing', 
    basePrice: 85.00, 
    duration: '2 hrs', 
    status: 'Active',
    popularity: 'High'
  },
  { 
    id: 4, 
    name: 'Kitchen Cabinet Painting', 
    category: 'Renovation', 
    basePrice: 350.00, 
    duration: '2 Days', 
    status: 'Inactive',
    popularity: 'Low'
  },
  { 
    id: 5, 
    name: 'AC Gas Refill', 
    category: 'HVAC', 
    basePrice: 60.00, 
    duration: '1.5 hrs', 
    status: 'Active',
    popularity: 'Medium'
  }
];

export default function ServicesListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (

      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Services Catalog</h1>
            <p className="text-slate-500 text-sm">Define and manage the services available on your platform.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Create New Service
          </button>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Services</p>
              <h3 className="text-2xl font-bold text-slate-900">24</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active</p>
              <h3 className="text-2xl font-bold text-slate-900">21</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Categories</p>
              <h3 className="text-2xl font-bold text-slate-900">8</h3>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search services by name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Sort
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Base Price</th>
                  <th className="px-6 py-4">Est. Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{service.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
                          service.popularity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {service.popularity} Demand
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                        <Layers size={14} className="text-slate-400" />
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-bold text-slate-900">
                        <DollarSign size={14} className="text-slate-400" />
                        {service.basePrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        {service.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {service.status === 'Active' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 size={14} /> Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                            <Circle size={14} /> Inactive
                          </div>
                        )}
                      </div>
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
        </div>

      </div>
   
  );
}