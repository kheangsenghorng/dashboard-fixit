"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  LayoutGrid,
  ArrowRight,
  LogOut,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCategoryStore } from "../../app/store/useCategoryStore";
import { useAuthGuard } from "../../app/hooks/useAuthGuard";
import { useAuthStore } from "../../app/store/useAuthStore";
import { decodeId, encodeId } from "../../app/utils/hashids";
import { useCategoryRealtime } from "../../app/hooks/useCategoryRealtime";
import { useTypeStore } from "../../app/store/useTypeStore";

export default function NavbarFixit() {
  const params = useParams();
  const rawCategoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const categoryId = rawCategoryId ? decodeId(rawCategoryId) : null;

  const router = useRouter();
  const { user: authUser, initialized } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout);

  const categories = useCategoryStore((s) => s.categories ?? []);
  const catLoading = useCategoryStore((s) => s.isLoading);
  const FetchActiveCategories = useCategoryStore(
    (s) => s.FetchActiveCategories
  );

  const activeTypes = useTypeStore((s) => s.activeTypes ?? []);
  const typeLoading = useTypeStore((s) => s.isLoading);
  const fetchTypeAction = useTypeStore((s) => s.fetchTypeAction);

  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(0);
  const [catSearch, setCatSearch] = useState("");
  const [wishlistCount] = useState(0);

  const categoryDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  useCategoryRealtime();

  const getDashboardRoute = () => {
    if (!authUser) return "/auth/login";

    switch (authUser.role) {
      case "admin":
        return "/admin/dashboard";
      case "owner":
        return "/owner/dashboard";
      case "customer":
        return "/my-profile";
      default:
        return "/";
    }
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() ?? "?";

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setOpenMobile(false);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      (cat?.name ?? "").toLowerCase().includes(catSearch.toLowerCase())
    );
  }, [categories, catSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setOpenCategory(false);
      }

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        setOpenType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    FetchActiveCategories?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTypeAction?.();
  }, [categoryId, fetchTypeAction]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <header className="w-full bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/50 shadow-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl font-black text-slate-950 tracking-tighter uppercase group-hover:text-amber-600 transition-colors duration-300">
                Fixit
              </span>
              <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                Solutions
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/company"
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200 relative group"
              >
                Company
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenCategory((prev) => !prev);
                    setCatSearch("");
                    setOpenType(false);
                  }}
                  className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                    openCategory
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Categories
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openCategory ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openCategory && (
                  <div className="absolute left-[-150px] top-full pt-4 w-[900px]">
                    <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 flex overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                      <div className="w-[35%] bg-gradient-to-b from-slate-50 to-white p-10 border-r border-slate-200 flex flex-col">
                        <div className="bg-amber-100/30 shadow-sm w-14 h-14 rounded-xl flex items-center justify-center text-amber-600 mb-6 border border-amber-200">
                          <LayoutGrid size={28} />
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-3 leading-tight">
                          Explore <br /> Categories
                        </h3>

                        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                          Find what you need among our {categories.length}{" "}
                          categories.
                        </p>

                        <div className="relative mb-6">
                          <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                          />
                        </div>

                        <Link
                          href="/category"
                          onClick={() => setOpenCategory(false)}
                          className="mt-auto text-amber-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          View All <ArrowRight size={16} />
                        </Link>
                      </div>

                      <div className="w-[65%] p-8">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                          {catLoading ? (
                            <div className="col-span-2 flex items-center justify-center py-20 text-slate-400 text-sm italic">
                              Loading categories...
                            </div>
                          ) : filteredCategories.length > 0 ? (
                            filteredCategories
                              .slice(0, catSearch ? 100 : 12)
                              .map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/category/${encodeId(cat.id)}`}
                                  onClick={() => setOpenCategory(false)}
                                  className="flex items-center gap-4 group p-3 hover:bg-amber-50 rounded-xl transition-all"
                                >
                                  <div className="w-12 h-12 shrink-0 bg-slate-200 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-all duration-300">
                                    {cat?.icon ? (
                                      <img
                                        src={cat.icon}
                                        className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                                        alt={cat?.name ?? "Category icon"}
                                      />
                                    ) : (
                                      <LayoutGrid size={20} />
                                    )}
                                  </div>

                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors truncate">
                                      {cat?.name ?? "Unnamed category"}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                                      Browse
                                    </span>
                                  </div>
                                </Link>
                              ))
                          ) : (
                            <div className="col-span-2 py-20 text-center">
                              <p className="text-slate-400 text-sm">
                                {catSearch
                                  ? `No categories match "${catSearch}"`
                                  : "No categories available"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenType((prev) => !prev);
                    setOpenCategory(false);
                  }}
                  className={`flex items-center gap-1 text-[13px] font-bold transition py-2 border-b-2 ${
                    openType
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-500 border-transparent hover:text-blue-600"
                  }`}
                >
                  Types
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      openType ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openType && (
                  <div className="absolute left-[-300px] top-full pt-4 z-50">
                    <div className="bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] border border-slate-100 flex overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 w-[850px]">
                      <div className="w-[35%] bg-[#FDFCFB] p-10 border-r border-slate-100 flex flex-col">
                        <div className="bg-white shadow-sm w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 mb-8 border border-orange-50 relative">
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
                          ) : activeTypes.length > 0 ? (
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
                                      alt={type.name ?? "Type icon"}
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

          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative group"
          >
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 rounded-full py-2.5 pl-11 pr-16 w-[350px] text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white border border-slate-200 focus:border-amber-300 transition-all"
              placeholder="Quick search..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 border border-slate-300 rounded-md px-2 py-0.5 text-[10px] text-slate-400 font-mono font-semibold bg-white">
              ⌘ K
            </div>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
              <button className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-rose-500 rounded-lg transition relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </button>

              <button className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-amber-600 rounded-lg transition relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {!initialized ? (
              <div className="w-24 h-9 bg-slate-200 rounded-lg animate-pulse" />
            ) : authUser ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                  {getInitial(authUser.name)}
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    {authUser.name}
                  </p>
                </div>

                <Link
                  href={getDashboardRoute()}
                  className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-amber-600 transition active:scale-95 shadow-md"
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-amber-600 text-white px-8 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-amber-700 transition active:scale-95 shadow-md"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              onClick={() => setOpenMobile((prev) => !prev)}
            >
              {openMobile ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
