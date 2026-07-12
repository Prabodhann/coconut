"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Leaf } from "lucide-react";
import { menu_list } from "@/assets/assets";
import { useAppSelector } from "@/store/hooks";

interface FilterMenuProps {
  categories: string[];
  setCategories: (categories: string[]) => void;
  dietFilter: "All" | "Veg" | "Non-Veg";
  setDietFilter: (value: "All" | "Veg" | "Non-Veg") => void;
}

export function FilterMenu({
  categories,
  setCategories,
  dietFilter,
  setDietFilter,
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { list: foodList } = useAppSelector((state) => state.food);

  const availableCategories = menu_list.filter((menu) => {
    return foodList.some(
      (item) => {
        const matchesCategory = item.category === menu.menu_name;
        const matchesDiet = dietFilter === "All" || (dietFilter === "Veg" && item.isVeg) || (dietFilter === "Non-Veg" && !item.isVeg);
        return matchesCategory && matchesDiet;
      }
    );
  });

  const toggleCategory = (categoryName: string) => {
    if (categories.includes(categoryName)) {
      setCategories(categories.filter((c) => c !== categoryName));
    } else {
      setCategories([...categories, categoryName]);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-xl shadow-orange-500/30 flex items-center justify-center border-4 border-white dark:border-black"
        aria-label="Filter Menu"
      >
        <Filter className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full sm:w-[400px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Filter & Sort
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Diet Preference */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                      Dietary Preference
                    </h4>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl w-full">
                      <button
                        onClick={() => setDietFilter("All")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          dietFilter === "All"
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setDietFilter("Veg")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          dietFilter === "Veg"
                            ? "bg-green-500 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current" /> Veg
                      </button>
                      <button
                        onClick={() => setDietFilter("Non-Veg")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          dietFilter === "Non-Veg"
                            ? "bg-red-500 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current" /> Non-Veg
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategories([])}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          categories.length === 0
                            ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50"
                        }`}
                      >
                        All
                      </button>
                      {availableCategories.map((item, idx) => {
                        const isActive = categories.includes(item.menu_name);
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleCategory(item.menu_name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5 ${
                              isActive
                                ? "bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50"
                            }`}
                          >
                            {isActive && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {item.menu_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl py-4 font-semibold text-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
