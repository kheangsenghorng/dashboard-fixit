"use client";
import React, { useState } from 'react';
import { 
  Layers, 
  Package, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Plus,
  CheckCircle2,
  XCircle,
  ArrowUpDown
} from 'lucide-react';

// Mock Data representing the categories you can create from the sidebar
const initialCategories = [
  { id: 1, name: 'Electrical', type: 'Service', description: 'Wiring, lighting, and socket repairs', count: 12, status: 'Active' },
  { id: 2, name: 'Braking System', type: 'Mechanical', description: 'Brake pads, rotors, and fluid', count: 45, status: 'Active' },
  { id: 3, name: 'Plumbing', type: 'Service', description: 'Pipe leaks, drainage, and fittings', count: 8, status: 'Active' },
  { id: 4, name: 'Engine Parts', type: 'Mechanical', description: 'Filters, spark plugs, and belts', count: 120, status: 'Inactive' },
  { id: 5, name: 'AC Maintenance', type: 'Service', description: 'Gas refill and cleaning', count: 5, status: 'Active' },
  { id: 6, name: 'Suspension', type: 'Mechanical', description: 'Shocks, struts, and springs', count: 32, status: 'Active' },
];

export default function CategoryTablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Filter Logic
  const filteredCategories = initialCategories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || cat.type === filterType;
    return matchesSearch && matchesType;
  });

  return (

      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Category List</h1>
            <p className="text-slate-500 text-sm">View and manage your service and mechanical item categories.</p>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
              <Plus size={18} />
              New Category
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', 'Service', 'Mechanical'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filterType === type 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                  : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'
                }`}
              >
                {type} {type !== 'All' ? 'Type' : ''}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                      Category Name <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Linked Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cat.type === 'Service' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                          {cat.type === 'Service' ? <Layers size={18} /> : <Package size={18} />}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat.type === 'Service' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {cat.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 truncate max-w-[200px]">{cat.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">
                        {cat.count} {cat.type === 'Service' ? 'Services' : 'Items'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {cat.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-300">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Empty State */}
          {filteredCategories.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full text-slate-300 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No categories found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

  );
}