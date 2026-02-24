// ==============================
// Sidebar.jsx / Sidebar.tsx
// (FULL + ICON-ONLY when collapsed)
// ==============================
"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Wrench,
  HardHat,
  Users,
  Layers,
  Package,
  Settings,
  Plus,
  ChevronDown,
  LogOut,
  ShieldCheck,
  BarChart4,
  Bell,
  X,
  ChevronRight,
  Wallet,
  FileText,
  Ticket,
  Building2 as Company,
  TableProperties,
  List,
} from "lucide-react";
import { useAuthStore } from "../../../app/store/useAuthStore";

// ✅ Routes that an "Owner" is NOT allowed to see/access
const OWNER_BLOCKED_ROUTES = [
  "/admin/users",
  "/admin/company",
  "/admin/providers",
  "/admin/payments",
  "/admin/invoices",
  "/admin/coupons",
  "/admin/settings",
  "/admin/analytics",
  "/admin/create/users",
  "/admin/create/company",
  "/admin/create/category",
  "/admin/create/provider",
  "/admin/create/service",
];

// --- Menu Configuration ---
const navGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: ({ isOwner }) =>
          isOwner ? "/owner/dashboard" : "/admin/dashboard",
        icon: LayoutDashboard,
      },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart4 },
    ],
  },
  {
    title: "ACCOUNT MANAGEMENT",
    items: [
      { name: "Customers", href: "/admin/users", icon: Users },
      { name: "Company", href: "/admin/company", icon: Company },
      { name: "Service Providers", href: "/admin/providers", icon: HardHat },
    ],
  },
  {
    title: "SERVICE & INVENTORY",
    items: [
      {
        name: "Services List",
        href: ({ isOwner }) => (isOwner ? "/owner/services" : "/admin/services"),
        icon: Wrench,
      },
      { name: "Mechanical Items", href: "/admin/products", icon: Package },
      {
        name: "Service Categories",
        href: "/admin/service-categories",
        icon: Layers,
      },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { name: "Transactions", href: "/admin/payments", icon: Wallet },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Coupons/Promos", href: "/admin/coupons", icon: Ticket },
    ],
  },
];

// --- Role Helpers ---
const normalizeRole = (r) => {
  if (!r) return null;
  if (typeof r === "string") return r.toLowerCase();
  if (typeof r === "object")
    return (r.slug || r.name || r.role || "").toString().toLowerCase();
  return null;
};

const getUserRoles = (user) => {
  if (!user) return [];
  const roles = [];
  if (user.role) roles.push(normalizeRole(user.role));
  if (user.roles) {
    if (Array.isArray(user.roles)) roles.push(...user.roles.map(normalizeRole));
    else roles.push(normalizeRole(user.roles));
  }
  if (user.user?.role) roles.push(normalizeRole(user.user.role));
  return Array.from(new Set(roles.filter(Boolean)));
};

const hasAnyRole = (user, allowedRoles = []) => {
  const userRoles = getUserRoles(user);
  return userRoles.some((r) => allowedRoles.includes(r));
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout, loading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // dropdown states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [subMenus, setSubMenus] = useState({ createCat: false });

  const dropdownRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const isAdmin = useMemo(() => hasAnyRole(user, ["admin"]), [user]);
  const isOwner = useMemo(() => hasAnyRole(user, ["owner"]), [user]);
  const canOpenAdminUI = isAdmin || isOwner;

  const resolveHref = useCallback(
    (href) => (typeof href === "function" ? href({ isOwner, isAdmin }) : href),
    [isOwner, isAdmin]
  );

  const isBlocked = useCallback(
    (hrefOrFn) => {
      if (!isOwner) return false;
      const href = resolveHref(hrefOrFn)?.split("?")[0];
      return OWNER_BLOCKED_ROUTES.some(
        (route) => href === route || href?.startsWith(route + "/")
      );
    },
    [isOwner, resolveHref]
  );

  const isItemActive = useCallback(
    (item) => {
      const finalHref = resolveHref(item.href);
      if (!finalHref) return false;
  
      const current = (pathname || "").split("?")[0];
      const target = (finalHref || "").split("?")[0];
  
      // Special Company
      if (item.name === "Company") {
        return (
          current.startsWith("/admin/company") ||
          current.startsWith("/admin/edit/company") ||
          current.startsWith("/admin/create/company")
        );
      }
  
      if (current === target) return true;
      if (current.startsWith(target + "/")) return true;
  
      // ✅ Generic edit/create detection:
      // if menu item is /admin/users -> active also when /admin/edit/users or /admin/create/users
      const targetSlug = target.replace("/admin/", ""); // users, providers, etc.
      if (
        current.startsWith(`/admin/edit/${targetSlug}`) ||
        current.startsWith(`/admin/create/${targetSlug}`)
      ) {
        return true;
      }
  
      return false;
    },
    [pathname, resolveHref]
  );

  // ✅ Protection Logic
  useEffect(() => {
    if (!mounted) return;
    if (!user) return;

    if (!canOpenAdminUI) {
      router.replace("/");
      return;
    }

    if (isOwner && isBlocked(pathname)) {
      router.replace("/owner/dashboard");
    }
  }, [mounted, user, canOpenAdminUI, isOwner, pathname, isBlocked, router]);

  // Close dropdowns when collapsed
  useEffect(() => {
    if (isCollapsed) {
      setIsCreateOpen(false);
      setIsTableOpen(false);
      setSubMenus({ createCat: false });
    }
  }, [isCollapsed]);

  // Close dropdowns on outside click (desktop)
  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setIsCreateOpen(false);
        setIsTableOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!mounted || !canOpenAdminUI) return null;

  const closeMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar?.();
    }
  };

  const SidebarLink = ({ href, icon: Icon, children, onClick, subItem = false }) => {
    if (isBlocked(href)) return null;
    const finalHref = resolveHref(href);
    const active = finalHref
      ? pathname.split("?")[0] === finalHref.split("?")[0] ||
        pathname.startsWith(finalHref.split("?")[0] + "/")
      : false;

    return (
      <Link
        href={finalHref}
        onClick={(e) => {
          onClick?.(e);
          closeMobile();
        }}
        title={isCollapsed ? children : undefined}
        className={cn(
          "flex items-center transition-all group relative rounded-xl",
          isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-6 py-3.5",
          subItem ? (isCollapsed ? "" : "pl-10 text-[13px]") : (isCollapsed ? "" : "text-[14px]"),
          active
            ? "bg-indigo-50/80 text-indigo-700 font-bold"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />}
        {Icon && (
          <Icon
            size={subItem ? 14 : isCollapsed ? 22 : 20}
            className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
          />
        )}
        {!isCollapsed && <span>{children}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

<aside
  className={cn(
    "fixed inset-y-0 left-0 z-50 bg-white flex flex-col border-r border-slate-100",
    "lg:static lg:translate-x-0",
    "transition-[width,transform] duration-300 ease-in-out", // ✅ smoother
    // mobile slide
    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
    // desktop width
    isCollapsed ? "lg:w-20 w-72" : "lg:w-72 w-72"
  )}
>
        {/* Brand header */}
        <div className={cn("flex items-center justify-between h-20 border-b border-slate-50", isCollapsed ? "px-3" : "px-6")}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white" size={22} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black text-[#0F172A] tracking-tighter uppercase">
                Fix<span className="text-indigo-600">Admin</span>
              </span>
            )}
          </div>

          {/* mobile close */}
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Top action buttons (hidden when collapsed) */}
        {!isCollapsed && (
          <div ref={dropdownRef} className="px-6 pt-8 space-y-3">
            {/* Create New */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCreateOpen((v) => !v);
                  setIsTableOpen(false);
                }}
                className="w-full bg-[#0F172A] text-white flex items-center justify-between px-5 py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-md group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Plus size={18} />
                  <span className="font-bold text-sm tracking-tight">Create New</span>
                </div>
                <ChevronDown size={16} className={`opacity-60 transition-transform ${isCreateOpen ? "rotate-180" : ""}`} />
              </button>

              {isCreateOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  <SidebarLink href="/admin/create/users" icon={UserPlus} onClick={() => setIsCreateOpen(false)}>
                    New User
                  </SidebarLink>
                  <SidebarLink href="/admin/create/company" icon={Company} onClick={() => setIsCreateOpen(false)}>
                    New Company
                  </SidebarLink>
                  <SidebarLink href="/admin/create/provider" icon={HardHat} onClick={() => setIsCreateOpen(false)}>
                    New Provider
                  </SidebarLink>

                  {/* Nested Category */}
                  {!isBlocked("/admin/create/category") && (
                    <div className="border-t border-slate-50 mt-1">
                      <button
                        onClick={() => setSubMenus((s) => ({ ...s, createCat: !s.createCat }))}
                        className="flex items-center justify-between w-full px-6 py-3 text-sm text-slate-600 hover:bg-indigo-50"
                      >
                        <div className="flex items-center gap-2">
                          <Layers size={16} /> Category
                        </div>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${subMenus.createCat ? "rotate-90" : ""}`}
                        />
                      </button>

                      {subMenus.createCat && (
                        <div className="bg-slate-50 py-1">
                          <SidebarLink href="/admin/create/category?type=service" subItem onClick={() => setIsCreateOpen(false)}>
                            Service Type
                          </SidebarLink>
                          <SidebarLink href="/admin/create/category?type=mechanical" subItem onClick={() => setIsCreateOpen(false)}>
                            Mechanical Type
                          </SidebarLink>
                        </div>
                      )}
                    </div>
                  )}

                  <SidebarLink href="/admin/create/service" icon={Wrench} onClick={() => setIsCreateOpen(false)}>
                    New Service
                  </SidebarLink>
                </div>
              )}
            </div>

            {/* Manage Data */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTableOpen((v) => !v);
                  setIsCreateOpen(false);
                }}
                className="w-full bg-white border border-slate-200 text-slate-600 flex items-center justify-between px-5 py-3.5 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <List size={18} />
                  <span className="font-bold text-sm text-slate-700 tracking-tight">Manage Data</span>
                </div>
                <ChevronDown size={16} className={`opacity-40 transition-transform ${isTableOpen ? "rotate-180" : ""}`} />
              </button>

              {isTableOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 max-h-80 overflow-y-auto">
                  <SidebarLink href="/admin/users" icon={Users} onClick={() => setIsTableOpen(false)}>
                    Users List
                  </SidebarLink>
                  <SidebarLink href="/admin/company" icon={Company} onClick={() => setIsTableOpen(false)}>
                    Company List
                  </SidebarLink>
                  <SidebarLink
                    href={({ isOwner }) => (isOwner ? "/owner/services" : "/admin/services")}
                    icon={TableProperties}
                    onClick={() => setIsTableOpen(false)}
                  >
                    Services List
                  </SidebarLink>
                  <SidebarLink href="/admin/products" icon={Package} onClick={() => setIsTableOpen(false)}>
                    Products List
                  </SidebarLink>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsed quick actions */}
        {isCollapsed && (
          <div className="px-2 pt-4 space-y-2">
            <Link
              href="/admin/create/users"
              title="Create New"
              className="flex justify-center p-3 rounded-xl hover:bg-slate-50 text-slate-500"
            >
              <Plus size={20} />
            </Link>
            <Link
              href="/admin/users"
              title="Manage Data"
              className="flex justify-center p-3 rounded-xl hover:bg-slate-50 text-slate-500"
            >
              <List size={20} />
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-8 space-y-8 overflow-y-auto scrollbar-hide">
          {navGroups.map((group) => {
            const items = group.items.filter((i) => !isBlocked(i.href));
            if (items.length === 0) return null;

            return (
              <div key={group.title}>
                {!isCollapsed && (
                  <h3 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    {group.title}
                  </h3>
                )}

                <div className="space-y-1">
                  {items.map((item) => {
                    const active = isItemActive(item);
                    const finalHref = resolveHref(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={finalHref}
                        onClick={closeMobile}
                        title={isCollapsed ? item.name : undefined}
                        className={cn(
                          "flex items-center transition-all group relative rounded-xl",
                          isCollapsed ? "justify-center px-3 py-3" : "gap-4 px-6 py-3.5",
                          active
                            ? "bg-indigo-50/80 text-indigo-700 font-bold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />}
                        <item.icon
                          size={isCollapsed ? 22 : 20}
                          className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
                        />
                        {!isCollapsed && <span className="text-[14px]">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100",
              isCollapsed ? "px-2 py-3 justify-center" : "px-2 py-3"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600">
              {user?.name?.charAt(0) || "U"}
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate leading-none mb-1">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  {isOwner ? "Company Owner" : "Administrator"}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                disabled={loading}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {isCollapsed && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {!isBlocked("/admin/notifications") && (
                <Link href="/admin/notifications" title="Notifications" className="p-2 text-slate-400 hover:text-indigo-600">
                  <Bell size={18} />
                </Link>
              )}
              {!isBlocked("/admin/settings") && (
                <Link href="/admin/settings" title="Settings" className="p-2 text-slate-400 hover:text-indigo-600">
                  <Settings size={18} />
                </Link>
              )}
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600"
                disabled={loading}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}