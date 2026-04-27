import React, { useState, useMemo } from "react";
import { Search, X, Check, Command, Loader2 } from "lucide-react";

const SelectionModal = ({
  isOpen,
  onClose,
  title,
  items = [],
  onSelect,
  displayKey = "name",
  loading = false,
}) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];

    if (!search.trim()) return items;

    const term = search.toLowerCase();

    return items.filter((item) => {
      const displayValue = item?.[displayKey] || "";
      const idValue = item?.id || "";
      const emailValue = item?.email || "";
      const phoneValue = item?.phone || "";

      return (
        String(displayValue).toLowerCase().includes(term) ||
        String(idValue).toLowerCase().includes(term) ||
        String(emailValue).toLowerCase().includes(term) ||
        String(phoneValue).toLowerCase().includes(term)
      );
    });
  }, [items, search, displayKey]);

  const visibleItems = filtered.slice(0, 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-slate-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

            <p className="text-xs text-slate-400 font-medium">
              {loading
                ? "Updating list..."
                : `Found ${filtered.length} results`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col flex-1 overflow-hidden">
          {/* Search Input */}
          <div className="relative mb-4 group flex-shrink-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500 transition-colors"
              size={16}
            />

            <input
              className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
              placeholder="Search by name, ID, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* List Container */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={32} className="animate-spin mb-2 opacity-20" />

                <p className="text-sm font-medium">Loading data...</p>
              </div>
            ) : visibleItems.length > 0 ? (
              visibleItems.map((item) => {
                const displayValue = item?.[displayKey] || "No name";
                const firstLetter = String(displayValue)
                  .charAt(0)
                  .toUpperCase();

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-white transition-all flex-shrink-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={displayValue}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        firstLetter
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                        {displayValue}
                      </p>

                      {item.email && (
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {item.email}
                        </p>
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Command size={32} className="mb-2 opacity-20" />

                <p className="text-sm font-medium">No results found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center flex-shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {title}
          </p>

          <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">
            {items.length} Total
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
