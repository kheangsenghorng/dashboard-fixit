"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart4,
  Bell,
  ChevronDown,
  HardHat,
  LayoutDashboard,
  Layers,
  List,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Settings,
  Shapes,
  ShieldCheck,
  TableProperties,
  Ticket,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  X,
  FileText,
  Building2 as Company,
  History,
} from "lucide-react";
import { useAuthStore } from "../../../app/store/useAuthStore";

const OWNER_BLOCKED_ROUTES = [
  "/admin/users",
  "/admin/company",
  "/admin/providers",
  "/admin/payments",
  "/admin/invoices",
  "/admin/settings",
  "/admin/analytics",
  "/admin/create/users",
  "/admin/create/company",
  "/admin/create/categories",
  "/admin/categories",
  "/admin/types",
  "/admin/create/types",
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
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart4,
      },
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
        href: ({ isOwner }) =>
          isOwner ? "/owner/services" : "/admin/services",
        icon: Wrench,
      },
      { name: "Mechanical Items", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: Layers },
      { name: "Types", href: "/admin/types", icon: Shapes },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        name: "Payments",
        icon: Wallet,
        subItems: [
          {
            name: "Bookings",
            href: ({ isOwner }) =>
              isOwner ? "/owner/payments/bookings" : "/admin/payments/bookings",
            icon: Ticket,
          },
          {
            name: "Booking History",
            href: ({ isOwner }) =>
              isOwner ? "/owner/history/bookings" : "/admin/history/bookings",
            icon: History,
          },
          {
            name: "Payouts",
            href: ({ isOwner }) =>
              isOwner ? "/owner/payments/payouts" : "/admin/payments/payouts",
            icon: ArrowUpRight,
          },
          {
            name: "Refunds",
            href: ({ isOwner }) =>
              isOwner ? "/owner/payments/refunds" : "/admin/payments/refunds",
            icon: RotateCcw,
          },
        ],
      },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      {
        name: "Coupons & Promos",
        href: ({ isOwner }) => (isOwner ? "/owner/coupons" : "/admin/coupons"),
        icon: Ticket,
      },
    ],
  },
];

const CREATE_LINKS = [
  { name: "New User", href: "/admin/create/users", icon: UserPlus },
  { name: "New Company", href: "/admin/create/company", icon: Company },
  { name: "New Provider", href: "/admin/create/provider", icon: HardHat },
  { name: "New Categories", href: "/admin/create/categories", icon: Wrench },
  { name: "New Types", href: "/admin/create/types", icon: Wrench },
  { name: "New Service", href: "/admin/create/service", icon: Wrench },
];

const MANAGE_LINKS = [
  { name: "Users List", href: "/admin/users", icon: Users },
  { name: "Company List", href: "/admin/company", icon: Company },
  { name: "Category List", href: "/admin/categories", icon: Layers },
  { name: "Type List", href: "/admin/types", icon: Layers },
  {
    name: "Services List",
    href: ({ isOwner }) => (isOwner ? "/owner/services" : "/admin/services"),
    icon: TableProperties,
  },
  { name: "Products List", href: "/admin/products", icon: Package },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

function normalizeRole(role) {
  if (!role) return null;
  if (typeof role === "string") return role.toLowerCase();

  if (typeof role === "object") {
    return (role.slug || role.name || role.role || "").toString().toLowerCase();
  }

  return null;
}

function getUserRoles(user) {
  if (!user) return [];

  const roles = [
    normalizeRole(user.role),
    ...(Array.isArray(user.roles)
      ? user.roles.map(normalizeRole)
      : user.roles
      ? [normalizeRole(user.roles)]
      : []),
    normalizeRole(user.user?.role),
  ];

  return [...new Set(roles.filter(Boolean))];
}

function hasAnyRole(user, allowedRoles = []) {
  return getUserRoles(user).some((role) => allowedRoles.includes(role));
}

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

function CollapseTooltip({ label, children }) {
  return (
    <div className="group/tip relative flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-full top-1/2 z-[999] ml-3 -translate-y-1/2",
          "whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg",
          "scale-95 opacity-0 transition-all duration-150",
          "group-hover/tip:scale-100 group-hover/tip:opacity-100"
        )}
      >
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </span>
    </div>
  );
}

function SectionLabel({ title, isCollapsed }) {
  if (isCollapsed) {
    return <hr className="mx-3 my-1 border-slate-100" />;
  }

  return (
    <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
      {title}
    </p>
  );
}

function DropdownButton({
  onClick,
  isOpen,
  icon: Icon,
  label,
  variant = "dark",
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[13.5px] font-semibold",
        "transition-all duration-150 active:scale-[0.98]",
        variant === "dark"
          ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} />
        {label}
      </span>

      <ChevronDown
        size={14}
        className={cn(
          "opacity-60 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export default function AdminSidebar({ isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout, loading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const isAdmin = useMemo(() => hasAnyRole(user, ["admin"]), [user]);
  const isOwner = useMemo(() => hasAnyRole(user, ["owner"]), [user]);
  const canOpenAdminUI = isAdmin || isOwner;

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const roleLabel = isOwner ? "Company Owner" : "Administrator";

  const resolveHref = useCallback(
    (href) => (typeof href === "function" ? href({ isOwner, isAdmin }) : href),
    [isAdmin, isOwner]
  );

  const isBlocked = useCallback(
    (hrefOrFn) => {
      if (!isOwner) return false;

      const href = resolveHref(hrefOrFn)?.split("?")[0];
      return OWNER_BLOCKED_ROUTES.some(
        (route) => href === route || href?.startsWith(`${route}/`)
      );
    },
    [isOwner, resolveHref]
  );

  const isPathActive = useCallback(
    (href) => {
      if (!href || typeof href !== "string") return false;

      const currentPath = pathname.split("?")[0];
      const targetPath = href.split("?")[0];
      const lastSegment = targetPath.split("/").pop();

      return (
        currentPath === targetPath ||
        currentPath.startsWith(`${targetPath}/`) ||
        currentPath.includes(`/create/${lastSegment}`) ||
        currentPath.includes(`/edit/${lastSegment}`)
      );
    },
    [pathname]
  );

  const isItemActive = useCallback(
    (item) => isPathActive(resolveHref(item.href)),
    [isPathActive, resolveHref]
  );

  const closeMobileSidebar = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar?.();
    }
  }, [toggleSidebar]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!isCollapsed) return;

    setIsCreateOpen(false);
    setIsTableOpen(false);
    setIsPaymentsOpen(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCreateOpen(false);
        setIsTableOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!mounted || !canOpenAdminUI) return null;

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
    const active = forcedActive ?? isPathActive(finalHref);

    const content = (
      <Link
        href={finalHref}
        onClick={(event) => {
          onClick?.(event);
          closeMobileSidebar();
        }}
        className={cn(
          "group relative flex items-center rounded-xl transition-all duration-150",
          isCollapsed
            ? "justify-center p-3"
            : subItem
            ? "gap-3 px-4 py-2.5 pl-9 text-[13px]"
            : "gap-3 px-4 py-2.5 text-[13.5px] font-medium",
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        )}
      >
        {active && (
          <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-indigo-500" />
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

    return isCollapsed ? (
      <CollapseTooltip label={children}>{content}</CollapseTooltip>
    ) : (
      content
    );
  };

  const renderLinkList = (links, closeMenu) =>
    links.map((link) => (
      <NavLink
        key={link.name}
        href={link.href}
        icon={link.icon}
        onClick={closeMenu}
      >
        {link.name}
      </NavLink>
    ));

  const renderPaymentsMenu = (item) => {
    const active = item.subItems?.some((subItem) =>
      isPathActive(resolveHref(subItem.href))
    );

    if (isCollapsed) {
      return (
        <NavLink
          key={item.name}
          href={item.subItems?.[0]?.href}
          icon={item.icon}
          active={active}
        >
          {item.name}
        </NavLink>
      );
    }

    return (
      <div key={item.name} className="space-y-1">
        <button
          onClick={() => setIsPaymentsOpen((prev) => !prev)}
          className={cn(
            "group flex w-full items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-150",
            isPaymentsOpen || active
              ? "bg-slate-50 text-slate-900"
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon
              size={18}
              className={cn(
                isPaymentsOpen || active ? "text-indigo-600" : "text-slate-400"
              )}
            />
            <span className="text-[13.5px] font-medium">{item.name}</span>
          </div>

          <ChevronDown
            size={14}
            className={cn(
              "transition-transform",
              isPaymentsOpen && "rotate-180"
            )}
          />
        </button>

        <Collapsible isOpen={isPaymentsOpen}>
          <div className="ml-6 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.name}
                href={subItem.href}
                icon={subItem.icon}
                subItem
                active={isPathActive(resolveHref(subItem.href))}
              >
                {subItem.name}
              </NavLink>
            ))}
          </div>
        </Collapsible>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-100 bg-white",
          "transition-[width,transform] duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-72 lg:w-[72px]" : "w-72"
        )}
      >
        <div
          className={cn(
            "flex h-[64px] shrink-0 items-center border-b border-slate-100",
            isCollapsed ? "justify-center px-0" : "justify-between px-5"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
              <ShieldCheck size={18} className="text-white" />
            </div>

            {!isCollapsed && (
              <span className="text-[17px] font-black tracking-tight text-slate-900">
                Fix<span className="text-indigo-600">Admin</span>
              </span>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div ref={dropdownRef} className="shrink-0 space-y-2 px-4 pt-5 pb-2">
            <div className="relative">
              <DropdownButton
                onClick={() => {
                  setIsCreateOpen((prev) => !prev);
                  setIsTableOpen(false);
                }}
                isOpen={isCreateOpen}
                icon={Plus}
                label="Create New"
                variant="dark"
              />

              <Collapsible isOpen={isCreateOpen}>
                <div className="mt-1 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
                  {renderLinkList(CREATE_LINKS, () => setIsCreateOpen(false))}
                </div>
              </Collapsible>
            </div>

            <div className="relative">
              <DropdownButton
                onClick={() => {
                  setIsTableOpen((prev) => !prev);
                  setIsCreateOpen(false);
                }}
                isOpen={isTableOpen}
                icon={List}
                label="Manage Data"
                variant="light"
              />

              <Collapsible isOpen={isTableOpen}>
                <div className="mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-md">
                  {renderLinkList(MANAGE_LINKS, () => setIsTableOpen(false))}
                </div>
              </Collapsible>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex shrink-0 flex-col items-center gap-1 px-2 pt-4">
            <CollapseTooltip label="Create New">
              <Link
                href="/admin/create/users"
                className="flex justify-center rounded-xl p-3 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
              >
                <Plus size={18} />
              </Link>
            </CollapseTooltip>

            <CollapseTooltip label="Manage Data">
              <Link
                href="/admin/users"
                className="flex justify-center rounded-xl p-3 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
              >
                <List size={18} />
              </Link>
            </CollapseTooltip>
          </div>
        )}

        <nav className="scrollbar-hide flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !isBlocked(item.href)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                <SectionLabel title={group.title} isCollapsed={isCollapsed} />

                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    if (item.subItems?.length) {
                      return renderPaymentsMenu(item);
                    }

                    return (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        active={isItemActive(item)}
                      >
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <div
            className={cn(
              "flex items-center rounded-xl border border-slate-100 bg-slate-50",
              isCollapsed ? "justify-center p-2.5" : "gap-3 p-2.5"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-100 text-sm font-black text-indigo-600">
              {userInitial}
            </div>

            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-tight text-slate-900">
                    {user?.name}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {roleLabel}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {!isBlocked("/admin/notifications") && (
                    <Link
                      href="/admin/notifications"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      title="Notifications"
                    >
                      <Bell size={15} />
                    </Link>
                  )}

                  {!isBlocked("/admin/settings") && (
                    <Link
                      href="/admin/settings"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      title="Settings"
                    >
                      <Settings size={15} />
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            )}
          </div>

          {isCollapsed && (
            <div className="mt-2 flex flex-col items-center gap-1">
              {!isBlocked("/admin/notifications") && (
                <CollapseTooltip label="Notifications">
                  <Link
                    href="/admin/notifications"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Bell size={16} />
                  </Link>
                </CollapseTooltip>
              )}

              {!isBlocked("/admin/settings") && (
                <CollapseTooltip label="Settings">
                  <Link
                    href="/admin/settings"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Settings size={16} />
                  </Link>
                </CollapseTooltip>
              )}

              <CollapseTooltip label="Logout">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
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
