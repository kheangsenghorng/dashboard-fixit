"use client";

import React from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Layers,
  ChevronDown,
  ArrowRight,
  Handshake,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";

const SabyTinhLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#1e293b]">
      {/* --- 1. NAVBAR --- */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <h1 className="text-2xl font-black tracking-tighter text-black">
            SABY-TINH
          </h1>

          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <li className="cursor-pointer hover:text-blue-600 transition">
              Home
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
              Shop <ChevronDown size={14} />
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
              Categories <ChevronDown size={14} />
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
              Brands <ChevronDown size={14} />
            </li>
            <li className="cursor-pointer hover:text-blue-600 transition">
              Products
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-100 rounded-full py-2 pl-10 pr-12 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Quick registry search..."
            />
            <div className="absolute right-3 top-1.5 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-gray-400">
              ⌘ K
            </div>
          </div>

          {/* Icons & Login */}
          <div className="flex items-center gap-4 text-gray-600">
            <Heart
              size={22}
              className="cursor-pointer hover:text-red-500 transition"
            />
            <ShoppingBag
              size={22}
              className="cursor-pointer hover:text-blue-600 transition"
            />
            <Link href="/auth/login">
              <button className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION (SIDEBAR + BANNER) --- */}
      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
        {/* SIDEBAR CATEGORY */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-black p-2 rounded-lg text-white">
                  <Layers size={20} />
                </div>
                <h2 className="font-bold text-sm tracking-widest uppercase">
                  Category
                </h2>
              </div>

              {/* Skeleton Category List */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-50 rounded-2xl w-full hover:bg-gray-100 transition cursor-pointer"
                  ></div>
                ))}
              </div>
            </div>

            <button className="mt-8 w-full py-4 border border-gray-100 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 transition">
              Explore All Categories <ArrowRight size={16} />
            </button>
          </div>
        </aside>

        {/* LARGE BANNER */}
        <section className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 h-full min-h-[600px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 blur-[120px] rounded-full"></div>

            <div className="text-center z-10">
              <p className="text-gray-400 font-medium tracking-[0.5em] text-sm uppercase animate-pulse">
                Loading events...
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- 3. PARTNERS SECTION --- */}
      <section className="py-24 px-8 text-center max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-3xl text-purple-600">
            <Handshake size={32} />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Our Trusted Cambodian Delivery Partners
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          We partner with the best food tech and express delivery companies to
          bring your orders faster and safer across Cambodia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Banner 1 */}
          <div className="group h-72 rounded-[2.5rem] overflow-hidden bg-[#FF2B85] relative shadow-xl transition-transform hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
              alt="Partner"
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <span className="text-white font-bold text-2xl">Foodpanda</span>
            </div>
          </div>
          {/* Banner 2 */}
          <div className="group h-72 rounded-[2.5rem] overflow-hidden bg-[#00B14F] relative shadow-xl transition-transform hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
              alt="Partner"
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <span className="text-white font-bold text-2xl">
                Grab Cambodia
              </span>
            </div>
          </div>
          {/* Banner 3 */}
          <div className="group h-72 rounded-[2.5rem] overflow-hidden bg-[#F5A623] relative shadow-xl transition-transform hover:-translate-y-2">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
              alt="Partner"
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <span className="text-white font-bold text-2xl">
                E-Gets / Nham24
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-8">
        <hr className="border-gray-100" />
      </div>

      {/* --- 4. FOOTER --- */}
      <footer className="py-24 px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                <span className="text-2xl">S</span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter">
                SABY-TINH
              </h3>
            </div>
            <p className="text-gray-500 leading-relaxed mb-10 max-w-sm">
              Next-generation terminal for high-performance computing, mobile
              architecture, and professional node registry.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-black mb-8">
              Inventory Nodes
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              {[
                "Registry Store",
                "New Units",
                "Featured Gear",
                "System Nodes",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-blue-600 cursor-pointer flex items-center gap-3 transition"
                >
                  <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-black mb-8">
              Support Terminal
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              {[
                "Help Center",
                "Contact Us",
                "Warranty Protocol",
                "Link Status",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-blue-600 cursor-pointer flex items-center gap-3 transition"
                >
                  <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-black mb-8">
              Registry Policy
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Admin about",
                "About Us",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-blue-600 cursor-pointer flex items-center gap-3 transition"
                >
                  <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Badge Column */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-5">
                <ShieldCheck size={32} />
              </div>
              <h5 className="font-bold text-sm mb-2 text-black">
                Verified Gear
              </h5>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Official manufacturer warranty & secure procurement.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* --- 5. FLOATING JOIN BUTTON --- */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full py-4 px-8 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all transform cursor-pointer">
          <div className="bg-black p-2.5 rounded-xl text-white">
            <Store size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">
              Start Selling
            </p>
            <p className="text-base font-black flex items-center gap-1 text-black">
              Join Now <ArrowRight size={16} />
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SabyTinhLandingPage;
