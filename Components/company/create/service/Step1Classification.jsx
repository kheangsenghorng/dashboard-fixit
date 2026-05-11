import {
  Search,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Step1Classification({
  formData,
  setFormData,
  categories,
  activeTypes,
}) {
  const [search, setSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  // Filter categories based on search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Logic for "View More" Categories
  const visibleCategories = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, 10);

  // Logic for "View More" Sub-Types
  const visibleTypes = showAllTypes ? activeTypes : activeTypes.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-10"
    >
      {/* --- HEADER & SEARCH --- */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-600">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Classification Engine
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Select your{" "}
          <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">
            Industry
          </span>
        </h2>

        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
            size={22}
          />
          <input
            placeholder="Search industry (e.g. Cleaning, HVAC...)"
            className="relative w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 font-bold text-lg shadow-sm outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300 focus:shadow-xl focus:shadow-indigo-50"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- CATEGORY GRID --- */}
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((cat) => {
              const isSelected = formData.category_id === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category_id: cat.id })
                  }
                  className={`relative group overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 ${
                    isSelected
                      ? "border-indigo-600 bg-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50/50"
                      : "border-slate-100 bg-slate-50/30 hover:bg-white hover:border-indigo-200"
                  }`}
                >
                  {/* Selection Badge */}
                  {isSelected && (
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <CheckCircle2
                        size={24}
                        className="text-indigo-600 fill-white"
                      />
                    </motion.div>
                  )}

                  {/* Icon Container */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 blur-2xl rounded-full transition-opacity ${
                        isSelected
                          ? "bg-indigo-400/20 opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div
                      className={`relative w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                        isSelected
                          ? "bg-indigo-50 scale-110 rotate-3"
                          : "bg-white shadow-sm group-hover:rotate-3"
                      }`}
                    >
                      <Image
                        src={cat.icon}
                        width={48}
                        height={48}
                        className={`transition-all duration-500 ${
                          isSelected
                            ? "grayscale-0"
                            : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                        }`}
                        alt={cat.name}
                        unoptimized
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-black uppercase tracking-widest ${
                      isSelected ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View More Categories Toggle */}
        {filteredCategories.length > 10 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all hover:shadow-lg active:scale-95"
            >
              {showAllCategories ? (
                <>
                  SHOW LESS <ChevronUp size={16} />
                </>
              ) : (
                <>
                  VIEW ALL ({filteredCategories.length}){" "}
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* --- SUB-TYPE SELECTION --- */}
      <AnimatePresence>
        {formData.category_id && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pt-10 space-y-8 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <LayoutGrid size={20} />
                </div>
                <span className="text-lg font-black tracking-tight">
                  Select Sub-Category
                </span>
              </div>
              <div className="h-px flex-1 bg-slate-200/60" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleTypes.map((type, idx) => {
                const isSelected = formData.type_id === type.id.toString();
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: idx * 0.03 },
                    }}
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type_id: type.id.toString() })
                    }
                    className={`group relative flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-white shadow-xl shadow-indigo-100/50 translate-x-2"
                        : "border-transparent bg-white hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`shrink-0 relative w-14 h-14 rounded-2xl overflow-hidden transition-all ${
                        isSelected
                          ? "bg-indigo-600 rotate-6"
                          : "bg-slate-50 group-hover:bg-indigo-50"
                      }`}
                    >
                      <Image
                        src={type.icon}
                        fill
                        className={`object-cover p-2 ${
                          isSelected
                            ? "invert brightness-0"
                            : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                        }`}
                        alt=""
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-black uppercase tracking-tight ${
                          isSelected ? "text-indigo-600" : "text-slate-700"
                        }`}
                      >
                        {type.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        Standard Service Type
                      </p>
                    </div>

                    {isSelected && (
                      <div className="bg-indigo-600 text-white p-1 rounded-full">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* View More Sub-Types Toggle */}
            {activeTypes.length > 6 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowAllTypes(!showAllTypes)}
                  className="group flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all"
                >
                  <PlusCircle
                    size={18}
                    className={`transition-transform duration-500 ${
                      showAllTypes ? "rotate-45" : ""
                    }`}
                  />
                  {showAllTypes
                    ? "Show Fewer Types"
                    : `Show ${activeTypes.length - 6} more types`}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EMPTY STATE HINT --- */}
      {!formData.category_id && (
        <div className="text-center py-6">
          <p className="text-slate-300 text-xs font-black uppercase tracking-[0.3em]">
            Waiting for sector selection...
          </p>
        </div>
      )}
    </motion.section>
  );
}
