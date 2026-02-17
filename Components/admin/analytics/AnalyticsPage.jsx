"use client";
import React, { useState } from 'react';

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '$45,231.89', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Active Users', value: '2,345', change: '+18.2%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Services Completed', value: '842', change: '-4.4%', trend: 'down', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Provider Growth', value: '12%', change: '+2.1%', trend: 'up', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const topServices = [
  { name: 'Electrical Repair', orders: 145, revenue: '$12,400', growth: 85 },
  { name: 'Plumbing Checkup', orders: 120, revenue: '$8,200', growth: 70 },
  { name: 'AC Maintenance', orders: 98, revenue: '$15,600', growth: 92 },
  { name: 'Home Painting', orders: 45, revenue: '$22,000', growth: 40 },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('Last 30 Days');

  return (

      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
            <p className="text-slate-500 text-sm">Track your service performance and revenue growth.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
              <Calendar size={16} className="text-slate-400 mr-2" />
              <select 
                className="bg-transparent text-sm font-medium outline-none text-slate-600 cursor-pointer"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart Mockup */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900">Revenue Forecast</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 bg-indigo-600 rounded-full"></span> This Month
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 bg-slate-200 rounded-full"></span> Last Month
                </div>
              </div>
            </div>

            {/* Simple CSS Bar Chart */}
            <div className="flex items-end justify-between h-64 gap-2 pt-4">
              {[40, 70, 55, 90, 65, 80, 50, 95, 85, 75, 60, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full bg-slate-50 rounded-t-lg h-full overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-400" 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Top Services</h3>
            <div className="space-y-6">
              {topServices.map((service) => (
                <div key={service.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{service.name}</span>
                    <span className="text-slate-500">{service.orders} orders</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full" 
                      style={{ width: `${service.growth}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
              View Detailed Report
            </button>
          </div>

        </div>

        {/* Bottom Section: Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Provider Performance</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Completion Rate</th>
                  <th className="px-6 py-4">Revenue Gen.</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {['JS', 'MK', 'LR'][i]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{['John Smith', 'Mike Ross', 'Laura Ray'][i]}</p>
                          <p className="text-xs text-slate-500">Electrician</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        ★ 4.{9-i}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-700 font-medium">{98 - (i*2)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      $2,400.00
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                        Active
                      </span>
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