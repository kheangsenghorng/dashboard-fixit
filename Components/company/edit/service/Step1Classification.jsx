"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export default function Step1Classification({
  formData,
  setFormData,
  categories = [],
  activeTypes = [],
}) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return categories;

    return categories.filter((category) =>
      category.name?.toLowerCase().includes(keyword)
    );
  }, [categories, search]);

  const handleSelectCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      category_id: category.id.toString(),
      type_id: "",
    }));
  };

  const handleSelectType = (type) => {
    setFormData((prev) => ({
      ...prev,
      type_id: type.id.toString(),
    }));
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">
          Select <span className="text-indigo-600">Category</span>
        </h1>

        <p className="text-slate-500 font-medium text-lg">
          Choose category and service type before continuing.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-[3rem] p-6 md:p-10 shadow-sm">
        {/* Search */}
        <div className="relative mb-10">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            type="text"
            value={search}
            placeholder="Search categories..."
            className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-8 font-bold text-base md:text-lg outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredCategories.map((category) => {
            const isSelected = formData.category_id === category.id.toString();

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelectCategory(category)}
                className={`group p-6 md:p-8 rounded-[2.5rem] border-2 transition-all text-center ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                    : "border-slate-50 hover:bg-slate-50 hover:border-slate-100"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-2 shadow-sm group-hover:scale-110 transition-transform">
                  {category.icon ? (
                    <Image
                      src={category.icon}
                      width={64}
                      height={64}
                      className="object-contain"
                      alt={category.name || "Category"}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-slate-100" />
                  )}
                </div>

                <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-bold">
            No categories found.
          </div>
        )}

        {/* Types */}
        {formData.category_id && (
          <div className="mt-12 pt-12 border-t border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-4">
              Specialization Type
            </h3>

            {activeTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTypes.map((type) => {
                  const isSelected = formData.type_id === type.id.toString();

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectType(type)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-slate-50 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        {type.icon ? (
                          <Image
                            src={type.icon}
                            width={48}
                            height={48}
                            className="object-cover"
                            alt={type.name || "Type"}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100" />
                        )}
                      </div>

                      <div className="text-left">
                        <p className="font-bold text-slate-900 leading-tight">
                          {type.name}
                        </p>

                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                          Select Type
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-3xl text-center text-slate-400 font-bold">
                No active types found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
