"use client";
import React, { useState } from 'react';

import { 
  Package, 
  Zap, 
  ArrowLeft, 
  Save, 
  Tag, 
  Hash, 
  DollarSign, 
  Box, 
  AlertCircle,
  ShieldCheck,

} from 'lucide-react';
import Link from 'next/link';

export default function CreateElectricalItemPage() {
  const [stock, setStock] = useState(0);

  return (

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium w-fit"
        >
          <ArrowLeft size={16} />
          Back to Mechanical Items
        </Link>

        {/* Page Header */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl relative overflow-hidden">
          <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-500 opacity-20 rotate-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Package size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Mechanical Inventory</span>
            </div>
            <h1 className="text-2xl font-bold">Add Electrical Part</h1>
            <p className="text-slate-400 text-sm mt-1">Register a new electrical component for service providers.</p>
          </div>
          <div className="relative z-10 hidden md:block">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">Category Link</p>
              <p className="text-sm font-bold flex items-center gap-2">
                <Zap size={14} className="text-amber-400" /> Electrical Maintenance
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Tag size={18} className="text-indigo-600" /> General Information
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 16A Circuit Breaker (Single Pole)" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">SKU / Serial</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="ELEC-001" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Schneider" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Technical Specs</label>
                  <textarea 
                    rows="3" 
                    placeholder="Voltage rating, Ampere, Material type..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <DollarSign size={18} className="text-indigo-600" /> Pricing & Commission
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Unit Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  </div>
                  <p className="text-[10px] text-slate-400">Your 10% fee will be calculated on this price.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Unit Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info (Right Column) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Box size={18} className="text-indigo-600" /> Inventory Level
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
                  <input 
                    type="number" 
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Low Stock Alert</label>
                  <input type="number" placeholder="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl flex gap-3 ${stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Items will be automatically available for Providers in the "Electrical" category once saved.
                </p>
              </div>
            </div>

            {/* Certification / Safety */}
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-4">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <ShieldCheck size={18} /> Quality Standard
              </h4>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Ensure this mechanical item meets the ISO-9001 standard for high-voltage electrical equipment.
              </p>
              <div className="flex items-center gap-2">
                 <input type="checkbox" className="w-4 h-4 rounded accent-indigo-600" id="verify" />
                 <label htmlFor="verify" className="text-[11px] font-bold text-indigo-900 cursor-pointer">Safety Certified Item</label>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
              <Save size={20} />
              Save Item to Inventory
            </button>
          </div>
        </form>
      </div>

  );
}