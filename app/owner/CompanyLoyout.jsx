"use client";
import React, { useState } from 'react';

import Navbar from '@/Components/admin/navbar/Navbar';
import AdminSidebar from '@/Components/admin/sidebar/Sidebar';
import { useParams } from 'next/navigation';
export default function CompanyLoyout({ children }) {

    
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* 1. The Sidebar - Controlled by sidebarOpen state */}
      <AdminSidebar
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(false)} 
      />

      {/* 2. The Main Viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* 3. The Navbar - Passes the function to open the sidebar */}
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        {/* 4. Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}