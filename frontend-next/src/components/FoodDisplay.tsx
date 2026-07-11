"use client";

import { useAppSelector } from "@/store/hooks";
import { FoodItem } from "@/components/FoodItem";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { UI_CONTENT } from "@/constants/uiContent";
import { motion } from "framer-motion";

interface FoodDisplayProps {
  category: string;
  searchQuery?: string;
  aiItemIds?: string[] | null;
}

export function FoodDisplay({
  category,
  searchQuery = "",
  aiItemIds = null,
}: FoodDisplayProps) {
  const { list: foodList, loading } = useAppSelector((state) => state.food);

  if (loading) {
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
    if (aiItemIds && aiItemIds.length > 0) {
      const matchesCategory = category === "All" || category === item.category;
      return aiItemIds.includes(item._id) && matchesCategory;
    }

    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
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
        <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400 space-y-4">
          <p className="text-xl">
            {aiItemIds && aiItemIds.length === 0
              ? "The AI couldn't find any exact matches for your craving."
              : `No dishes found ${searchQuery ? `for "${searchQuery}"` : "in this category"}.`}
          </p>
          <p className="text-sm">
            Try searching for something else or clearing your filters.
          </p>
        </div>
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
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
