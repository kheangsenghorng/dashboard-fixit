"use client";
import React, { useState } from 'react';

import { Layers, Package, Tool, Save, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

export default function CreateCategoryPage() {
  const [type, setType] = useState('service'); // 'service' or 'mechanical'

  return (

      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/categories" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Categories
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-indigo-600 text-white">
            <h1 className="text-2xl font-bold">Create New Category</h1>
            <p className="text-indigo-100 text-sm mt-1">Define a new area for services or mechanical parts.</p>
          </div>

          <form className="p-8 space-y-6">
            {/* TYPE SELECTOR */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Category Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setType('service')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    type === 'service' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Layers size={20} />
                  <span className="font-bold">General Service</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setType('mechanical')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    type === 'mechanical' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Package size={20} />
                  <span className="font-bold">Mechanical Item</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                <input type="text" placeholder="e.g. Engine Repair or AC Service" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Slug (URL)</label>
                <input type="text" placeholder="e.g. engine-repair" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <textarea rows="3" placeholder="Describe what this category covers..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"></textarea>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 text-amber-700">
              <Info size={20} className="shrink-0" />
              <p className="text-xs leading-relaxed">
                {type === 'service' 
                  ? "This category will allow Providers to list their skills and help customers with problems."
                  : "This category will be used to group mechanical items, spare parts, and inventory items."}
              </p>
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2">
              <Save size={20} />
              Confirm & Create Category
            </button>
          </form>
        </div>
      </div>

  );
}