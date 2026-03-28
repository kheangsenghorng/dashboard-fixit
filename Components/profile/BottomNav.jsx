"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MessageSquare,
  Pencil,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useRequireAuth } from "../../app/hooks/useRequireAuth";

const menuItems = [
  { icon: <User size={22} />, label: "Profile", href: "/my-profile" },
  { icon: <MessageSquare size={22} />, label: "Messages", href: "/messages" },
  { icon: <Pencil size={22} />, label: "Edit", href: "/edit" },
  { icon: <Package size={22} />, label: "Orders", href: "/history" },
  { icon: <Heart size={22} />, label: "Saved", href: "/profile/saved" },
  { icon: <MapPin size={22} />, label: "Address", href: "/addresses" },
  { icon: <ShieldCheck size={22} />, label: "Privacy", href: "/security" },
];

const BottomNav = () => {
  const { user: authUser, initialized } = useRequireAuth();
  const pathname = usePathname();

  if (!initialized || !authUser) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? "text-indigo-600 scale-110" : "text-slate-400"
              }`}
            >
              {item.icon}
              {isActive && (
                <span className="w-1 h-1 bg-indigo-600 rounded-full mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
