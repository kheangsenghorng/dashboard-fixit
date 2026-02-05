"use client";
import React from 'react';

import { 
  Zap, 
  Wrench, 
  Lightbulb, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  ArrowLeft,

  AlertCircle,
  MoreHorizontal,

} from 'lucide-react';
import Link from 'next/link';

// Specialized Data for Electrical Category
const subServices = [
  { id: 1, name: 'Full House Re-wiring', price: '$1,200+', time: '2-4 Days', risk: 'High', status: 'Active' },
  { id: 2, name: 'Socket/Outlet Repair', price: '$45.00', time: '1 hr', risk: 'Low', status: 'Active' },
  { id: 3, name: 'LED Lighting Installation', price: '$150.00', time: '3 hrs', risk: 'Medium', status: 'Active' },
  { id: 4, name: 'Circuit Breaker Triage', price: '$85.00', time: '1.5 hrs', risk: 'High', status: 'Active' },
];

const specializedProviders = [
  { name: 'Marcus Volt', rating: 4.9, license: 'L-9902', status: 'On-Job' },
  { name: 'Sarah Spark', rating: 4.8, license: 'L-4410', status: 'Available' },
];

export default function ElectricalCategoryPage() {
  return (

      <div className="space-y-6">
        
        {/* Breadcrumb & Back Button */}
        <Link 
          href="/admin/categories" 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium w-fit"
        >
          <ArrowLeft size={16} />
          Back to Categories
        </Link>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-inner">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Electrical Services</h1>
              <p className="text-slate-500 text-sm">Wiring, socket repairs, and lighting installations management.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              Edit Category
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all">
              Add Sub-Service
            </button>
          </div>
        </div>

        {/* Specialized Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Monthly Revenue</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">$12,450</h3>
              <span className="flex items-center text-emerald-500 text-xs font-bold">
                <TrendingUp size={14} className="mr-1" /> +8%
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Active Electricians</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">45</h3>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Safety Compliance</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-bold text-emerald-600">98%</h3>
              <ShieldAlert size={20} className="text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Services List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-900">Sub-Services Breakdown</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-3">Service Name</th>
                  <th className="px-6 py-3">Pricing</th>
                  <th className="px-6 py-3">Risk Level</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-amber-500 transition-colors">
                          {service.name.includes('Lighting') ? <Lightbulb size={18} /> : <Wrench size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{service.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium italic">Est. {service.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      {service.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        service.risk === 'High' ? 'text-rose-600 bg-rose-50' : 
                        service.risk === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                      }`}>
                        {service.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Specialized Providers Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                Top Sparkies
                <Users size={18} className="text-slate-400" />
              </h3>
              <div className="space-y-4">
                {specializedProviders.map((pro, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                        {pro.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{pro.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">License: {pro.license}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">★ {pro.rating}</div>
                      <div className={`text-[10px] font-bold ${pro.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {pro.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all">
                View All Electricians
              </button>
            </div>

            {/* Quick Safety Notice */}
            <div className="bg-amber-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
              <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 group-hover:rotate-12 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Safety Alert</span>
                </div>
                <p className="text-xs text-amber-100 leading-relaxed font-medium">
                  All wiring jobs over 240V require high-voltage certification check before dispatch.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

  );
}