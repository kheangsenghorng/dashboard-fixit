"use client";
import React, { useState, useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  BarChart3, 
  Tag, 
  Box, 
  MoreHorizontal, 
  ArrowUpDown,
  Filter,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react';

// Mock Data for Inventory
const initialProducts = [
  { id: 1, name: 'Brake Pad Set (Ceramic)', sku: 'BRK-8802', category: 'Braking System', stock: 45, price: 55.00, status: 'In Stock' },
  { id: 2, name: 'Oil Filter - Premium', sku: 'OIL-4410', category: 'Engine', stock: 12, price: 12.50, status: 'Low Stock' },
  { id: 3, name: 'Spark Plug Platinum', sku: 'SPK-1122', category: 'Ignition', stock: 150, price: 8.99, status: 'In Stock' },
  { id: 4, name: 'Suspension Strut - Front', sku: 'SUS-9900', category: 'Suspension', stock: 0, price: 185.00, status: 'Out of Stock' },
  { id: 5, name: 'Alternator - 12V High Output', sku: 'ALT-3344', category: 'Electrical', stock: 8, price: 210.00, status: 'Low Stock' },
];

export default function ProductsPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
  const { user } = useAuthGuard();
  const [searchTerm, setSearchTerm] = useState('');

  if (!mounted || !user) return null;


  return (

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mechanical Items</h1>
            <p className="text-slate-500 text-sm">Monitor stock levels and manage spare parts inventory.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Add New Item
          </button>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total SKUs</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">1,402</h3>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Box size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold text-rose-600 mt-1">18 Items</h3>
              </div>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inventory Value</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">$42,850.00</h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Table & Controls */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by SKU, item name or category..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white">
                <Filter size={16} />
                Category
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white">
                <ArrowUpDown size={16} />
                Sort
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Item & SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Price (Unit)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
                          <p className="text-[11px] font-mono text-slate-500 mt-1">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md w-fit">
                        <Tag size={12} />
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-900">{item.stock} Units</span>
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.stock > 30 ? 'bg-emerald-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} 
                            style={{ width: `${Math.min(item.stock, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors">
                          <Trash2 size={16} />
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