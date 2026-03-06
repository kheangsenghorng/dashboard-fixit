"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
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
  Type,       
  Shapes, 
  Menu,
} from "lucide-react";
import { useAuthStore } from "../../../app/store/useAuthStore";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  "/admin/create/categories",
  "/admin/categories",
];

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: ({ isOwner }) =>
          isOwner ? "/owner/dashboard" : "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Documents",
        href: "/owner/documents",
        icon: FileText,
        roles: ["owner"],
      },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart4 },
    ],
  },
  {
    title: "Account Management",
    items: [
      { name: "Customers", href: "/admin/users", icon: Users },
      { name: "Company", href: "/admin/company", icon: Company },
      { name: "Service Providers", href: "/admin/providers", icon: HardHat },
    ],
  },
  {
    title: "Service & Inventory",
    items: [
      {
        name: "Services",
        href: ({ isOwner }) => (isOwner ? "/owner/services" : "/admin/services"),
        icon: Wrench,
      },
      { name: "Mechanical Items", href: "/admin/products", icon: Package },
      {
        name: "Categories",
        href: "/admin/categories",
        icon: Layers,
      },
      {
        name: "Types",
        href: "/admin/types",
        icon: Shapes,
      },
    ],
  },
  {
    title: "Financial",
    items: [
      { name: "Transactions", href: "/admin/payments", icon: Wallet },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Coupons & Promos", href: "/admin/coupons", icon: Ticket },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const hasAnyRole = (user, allowedRoles = []) =>
  getUserRoles(user).some((r) => allowedRoles.includes(r));

const cn = (...classes) => classes.filter(Boolean).join(" ");

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated collapsible section */
function Collapsible({ isOpen, children }) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {children}
    </div>
  );
}

/** Tooltip that appears when sidebar is collapsed */
function CollapseTooltip({ label, children }) {
  return (
    <div className="group/tip relative flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2",
          "whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5",
          "text-xs font-semibold text-white shadow-lg",
          "opacity-0 scale-95 transition-all duration-150",
          "group-hover/tip:opacity-100 group-hover/tip:scale-100",
          "z-[999]"
        )}
      >
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminSidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout, loading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [createCatOpen, setCreateCatOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const isAdmin = useMemo(() => hasAnyRole(user, ["admin"]), [user]);
  const isOwner = useMemo(() => hasAnyRole(user, ["owner"]), [user]);
  const canOpenAdminUI = isAdmin || isOwner;

  const resolveHref = useCallback(
    (href) =>
      typeof href === "function" ? href({ isOwner, isAdmin }) : href,
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
      const target = finalHref.split("?")[0];

      if (item.name === "Company") {
        return (
          current.startsWith("/admin/company") ||
          current.startsWith("/admin/edit/company") ||
          current.startsWith("/admin/create/company")
        );
      }

      if (current === target || current.startsWith(target + "/")) return true;

      const targetSlug = target.replace("/admin/", "");
      return (
        current.startsWith(`/admin/edit/${targetSlug}`) ||
        current.startsWith(`/admin/create/${targetSlug}`)
      );
    },
    [pathname, resolveHref]
  );

  // Route protection
  useEffect(() => {
    if (!mounted || !user) return;
    if (!canOpenAdminUI) {
      router.replace("/");
      return;
    }
    if (isOwner && isBlocked(pathname)) {
      router.replace("/owner/dashboard");
    }
  }, [mounted, user, canOpenAdminUI, isOwner, pathname, isBlocked, router]);

  // Close dropdowns when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setIsCreateOpen(false);
      setIsTableOpen(false);
      setCreateCatOpen(false);
    }
  }, [isCollapsed]);

  // Close dropdowns on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCreateOpen(false);
        setIsTableOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!mounted || !canOpenAdminUI) return null;

  const closeMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar?.();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ── Reusable nav link ──
  const NavLink = ({
    href,
    icon: Icon,
    children,
    onClick,
    subItem = false,
    active: forcedActive,
  }) => {
    if (isBlocked(href)) return null;
    const finalHref = resolveHref(href);
    const active =
      forcedActive !== undefined
        ? forcedActive
        : finalHref
        ? pathname.split("?")[0] === finalHref.split("?")[0] ||
          pathname.startsWith(finalHref.split("?")[0] + "/")
        : false;

    const inner = (
      <Link
        href={finalHref}
        onClick={(e) => {
          onClick?.(e);
          closeMobile();
        }}
        className={cn(
          "relative flex items-center rounded-xl transition-all duration-150 group",
          isCollapsed
            ? "justify-center p-3"
            : cn(
                "gap-3 px-4 py-2.5",
                subItem ? "pl-9 text-[13px]" : "text-[13.5px] font-medium"
              ),
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        )}
      >
        {active && (
          <span className="absolute left-0 inset-y-1.5 w-[3px] bg-indigo-500 rounded-r-full" />
        )}
        {Icon && (
          <Icon
            size={subItem ? 14 : 18}
            className={cn(
              "shrink-0 transition-colors",
              active
                ? "text-indigo-600"
                : "text-slate-400 group-hover:text-slate-600"
            )}
          />
        )}
        {!isCollapsed && (
          <span className={cn(active && "font-semibold")}>{children}</span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return <CollapseTooltip label={children}>{inner}</CollapseTooltip>;
    }
    return inner;
  };

  // ── Dropdown trigger button ──
  const DropdownButton = ({ onClick, isOpen: open, icon: Icon, label, variant = "dark" }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl",
        "transition-all duration-150 active:scale-[0.98] text-[13.5px] font-semibold",
        variant === "dark"
          ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} />
        {label}
      </span>
      <ChevronDown
        size={14}
        className={cn(
          "transition-transform duration-200 opacity-60",
          open && "rotate-180"
        )}
      />
    </button>
  );

  // ── Section divider ──
  const SectionLabel = ({ title }) =>
    !isCollapsed ? (
      <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
    ) : (
      <hr className="mx-3 border-slate-100 my-1" />
    );

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const roleLabel = isOwner ? "Company Owner" : "Administrator";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-100",
          "transition-[width,transform] duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-[72px] w-72" : "w-72"
        )}
      >
        {/* ── Header ── */}
        <div
          className={cn(
            "flex items-center h-[64px] border-b border-slate-100 shrink-0",
            isCollapsed ? "justify-center px-0" : "justify-between px-5"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-[17px] font-black tracking-tight text-slate-900">
                Fix<span className="text-indigo-600">Admin</span>
              </span>
            )}
          </div>

          {/* Mobile close */}
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Action Buttons (expanded only) ── */}
        {!isCollapsed && (
          <div ref={dropdownRef} className="px-4 pt-5 pb-2 space-y-2 shrink-0">
            {/* Create New */}
            <div className="relative">
              <DropdownButton
                onClick={() => {
                  setIsCreateOpen((v) => !v);
                  setIsTableOpen(false);
                }}
                isOpen={isCreateOpen}
                icon={Plus}
                label="Create New"
                variant="dark"
              />

              <Collapsible isOpen={isCreateOpen}>
                <div className="mt-1 bg-white border border-slate-100 rounded-xl shadow-md overflow-hidden">
                  <NavLink href="/admin/create/users" icon={UserPlus} onClick={() => setIsCreateOpen(false)}>
                    New User
                  </NavLink>
                  <NavLink href="/admin/create/company" icon={Company} onClick={() => setIsCreateOpen(false)}>
                    New Company
                  </NavLink>
                  <NavLink href="/admin/create/provider" icon={HardHat} onClick={() => setIsCreateOpen(false)}>
                    New Provider
                  </NavLink>

                  <NavLink href="/admin/create/categories" icon={Wrench} onClick={() => setIsCreateOpen(false)}>
                    New Categories
                  </NavLink>
                  <NavLink href="/admin/create/types" icon={Wrench} onClick={() => setIsCreateOpen(false)}>
                    New Types
                  </NavLink>

                  <NavLink href="/admin/create/service" icon={Wrench} onClick={() => setIsCreateOpen(false)}>
                    New Service
                  </NavLink>
                </div>
              </Collapsible>
            </div>

            {/* Manage Data */}
            <div className="relative">
              <DropdownButton
                onClick={() => {
                  setIsTableOpen((v) => !v);
                  setIsCreateOpen(false);
                }}
                isOpen={isTableOpen}
                icon={List}
                label="Manage Data"
                variant="light"
              />

              <Collapsible isOpen={isTableOpen}>
                <div className="mt-1 bg-white border border-slate-100 rounded-xl shadow-md overflow-hidden max-h-72 overflow-y-auto">
                  <NavLink href="/admin/users" icon={Users} onClick={() => setIsTableOpen(false)}>
                    Users List
                  </NavLink>
                  <NavLink href="/admin/company" icon={Company} onClick={() => setIsTableOpen(false)}>
                    Company List
                  </NavLink>
                  <NavLink href="/admin/categories" icon={Layers} onClick={() => setIsTableOpen(false)}>
                    Category List
                  </NavLink>
                  <NavLink href="/admin/types" icon={Layers} onClick={() => setIsTableOpen(false)}>
                    Type List
                  </NavLink>
                  <NavLink
                    href={({ isOwner }) =>
                      isOwner ? "/owner/services" : "/admin/services"
                    }
                    icon={TableProperties}
                    onClick={() => setIsTableOpen(false)}
                  >
                    Services List
                  </NavLink>
                  <NavLink href="/admin/products" icon={Package} onClick={() => setIsTableOpen(false)}>
                    Products List
                  </NavLink>
                </div>
              </Collapsible>
            </div>
          </div>
        )}

        {/* ── Collapsed quick actions ── */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-1 px-2 pt-4 shrink-0">
            <CollapseTooltip label="Create New">
              <Link
                href="/admin/create/users"
                className="flex justify-center p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <Plus size={18} />
              </Link>
            </CollapseTooltip>
            <CollapseTooltip label="Manage Data">
              <Link
                href="/admin/users"
                className="flex justify-center p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <List size={18} />
              </Link>
            </CollapseTooltip>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-hide"
          aria-label="Main navigation"
        >
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((item) => {
              if (isBlocked(item.href)) return false;
              if (item.roles?.length) return hasAnyRole(user, item.roles);
              return true;
            });

            if (items.length === 0) return null;

            return (
              <div key={group.title}>
                <SectionLabel title={group.title} />

                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = isItemActive(item);
                    const finalHref = resolveHref(item.href);

                    const inner = (
                      <Link
                        key={item.name}
                        href={finalHref}
                        onClick={closeMobile}
                        className={cn(
                          "relative flex items-center rounded-xl transition-all duration-150 group",
                          isCollapsed
                            ? "justify-center p-3"
                            : "gap-3 px-4 py-2.5 text-[13.5px] font-medium",
                          active
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 inset-y-1.5 w-[3px] bg-indigo-500 rounded-r-full" />
                        )}
                        <item.icon
                          size={18}
                          className={cn(
                            "shrink-0 transition-colors",
                            active
                              ? "text-indigo-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        {!isCollapsed && (
                          <span className={cn(active && "font-semibold")}>
                            {item.name}
                          </span>
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <CollapseTooltip key={item.name} label={item.name}>
                          {inner}
                        </CollapseTooltip>
                      );
                    }
                    return <React.Fragment key={item.name}>{inner}</React.Fragment>;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="shrink-0 p-3 border-t border-slate-100">
          {/* User card */}
          <div
            className={cn(
              "flex items-center rounded-xl bg-slate-50 border border-slate-100",
              isCollapsed ? "justify-center p-2.5" : "gap-3 p-2.5"
            )}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-sm font-black text-indigo-600 shrink-0">
              {userInitial}
            </div>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-0.5">
                    {roleLabel}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!isBlocked("/admin/notifications") && (
                    <Link
                      href="/admin/notifications"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Notifications"
                    >
                      <Bell size={15} />
                    </Link>
                  )}
                  {!isBlocked("/admin/settings") && (
                    <Link
                      href="/admin/settings"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Settings"
                    >
                      <Settings size={15} />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Collapsed icon row */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-1 mt-2">
              {!isBlocked("/admin/notifications") && (
                <CollapseTooltip label="Notifications">
                  <Link
                    href="/admin/notifications"
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Bell size={16} />
                  </Link>
                </CollapseTooltip>
              )}
              {!isBlocked("/admin/settings") && (
                <CollapseTooltip label="Settings">
                  <Link
                    href="/admin/settings"
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Settings size={16} />
                  </Link>
                </CollapseTooltip>
              )}
              <CollapseTooltip label="Logout">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </CollapseTooltip>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}