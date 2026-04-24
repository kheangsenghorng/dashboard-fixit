import {
  Clock,
  CheckCircle2,
  Ban,
  AlertCircle,
  Wrench,
  ShieldQuestion,
  UserCheck,
} from "lucide-react";

export const cn = (...c) => c.filter(Boolean).join(" ");

export const fmt = (dateStr) => {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fmtTime = (dateStr) => {
  if (!dateStr) return null;

  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const BOOKING_STATUS = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
    pulse: true,
    icon: Clock,
  },

  confirmed: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
    pulse: false,
    icon: UserCheck,
  },

  in_progress: {
    label: "In Progress",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
    dot: "bg-indigo-500",
    pulse: true,
    icon: Wrench,
  },

  awaiting_customer_confirmation: {
    label: "Awaiting Customer",
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-200",
    dot: "bg-purple-500",
    pulse: true,
    icon: ShieldQuestion,
  },

  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    pulse: false,
    icon: CheckCircle2,
  },

  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
    pulse: false,
    icon: Ban,
  },

  disputed: {
    label: "Disputed",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    dot: "bg-red-500",
    pulse: true,
    icon: AlertCircle,
  },
};

export const CUSTOMER_STATUS = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },

  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },

  disputed: {
    label: "Disputed",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
  },
};

export const PAYMENT_STATUS = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },

  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },

  refunded: {
    label: "Refunded",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },

  unpaid: {
    label: "Unpaid",
    bg: "bg-slate-100",
    text: "text-slate-500",
    ring: "ring-slate-200",
  },
};
