import React from "react";

const Pagination = ({ pagination, onPaginationClick }) => {
  return (
    <div className="mt-12 mb-20 flex flex-col md:flex-row items-center justify-between bg-white px-8 py-6 rounded-[1.5rem] border border-slate-200 shadow-sm gap-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Records{" "}
        <span className="text-slate-900">
          {pagination?.from || 0}-{pagination?.to || 0}
        </span>{" "}
        of <span className="text-slate-900">{pagination?.total || 0}</span>
      </p>

      {pagination?.links?.length > 0 && (
        <div className="flex gap-2">
          {pagination.links.map((link, idx) => (
            <button
              key={idx}
              disabled={!link.url || link.active}
              onClick={() => onPaginationClick(link)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                link.active
                  ? "bg-indigo-600 text-white shadow-lg -translate-y-0.5"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              } ${!link.url && "opacity-30 cursor-not-allowed"}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Pagination;
