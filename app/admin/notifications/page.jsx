"use client";
import React from 'react';

import { Info, AlertTriangle, CheckCircle, Trash2, MailOpen } from 'lucide-react';

const notifications = [
  { id: 1, type: 'info', title: 'New Provider Signup', msg: 'Marcus Volt applied for Electrical category.', time: '2 mins ago', read: false },
  { id: 2, type: 'warning', title: 'Low Stock Alert', msg: 'Oil Filters are below 10 units in inventory.', time: '1 hour ago', read: false },
  { id: 3, type: 'success', title: 'Service Completed', msg: 'Order #ORD-9902 was successfully closed.', time: '5 hours ago', read: true },
  { id: 4, type: 'info', title: 'System Update', msg: 'Dashboard version 2.4.0 is now live.', time: '1 day ago', read: true },
];

export default function NotificationsPage() {
  return (

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-sm">Stay updated with the latest system activities.</p>
          </div>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Mark all as read</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {notifications.map((n) => (
            <div key={n.id} className={`p-6 flex gap-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
              <div className={`p-2 h-fit rounded-lg ${
                n.type === 'info' ? 'bg-blue-50 text-blue-600' : 
                n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 
                'bg-emerald-50 text-emerald-600'
              }`}>
                {n.type === 'info' && <Info size={20} />}
                {n.type === 'warning' && <AlertTriangle size={20} />}
                {n.type === 'success' && <CheckCircle size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{n.msg}</p>
                <div className="flex gap-4 mt-3">
                  <button className="text-[12px] font-bold text-indigo-600 flex items-center gap-1">
                    <MailOpen size={14} /> Mark as read
                  </button>
                  <button className="text-[12px] font-bold text-rose-500 flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}