"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, UserPlus, Wrench, HardHat, Users, Layers, 
  Package, Settings, Plus, ChevronDown, LogOut, ShieldCheck, 
  BarChart4, Briefcase, Bell, X, ChevronRight,
  Wallet, FileText, Ticket, Star, MessageSquare,
  TableProperties, List // Added for Table views
} from 'lucide-react';

const adminGroups = [
  {
    title: "Overview",
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart4 },
    ]
  },
  {
    title: "Account Management",
    items: [
      { name: 'Customers/Users', href: '/admin/users', icon: Users },
      { name: 'Service Providers', href: '/admin/providers', icon: HardHat },
    ]
  },
  {
    title: "Service & Inventory",
    items: [
      { name: 'Services List', href: '/admin/services', icon: Briefcase },
      { name: 'Mechanical Items', href: '/admin/products', icon: Package },
      { name: 'Service Categories', href: '/admin/service-categories', icon: Layers },
    ]
  },
  {
    title: "Financial Management", 
    items: [
      { name: 'Transactions', href: '/admin/payments', icon: Wallet },
      { name: 'Invoices', href: '/admin/invoices', icon: FileText },
      { name: 'Coupons/Promos', href: '/admin/coupons', icon: Ticket },
    ]
  },
  {
    title: "Feedback & Support", 
    items: [
      { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
      { name: 'Reviews/Ratings', href: '/admin/reviews', icon: Star },
    ]
  }
];

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  
  // State for Create Dropdowns
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categorySubOpen, setCategorySubOpen] = useState(false);
  const [productSubOpen, setProductSubOpen] = useState(false);

  // State for Table Dropdowns
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [tableCategorySubOpen, setTableCategorySubOpen] = useState(false);
  const [tableProductSubOpen, setTableProductSubOpen] = useState(false);

  // Helper to close one when opening the other
  const toggleCreate = () => {
    setIsCreateOpen(!isCreateOpen);
    setIsTableOpen(false);
  };

  const toggleTable = () => {
    setIsTableOpen(!isTableOpen);
    setIsCreateOpen(false);
  };

  // Close sub-menus when the main menus are closed
  useEffect(() => {
    if (!isCreateOpen) {
      setCategorySubOpen(false);
      setProductSubOpen(false);
    }
    if (!isTableOpen) {
        setTableCategorySubOpen(false);
        setTableProductSubOpen(false);
    }
  }, [isCreateOpen, isTableOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-600 
        transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-200
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Logo Section */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FIX<span className="text-indigo-600">ADMIN</span>
            </span>
          </div>
          <button className="p-1 text-slate-400 hover:text-slate-600 lg:hidden" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        {/* ADMIN ACTIONS: Dropdowns Section */}
        <div className="px-4 pt-6 pb-2 space-y-2 flex-shrink-0">
          
          {/* 1. CREATE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={toggleCreate}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all shadow-sm font-medium border ${
                isCreateOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                <span>Create New</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isCreateOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCreateOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl z-30 animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto">
                <Link href="/admin/create/user" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-slate-50">
                  <UserPlus size={16} /> New User
                </Link>
                <Link href="/admin/create/provider" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-slate-50">
                  <HardHat size={16} /> New Provider
                </Link>
                <div className="border-b border-slate-50">
                  <button onClick={() => setCategorySubOpen(!categorySubOpen)} className="flex items-center justify-between w-full px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 transition-colors">
                    <div className="flex items-center gap-2"><Layers size={16} /> New Category</div>
                    <ChevronRight size={14} className={`transition-transform ${categorySubOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {categorySubOpen && (
                    <div className="bg-slate-50 py-1 shadow-inner">
                      <Link href="/admin/create/category?type=service" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">Service Type</Link>
                      <Link href="/admin/create/category?type=mechanical" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">Mechanical Type</Link>
                    </div>
                  )}
                </div>
                <Link href="/admin/create/service" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-slate-50">
                  <Wrench size={16} /> New Service
                </Link>
                <div>
                  <button onClick={() => setProductSubOpen(!productSubOpen)} className="flex items-center justify-between w-full px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 transition-colors">
                    <div className="flex items-center gap-2"><Package size={16} /> New Product</div>
                    <ChevronRight size={14} className={`transition-transform ${productSubOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {productSubOpen && (
                    <div className="bg-slate-50 py-1 shadow-inner">
                      <Link href="/admin/create/product" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">General Item</Link>
                      <Link href="/admin/create/product/electrical" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">Electrical Part</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. VIEW TABLES DROPDOWN */}
          <div className="relative">
            <button 
              onClick={toggleTable}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all shadow-sm font-medium border ${
                isTableOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <List size={18} />
                <span>Manage Data</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isTableOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTableOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl z-30 animate-in fade-in slide-in-from-top-2 max-h-[400px] overflow-y-auto">
                <Link href="/admin/users" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50">
                  <Users size={16} /> Users List
                </Link>
                <Link href="/admin/providers" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50">
                  <HardHat size={16} /> Providers List
                </Link>
                <div className="border-b border-slate-50">
                  <button onClick={() => setTableCategorySubOpen(!tableCategorySubOpen)} className="flex items-center justify-between w-full px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2"><Layers size={16} /> Categories</div>
                    <ChevronRight size={14} className={`transition-transform ${tableCategorySubOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {tableCategorySubOpen && (
                    <div className="bg-slate-50 py-1 shadow-inner">
                      <Link href="/admin/categories/service" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors">Service Categories</Link>
                      <Link href="/admin/categories/mechanical" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors">Mechanical Categories</Link>
                    </div>
                  )}
                </div>
                <Link href="/admin/services" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50">
                  <TableProperties size={16} /> Services List
                </Link>
                <div>
                  <button onClick={() => setTableProductSubOpen(!tableProductSubOpen)} className="flex items-center justify-between w-full px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2"><Package size={16} /> Products List</div>
                    <ChevronRight size={14} className={`transition-transform ${tableProductSubOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {tableProductSubOpen && (
                    <div className="bg-slate-50 py-1 shadow-inner">
                      <Link href="/admin/products" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors">General Products</Link>
                      <Link href="/admin/products/electrical" className="flex items-center gap-2 px-8 py-2.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors">Electrical Parts</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-7 overflow-y-auto scrollbar-hide">
          {adminGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 rounded-l-none' 
                          : 'hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                      <span className="text-[14px] font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">System Admin</p>
              <p className="text-xs text-slate-500 truncate italic">Full Access Control</p>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-slate-200 pt-4">
            <Link href="/admin/notifications" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </Link>
            <Link href="/admin/settings" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings size={18} />
            </Link>
            <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}