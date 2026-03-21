"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/Components/admin/sidebar/Sidebar";
import Navbar from "@/Components/admin/navbar/Navbar";

const STORAGE_KEY = "admin_sidebar_collapsed";

// Breakpoints
const MOBILE_MAX = 768; // < 768  → mobile drawer
const TABLET_MAX = 1024; // 768–1023 → iPad drawer
// >= 1024 → desktop collapse/expand

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile + iPad drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop only

  // ✅ Load saved preference (desktop only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setSidebarCollapsed(true);
    if (saved === "false") setSidebarCollapsed(false);
  }, []);

  // ✅ Handle resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      const w = window.innerWidth;

      // Mobile + iPad (< 1024): use drawer, close it on resize
      if (w < TABLET_MAX) {
        setSidebarOpen(false); // close drawer on resize
        return;
      }

      // Desktop (>= 1024): restore saved collapse preference
      if (w >= TABLET_MAX) {
        setSidebarOpen(false); // ensure drawer is closed
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "true") setSidebarCollapsed(true);
        if (saved === "false") setSidebarCollapsed(false);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Navbar menu button:
  // - mobile + iPad (< 1024): toggle drawer open/close
  // - desktop (>= 1024):      collapse/expand + save to localStorage
  const onNavbarMenuClick = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;

    if (w < TABLET_MAX) {
      // Mobile + iPad → drawer toggle
      setSidebarOpen((v) => !v);
      return;
    }

    // Desktop → collapse toggle + persist
    setSidebarCollapsed((v) => {
      const next = !v;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <AdminSidebar
        isOpen={sidebarOpen} // drawer open: mobile + iPad
        toggleSidebar={closeMobileSidebar}
        isCollapsed={sidebarCollapsed} // collapse: desktop only
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar toggleSidebar={onNavbarMenuClick} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
