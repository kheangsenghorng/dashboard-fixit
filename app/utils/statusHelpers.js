export const getBookingStatusBadge = (status) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    in_progress: "bg-indigo-100 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    disputed: "bg-red-100 text-red-700 border-red-200",
  };
  return styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

export const formatStatus = (status) =>
  status?.replaceAll("_", " ") || "pending";
