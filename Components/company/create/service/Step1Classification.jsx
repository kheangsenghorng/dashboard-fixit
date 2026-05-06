import { Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Step1Classification({
  formData,
  setFormData,
  categories,
  activeTypes,
}) {
  const [search, setSearch] = useState("");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
        <div className="relative mb-10">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            placeholder="Search industry..."
            className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-8 font-bold text-lg"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, category_id: cat.id })
                }
                className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                  formData.category_id === cat.id
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                    : "border-slate-50 hover:bg-slate-50"
                }`}
              >
                <Image
                  src={cat.icon}
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                  alt=""
                  unoptimized
                />
                <span className="text-xs font-black uppercase tracking-widest">
                  {cat.name}
                </span>
              </button>
            ))}
        </div>

        {formData.category_id && (
          <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type_id: type.id.toString() })
                }
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${
                  formData.type_id === type.id.toString()
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-50 bg-white"
                }`}
              >
                <Image
                  src={type.icon}
                  width={48}
                  height={48}
                  className="rounded-xl"
                  alt=""
                  unoptimized
                />
                <span className="font-bold">{type.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
