"use client";
import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        {/* Toggle Button for Mobile - Calls the toggleSidebar function */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 mr-4 text-gray-600 lg:hidden hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Search Input (Hidden on extra small screens) */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-80 bg-gray-50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown Placeholder */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-semibold text-xs">
            AD
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}