"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  LayoutGrid,
  ArrowRight,
  Zap,
  LogOut,
} from "lucide-react";
import Link from "next/link";

import { useTypeStore } from "../../app/store/useTypeStore";
import { useCategoryStore } from "../../app/store/useCategoryStore";
import { useAuthGuard } from "../../app/hooks/useAuthGuard";
import { useAuthStore } from "../../app/store/useAuthStore";
import { encodeId } from "../../app/utils/hashids";

export default function NavbarFixit() {
  const { user: authUser, initialized } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout); // ← grab logout action
  const { categories, isLoading: catLoading } = useCategoryStore();
  const {
    activeTypes,
    fatchTypeAction,
    isLoading: typeLoading,
  } = useTypeStore();

  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openMobile, setOpenMobile] = useState(false); // ← mobile menu
  const [searchQuery, setSearchQuery] = useState(""); // ← search state
  const [cartCount] = useState(0); // ← replace with your cart store
  const [catSearch, setCatSearch] = useState("");

  const categoryDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const getDashboardRoute = () => {
    if (!authUser) return "/auth/login";
    switch (authUser.role) {
      case "admin":
        return "/admin/dashboard";
      case "owner":
        return "/owner/dashboard";
      case "customer":
        return "/customer";
      default:
        return "/";
    }
  };

  // First letter avatar
  const getInitial = (name) => name?.charAt(0).toUpperCase() ?? "?";

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      )
        setOpenCategory(false);
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      )
        setOpenType(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fatchTypeAction();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <header className="w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-20 px-6">
          {/* ── LEFT: BRAND & NAV ── */}
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-blue-600 transition-colors">
                Fixit
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-[13px] font-bold text-slate-500 hover:text-blue-600 transition"
              >
                Home
              </Link>

              {/* ✅ FIX: Shop now has an href */}
              <Link
                href="/company"
                className="flex items-center gap-1 text-[13px] font-bold text-slate-500 hover:text-blue-600 transition"
              >
                Company <ChevronDown size={14} />
              </Link>

              {/* MEGA MENU: CATEGORIES */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => {
                    setOpenCategory(!openCategory);
                    setOpenType(false);
                    setCatSearch(""); // Reset search when opening
                  }}
                  className={`flex items-center gap-1 text-[13px] font-bold transition py-2 border-b-2 ${
                    openCategory
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-500 border-transparent hover:text-blue-600"
                  }`}
                >
                  Categories{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${openCategory ? "rotate-180" : ""}`}
                  />
                </button>

                {openCategory && (
                  <div className="absolute left-[-150px] top-full pt-4 w-[900px]">
                    <div className="bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-slate-100 flex overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                      {/* LEFT SIDE: STATS & SEARCH */}
                      <div className="w-[35%] bg-[#F8FAFC] p-10 border-r border-slate-100 flex flex-col">
                        <div className="bg-white shadow-sm w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-50">
                          <LayoutGrid size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                          Explore <br /> Categories
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
                          Quickly find what you need among our{" "}
                          {categories?.length ?? 0} categories.
                        </p>

                        {/* SEARCH INPUT INSIDE DROPDOWN */}
                        <div className="relative mb-6">
                          <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            placeholder="Search categories..."
                            onChange={(e) => setCatSearch(e.target.value)} // You'll need to add const [catSearch, setCatSearch] = useState("");
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          />
                        </div>

                        <Link
                          href="/category"
                          onClick={() => setOpenCategory(false)}
                          className="mt-auto text-blue-600 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                        >
                          All Categories Page <ArrowRight size={16} />
                        </Link>
                      </div>

                      {/* RIGHT SIDE: SCROLLABLE LIST */}
                      <div className="w-[65%] p-8">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                          {catLoading ? (
                            <div className="col-span-2 flex items-center justify-center py-20 text-slate-400 text-sm italic">
                              Loading categories...
                            </div>
                          ) : (
                            // Filter logic: if search is empty, show top 12. If searching, show all matches.
                            categories
                              ?.filter((cat) =>
                                cat.name
                                  .toLowerCase()
                                  .includes(catSearch.toLowerCase()),
                              )
                              .slice(0, catSearch ? 100 : 12) // Show more results if user is actively searching
                              .map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/category/${encodeId(cat.id)}`}
                                  onClick={() => setOpenCategory(false)}
                                  className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                  <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                                    <img
                                      src={cat.icon}
                                      className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                                      alt={cat.name}
                                    />
                                  </div>
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                      {cat.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                      Browse
                                    </span>
                                  </div>
                                </Link>
                              ))
                          )}

                          {/* NO RESULTS STATE */}
                          {!catLoading &&
                            categories?.filter((cat) =>
                              cat.name
                                .toLowerCase()
                                .includes(catSearch.toLowerCase()),
                            ).length === 0 && (
                              <div className="col-span-2 py-20 text-center">
                                <p className="text-slate-400 text-sm">
                                  No categories match "{catSearch}"
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MEGA MENU: TYPES */}
              <div className="relative" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenType(!openType);
                    setOpenCategory(false);
                  }}
                  className={`flex items-center gap-1 text-[13px] font-bold transition py-2 border-b-2 ${
                    openType
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-500 border-transparent hover:text-blue-600"
                  }`}
                >
                  Types{" "}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${openType ? "rotate-180" : ""}`}
                  />
                </button>

                {openType && (
                  <div className="absolute left-[-300px] top-full pt-4 z-50">
                    <div className="bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-slate-100 flex overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 w-[850px]">
                      <div className="w-[35%] bg-[#FDFCFB] p-10 border-r border-slate-100 flex flex-col">
                        <div className="bg-white shadow-sm w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 mb-8 border border-orange-50">
                          <Zap
                            size={28}
                            fill="currentColor"
                            className="opacity-20"
                          />
                          <Zap size={28} className="absolute" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                          Explore <br /> Collections
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mb-10 leading-relaxed">
                          Discover products grouped by specific types and unique
                          collections.
                        </p>
                        <Link
                          href="/type"
                          onClick={() => setOpenType(false)}
                          className="mt-auto text-blue-600 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                        >
                          View All Types <ArrowRight size={16} />
                        </Link>
                      </div>
                      <div className="w-[65%] p-10">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                          {typeLoading ? (
                            <div className="col-span-2 py-20 text-center text-slate-400 text-sm italic">
                              Loading types...
                            </div>
                          ) : activeTypes?.length > 0 ? (
                            activeTypes.slice(0, 8).map((type) => (
                              <Link
                                key={type.id}
                                href={`/type/${encodeId(type.id)}`}
                                onClick={() => setOpenType(false)}
                                className="flex items-center gap-5 group cursor-pointer"
                              >
                                <div className="w-14 h-14 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200">
                                  {type.icon ? (
                                    <img
                                      src={type.icon}
                                      alt=""
                                      className="w-7 h-7 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                                    />
                                  ) : (
                                    <Zap
                                      size={22}
                                      className="text-slate-400 group-hover:text-white transition-colors"
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                                    {type.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                                    Explore Type
                                  </span>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="col-span-2 py-10 text-center text-slate-400">
                              No active types found.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ── CENTER: SEARCH ── */}
          {/* ✅ FIX: Now functional with onSubmit */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative group"
          >
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 rounded-full py-2.5 pl-11 pr-16 w-[350px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white border border-transparent focus:border-blue-100 transition-all"
              placeholder="Quick search..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 border border-slate-200 rounded-md px-1.5 py-0.5 text-[10px] text-slate-400 font-mono font-bold bg-white">
              ⌘ K
            </div>
          </form>

          {/* ── RIGHT: USER ACTIONS ── */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-slate-100 pr-4">
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-red-500 rounded-full transition relative">
                <Heart size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* ✅ Cart badge */}
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-full transition relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* ✅ Auth section with initialized guard */}
            {!initialized ? (
              <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
            ) : authUser ? (
              <div className="flex items-center gap-3 pl-2">
                {/* ✅ Avatar with initials */}
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                  {getInitial(authUser.name)}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none">
                    {authUser.name}
                  </p>
                </div>
                <Link href={getDashboardRoute()}>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition active:scale-95 shadow-lg shadow-slate-200">
                    My Account
                  </button>
                </Link>
                {/* ✅ Logout button */}
                <button
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200">
                  Login
                </button>
              </Link>
            )}

            {/* ✅ Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition"
              onClick={() => setOpenMobile(!openMobile)}
            >
              {openMobile ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {openMobile && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            {/* Search bar on mobile */}
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-100 transition-all"
                placeholder="Search..."
              />
            </form>

            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Categories", href: "/categories" },
                { label: "Types", href: "/types" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpenMobile(false)}
                  className="text-[14px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-3 py-2.5 rounded-xl transition"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 pt-4">
              {!initialized ? (
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ) : authUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                      {getInitial(authUser.name)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-none">
                        {authUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                        {authUser.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setOpenMobile(false)}
                    >
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition">
                        Dashboard
                      </button>
                    </Link>
                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setOpenMobile(false);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setOpenMobile(false)}>
                  <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
