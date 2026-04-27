import { ChevronRight } from "lucide-react";

const TabButton = ({ active, onClick, icon, label, desc }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-5 rounded-3xl transition-all duration-500 group ${
      active
        ? "bg-white text-indigo-600 shadow-2xl shadow-slate-200 border-none scale-105"
        : "text-slate-400 hover:bg-white/50 hover:text-slate-600"
    }`}
  >
    <div
      className={`p-3 rounded-2xl transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-slate-200 text-slate-400 group-hover:bg-slate-300"
      }`}
    >
      {icon}
    </div>

    <div className="text-left">
      <p className="font-black text-sm uppercase tracking-tight">{label}</p>

      <p
        className={`text-[10px] font-bold uppercase opacity-60 ${
          active ? "text-indigo-400" : "text-slate-400"
        }`}
      >
        {desc}
      </p>
    </div>

    {active && <ChevronRight className="ml-auto text-indigo-300" size={18} />}
  </button>
);

export default TabButton;