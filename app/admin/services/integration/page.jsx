"use client";
import React, { useState } from 'react';

import { 

  Package, 
  Plus, 

  Settings2, 
  Zap, 
  Layers,
  ArrowRight,

  Info
} from 'lucide-react';

// Mock Data for Services that need Parts
const serviceBundles = [
  { 
    id: 1, 
    serviceName: 'Full House Re-wiring', 
    category: 'Electrical',
    laborPrice: 800.00,
    requiredParts: [
      { id: 101, name: 'Copper Wiring (100m)', price: 150.00, qty: 2 },
      { id: 102, name: 'Circuit Breaker 16A', price: 25.00, qty: 5 }
    ]
  },
  { 
    id: 2, 
    serviceName: 'AC Gas Refill & Filter', 
    category: 'HVAC',
    laborPrice: 60.00,
    requiredParts: [
      { id: 201, name: 'Refrigerant Gas R32', price: 40.00, qty: 1 },
      { id: 202, name: 'Anti-Bacterial Filter', price: 15.00, qty: 1 }
    ]
  }
];

export default function ServicePartsIntegration() {
  return (

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service & Parts Bundles</h1>
            <p className="text-slate-500 text-sm">Link Mechanical Items (parts) to Services (labor) for accurate customer billing.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all">
            <Plus size={18} />
            Create New Bundle
          </button>
        </div>

        {/* Integration Alert */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
          <Info size={20} className="shrink-0" />
          <p className="text-sm leading-relaxed">
            <strong>Platform Rule:</strong> When a Provider completes a job, the 10% platform fee is calculated on the <b>Labor + Parts</b> total.
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {serviceBundles.map((bundle) => {
            const partsTotal = bundle.requiredParts.reduce((acc, p) => acc + (p.price * p.qty), 0);
            const grandTotal = bundle.laborPrice + partsTotal;

            return (
              <div key={bundle.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Header of Card */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl text-indigo-600 shadow-sm">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{bundle.serviceName}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{bundle.category} Labor</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Settings2 size={18} />
                  </button>
                </div>

                {/* Body: Parts List */}
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Mechanical Items (Parts)</span>
                    <span>Cost</span>
                  </div>
                  <div className="space-y-2">
                    {bundle.requiredParts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-white hover:ring-1 hover:ring-indigo-100 transition-all">
                        <div className="flex items-center gap-3">
                          <Package size={16} className="text-slate-400" />
                          <div>
                            <p className="text-sm font-bold text-slate-700">{part.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Qty: {part.qty}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-900">${(part.price * part.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <Plus size={14} /> Add Another Part
                  </button>
                </div>

                {/* Footer: Calculation */}
                <div className="p-6 bg-slate-900 text-white mt-auto">
                  <div className="space-y-2 mb-4 opacity-80">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Service Labor</span>
                      <span>${bundle.laborPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>Mechanical Parts Total</span>
                      <span>${partsTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Customer Total</p>
                      <h4 className="text-2xl font-bold">${grandTotal.toFixed(2)}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Admin 10%</p>
                      <p className="font-bold text-lg">${(grandTotal * 0.1).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link UI Section */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
           <Layers className="absolute -left-8 -bottom-8 w-40 h-40 opacity-10" />
           <div className="relative z-10 flex-1 space-y-2">
             <h2 className="text-2xl font-bold">Need to fix a specific problem?</h2>
             <p className="text-indigo-100 text-sm">Assign specific mechanical categories to your electrical providers to enable them to use spare parts in their jobs.</p>
           </div>
           <button className="relative z-10 bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2">
             Assign Category Access <ArrowRight size={18} />
           </button>
        </div>

      </div>
  );
}