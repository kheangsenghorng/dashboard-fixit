"use client";
import React, { useState } from 'react';
import Sidebar from '../../Components/admin/sidebar/Sidebar';
import Navbar from '../../Components/admin/navbar/Navbar';

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    
      <body className="antialiased text-slate-900">
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          />

          {/* Right Side Wrapper */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
   
  );
}