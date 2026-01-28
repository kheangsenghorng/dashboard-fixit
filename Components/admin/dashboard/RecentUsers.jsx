import React from "react";

const RecentUsers = () => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 text-lg">System Activity</h3>
      <button className="text-sm font-bold text-indigo-600 hover:underline transition-all">View All</button>
    </div>
    <div className="overflow-x-auto px-2">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="px-6 py-4">Session</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3].map((i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-all group">
              <td className="px-6 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">
                  {i === 1 ? 'JD' : i === 2 ? 'BK' : 'MW'}
                </div>
                <span className="font-bold text-slate-700 text-sm italic tracking-tight">Access Node #{i}</span>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase border border-green-100">Live</span>
              </td>
              <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tighter">Just Now</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentUsers;