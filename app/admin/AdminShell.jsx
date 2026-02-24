"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/Components/admin/sidebar/Sidebar";
import Navbar from "@/Components/admin/navbar/Navbar";

const STORAGE_KEY = "admin_sidebar_collapsed";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop default open

  // ✅ Load saved preference (desktop only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setSidebarCollapsed(true);
    if (saved === "false") setSidebarCollapsed(false);
  }, []);

  // ✅ Auto-collapse on tablet only (768–1023)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      const w = window.innerWidth;

      // Tablet range: collapse always
      if (w >= 768 && w < 1024) {
        setSidebarCollapsed(true);
        return;
      }

      // Desktop (>=1024): restore saved preference
      if (w >= 1024) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "true") setSidebarCollapsed(true);
        if (saved === "false") setSidebarCollapsed(false);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ ONLY Navbar menu button toggles:
  // - mobile: open drawer
  // - desktop: collapse/expand + save
  const onNavbarMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen((v) => !v);
      return;
    }

    setSidebarCollapsed((v) => {
      const next = !v;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  // Sidebar itself should ONLY close drawer on mobile
  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={closeMobileSidebar}
        isCollapsed={sidebarCollapsed}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar toggleSidebar={onNavbarMenuClick} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}