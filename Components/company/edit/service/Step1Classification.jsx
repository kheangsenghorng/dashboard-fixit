import { Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Step1Classification({ formData, setFormData, categories, activeTypes }) {
  const [search, setSearch] = useState("");

  return (
    <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <header>
        <h1 className="text-6xl font-black tracking-tight text-slate-900 mb-4">Select <span className="text-indigo-600">Category</span></h1>
        <p className="text-slate-500 font-medium text-lg">Define the industrial niche for this service protocol.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            placeholder="Search industry categories..."
            className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-8 font-bold text-lg focus:ring-2 focus:ring-indigo-500/20 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFormData({ ...formData, category_id: cat.id.toString(), type_id: "" })}
              className={`group p-8 rounded-[2.5rem] border-2 transition-all text-center ${
                formData.category_id === cat.id.toString() ? "border-indigo-600 bg-indigo-50/50" : "border-slate-50 hover:bg-slate-50"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-2 shadow-sm group-hover:scale-110 transition-transform">
                <Image src={cat.icon} width={64} height={64} className="object-contain" alt="" unoptimized />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">{cat.name}</span>
            </button>
          ))}
        </div>

        {formData.category_id && (
          <div className="mt-12 pt-12 border-t border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-4">Specialization Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type_id: type.id.toString() })}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    formData.type_id === type.id.toString() ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-slate-50 bg-white"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <Image src={type.icon} width={48} height={48} className="object-cover" alt="" unoptimized />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 leading-tight">{type.name}</p>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Select Protocol</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}