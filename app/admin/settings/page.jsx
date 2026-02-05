"use client";
import React from 'react';

import { User, Shield, Bell, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  return (

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500 text-sm">Update your profile and application configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Sidebar */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold bg-indigo-50 text-indigo-600 rounded-xl">
              <User size={18} /> Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl">
              <Shield size={18} /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl">
              <Bell size={18} /> Notifications
            </button>
          </div>

          {/* Settings Form */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input type="text" defaultValue="System Admin" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input type="email" defaultValue="admin@fixit.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / Description</label>
                <textarea rows="3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="Main administrator for the FIX-IT platform. Responsible for provider verification and service management."></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md transition-all">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
            
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
              <h3 className="text-sm font-bold text-rose-900">Danger Zone</h3>
              <p className="text-xs text-rose-600 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700">Delete Account</button>
            </div>
          </div>
        </div>
      </div>

  );
}