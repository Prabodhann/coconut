"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { FoodItem } from "@/components/FoodItem";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { UI_CONTENT } from "@/constants/uiContent";
import { motion } from "framer-motion";
import { Flame, ChefHat, SearchX, RotateCcw } from "lucide-react";

interface FoodDisplayProps {
  categories: string[];
  searchQuery?: string;
  aiItemIds?: string[] | null;
  dietFilter?: "All" | "Veg" | "Non-Veg";
}

export function FoodDisplay({
  categories,
  searchQuery = "",
  aiItemIds = null,
  dietFilter = "All",
}: FoodDisplayProps) {
  const { list: foodList, loading } = useAppSelector((state) => state.food);
  const [isColdStart, setIsColdStart] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  // Smart Loader Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (loading) {
      // After 3 seconds of loading, we assume it's a cold start
      timer = setTimeout(() => {
        setIsColdStart(true);
      }, 3000);

      // Keep track of total seconds loading
      interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setIsColdStart(false);
      setLoadingTime(0);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loading]);

  if (loading) {
    if (isColdStart) {
      const progress = Math.min((loadingTime / 40) * 100, 95); // Fake progress up to 95% over 40 seconds
      return (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center max-w-md w-full text-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-orange-500 opacity-20"
              />
              <div className="w-24 h-24 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center relative">
                <ChefHat className="w-10 h-10 text-orange-500 absolute" />
                <motion.div
                  animate={{ opacity: [0, 1, 0], y: [10, -10] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Flame className="w-5 h-5 text-red-400 absolute -top-2 right-2" />
                </motion.div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Waking up the Kitchen...
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Our servers were taking a quick nap. Please give us about 30 seconds to heat up the ovens!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-orange-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm font-medium text-orange-500">
              {loadingTime}s elapsed
            </p>
          </motion.div>
        </div>
      );
    }
    
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (foodList.length === 0) {
    return <SkeletonLoader />;
  }

  const filteredFood = foodList.filter((item) => {
    const isCategoryMatch = categories.length === 0 || categories.includes(item.category);
    const isDietMatch = dietFilter === "All" || (dietFilter === "Veg" && item.isVeg) || (dietFilter === "Non-Veg" && !item.isVeg);

    if (aiItemIds && aiItemIds.length > 0) {
      return aiItemIds.includes(item._id) && isCategoryMatch && isDietMatch;
    }

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return isCategoryMatch && matchesSearch && isDietMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 mt-2" id="food-display">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 inline-block self-start">
        {UI_CONTENT.FOOD_DISPLAY.TITLE}
      </h2>

      {filteredFood.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 flex flex-col items-center justify-center text-center space-y-6"
        >
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-full border border-zinc-100 dark:border-zinc-800">
            <SearchX className="w-12 h-12 text-zinc-400" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              No dishes found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              {aiItemIds && aiItemIds.length === 0
                ? "The AI couldn't find any exact matches for your craving."
                : `We couldn't find any dishes matching your current filters ${searchQuery ? `and search "${searchQuery}"` : ""}.`}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset all filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredFood.map((item) => (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <FoodItem
                image={item.image}
                name={item.name}
                desc={item.description}
                price={item.price}
                id={item._id}
                isVeg={item.isVeg}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
