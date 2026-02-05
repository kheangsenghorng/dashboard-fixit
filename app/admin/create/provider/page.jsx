"use client";
import React from 'react';

import { HardHat, User, Briefcase, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProviderPage() {
  return (

      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/providers" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Providers
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Register Service Provider</h1>
              <p className="text-slate-400 text-sm mt-1">Connect a technician or business to your platform.</p>
            </div>
            <HardHat size={40} className="text-indigo-400 opacity-50" />
          </div>

          <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Owner Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
                <User size={18} className="text-indigo-600" />
                Business Owner Info
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Owner Full Name</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            {/* Business Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
                <Briefcase size={18} className="text-indigo-600" />
                Service Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Business/Shop Name</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Specialty</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500">
                    <option>Select Category</option>
                    <option>Mechanical (Auto)</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
                <MapPin size={18} className="text-indigo-600" />
                Location & Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Operating City" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <ShieldCheck size={24} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Instant Verification</p>
                    <p className="text-[10px] text-emerald-600">Admin will bypass document review</p>
                  </div>
                  <input type="checkbox" className="ml-auto w-5 h-5 accent-emerald-600" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2">
                Create Provider & Authorize
              </button>
            </div>
          </form>
        </div>
      </div>

  );
}