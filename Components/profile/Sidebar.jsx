"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  MessageSquare,
  Pencil,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  X,
  Menu, // Added Menu icon
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRequireAuth } from "../../app/hooks/useRequireAuth";
import Image from "next/image";
import { useAuthStore } from "../../app/store/useAuthStore";

const menuItems = [
  { icon: <User size={20} />, label: "My Profile", href: "/my-profile" },
  { icon: <MessageSquare size={20} />, label: "Messages", href: "/messages" },
  { icon: <Pencil size={20} />, label: "Edit Details", href: "/edit" },
  { icon: <Package size={20} />, label: "Purchase History", href: "/history" },
  { icon: <Heart size={20} />, label: "Saved Items", href: "/profile/saved" },
  { icon: <MapPin size={20} />, label: "My Addresses", href: "/addresses" },
  {
    icon: <ShieldCheck size={20} />,
    label: "Privacy & Security",
    href: "/security",
  },
];

const Sidebar = ({ onClose }) => {
  const { user: authUser, initialized } = useRequireAuth();
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();

  // State to manage desktop collapse
  const [isExpanded, setIsExpanded] = useState(true);

  if (!initialized || !authUser) return null;

  return (
    <aside
      className={`relative flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-28 h-full lg:h-fit max-h-screen lg:max-h-none overflow-y-auto lg:overflow-visible pb-10 lg:pb-0 transition-all duration-300 ease-in-out
        ${isExpanded ? "w-full lg:w-80" : "w-full lg:w-24"} 
      `}
    >
      {/* MOBILE ONLY: Close Header */}
      <div className="flex lg:hidden items-center justify-between px-2 mb-2">
        <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">
          Menu
        </span>
        <button
          onClick={onClose}
          className="p-2 bg-white rounded-full shadow-sm border border-slate-100 text-slate-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* DESKTOP TOGGLE BUTTON (Floating) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="hidden lg:flex absolute -right-3 top-10 z-10 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:text-indigo-600 transition-all"
      >
        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Profile Card Mini */}
      <div
        className={`bg-white rounded-[2rem] p-4 lg:p-5 shadow-sm border border-slate-100 flex items-center transition-all duration-300
        ${isExpanded ? "justify-between" : "justify-center"}
      `}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
            {authUser.avatar ? (
              <Image
                src={authUser.avatar}
                alt="User"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              (authUser.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          {isExpanded && (
            <div className="whitespace-nowrap overflow-hidden transition-all duration-300">
              <h2 className="font-bold text-[17px] text-slate-900 leading-tight">
                {authUser.name || authUser.login || "User"}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Manage Account</p>
            </div>
          )}
        </div>
        {isExpanded && (
          <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-xl lg:block hidden">
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Menu Navigation */}
      <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 flex flex-col flex-grow lg:flex-none">
        <nav className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                title={!isExpanded ? item.label : ""} // Tooltip when collapsed
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                } ${!isExpanded ? "justify-center px-0" : ""}`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-600"
                  } transition-colors`}
                >
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className="font-semibold text-[15px] whitespace-nowrap overflow-hidden transition-all duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-6 lg:mt-auto pt-4 border-t border-slate-50">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-5 py-4 text-rose-500 hover:bg-rose-50 rounded-[1.25rem] transition-all font-bold text-[15px] group ${
              !isExpanded ? "justify-center px-0" : ""
            }`}
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform shrink-0"
            />
            {isExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
