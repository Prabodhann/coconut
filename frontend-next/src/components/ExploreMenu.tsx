"use client";

import { useAppSelector } from "@/store/hooks";
import { menu_list } from "@/assets/assets";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface ExploreMenuProps {
  categories: string[];
  setCategories: (categories: string[]) => void;
  dietFilter: "All" | "Veg" | "Non-Veg";
  setDietFilter: (value: "All" | "Veg" | "Non-Veg") => void;
}

export function ExploreMenu({
  categories,
  setCategories,
  dietFilter,
  setDietFilter,
}: ExploreMenuProps) {
  const { list: foodList } = useAppSelector((state) => state.food);

  // Compute available categories dynamically
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
    <div className="flex flex-col gap-4 py-4 mb-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Explore our menu
          </h2>
          <p className="text-zinc-500 max-w-[60%] mt-1">
            Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
          </p>
        </div>
        
        {/* Diet Toggle */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setDietFilter("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              dietFilter === "All"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietFilter("Veg")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              dietFilter === "Veg"
                ? "bg-green-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current" /> Veg
          </button>
          <button
            onClick={() => setDietFilter("Non-Veg")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              dietFilter === "Non-Veg"
                ? "bg-red-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current" /> Non-Veg
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setCategories([])}
          className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
            categories.length === 0
              ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50"
          }`}
        >
          All Categories
        </button>
        {availableCategories.map((item, index) => {
          const isActive = categories.includes(item.menu_name);
          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={index}
              onClick={() => toggleCategory(item.menu_name)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all border flex items-center gap-2 ${
                isActive
                  ? "bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50"
              }`}
            >
              {isActive && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {item.menu_name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
